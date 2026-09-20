import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as db from '../lib/db';
import type { Announcement, ForumPost } from '../types';

export default function ContentLandingPage({ type }: { type: 'artikel' | 'pengumuman' | 'kreasi' }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  useEffect(() => { void Promise.all([db.fetchAnnouncements(true), db.fetchForumPosts()]).then(([a, p]) => { setAnnouncements(a.data); setPosts(p); }); }, []);
  const title = type === 'artikel' ? 'Artikel' : type === 'pengumuman' ? 'Pengumuman' : 'Kreasi Warga';
  return <main className="min-h-screen bg-[#F8F9FA] px-5 py-10 text-[#1F2937]"><div className="mx-auto max-w-5xl"><Link to="/" className="text-sm font-semibold text-emerald-800">← Beranda</Link><h1 className="mt-6 text-4xl font-bold text-[#1B4332]">{title}</h1><div className="mt-8 grid gap-5 md:grid-cols-2">{type === 'kreasi' ? posts.map(p => <article key={p.id} className="rounded-2xl bg-white p-6 shadow-sm"><p className="text-xs text-emerald-700">{p.author_name} · {p.category}</p><h2 className="mt-2 text-xl font-bold">{p.title}</h2><p className="mt-3 whitespace-pre-line text-slate-600">{p.content}</p>{p.image_url && <img src={p.image_url} className="mt-4 max-h-80 w-full rounded-xl object-cover" alt=""/>}</article>) : announcements.filter(a => a.contentType === type).map(a => <article key={a.id} className="rounded-2xl bg-white p-6 shadow-sm"><p className="text-xs text-emerald-700">{a.date} · {a.author}</p><h2 className="mt-2 text-xl font-bold">{a.title}</h2><p className="mt-3 whitespace-pre-line text-slate-600">{a.summary}</p>{a.coverImage && <img src={a.coverImage} className="mt-4 max-h-80 w-full rounded-xl object-cover" alt=""/>}</article>)}</div></div></main>;
}
