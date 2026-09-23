import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, BookOpen, ArrowLeft, Star } from 'lucide-react';
import * as db from '../lib/db';
import type { Book } from '../types';

function Cover({ book }: { book: Book }) {
  const [src, setSrc] = useState(book.coverImage || '/logo-terang-literasi-transparent.png');
  return <img src={src} onError={() => setSrc('/logo-terang-literasi-transparent.png')} alt={book.title} loading="lazy" decoding="async" className="h-64 w-full rounded-2xl object-cover bg-[#F4EFEA]" />;
}

export default function PublicCollectionPage() {
  const [params] = useSearchParams(); const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(0); const [hasMore, setHasMore] = useState(false); const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(params.get('category') || 'Semua');
  const [error, setError] = useState('');
  useEffect(() => {
    setLoading(true);
    db.fetchBooksPaginated(0, 24, true)
      .then((result) => { setBooks(result.data); setHasMore(result.hasMore); setPage(0); })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  const loadMore = async () => {
    const result = await db.fetchBooksPaginated(page + 1, 24, true);
    setBooks((current) => [...current, ...result.data]); setHasMore(result.hasMore); setPage((current) => current + 1);
  };
  const categories = ['Semua', ...Array.from(new Set(books.map((b) => b.category)))];
  const filtered = useMemo(() => books.filter((b) => (category === 'Semua' || b.category === category) && `${b.title} ${b.author} ${b.description}`.toLowerCase().includes(query.toLowerCase())), [books, category, query]);
 return <div className="min-h-screen bg-[#F8F9FA] text-[#1F2937]"><header className="sticky top-0 z-20 border-b border-[#E5E7EB] bg-white/95 backdrop-blur"><div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5"><Link to="/" className="flex items-center gap-3"><img src="/logo-terang-literasi-transparent.png" className="h-12 w-40 object-contain" alt="Logo Terang Literasi"/></Link><div className="flex gap-2"><Link to="/login?redirect=%2Fkoleksi" className="rounded-xl border border-[#1E4D3E] px-4 py-2 text-sm font-semibold text-[#1E4D3E]">Masuk</Link><Link to="/register" className="rounded-xl bg-[#1E4D3E] px-4 py-2 text-sm font-semibold text-white">Daftar</Link></div></div></header><main className="mx-auto max-w-7xl px-5 py-10"><Link to="/" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#1E4D3E]"><ArrowLeft className="h-4 w-4"/> Beranda</Link><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="font-bold text-[#D97706]">Koleksi publik</p><h1 className="mt-1 text-3xl font-bold text-[#1B4332]">Koleksi Perpustakaan Desa</h1><p className="mt-2 text-slate-500">Buku nyata yang tersedia untuk dibaca warga.</p></div><span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">{books.length} judul tersedia</span></div><div className="mt-8 flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-4"><Search className="h-5 w-5 text-slate-400"/><input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full outline-none" placeholder="Cari judul, penulis, atau kata kunci..."/></div><div className="mt-4 flex gap-2 overflow-x-auto pb-2">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold ${category === item ? 'bg-[#1E4D3E] text-white' : 'border border-[#E5E7EB] bg-white text-slate-600'}`}>{item}</button>)}</div>{error && <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">Koleksi belum dapat dimuat: {error}</div>}{loading ? <p className="mt-8 rounded-2xl bg-white p-10 text-center text-slate-500">Memuat koleksi…</p> : <><div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">{filtered.map((book) => <Link key={book.id} to={`/koleksi/${encodeURIComponent(book.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}`} state={{ book }} className="group"><Cover book={book}/><h2 className="mt-3 line-clamp-2 font-bold group-hover:text-[#1E4D3E]">{book.title}</h2><p className="mt-1 truncate text-sm text-slate-500">{book.author}</p><p className="mt-2 flex items-center gap-1 text-xs text-[#D97706]"><Star className="h-3.5 w-3.5 fill-current"/> {book.rating.toFixed(1)} · {book.category}</p></Link>)}{!error && !filtered.length && <div className="col-span-full rounded-2xl bg-white p-10 text-center text-slate-500"><BookOpen className="mx-auto mb-3 h-8 w-8"/>Belum ada buku yang cocok.</div>}</div>{hasMore && <button type="button" onClick={() => void loadMore()} className="mx-auto mt-8 block rounded-xl border border-[#1E4D3E] px-5 py-3 font-semibold text-[#1E4D3E]">Muat lebih banyak</button>}</>}</main></div>;
}
