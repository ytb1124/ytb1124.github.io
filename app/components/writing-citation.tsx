import type { getSelectedWriting } from '../data/writing';

type Publication = ReturnType<typeof getSelectedWriting>[number];

export function WritingCitation({ publication, titleHref }: { publication: Publication; titleHref?: string }) {
  const { author, year, title, citation, lang } = publication;

  return <p className="writing-citation" lang={lang}>
    <strong>{author}</strong>{` (${year}). `}
    {titleHref ? <a href={titleHref} target="_blank" rel="noopener noreferrer">{title}</a> : title}
    {`. ${citation}`}
  </p>;
}
