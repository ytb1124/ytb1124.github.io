import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { projectSummaries } from '../data/project-summaries';
import { allProjects, type Project, site } from '../data/site';
import './simple.css';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Taebin Yoo — Sound & Music Technology',
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
    <div className="simple-page" id="top">
      <a className="simple-skip" href="#main-content">Skip to content</a>
      <header className="simple-header">
        <div className="simple-header-inner">
          <a className="simple-name" href="#top">{site.name}<span aria-hidden="true">.</span></a>
          <nav aria-label="Primary navigation">
            <a href="#projects">Projects</a>
            <a href="#research">Research</a>
            <a href="#bio">Bio</a>
            <ResourceLink href={site.socials.cv}>CV (PDF)</ResourceLink>
          </nav>
        </div>
      </header>

      <main className="simple-main" id="main-content">
        <section className="simple-hero" aria-labelledby="hero-heading">
          <p className="simple-eyebrow">Sound engineering & music technology</p>
          <h1 id="hero-heading">Building intelligent music tools, expressive instruments, <span>& spatial audio systems.</span></h1>
          <p className="simple-intro">I’m Taebin Yoo, a live sound engineer and music technology researcher based in Seoul. My work connects spatial audio, musical interaction, and machine learning to explore how sound can adapt to spaces and people.</p>
          <div className="simple-hero-bottom">
            <p>Selected work <span aria-hidden="true">/</span> 2025–2026</p>
            <a href="#projects">Explore projects <span aria-hidden="true">↓</span></a>
          </div>
        </section>

        <section className="simple-section" id="projects" aria-labelledby="projects-heading">
          <div className="simple-section-heading"><span className="simple-number" aria-hidden="true">01</span><h2 id="projects-heading">Featured projects</h2></div>
          <div className="simple-section-content">
            {allProjects.map(project => (
              <article className="simple-project" id={project.slug} key={project.slug}>
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

        <section className="simple-section" id="research" aria-labelledby="research-heading">
          <div className="simple-section-heading"><span className="simple-number" aria-hidden="true">02</span><h2 id="research-heading">Research & publications</h2></div>
          <div className="simple-section-content">
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
          <div className="simple-section-heading"><span className="simple-number" aria-hidden="true">03</span><h2 id="bio-heading">About / CV / contact</h2></div>
          <div className="simple-section-content">
            <div className="simple-bio">
              <h3>A practice shaped by listening.</h3>
              <p>{site.home.intro}</p>
              <p>Working on sound for more than 200 performances led me from tuning rooms to building tools for performers and listeners. My current interests include spatial sound reproduction, performer-tailored instruments, audio-to-MIDI workflows, and accessible music experiences.</p>
              <dl className="simple-facts">
                <div><dt>Based in</dt><dd>{site.contact.address}</dd></div>
                <div><dt>Education</dt><dd>{writing.degree}, {writing.school}<br />{writing.period} · {writing.gpa}</dd></div>
                <div><dt>Experience</dt><dd>Freelance live sound engineer · 2022–Present<br />Technical intern, BLS System Design Division · 2025</dd></div>
              </dl>
            </div>
            <div className="simple-cv" id="cv"><div><h3>Curriculum vitae</h3><p>Education, experience, research, and qualifications.</p></div><ResourceLink href={site.socials.cv}>View CV (PDF)</ResourceLink></div>
            <div className="simple-contact" id="contact">
              <p className="simple-eyebrow">Contact</p>
              <h3>Let’s talk about sound & music.</h3>
              <a className="simple-email" href={site.contact.emailHref}>{site.contact.email}<span aria-hidden="true"> ↗</span></a>
              <ul className="simple-links"><li><ResourceLink href={site.socials.linkedin}>LinkedIn</ResourceLink></li><li><ResourceLink href="https://github.com/ytb1124">GitHub</ResourceLink></li><li><ResourceLink href={site.socials.youtube}>YouTube</ResourceLink></li></ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="simple-footer"><span>© {new Date().getFullYear()} {site.name}</span><a href="#top">Back to top ↑</a></footer>
    </div>
  );
}
