import type { ReactNode } from 'react';

/** One title, description and optional aside pattern for the main sections. */
export function PageIntro({ eyebrow, title, description, action, aside }: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
  aside?: ReactNode;
}) {
  return <header className={`page-intro${aside ? ' page-intro-with-aside' : ''}`}>
    <div className="page-intro-copy">
      <span className="section-eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
      {action && <div className="page-intro-action">{action}</div>}
    </div>
    {aside && <div className="page-intro-aside">{aside}</div>}
  </header>;
}
