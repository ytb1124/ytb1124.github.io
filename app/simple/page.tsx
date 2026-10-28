import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Image from 'next/image';
import { musicProduction } from '../data/music-production';
import { projectSummaries } from '../data/project-summaries';
import { allProjects, type Project, site } from '../data/site';
import './simple.css';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Taebin Yoo / Music Technology',
  description: 'Selected projects, research, and technical contributions by Taebin Yoo, working across spatial audio, musical instruments, and accessible music technology.',
  alternates: { canonical: 'https://taebin.link/simple' },
};

function ResourceLink({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} target="_blank" rel="noopener noreferrer">{children}<span aria-hidden="true"> ↗</span></a>;
}

function projectLinks(project: Project) {
  const links: { href: string; label: string }[] = [];
  if (project.repository) links.push({ href: project.repository, label: 'GitHub Repo' });
  if (project.video) {
    const url = new URL(project.video);
    const videoId = url.pathname.startsWith('/embed/') ? url.pathname.split('/')[2] : undefined;
    links.push({ href: videoId ? `https://www.youtube.com/watch?v=${videoId}` : project.video, label: 'YouTube Demo' });
  }
  if (project.demo) links.push({ href: project.demo.src, label: 'Demo Video (MP4)' });
  for (const resource of project.resources ?? []) {
    links.push({ href: resource.href, label: resource.label.en.replace(/\s*[↗→]\s*$/, '') });
  }
  if (project.gallery[0]) links.push({ href: project.gallery[0], label: 'Photo / Screenshot' });
  return links;
}

