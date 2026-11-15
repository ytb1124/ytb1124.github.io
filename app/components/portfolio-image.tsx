/* oxlint-disable next/no-img-element */
import type { ComponentProps } from 'react';
import generatedPreviews from '../data/generated-image-previews.json';

type Preview = { src: string; width: number };
type PortfolioImageProps = Omit<ComponentProps<'img'>, 'src' | 'srcSet'> & {
  src: string;
  alt: string;
  sizes: string;
};

const previews: Record<string, Preview[] | undefined> = generatedPreviews;

export function imagePreview(src: string, width: number) {
  const variants = previews[src];
  return variants?.find(variant => variant.width >= width)?.src ?? variants?.at(-1)?.src ?? src;
}

export function PortfolioImage({ src, alt, sizes, loading = 'lazy', ...props }: PortfolioImageProps) {
  const variants = previews[src];
  return <img
    {...props}
    alt={alt}
    loading={loading}
    decoding="async"
    sizes={variants ? sizes : undefined}
    srcSet={variants?.map(variant => `${variant.src} ${variant.width}w`).join(', ')}
    src={imagePreview(src, 720)}
    data-original-src={variants ? src : undefined}
  />;
}
