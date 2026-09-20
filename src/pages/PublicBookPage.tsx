import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Download, Lock, Star } from 'lucide-react';
import type { Book } from '../types';
import * as db from '../lib/db';

export default function PublicBookPage() {
  const { bookSlug } = useParams(); const location = useLocation();
  const [book, setBook] = useState<Book | undefined>((location.state as { book?: Book } | null)?.book);
  const [error, setError] = useState('');
  useEffect(() => { if (book) return; db.fetchPublishedBooks().then(({ data }) => setBook(data.find((item) => item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === bookSlug))).catch((e: Error) => setError(e.message)); }, [book, bookSlug]);
  if (error) return <main className="min-h-screen p-8 text-red-700">Buku gagal dimuat: {error}</main>;
  if (!book) return <main className="min-h-screen p-8">Memuat detail buku...</main>;
  return <main className="min-h-screen bg-[#F8F9FA] px-5 py-10 text-[#1F2937]"><div className="mx-auto max-w-5xl"><Link to="/koleksi" className="inline-flex items-center gap-2 text-sm font-semibold text-[#1E4D3E]"><ArrowLeft className="h-4 w-4"/> Kembali ke koleksi</Link><article className="mt-6 grid gap-8 rounded-3xl bg-white p-6 shadow-sm md:grid-cols-[260px_1fr] md:p-10"><img src={book.coverImage || '/logo-lasem-mark.png'} onError={(e) => { e.currentTarget.src = '/logo-lasem-mark.png'; }} className="h-[360px] w-full rounded-2xl object-cover bg-[#F4EFEA]" alt={book.title}/><div><span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-800">{book.category}</span><h1 className="mt-4 text-3xl font-bold text-[#1B4332]">{book.title}</h1><p className="mt-2 text-slate-500">Oleh {book.author} · {book.year}</p><p className="mt-5 leading-relaxed text-slate-600">{book.description}</p><div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600"><span className="flex items-center gap-1"><Star className="h-4 w-4 fill-[#D97706] text-[#D97706]"/> {book.rating.toFixed(1)}</span><span>{book.pages} halaman</span><span>{book.format} · {book.fileSize}</span></div><div className="mt-8 flex flex-wrap gap-3"><Link to={`/login?redirect=${encodeURIComponent(`/app?book=${book.id}`)}`} className="inline-flex items-center gap-2 rounded-xl bg-[#1E4D3E] px-5 py-3 font-bold text-white"><BookOpen className="h-4 w-4"/> Masuk untuk membaca</Link>{book.fileUrl ? <a href={book.fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] px-5 py-3 font-bold"><Download className="h-4 w-4"/> Unduh</a> : <span className="inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] px-5 py-3 text-slate-500"><Lock className="h-4 w-4"/> File belum tersedia</span>}</div></div></article></div></main>;
}