export default function SimplePage() {
  const writing = site.pageContent.en.experience;
  const plannedSubmission = allProjects.find(project => project.slug === 'corrective-impulse-response')?.plannedSubmission;

  return (
    <div className="site-frame simple-page" id="top">
      <a className="simple-skip" href="#main-content">Skip to content</a>
      <header className="site-header simple-header">
          <a className="brand" href="#top">{site.name}</a>
          <nav className="desktop-nav simple-nav" aria-label="Primary navigation">
            <a href="#projects">Projects</a>
            <a href="#music">Music Production</a>
            <a href="#research">Research</a>
            <a href="#bio">Bio</a>
            <ResourceLink href={site.socials.cv}>CV (PDF)</ResourceLink>
          </nav>
      </header>

      <main className="simple-main" id="main-content">
        <section className="simple-hero" aria-labelledby="hero-heading">
          <div className="simple-hero-copy">
            <h1 id="hero-heading">Taebin Yoo <span>/ Music Technology</span></h1>
            <p className="simple-intro">I build music tools, electronic instruments, and spatial audio systems at the intersection of musical interaction, machine learning, and accessible music technology. My practice spans live sound engineering, immersive performance, and studio recording.</p>
            <ul className="simple-links simple-intro-links"><li><a href={site.contact.emailHref}>Email <span aria-hidden="true">↗</span></a></li><li><ResourceLink href="https://github.com/ytb1124">GitHub</ResourceLink></li><li><ResourceLink href={site.socials.cv}>CV (PDF)</ResourceLink></li><li><ResourceLink href="https://taebin.link/">Full website · taebin.link</ResourceLink></li></ul>
          </div>
          <Image className="simple-portrait" src={site.assets.homePortrait} alt="Taebin Yoo" width={300} height={400} priority data-no-lightbox />
        </section>

        <section className="simple-section" id="projects" aria-labelledby="projects-heading">
          <div className="simple-section-heading"><div><span className="simple-number">Selected work / 2025–2026</span><h2 id="projects-heading">Featured projects</h2></div><a href="#research">Research & publications <span aria-hidden="true">↓</span></a></div>
          <div className="simple-section-content simple-project-grid">
            {allProjects.map(project => (
              <article className="simple-project" id={project.slug} key={project.slug}>
                <a className={`simple-project-image${project.slug === 'listening-tool-ci' ? ' simple-ensemble-image' : ''}`} href={`/projects/${project.slug}`} aria-label={`Read more about ${project.title}`}><Image src={project.image} alt={project.title} width={1200} height={750} loading="lazy" /></a>
                <div className="simple-project-meta"><span>{project.category}</span><span>{project.year}{project.ongoing ? ' · Ongoing' : ''}</span></div>
                <h3>{project.title}</h3>
                <p className="simple-project-summary">{project.slug === 'listening-tool-ci' ? projectSummaries[project.slug].en.system : project.description}</p>
                <div className="simple-role"><h4>My technical role</h4><p>{projectSummaries[project.slug].en.build}</p></div>
                {project.slug === 'listening-tool-ci' && <p className="simple-project-note">Current prototype uses pink-noise placeholders; CI user evaluation is still planned.</p>}
                <ul className="simple-links" aria-label={`${project.title} resources`}>
                  {projectLinks(project).map(link => <li key={link.href}><ResourceLink href={link.href}>{link.label}</ResourceLink></li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="simple-section" id="music" aria-labelledby="music-heading">
          <div className="simple-section-heading"><div><span className="simple-number">Live sound, immersive production & recording</span><h2 id="music-heading">Music production</h2></div><ResourceLink href="https://taebin.link/music-production">More music production</ResourceLink></div>
          <div className="simple-section-content simple-music-grid">
            {musicProduction.selectedProjects.projects.map(project => <article className="simple-music-project" key={project.id}>
              <a className="simple-project-image" href={project.videoUrl} target="_blank" rel="noopener noreferrer" aria-label={`Watch ${project.title}`}><Image src={project.image} alt={project.title} width={1200} height={675} loading="lazy" /></a>
              <div className="simple-project-meta"><span>{project.category.en}</span><span>{project.year}</span></div>
              <h3>{project.title}</h3>
              <p className="simple-project-summary">{project.question.en}</p>
              <div className="simple-role"><h4>My role</h4><p>{project.body.en[0]}</p></div>
              <ul className="simple-links"><li><ResourceLink href={project.videoUrl}>YouTube Video</ResourceLink></li>{project.reports && <li><ResourceLink href={project.reports.en}>Case Study (PDF)</ResourceLink></li>}</ul>
            </article>)}
            <article className="simple-music-project">
              <a className="simple-project-image simple-album-image" href={musicProduction.studio.playlistUrl} target="_blank" rel="noopener noreferrer" aria-label={`Listen to ${musicProduction.studio.albumTitle}`}><Image src={musicProduction.studio.cover} alt={musicProduction.studio.coverAlt} width={800} height={800} loading="lazy" /></a>
              <div className="simple-project-meta"><span>Studio recording</span><span>2026</span></div>
              <h3>{musicProduction.studio.albumTitle}</h3>
              <p className="simple-project-summary">{musicProduction.studio.meta}</p>
              <div className="simple-role"><h4>My role</h4><p>{musicProduction.studio.note.en}</p></div>
              <ul className="simple-links"><li><ResourceLink href={musicProduction.studio.playlistUrl}>Listen to the Album</ResourceLink></li></ul>
            </article>
          </div>
          <p className="simple-more"><ResourceLink href={musicProduction.mixing.playlistUrl}>Live Mixing Playlist</ResourceLink><ResourceLink href="https://taebin.link/music-production">All production work & live credits</ResourceLink></p>
        </section>

        <section className="simple-section" id="research" aria-labelledby="research-heading">
          <div className="simple-section-heading"><div><span className="simple-number">Papers, writing & technical studies</span><h2 id="research-heading">Research & publications</h2></div></div>
          <div className="simple-section-content simple-research-list">
            <article className="simple-publication">
              <p className="simple-eyebrow">Conference paper · 2026</p>
              <h3>{writing.paperTitle}</h3>
              <p>{writing.paperCitation}</p>
              <p className="simple-award">{writing.writingAward}</p>
              <ul className="simple-links"><li><ResourceLink href="/reports/corrective-ir-paper-en.pdf">Paper (EN PDF)</ResourceLink></li><li><ResourceLink href="/reports/corrective-ir-paper-ko.pdf">Paper (KO PDF)</ResourceLink></li></ul>
            </article>
            <article className="simple-publication">
              <p className="simple-eyebrow">Magazine article · 2026</p>
              <h3 lang="ko">{writing.magazineTitle.replace(/\s*↗$/, '')}</h3>
              <p>{writing.magazineCitation}</p>
              <ul className="simple-links"><li><ResourceLink href="/reports/corrective-ir-ssm-vol19-ko.pdf">Article (KO PDF)</ResourceLink></li></ul>
            </article>
            <article className="simple-publication">
              <p className="simple-eyebrow">Technical studies · 2026</p>
              <h3>Spatial audio renderer measurements</h3>
              <p>Independent measurements and model comparisons of Sound xR Image and L-ISA Studio.</p>
              <ul className="simple-links"><li><ResourceLink href="/reports/sound-xr-image-renderer-report-en.pdf">Sound xR Report (EN PDF)</ResourceLink></li><li><ResourceLink href="/reports/l-isa-renderer-report-en.pdf">L-ISA Report (EN PDF)</ResourceLink></li><li><ResourceLink href="/downloads/afc-renderer-experiment.xlsx">Measurement Data (XLSX)</ResourceLink></li></ul>
            </article>
            {plannedSubmission && <article className="simple-publication simple-planned">
              <p className="simple-eyebrow">Planned submission</p>
              <h3>{plannedSubmission.venue}</h3>
              <p>A paper on the Corrective IR project is planned for this workshop. It has not yet been submitted or accepted.</p>
              <ul className="simple-links"><li><ResourceLink href={plannedSubmission.href}>Workshop Website</ResourceLink></li></ul>
            </article>}
          </div>
        </section>

        <section className="simple-section" id="bio" aria-labelledby="bio-heading">
          <div className="simple-section-heading"><div><span className="simple-number">Background & experience</span><h2 id="bio-heading">About / CV / contact</h2></div></div>
          <div className="simple-section-content">
            <div className="simple-bio">
              <dl className="simple-facts">
                <div><dt>Based in</dt><dd>{site.contact.address}</dd></div>
                <div><dt>Education</dt><dd>{writing.degree}, {writing.school}<br />{writing.period} · {writing.gpa}</dd></div>
                <div><dt>Experience</dt><dd>Freelance live sound engineer · 2022–Present · 200+ performances<br />Technical intern, BLS System Design Division · 2025</dd></div>
              </dl>
            </div>
            <div className="simple-cv" id="cv"><div><h3>Curriculum vitae</h3><p>Education, experience, research, and qualifications.</p></div><ResourceLink href={site.socials.cv}>View CV (PDF)</ResourceLink></div>
            <div className="simple-contact" id="contact">
              <p className="simple-eyebrow">Contact</p>
              <h3>Let’s talk about sound & music.</h3>
              <a className="simple-email" href={site.contact.emailHref}>{site.contact.email}<span aria-hidden="true"> ↗</span></a>
              <ul className="simple-links"><li><ResourceLink href={site.socials.linkedin}>LinkedIn</ResourceLink></li><li><ResourceLink href="https://github.com/ytb1124">GitHub</ResourceLink></li><li><ResourceLink href={site.socials.youtube}>YouTube</ResourceLink></li></ul>
              <p className="simple-more"><ResourceLink href="https://taebin.link/">Visit taebin.link for the full portfolio</ResourceLink></p>
            </div>
          </div>
        </section>
      </main>

      <footer className="simple-footer"><span>© {new Date().getFullYear()} {site.name}</span><ResourceLink href="https://taebin.link/">taebin.link</ResourceLink><a href="#top">Back to top ↑</a></footer>
    </div>
  );
}
