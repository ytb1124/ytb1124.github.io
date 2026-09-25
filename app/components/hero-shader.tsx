'use client';

import { useEffect, useRef } from 'react';

const vertexShader = `#version 300 es
layout(location = 0) in vec4 a_position;

uniform vec2 u_resolution;

out vec2 v_objectUV;
out vec2 v_responsiveUV;
out vec2 v_responsiveBoxGivenSize;
out vec2 v_patternUV;

void main() {
  gl_Position = a_position;
  vec2 uv = a_position.xy * .5;
  float squareSize = min(u_resolution.x, u_resolution.y);
  v_objectUV = uv * (u_resolution / squareSize);
  v_objectUV += vec2(.55, 2.);
  v_responsiveUV = uv;
  v_responsiveBoxGivenSize = u_resolution;
  v_patternUV = uv + .5;
}`;

const fragmentShader = `#version 300 es
precision mediump float;

uniform float u_time;
uniform vec4 u_colorBack;
uniform vec4 u_colors[5];
uniform float u_colorsCount;
uniform float u_frequency;
uniform float u_spotty;
uniform float u_midSize;
uniform float u_midIntensity;
uniform float u_density;
uniform float u_blending;

in vec2 v_objectUV;
in vec2 v_responsiveUV;
in vec2 v_responsiveBoxGivenSize;
in vec2 v_patternUV;

out vec4 fragColor;

#define TWO_PI 6.28318530718

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec2 rotateUV(vec2 uv, float th) {
  return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}

float hash(float n) {
  return fract(sin(n * 43758.5453123) * 43758.5453123);
}

float valueNoise(vec2 uv) {
  vec2 i = floor(uv);
  vec2 f = fract(uv);
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float raysShape(vec2 uv, float r, float freq, float density) {
  float a = atan(uv.y, uv.x);
  vec2 left = vec2(a * freq, r);
  vec2 right = vec2(mod(a, TWO_PI) * freq, r);
  float nLeft = pow(valueNoise(left), density);
  float nRight = pow(valueNoise(right), density);
  return mix(nRight, nLeft, smoothstep(-.15, .15, uv.x));
}

void main() {
  vec2 shapeUV = v_objectUV;
  float t = .2 * u_time;
  float radius = length(shapeUV);
  float spots = 5. * abs(u_spotty);
  float density = 4. - 3. * clamp(u_density, 0., 1.);
  float middleShape = pow(u_midIntensity, .3) * smoothstep(abs(u_midSize), .02 * abs(u_midSize), 3. * radius);
  middleShape = pow(middleShape, 5.);

  vec3 accumColor = vec3(0.);
  float accumAlpha = 0.;

  for (int i = 0; i < 5; i++) {
    if (i >= int(u_colorsCount)) break;
    vec2 rotatedUV = rotateUV(shapeUV, float(i) + 1.);
    float r1 = radius * (1. + .4 * float(i)) - 3. * t;
    float r2 = .5 * radius * (1. + spots) - 2. * t;
    float f = mix(1., 3. + .5 * float(i), hash(float(i) + 10.)) * u_frequency;
    float ray = raysShape(rotatedUV, r1, 5. * f, density);
    ray *= raysShape(rotatedUV, r2, 4. * f, density);
    ray += (1. + 4. * ray) * middleShape;
    ray = clamp(ray, 0., 1.);

    float srcAlpha = u_colors[i].a * ray;
    vec3 srcColor = u_colors[i].rgb * srcAlpha;
    vec3 alphaBlendColor = accumColor + (1. - accumAlpha) * srcColor;
    float alphaBlendAlpha = accumAlpha + (1. - accumAlpha) * srcAlpha;
    vec3 addBlendColor = accumColor + srcColor;
    float addBlendAlpha = accumAlpha + srcAlpha;
    accumColor = mix(alphaBlendColor, addBlendColor, u_blending);
    accumAlpha = mix(alphaBlendAlpha, addBlendAlpha, u_blending);
  }

  vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
  vec3 alphaBlendColor = accumColor + (1. - accumAlpha) * bgColor;
  float alphaBlendAlpha = accumAlpha + (1. - accumAlpha) * u_colorBack.a;
  vec3 addBlendColor = accumColor + bgColor;
  float addBlendAlpha = accumAlpha + u_colorBack.a;
  accumColor = mix(alphaBlendColor, addBlendColor, u_blending);
  accumAlpha = mix(alphaBlendAlpha, addBlendAlpha, u_blending);

  vec3 color = clamp(accumColor, 0., 1.);
  float opacity = clamp(accumAlpha, 0., 1.);
  color += 1. / 256. * (fract(sin(dot(.014 * gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453123) - .5);
  fragColor = vec4(color, opacity);
}`;

function compileShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function HeroShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl2', { alpha: false, antialias: false });
    if (!gl) return;

    const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexShader);
    const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
    if (!vertex || !fragment) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    const activateProgram = gl.useProgram.bind(gl);
    activateProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const uniform = (name: string) => gl.getUniformLocation(program, name);
    gl.uniform4f(uniform('u_colorBack'), 48 / 255, 98 / 255, 150 / 255, 1);
    gl.uniform4fv(uniform('u_colors[0]'), new Float32Array([
      1, 60 / 255, 0, 1,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
    ]));
    gl.uniform1f(uniform('u_colorsCount'), 1);
    gl.uniform1f(uniform('u_frequency'), .5);
    gl.uniform1f(uniform('u_spotty'), 1.9);
    gl.uniform1f(uniform('u_midSize'), 0);
    gl.uniform1f(uniform('u_midIntensity'), .23);
    gl.uniform1f(uniform('u_density'), 1);
    gl.uniform1f(uniform('u_blending'), 1);

    const maxPixels = 8_294_400;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const pixelRatio = window.devicePixelRatio || 1;
      const limitedRatio = Math.min(pixelRatio, Math.sqrt(maxPixels / Math.max(1, rect.width * rect.height)));
      const width = Math.max(1, Math.round(rect.width * limitedRatio));
      const height = Math.max(1, Math.round(rect.height * limitedRatio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
        gl.uniform2f(uniform('u_resolution'), width, height);
      }
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    const start = performance.now();
    const render = (now: number) => {
      gl.uniform1f(uniform('u_time'), reduceMotion ? 0 : 2 * (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (!reduceMotion) frame = requestAnimationFrame(render);
    };
    render(start);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-shader" aria-hidden="true" />;
}
