import type { Announcement } from '../../types';

export function AnnouncementCard({ item }: { item: Announcement }) {
  return <article className="lasem-panel p-5"><p className="text-xs font-medium text-[#1E4D3E]">{item.date} · {item.author}</p><h3 className="mt-2 text-lg font-bold text-[#163B31]">{item.title}</h3><p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">{item.summary}</p>{item.coverImage && <img src={item.coverImage} alt="" className="mt-4 max-h-56 w-full rounded-xl object-cover" />}</article>;
}
