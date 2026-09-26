'use client';

import { useEffect, useMemo, useState } from 'react';

const API = 'https://admin-api.taebin.link';
const paths = {
  site: 'content/site.json',
  projects: 'content/projects.json',
  korean: 'content/korean.json',
  summaries: 'content/project-summaries.json',
  activities: 'content/activities.json',
  musicProduction: 'content/music-production.json',
} as const;

type Documents = Record<string, any>;
type Asset = { path: string; base64: string };

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9가-힣]+/g, '-').replace(/^-|-$/g, '') || `item-${Date.now()}`;
}

function move<T>(items: T[], index: number, direction: -1 | 1) {
  const target = index + direction;
  if (target < 0 || target >= items.length) return items;
  const next = [...items];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

function Field({ label, value, onChange, compact = false }: { label: string; value: string; onChange: (value: string) => void; compact?: boolean }) {
  const multiline = !compact && (value.length > 70 || value.includes('\n'));
  return <label className="admin-field"><span>{label}</span>{multiline
    ? <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={Math.min(10, Math.max(3, value.split('\n').length + 2))} />
    : <input value={value} onChange={(event) => onChange(event.target.value)} />}</label>;
}

function ButtonRow({ index, length, onMove, onDelete }: { index: number; length: number; onMove: (direction: -1 | 1) => void; onDelete: () => void }) {
  return <div className="admin-row-actions">
    <button type="button" disabled={index === 0} onClick={() => onMove(-1)}>↑</button>
    <button type="button" disabled={index === length - 1} onClick={() => onMove(1)}>↓</button>
    <button type="button" className="danger" onClick={onDelete}>삭제</button>
  </div>;
}

function StringList({ label, values, onChange }: { label: string; values: string[]; onChange: (values: string[]) => void }) {
  return <section className="admin-subsection"><h3>{label}</h3>{values.map((value, index) => <div className="admin-list-item" key={`${index}-${value.slice(0, 12)}`}>
    <textarea value={value} onChange={(event) => { const next = [...values]; next[index] = event.target.value; onChange(next); }} rows={4} />
    <ButtonRow index={index} length={values.length} onMove={(direction) => onChange(move(values, index, direction))} onDelete={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))} />
  </div>)}<button type="button" className="secondary" onClick={() => onChange([...values, ''])}>문단 추가</button></section>;
}

function ImageEditor({ label, value, onChange, queueAsset, removeAsset }: { label: string; value: string; onChange: (value: string) => void; queueAsset: (file: File, onReady: (path: string) => void) => void; removeAsset: (path: string) => void }) {
  return <div className="admin-image-field"><span>{label}</span>{value && <img src={value} alt="" />}
    <div><label className="upload-button">사진 선택<input type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) queueAsset(file, onChange); }} /></label>
    {value && <button type="button" className="danger" onClick={() => { removeAsset(value); onChange(''); }}>사진 제거</button>}</div>
  </div>;
}

function GalleryEditor({ values, onChange, queueAsset, removeAsset }: { values: string[]; onChange: (values: string[]) => void; queueAsset: (file: File, onReady: (path: string) => void) => void; removeAsset: (path: string) => void }) {
  return <section className="admin-subsection"><h3>사진 갤러리</h3><div className="admin-gallery-list">{values.map((value, index) => <div className="admin-gallery-item" key={`${value}-${index}`}><img src={value} alt="" /><ButtonRow index={index} length={values.length} onMove={(direction) => onChange(move(values, index, direction))} onDelete={() => { removeAsset(value); onChange(values.filter((_, itemIndex) => itemIndex !== index)); }} /></div>)}</div>
    <label className="upload-button">사진 추가<input type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) queueAsset(file, (path) => onChange([...values, path])); }} /></label>
  </section>;
}

function TripleList({ label, values, onChange }: { label: string; values: string[][]; onChange: (values: string[][]) => void }) {
  return <section className="admin-subsection"><h3>{label}</h3>{values.map((row, index) => <div className="admin-triple" key={`${index}-${row[0]}`}>
    {row.map((value, column) => <input key={column} value={value} onChange={(event) => { const next = clone(values); next[index][column] = event.target.value; onChange(next); }} />)}
    <ButtonRow index={index} length={values.length} onMove={(direction) => onChange(move(values, index, direction))} onDelete={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))} />
  </div>)}<button type="button" className="secondary" onClick={() => onChange([...values, ['', '', '']])}>항목 추가</button></section>;
}

