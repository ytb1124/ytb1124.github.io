import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Image from 'next/image';
import { musicProduction } from '../data/music-production';
import { projectSummaries } from '../data/project-summaries';
import { catalogProjects, getProjectResources, getProjectSummary, type Project, site } from '../data/site';
import { getSelectedWriting } from '../data/writing';
import './simple.css';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: `${site.name} / Music Technology`,
  description: site.home.intro,
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
  for (const resource of getProjectResources(project)) {
    links.push({ href: resource.href, label: resource.label.en.replace(/\s*[↗→]\s*$/, '') });
  }
  if (project.gallery[0]) links.push({ href: project.gallery[0], label: 'Photo / Screenshot' });
  return links;
}

export default function SimplePage() {
  const writing = site.pageContent.en.experience;
  const rendererStudy = catalogProjects.find(project => project.slug === 'spatial-renderer-system-identification');
  const plannedSubmissions = catalogProjects.filter(project => project.plannedSubmission);

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
            <h1 id="hero-heading">{site.name} <span>/ Music Technology</span></h1>
            <p className="simple-intro">{site.home.intro}</p>
            <ul className="simple-links simple-intro-links"><li><a href={site.contact.emailHref}>Email <span aria-hidden="true">↗</span></a></li><li><ResourceLink href="https://github.com/ytb1124">GitHub</ResourceLink></li><li><ResourceLink href={site.socials.cv}>CV (PDF)</ResourceLink></li><li><ResourceLink href="https://taebin.link/">Full website · taebin.link</ResourceLink></li></ul>
          </div>
          <Image className="simple-portrait" src={site.assets.homePortrait} alt={site.name} width={300} height={400} priority data-no-lightbox />
        </section>

        <section className="simple-section" id="projects" aria-labelledby="projects-heading">
          <div className="simple-section-heading"><div><span className="simple-number">{site.pageContent.en.projects.eyebrow}</span><h2 id="projects-heading">Featured projects</h2></div><a href="#research">Research & publications <span aria-hidden="true">↓</span></a></div>
          <div className="simple-section-content simple-project-grid">
            {catalogProjects.map(project => {
              const technicalRole = projectSummaries[project.slug]?.en?.build ?? project.contribution?.design.en;
              return (
              <article className="simple-project" id={project.slug} key={project.slug}>
                <a className={`simple-project-image${project.slug === 'listening-tool-ci' ? ' simple-ensemble-image' : ''}`} href={`/projects/${project.slug}`} aria-label={`Read more about ${project.title}`}><Image src={project.image} alt={project.title} width={1200} height={750} loading="lazy" /></a>
                <div className="simple-project-meta"><span>{project.category}</span><span>{project.year}{project.ongoing ? ' · Ongoing' : ''}</span></div>
                <h3>{project.title}</h3>
                <p className="simple-project-summary">{getProjectSummary(project, 'en')}</p>
                {technicalRole && <div className="simple-role"><h4>My technical role</h4><p>{technicalRole}</p></div>}
                <ul className="simple-links" aria-label={`${project.title} resources`}>
                  {projectLinks(project).map(link => <li key={link.href}><ResourceLink href={link.href}>{link.label}</ResourceLink></li>)}
                </ul>
              </article>
              );
            })}
          </div>
        </section>

        <section className="simple-section" id="music" aria-labelledby="music-heading">
          <div className="simple-section-heading"><div><span className="simple-number">{musicProduction.selectedProjects.eyebrow.en}</span><h2 id="music-heading">Music production</h2></div><ResourceLink href="https://taebin.link/music-production">More music production</ResourceLink></div>
          <p className="simple-section-description">{site.pageContent.en.music.intro}</p>
          <div className="simple-section-content simple-music-grid">
            {musicProduction.selectedProjects.projects.map(project => <article className="simple-music-project" key={project.id}>
              <a className="simple-project-image" href={project.videoUrl} target="_blank" rel="noopener noreferrer" aria-label={`Watch ${project.title}`}><Image src={project.image} alt={project.title} width={1200} height={675} loading="lazy" /></a>
              <div className="simple-project-meta"><span>{project.category.en}</span><span>{project.year}</span></div>
              <h3>{project.title}</h3>
              <p className="simple-project-summary">{project.question.en}</p>
              <div className="simple-role"><h4>My role</h4><p>{project.body.en[0]}</p></div>
              <ul className="simple-links"><li><ResourceLink href={project.videoUrl}>{project.videoLabel.en.replace(/\s*→$/, '')}</ResourceLink></li>{project.reports && <li><ResourceLink href={project.reports.en}>{project.reportLabel?.en.replace(/\s*→$/, '') ?? 'Read report'}</ResourceLink></li>}</ul>
            </article>)}
            <article className="simple-music-project">
              <a className="simple-project-image simple-album-image" href={musicProduction.studio.playlistUrl} target="_blank" rel="noopener noreferrer" aria-label={`Listen to ${musicProduction.studio.albumTitle}`}><Image src={musicProduction.studio.cover} alt={musicProduction.studio.coverAlt} width={800} height={800} loading="lazy" /></a>
              <div className="simple-project-meta"><span>{musicProduction.studio.title}</span><span>{musicProduction.studio.eyebrow.en}</span></div>
              <h3>{musicProduction.studio.albumTitle}</h3>
              <p className="simple-project-summary">{musicProduction.studio.meta}</p>
              <div className="simple-role"><h4>My role</h4><p>{musicProduction.studio.note.en}</p></div>
              <ul className="simple-links"><li><ResourceLink href={musicProduction.studio.playlistUrl}>{musicProduction.studio.listenLabel.en.replace(/\s*→$/, '')}</ResourceLink></li></ul>
            </article>
          </div>
          <p className="simple-more"><ResourceLink href={musicProduction.mixing.playlistUrl}>{musicProduction.mixing.title.en}</ResourceLink><ResourceLink href="https://taebin.link/music-production">All production work & live credits</ResourceLink></p>
        </section>

        <section className="simple-section" id="research" aria-labelledby="research-heading">
          <div className="simple-section-heading"><div><span className="simple-number">Papers, writing & technical studies</span><h2 id="research-heading">Research & publications</h2></div></div>
          <div className="simple-section-content simple-research-list">
            {getSelectedWriting('en').map(publication => <article className="simple-publication" key={publication.id}>
              <p className="simple-eyebrow">{publication.kind}</p>
              <h3 lang={publication.lang}>{publication.title}</h3>
              <p>{publication.citation}</p>
              {publication.award && <p className="simple-award">{publication.award}</p>}
              <ul className="simple-links">{publication.links.map(link => <li key={link.href}><ResourceLink href={link.href}>{link.label.en.replace(/\s*↗$/, '')}</ResourceLink></li>)}</ul>
            </article>)}
            {rendererStudy && <article className="simple-publication">
              <p className="simple-eyebrow">{rendererStudy.category} · {rendererStudy.year}</p>
              <h3>{rendererStudy.title}</h3>
              <p>{getProjectSummary(rendererStudy, 'en')}</p>
              <ul className="simple-links">{getProjectResources(rendererStudy).map(link => <li key={link.href}><ResourceLink href={link.href}>{link.label.en.replace(/\s*[↗→]$/, '')}</ResourceLink></li>)}</ul>
            </article>}
            {plannedSubmissions.map(project => {
              const submission = project.plannedSubmission!;
              return <article className="simple-publication simple-planned" key={project.slug}>
                <p className="simple-eyebrow">{submission.label.en}</p>
                <h3>{submission.venue}</h3>
                <p>{submission.description.en}</p>
                <ul className="simple-links"><li><ResourceLink href={submission.href}>Workshop Website</ResourceLink></li></ul>
              </article>;
            })}
          </div>
        </section>

        <section className="simple-section" id="bio" aria-labelledby="bio-heading">
          <div className="simple-section-heading"><div><span className="simple-number">Background & experience</span><h2 id="bio-heading">About / CV / contact</h2></div></div>
          <div className="simple-section-content">
            <div className="simple-bio">
              <dl className="simple-facts">
                <div><dt>Based in</dt><dd>{site.pageContent.en.contact.location}</dd></div>
                <div><dt>Education</dt><dd>{writing.degree}, {writing.school}<br />{writing.period} · {writing.gpa}</dd></div>
                <div><dt>Experience</dt><dd>{writing.highlights.map(([period, role, organization]) => <span className="simple-career" key={`${period}-${role}`}>{role} · {organization} · {period}</span>)}</dd></div>
              </dl>
            </div>
            <div className="simple-cv" id="cv"><div><h3>Curriculum vitae</h3><p>{site.experience.cvDescription}</p></div><ResourceLink href={site.socials.cv}>View CV (PDF)</ResourceLink></div>
            <div className="simple-contact" id="contact">
              <p className="simple-eyebrow">{site.pageContent.en.contact.title}</p>
              <h3>{site.pageContent.en.contact.eyebrow}</h3>
              <p className="simple-section-description">{site.pageContent.en.contact.intro}</p>
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
