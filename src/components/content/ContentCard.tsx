import type { Announcement } from '../../types';
import { Link } from 'react-router-dom';
import { contentSlug } from '../../lib/contentSlug';

export function AnnouncementCard({ item }: { item: Announcement }) {
  const type = item.contentType === 'pengumuman' ? 'pengumuman' : 'artikel';
  return <Link to={`/${type}/${contentSlug(item.title)}`} className="lasem-panel block p-5 transition hover:-translate-y-0.5 hover:shadow-lg"><p className="text-xs font-medium text-[#1E4D3E]">{item.date} · {item.author}</p><h3 className="mt-2 text-lg font-bold text-[#163B31]">{item.title}</h3><p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">{item.summary}</p>{item.coverImage && <img src={item.coverImage} loading="lazy" decoding="async" alt="" className="mt-4 max-h-56 w-full rounded-xl object-cover" onError={(event) => { event.currentTarget.style.display = 'none' }} />}</Link>;
}
