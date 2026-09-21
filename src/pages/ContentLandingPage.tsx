import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as db from '../lib/db';
import type { Announcement, ForumPost } from '../types';
import { ContentSection } from '../components/content/ContentSection';
import { AnnouncementCard } from '../components/content/ContentCard';
import { contentSlug } from '../lib/contentSlug';

export default function ContentLandingPage({ type }: { type: 'artikel' | 'pengumuman' | 'kreasi' }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]); const [loading,setLoading]=useState(true); const [error,setError]=useState('');
  const [posts, setPosts] = useState<ForumPost[]>([]);
  useEffect(() => { void Promise.all([db.fetchAnnouncements(true), db.fetchForumPosts()]).then(([a, p]) => { setAnnouncements(a.data); setPosts(p); }).catch(e=>setError(e instanceof Error?e.message:'Konten gagal dimuat.')).finally(()=>setLoading(false)); }, []);
  const title = type === 'artikel' ? 'Artikel' : type === 'pengumuman' ? 'Pengumuman' : 'Kreasi Warga';
  const filtered = announcements.filter(a => a.contentType === type);
  return <main className="min-h-screen bg-[#F7F4ED] px-5 py-10 text-[#17231F]"><div className="mx-auto max-w-5xl"><Link to="/" className="text-sm font-semibold text-emerald-800">← Beranda</Link><h1 className="mt-6 text-4xl font-bold text-[#163B31]">{title}</h1><ContentSection id={type} eyebrow="Perpustakaan Desa Lasem" title={title} loading={loading} error={error} empty={type === 'kreasi' ? !posts.length : !filtered.length}>{type === 'kreasi' ? <div className="space-y-5">{posts.map(p=><Link to={`/kreasi/${contentSlug(p.title)}`} key={p.id} className="lasem-panel block p-6 transition hover:-translate-y-0.5 hover:shadow-lg"><p className="text-xs text-emerald-700">{p.author_name} · {p.category}</p><h2 className="mt-2 text-xl font-bold">{p.title}</h2><p className="mt-3 whitespace-pre-line text-slate-600">{p.content}</p>{p.image_url && <img src={p.image_url} loading="lazy" decoding="async" className="mt-4 max-h-80 w-full rounded-xl object-cover" alt="" onError={(event) => { event.currentTarget.style.display = 'none' }} />}</Link>)}</div> : <div className="grid gap-5 md:grid-cols-2">{filtered.map(a=><AnnouncementCard key={a.id} item={a}/>)}</div>}</ContentSection></div></main>;
}