export function AdminClient() {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState('ytb1124');
  const [password, setPassword] = useState('');
  const [csrf, setCsrf] = useState('');
  const [documents, setDocuments] = useState<Documents | null>(null);
  const [revision, setRevision] = useState('');
  const [tab, setTab] = useState<'pages' | 'projects' | 'experience' | 'production'>('pages');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [deletions, setDeletions] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(true);
  const [activitySearch, setActivitySearch] = useState('');

  const updateDocument = (path: string, updater: (document: any) => void) => setDocuments((current) => {
    if (!current) return current;
    const next = clone(current);
    updater(next[path]);
    return next;
  });

  const loadContent = async (sessionCsrf = csrf) => {
    setBusy(true);
    const response = await fetch(`${API}/content`, { credentials: 'include' });
    if (!response.ok) { setAuthenticated(false); setBusy(false); return; }
    const data = await response.json() as any;
    setDocuments(data.documents); setRevision(data.revision); setAssets([]); setDeletions([]); setCsrf(sessionCsrf); setBusy(false);
  };

  useEffect(() => {
    fetch(`${API}/session`, { credentials: 'include' }).then(async (response) => {
      if (!response.ok) { setBusy(false); return; }
      const session = await response.json() as any; setAuthenticated(true); setCsrf(session.csrf); await loadContent(session.csrf);
    }).catch(() => setBusy(false));
  }, []);

  const login = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setMessage('');
    const response = await fetch(`${API}/login`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
    const data = await response.json() as any;
    if (!response.ok) { setMessage(data.error || '로그인할 수 없습니다.'); setBusy(false); return; }
    setAuthenticated(true); setPassword(''); setCsrf(data.csrf); await loadContent(data.csrf);
  };

  const save = async () => {
    if (!documents) return;
    setBusy(true); setMessage('저장하고 배포를 시작하는 중입니다…');
    const response = await fetch(`${API}/content`, { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json', 'X-Admin-CSRF': csrf }, body: JSON.stringify({ revision, documents, assets, deletions }) });
    const data = await response.json() as any;
    if (!response.ok) { setMessage(data.error || '저장할 수 없습니다.'); setBusy(false); return; }
    setRevision(data.revision); setAssets([]); setDeletions([]); setMessage('저장되었습니다. GitHub Pages 반영에는 약 1–2분이 걸립니다.'); setBusy(false);
  };

  const queueAsset = (file: File, onReady: (path: string) => void) => {
    if (file.size > 8_000_000) { setMessage('사진 한 장은 8MB 이하로 올려주세요.'); return; }
    const extension = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
    const path = `/uploads/${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ''))}.${extension}`;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result); const base64 = dataUrl.split(',')[1];
      setAssets((current) => [...current, { path: `public${path}`, base64 }]);
      onReady(path);
    };
    reader.readAsDataURL(file);
  };

  const removeAsset = (path: string) => {
    if (path.startsWith('/uploads/')) setDeletions((current) => [...new Set([...current, `public${path}`])]);
  };

  const addProject = () => setDocuments((current) => {
    if (!current) return current;
    const next = clone(current);
    const slug = `new-project-${Date.now()}`;
    next[paths.projects].push({ slug, year: new Date().getFullYear().toString(), category: 'Project', title: 'New Project', description: '', question: '', image: '', gallery: [], body: [] });
    next[paths.korean].projectBodies[slug] = [];
    next[paths.summaries][slug] = {
      en: { question: '', system: '', methods: '', result: '', next: '' },
      ko: { question: '', system: '', methods: '', result: '', next: '' },
    };
    next[paths.site].sections[0].projectSlugs.push(slug);
    return next;
  });

  const renameProject = (index: number, requestedSlug: string) => setDocuments((current) => {
    if (!current) return current;
    const next = clone(current);
    const oldSlug = next[paths.projects][index].slug;
    const newSlug = slugify(requestedSlug);
    next[paths.projects][index].slug = newSlug;
    for (const section of next[paths.site].sections) section.projectSlugs = section.projectSlugs.map((slug: string) => slug === oldSlug ? newSlug : slug);
    if (next[paths.korean].projectBodies[oldSlug] !== undefined) {
      next[paths.korean].projectBodies[newSlug] = next[paths.korean].projectBodies[oldSlug];
      delete next[paths.korean].projectBodies[oldSlug];
    }
    if (next[paths.summaries][oldSlug] !== undefined) {
      next[paths.summaries][newSlug] = next[paths.summaries][oldSlug];
      delete next[paths.summaries][oldSlug];
    }
    return next;
  });

  const deleteProject = (index: number) => setDocuments((current) => {
    if (!current) return current;
    const next = clone(current);
    const [project] = next[paths.projects].splice(index, 1);
    for (const section of next[paths.site].sections) section.projectSlugs = section.projectSlugs.filter((slug: string) => slug !== project.slug);
    delete next[paths.korean].projectBodies[project.slug];
    delete next[paths.summaries][project.slug];
    return next;
  });

  const logout = async () => {
    await fetch(`${API}/logout`, { method: 'POST', credentials: 'include' });
    setAuthenticated(false); setDocuments(null); setCsrf('');
  };

  const activityMatches = useMemo(() => activitySearch.trim().toLowerCase(), [activitySearch]);

  if (!authenticated) return <main className="admin-login"><form onSubmit={login}><p>TAEBIN.LINK</p><h1>관리자 로그인</h1><Field label="아이디" value={username} onChange={setUsername} compact /><label className="admin-field"><span>비밀번호</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /></label>{message && <div className="admin-message error">{message}</div>}<button className="primary" disabled={busy}>로그인</button></form></main>;
  if (!documents || busy && !revision) return <main className="admin-loading">관리자 데이터를 불러오는 중입니다…</main>;

  const site = documents[paths.site];
  const projects = documents[paths.projects] as any[];
  const korean = documents[paths.korean];
  const summaries = documents[paths.summaries];
  const activities = documents[paths.activities] as any[];
  const production = documents[paths.musicProduction];

  return <main className="admin-shell">
    <header className="admin-header"><div><p>TAEBIN.LINK</p><h1>Portfolio Admin</h1></div><div><a href="/" target="_blank">사이트 보기</a><button type="button" onClick={logout}>로그아웃</button></div></header>
    <nav className="admin-tabs">{([['pages','페이지·사진'],['projects','프로젝트'],['experience','경력'],['production','Music Production']] as const).map(([key,label])=><button key={key} className={tab===key?'active':''} onClick={()=>setTab(key)}>{label}</button>)}</nav>
    {message && <div className="admin-message">{message}</div>}

    {tab === 'pages' && <div className="admin-panel">
      <h2>홈</h2><div className="admin-columns"><section><h3>English</h3>{Object.keys(site.home).map((key)=><Field key={key} label={key} value={site.home[key]} onChange={(value)=>updateDocument(paths.site,(doc)=>{doc.home[key]=value;})}/>)}</section><section><h3>한국어</h3>{Object.keys(site.koreanHome).map((key)=><Field key={key} label={key} value={site.koreanHome[key]} onChange={(value)=>updateDocument(paths.site,(doc)=>{doc.koreanHome[key]=value;})}/>)}</section></div>
      <ImageEditor label="홈 프로필 사진" value={site.assets.homePortrait} onChange={(value)=>updateDocument(paths.site,(doc)=>{doc.assets.homePortrait=value;})} queueAsset={queueAsset} removeAsset={removeAsset}/>
      <h2>프로필</h2><div className="admin-columns"><section><h3>English</h3><Field label="제목" value={site.profile.title} onChange={(value)=>updateDocument(paths.site,(doc)=>{doc.profile.title=value;})}/><StringList label="본문" values={site.profile.paragraphs} onChange={(values)=>updateDocument(paths.site,(doc)=>{doc.profile.paragraphs=values;})}/><StringList label="Education 본문" values={site.profile.educationParagraphs} onChange={(values)=>updateDocument(paths.site,(doc)=>{doc.profile.educationParagraphs=values;})}/></section><section><h3>한국어</h3><Field label="제목" value={korean.profile.title} onChange={(value)=>updateDocument(paths.korean,(doc)=>{doc.profile.title=value;})}/><StringList label="본문" values={korean.profile.paragraphs} onChange={(values)=>updateDocument(paths.korean,(doc)=>{doc.profile.paragraphs=values;})}/></section></div>
      <ImageEditor label="프로필 대표 사진" value={site.assets.profileHero} onChange={(value)=>updateDocument(paths.site,(doc)=>{doc.assets.profileHero=value;})} queueAsset={queueAsset} removeAsset={removeAsset}/>
      <GalleryEditor values={site.assets.profileGallery} onChange={(values)=>updateDocument(paths.site,(doc)=>{doc.assets.profileGallery=values;})} queueAsset={queueAsset} removeAsset={removeAsset}/>
      <h2>연락처</h2><div className="admin-columns">{Object.keys(site.contact).map((key)=><Field key={key} label={key} value={site.contact[key]} onChange={(value)=>updateDocument(paths.site,(doc)=>{doc.contact[key]=value;})}/>)}</div>
    </div>}

    {tab === 'projects' && <div className="admin-panel">
      <div className="admin-title-row"><h2>프로젝트</h2><button className="secondary" onClick={addProject}>프로젝트 추가</button></div>
      <section className="admin-subsection"><h3>상단 연구 구조와 순서</h3>{site.sections.map((section:any,sectionIndex:number)=><details key={section.title}><summary>{section.title}</summary><Field label="English title" value={section.title} onChange={(value)=>updateDocument(paths.site,(doc)=>{doc.sections[sectionIndex].title=value;})}/><Field label="한국어 제목" value={section.koreanTitle} onChange={(value)=>updateDocument(paths.site,(doc)=>{doc.sections[sectionIndex].koreanTitle=value;})}/><Field label="English question" value={section.question} onChange={(value)=>updateDocument(paths.site,(doc)=>{doc.sections[sectionIndex].question=value;})}/><Field label="한국어 질문" value={section.koreanQuestion} onChange={(value)=>updateDocument(paths.site,(doc)=>{doc.sections[sectionIndex].koreanQuestion=value;})}/>{section.projectSlugs.map((slug:string,index:number)=><div className="admin-slug-row" key={slug}><span>{projects.find((project)=>project.slug===slug)?.title || slug}</span><ButtonRow index={index} length={section.projectSlugs.length} onMove={(direction)=>updateDocument(paths.site,(doc)=>{doc.sections[sectionIndex].projectSlugs=move(doc.sections[sectionIndex].projectSlugs,index,direction);})} onDelete={()=>updateDocument(paths.site,(doc)=>{doc.sections[sectionIndex].projectSlugs=doc.sections[sectionIndex].projectSlugs.filter((item:string)=>item!==slug);})}/></div>)}</details>)}</section>
      {projects.map((project,index)=><details className="admin-card" key={project.slug}><summary><span>{project.title}</span><span>{project.year}</span></summary><div className="admin-card-body"><ButtonRow index={index} length={projects.length} onMove={(direction)=>updateDocument(paths.projects,(doc)=>{const next=move(doc,index,direction);doc.splice(0,doc.length,...next);})} onDelete={()=>{if(confirm('이 프로젝트를 삭제할까요?'))deleteProject(index);}}/><div className="admin-columns"><Field label="slug (주소)" value={project.slug} onChange={(value)=>renameProject(index,value)}/><Field label="연도" value={project.year} onChange={(value)=>updateDocument(paths.projects,(doc)=>{doc[index].year=value;})}/><Field label="분류" value={project.category} onChange={(value)=>updateDocument(paths.projects,(doc)=>{doc[index].category=value;})}/><Field label="제목" value={project.title} onChange={(value)=>updateDocument(paths.projects,(doc)=>{doc[index].title=value;})}/></div><Field label="설명" value={project.description} onChange={(value)=>updateDocument(paths.projects,(doc)=>{doc[index].description=value;})}/><Field label="연구 질문" value={project.question} onChange={(value)=>updateDocument(paths.projects,(doc)=>{doc[index].question=value;})}/><ImageEditor label="대표 사진" value={project.image} onChange={(value)=>updateDocument(paths.projects,(doc)=>{doc[index].image=value;})} queueAsset={queueAsset} removeAsset={removeAsset}/><GalleryEditor values={project.gallery} onChange={(values)=>updateDocument(paths.projects,(doc)=>{doc[index].gallery=values;})} queueAsset={queueAsset} removeAsset={removeAsset}/><StringList label="English 상세 본문" values={project.body} onChange={(values)=>updateDocument(paths.projects,(doc)=>{doc[index].body=values;})}/><StringList label="한국어 상세 본문" values={korean.projectBodies[project.slug] || []} onChange={(values)=>updateDocument(paths.korean,(doc)=>{doc.projectBodies[project.slug]=values;})}/>{summaries[project.slug] && <div className="admin-columns">{(['en','ko'] as const).map((locale)=><section key={locale}><h3>{locale==='en'?'Summary · English':'Summary · 한국어'}</h3>{Object.keys(summaries[project.slug][locale]).map((key)=><Field key={key} label={key} value={summaries[project.slug][locale][key]} onChange={(value)=>updateDocument(paths.summaries,(doc)=>{doc[project.slug][locale][key]=value;})}/>)}</section>)}</div>}</div></details>)}
    </div>}

    {tab === 'experience' && <div className="admin-panel"><h2>Experience</h2><div className="admin-columns"><section><h3>English</h3><Field label="제목" value={site.experience.title} onChange={(value)=>updateDocument(paths.site,(doc)=>{doc.experience.title=value;})}/><Field label="CV 설명" value={site.experience.cvDescription} onChange={(value)=>updateDocument(paths.site,(doc)=>{doc.experience.cvDescription=value;})}/>{['entries','education','licenses','scholarships','awards'].map((key)=><TripleList key={key} label={key} values={site.experience[key]} onChange={(values)=>updateDocument(paths.site,(doc)=>{doc.experience[key]=values;})}/>)}</section><section><h3>한국어</h3><Field label="제목" value={korean.experience.title} onChange={(value)=>updateDocument(paths.korean,(doc)=>{doc.experience.title=value;})}/><Field label="CV 설명" value={korean.experience.cvDescription} onChange={(value)=>updateDocument(paths.korean,(doc)=>{doc.experience.cvDescription=value;})}/>{['entries','education','licenses','scholarships','awards'].map((key)=><TripleList key={key} label={key} values={korean.experience[key]} onChange={(values)=>updateDocument(paths.korean,(doc)=>{doc.experience[key]=values;})}/>)}</section></div></div>}

    {tab === 'production' && <div className="admin-panel">
      <h2>Music Production</h2>
      <details className="admin-card" open>
        <summary><span>01 · Studio Recording</span><span>{production.studio.albumTitle}</span></summary>
        <div className="admin-card-body">
          <div className="admin-columns">
            <section><h3>English</h3><Field label="Section label" value={production.studio.eyebrow.en} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.studio.eyebrow.en=value;})}/><Field label="Credit" value={production.studio.credit.en} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.studio.credit.en=value;})}/><Field label="Note" value={production.studio.note.en} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.studio.note.en=value;})}/></section>
            <section><h3>한국어</h3><Field label="섹션 이름" value={production.studio.eyebrow.ko} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.studio.eyebrow.ko=value;})}/><Field label="크레딧" value={production.studio.credit.ko} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.studio.credit.ko=value;})}/><Field label="설명" value={production.studio.note.ko} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.studio.note.ko=value;})}/></section>
          </div>
          <div className="admin-columns"><Field label="섹션 제목" value={production.studio.title} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.studio.title=value;})}/><Field label="앨범 제목" value={production.studio.albumTitle} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.studio.albumTitle=value;})}/><Field label="앨범 정보" value={production.studio.meta} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.studio.meta=value;})}/><Field label="커버 대체 텍스트" value={production.studio.coverAlt} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.studio.coverAlt=value;})}/></div>
          <ImageEditor label="앨범 커버" value={production.studio.cover} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.studio.cover=value;})} queueAsset={queueAsset} removeAsset={removeAsset}/>
          <section className="admin-subsection"><div className="admin-title-row"><h3>트랙</h3><button type="button" className="secondary" onClick={()=>updateDocument(paths.musicProduction,(doc)=>doc.studio.tracks.push({title:'새 트랙',duration:''}))}>트랙 추가</button></div>{production.studio.tracks.map((track:any,index:number)=><div className="admin-track" key={`${track.title}-${index}`}><input value={track.title} aria-label="트랙 제목" onChange={(event)=>updateDocument(paths.musicProduction,(doc)=>{doc.studio.tracks[index].title=event.target.value;})}/><input value={track.duration} aria-label="재생 시간" onChange={(event)=>updateDocument(paths.musicProduction,(doc)=>{doc.studio.tracks[index].duration=event.target.value;})}/><ButtonRow index={index} length={production.studio.tracks.length} onMove={(direction)=>updateDocument(paths.musicProduction,(doc)=>{doc.studio.tracks=move(doc.studio.tracks,index,direction);})} onDelete={()=>updateDocument(paths.musicProduction,(doc)=>doc.studio.tracks.splice(index,1))}/></div>)}</section>
        </div>
      </details>
      <details className="admin-card">
        <summary><span>02 · Mixing Portfolio</span><span>{production.mixing.title.en}</span></summary>
        <div className="admin-card-body"><div className="admin-columns">
          <section><h3>English</h3><Field label="Section label" value={production.mixing.eyebrow.en} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.mixing.eyebrow.en=value;})}/><Field label="Title" value={production.mixing.title.en} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.mixing.title.en=value;})}/><Field label="Description" value={production.mixing.description.en} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.mixing.description.en=value;})}/><Field label="Link label" value={production.mixing.linkLabel.en} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.mixing.linkLabel.en=value;})}/></section>
          <section><h3>한국어</h3><Field label="섹션 이름" value={production.mixing.eyebrow.ko} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.mixing.eyebrow.ko=value;})}/><Field label="제목" value={production.mixing.title.ko} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.mixing.title.ko=value;})}/><Field label="설명" value={production.mixing.description.ko} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.mixing.description.ko=value;})}/><Field label="링크 문구" value={production.mixing.linkLabel.ko} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.mixing.linkLabel.ko=value;})}/></section>
        </div><Field label="YouTube 재생목록 URL" value={production.mixing.playlistUrl} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.mixing.playlistUrl=value;})}/>
        <section className="admin-subsection"><h3>Arirang 1926 대표 사례</h3><div className="admin-columns">
          <section><h3>English</h3><Field label="Case label" value={production.mixing.case.eyebrow.en} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.mixing.case.eyebrow.en=value;})}/><Field label="Meta" value={production.mixing.case.meta.en} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.mixing.case.meta.en=value;})}/><Field label="Description" value={production.mixing.case.description.en} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.mixing.case.description.en=value;})}/><Field label="Link label" value={production.mixing.case.linkLabel.en} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.mixing.case.linkLabel.en=value;})}/></section>
          <section><h3>한국어</h3><Field label="사례 이름" value={production.mixing.case.eyebrow.ko} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.mixing.case.eyebrow.ko=value;})}/><Field label="메타 정보" value={production.mixing.case.meta.ko} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.mixing.case.meta.ko=value;})}/><Field label="설명" value={production.mixing.case.description.ko} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.mixing.case.description.ko=value;})}/><Field label="링크 문구" value={production.mixing.case.linkLabel.ko} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.mixing.case.linkLabel.ko=value;})}/></section>
        </div><div className="admin-columns"><Field label="프로젝트 제목" value={production.mixing.case.title} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.mixing.case.title=value;})}/><Field label="YouTube URL" value={production.mixing.case.videoUrl} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.mixing.case.videoUrl=value;})}/></div></section></div>
      </details>
      <details className="admin-card">
        <summary><span>03 · Live &amp; Immersive Production</span><span>{production.immersive.title}</span></summary>
        <div className="admin-card-body"><div className="admin-columns">
          <section><h3>English</h3><Field label="Section label" value={production.immersive.eyebrow.en} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.immersive.eyebrow.en=value;})}/><Field label="Meta" value={production.immersive.meta.en} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.immersive.meta.en=value;})}/><Field label="Description" value={production.immersive.description.en} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.immersive.description.en=value;})}/><Field label="Video link label" value={production.immersive.linkLabel.en} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.immersive.linkLabel.en=value;})}/><Field label="Report label" value={production.immersive.reportLabel.en} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.immersive.reportLabel.en=value;})}/></section>
          <section><h3>한국어</h3><Field label="섹션 이름" value={production.immersive.eyebrow.ko} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.immersive.eyebrow.ko=value;})}/><Field label="메타 정보" value={production.immersive.meta.ko} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.immersive.meta.ko=value;})}/><Field label="설명" value={production.immersive.description.ko} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.immersive.description.ko=value;})}/><Field label="영상 링크 문구" value={production.immersive.linkLabel.ko} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.immersive.linkLabel.ko=value;})}/><Field label="보고서 링크 문구" value={production.immersive.reportLabel.ko} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.immersive.reportLabel.ko=value;})}/></section>
        </div><div className="admin-columns"><Field label="프로젝트 제목" value={production.immersive.title} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.immersive.title=value;})}/><Field label="YouTube URL" value={production.immersive.videoUrl} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.immersive.videoUrl=value;})}/><Field label="English report" value={production.immersive.reports.en} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.immersive.reports.en=value;})}/><Field label="한국어 보고서" value={production.immersive.reports.ko} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.immersive.reports.ko=value;})}/></div></div>
      </details>
      <div className="admin-title-row"><h2>04 · Live Sound 활동</h2><button className="secondary" onClick={()=>updateDocument(paths.activities,(doc)=>doc.unshift({id:crypto.randomUUID(),title:'새 행사',englishTitle:'New Event',eventType:'Live Event Production',year:new Date().getFullYear().toString(),image:'',role:'Mixing Engineer'}))}>행사 추가</button></div>
      <div className="admin-columns"><Field label="English section label" value={production.credits.eyebrow.en} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.credits.eyebrow.en=value;})}/><Field label="한국어 섹션 이름" value={production.credits.eyebrow.ko} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.credits.eyebrow.ko=value;})}/><Field label="섹션 제목" value={production.credits.title} onChange={(value)=>updateDocument(paths.musicProduction,(doc)=>{doc.credits.title=value;})}/></div>
      <input className="admin-search" placeholder="행사명 검색" value={activitySearch} onChange={(event)=>setActivitySearch(event.target.value)}/>{activities.map((activity,index)=>({activity,index})).filter(({activity})=>!activityMatches || `${activity.title} ${activity.englishTitle}`.toLowerCase().includes(activityMatches)).map(({activity,index})=><details className="admin-card" key={activity.id}><summary><span>{activity.title}</span><span>{activity.eventType} · {activity.year}</span></summary><div className="admin-card-body"><ButtonRow index={index} length={activities.length} onMove={(direction)=>updateDocument(paths.activities,(doc)=>{const next=move(doc,index,direction);doc.splice(0,doc.length,...next);})} onDelete={()=>{if(confirm('이 행사를 삭제할까요?'))updateDocument(paths.activities,(doc)=>doc.splice(index,1));}}/><div className="admin-columns"><Field label="한국어 행사명" value={activity.title} onChange={(value)=>updateDocument(paths.activities,(doc)=>{doc[index].title=value;})}/><Field label="영문 행사명" value={activity.englishTitle} onChange={(value)=>updateDocument(paths.activities,(doc)=>{doc[index].englishTitle=value;})}/><Field label="행사 분류" value={activity.eventType} onChange={(value)=>updateDocument(paths.activities,(doc)=>{doc[index].eventType=value;})}/><Field label="연도" value={activity.year} onChange={(value)=>updateDocument(paths.activities,(doc)=>{doc[index].year=value;})}/><label className="admin-field"><span>역할</span><select value={activity.role} onChange={(event)=>updateDocument(paths.activities,(doc)=>{doc[index].role=event.target.value;})}><option>Mixing Engineer</option><option>System Engineer</option><option>Technician</option></select></label></div><ImageEditor label="행사 사진" value={activity.image} onChange={(value)=>updateDocument(paths.activities,(doc)=>{doc[index].image=value;})} queueAsset={queueAsset} removeAsset={removeAsset}/></div></details>)}
    </div>}

    <footer className="admin-savebar"><span>{assets.length ? `새 사진 ${assets.length}장 대기 중` : '변경 사항을 확인한 뒤 저장하세요.'}</span><button className="primary" disabled={busy} onClick={save}>{busy?'저장 중…':'저장하고 배포'}</button></footer>
  </main>;
}
