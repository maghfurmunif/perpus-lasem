import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { supabase } from '../lib/supabase';
import * as db from '../lib/db';
import { uploadBookCover, uploadCloudinaryFile } from '../lib/cloudinary';
import { parseCatalogCsv } from '../lib/catalogCsv';
import type { Book, Announcement, BorrowRecord, BookRequestItem, Profile } from '../types';

const emptyBook = (): Book => ({
 id: '', title: '', author: '', category: 'Edukasi', coverImage: '', format: 'PDF',
 accessType: 'Akses Terbuka', pages: 0, fileSize: '-', description: '', isbn: '',
 year: new Date().getFullYear(), publisher: '', tags: [], totalCopies: 1, availableCopies: 1,
 isFeatured: false, isPopular: false, isNew: true, rating: 0, ratingCount: 0, sampleChapters: [], reviews: [],
});
export default function AdminPage() {
 const location = useLocation();
 // Remount the form when URL changes, including Back/Forward.
 return <AdminContent key={location.pathname} />;
}
function AdminContent() {
 const { username, bookId, announcementId } = useParams();
 const { profile } = useAuth();
 const path = useLocation().pathname.split('/').slice(3).join('/');
 const base = `/app/${username}`;
 const [books, setBooks] = useState<Book[]>([]);
 const [articles, setArticles] = useState<Announcement[]>([]);
 const [forumPosts, setForumPosts] = useState<import('../types').ForumPost[]>([]);
 const [announcement, setAnnouncement] = useState<Announcement | null>(null);
 const [loans, setLoans] = useState<BorrowRecord[]>([]);
 const [requests, setRequests] = useState<BookRequestItem[]>([]);
 const [admins, setAdmins] = useState<Profile[]>([]);
 const [book, setBook] = useState<Book>(emptyBook);
 const [rows, setRows] = useState<Record<string,string>[]>([]);
 const [error, setError] = useState('');
 const [message, setMessage] = useState('');
 const [busy, setBusy] = useState(false);
 const [loading, setLoading] = useState(true);
 const [catalogQuery, setCatalogQuery] = useState('');
 const bookForm = path === 'katalog-buku/upload-buku' || path.startsWith('katalog-buku/edit/');
 const announcementForm = path === 'unggah-artikel' || path === 'kelola-artikel' || path === 'kelola-pengumuman' || path.startsWith('unggah-artikel/edit/');
 const announcementContentType = path === 'kelola-pengumuman' ? 'pengumuman' : 'artikel';
 const load = async () => {
   setLoading(true); setError('');
   try {
     if (path === 'pengaturan-admin') {
       setAdmins((await db.fetchProfiles()).filter((admin) => ['admin','superadmin','pustakawan','kepala_desa'].includes(admin.role)));
     } else {
       const result = await db.fetchBooks(); setBooks(result.data);
       if (bookId) { const found = result.data.find(b => b.id === bookId); if (!found) throw new Error('Buku tidak ditemukan.'); setBook(found); }
       if (announcementForm) {
         const loadedArticles = (await db.fetchAnnouncements()).data;
         setArticles(loadedArticles);
         if (announcementId) {
           const found = loadedArticles.find(a => a.id === announcementId);
           if (!found) throw new Error('Artikel/berita/kreasi tidak ditemukan.');
           setAnnouncement(found);
         }
       }
       if (path === 'moderasi-kreasi') setForumPosts(await db.fetchAllForumPosts());
       if (['admin','sirkulasi','laporan'].includes(path)) {
          setLoans(await db.fetchAllBorrowings());
       }
       if(path === 'usulan-buku') setRequests((await db.fetchBookRequests()).data);
     }
   } catch(e) {setError(e instanceof Error ? e.message : String((e as {message?:string})?.message ?? e));}
   finally {setLoading(false);}
 };
 useEffect(() => {void load();}, []);
 const run = async (action: () => Promise<void>) => {
   setBusy(true); setError(''); setMessage('');
   try {await action();} catch(e) {setError((e as Error).message || 'Operasi gagal.');}
   finally {setBusy(false);}
 };
 const saveBook = async (event: React.FormEvent) => {
   event.preventDefault();
   await run(async () => {
     if(book.availableCopies > book.totalCopies) throw new Error('Stok tersedia tidak boleh melebihi total.');
     const saved = bookId ? await db.updateBook(book) : await db.insertBook(book);
     if(!saved) throw new Error('Buku gagal disimpan. Periksa koneksi dan izin akun.');
     setMessage('Buku berhasil disimpan ke katalog.'); if(!bookId) setBook(emptyBook());
   });
 };
 const saveAnnouncement = async (event: React.FormEvent) => {
   event.preventDefault();
   if (!announcement) return;
   await run(async () => {
     await db.updateAnnouncement(announcement.id, {
       title: announcement.title,
       category: announcement.category,
       summary: announcement.summary,
       content_type: announcement.contentType ?? 'berita',
       cover_image: announcement.coverImage ?? null,
     });
     setMessage('Artikel/berita/kreasi berhasil diperbarui.');
     await load();
   });
 };
 const field = (key: keyof Book, label: string, type = 'text', required = false) => <label>{label}<input required={required} type={type} min={type==='number'?0:undefined} value={String(book[key] ?? '')} onChange={e=>setBook({...book,[key]:type==='number'?Number(e.target.value):e.target.value})} /></label>;
 const exportCsv = () => {const url=URL.createObjectURL(new Blob([db.booksToCsv(books)],{type:'text/csv;charset=utf-8'})); const a=document.createElement('a');a.href=url;a.download='katalog-lasem.csv';a.click();URL.revokeObjectURL(url);};
 const titles: Record<string,string> = {'admin':'Ikhtisar Perpustakaan','pengaturan-admin':'Pengaturan Admin','katalog-buku':'Katalog Buku','katalog-buku/upload-buku':'Unggah Buku','unggah-artikel':'Unggah Artikel & Warta','katalog-buku/unggah-masal':'Unggah Masal','sirkulasi':'Sirkulasi Pinjam','usulan-buku':'Usulan Buku','laporan':'Laporan Perpustakaan'};
 const visibleBooks = useMemo(() => books.filter((b) => `${b.title} ${b.author} ${b.category}`.toLowerCase().includes(catalogQuery.toLowerCase())), [books, catalogQuery]);
 return <div className="admin-page space-y-6">
   <h1 className="text-2xl font-bold">{bookId ? 'Edit Buku' : announcementId ? 'Edit Artikel, Berita & Kreasi' : titles[path]}</h1>
   {error && <div role="alert" className="bg-rose-50 text-rose-800 p-4 rounded-xl">{error} <button onClick={load}>Muat ulang</button></div>}
   {message && <p role="status" className="bg-emerald-50 p-4 rounded-xl">{message}</p>}
   {loading ? <p>Memuat data…</p> : <>
   {path === 'pengaturan-admin' && <>
     <p>Akun admin baru dibuat melalui layanan server. Hanya superadmin yang dapat melakukan tindakan ini.</p>
     <form onSubmit={e=>{e.preventDefault();const f=new FormData(e.currentTarget);void run(async()=>{
       const {data,error}=await supabase.functions.invoke('create-admin',{body:{email:f.get('email'),name:f.get('name'),password:f.get('password')}});
       if(error || data?.error) throw new Error(data?.error || error?.message || 'Gagal membuat admin.');
       await load();setMessage('Akun admin berhasil dibuat.');
     });}}>
       <label>Nama lengkap<input name="name" required /></label>
       <label>Email<input name="email" type="email" required /></label>
       <label>Password awal<input name="password" type="password" minLength={12} required autoComplete="new-password" /></label>
       <button disabled={busy}>Buat akun admin</button>
     </form>
     <ul>{admins.map(a=><li key={a.id} className="p-3 border-b">{a.nama_lengkap} · {a.email} · {a.role} · {a.aktif?'Aktif':'Nonaktif'}</li>)}</ul>
   </>}
   {bookForm && <form onSubmit={saveBook}>
     <div className="grid sm:grid-cols-2 gap-4">{field('title','Judul','text',true)}{field('author','Penulis','text',true)}
     <label>Kategori buku<input value={book.category} onChange={e=>setBook({...book,category:e.target.value as Book['category']})} placeholder="Contoh: Pertanian, Sejarah Lasem" required /></label>
     <label>Format<select value={book.format} onChange={e=>setBook({...book,format:e.target.value as Book['format']})}>{['PDF','EPUB','Buku Fisik'].map(v=><option key={v}>{v}</option>)}</select></label>
     <label>Akses<select value={book.accessType} onChange={e=>setBook({...book,accessType:e.target.value as Book['accessType']})}><option>Akses Terbuka</option><option>Lisensi Terbatas</option></select></label>
     {field('isbn','ISBN')}{field('publisher','Penerbit')}{field('year','Tahun','number',true)}{field('pages','Halaman','number')}{field('totalCopies','Total salinan','number',true)}{field('availableCopies','Salinan tersedia','number',true)}
     {field('coverImage','URL sampul','url')}{field('fileUrl','URL PDF / EPUB','url')}
     <label>Unggah sampul<input type="file" accept="image/png,image/jpeg,image/webp" disabled={busy} onChange={e=>{const f=e.target.files?.[0];if(f) void run(async()=>{if(f.size>5*1024*1024)throw new Error('Sampul maksimal 5 MB.');const url=await uploadBookCover(f);setBook(b=>({...b,coverImage:url}));});}} /></label></div>
     <label>Sinopsis<textarea required value={book.description} onChange={e=>setBook({...book,description:e.target.value})} /></label>
     <label className="flex gap-2"><input type="checkbox" checked={!!book.isFeatured} onChange={e=>setBook({...book,isFeatured:e.target.checked})}/>Rekomendasi admin</label>
     <button disabled={busy}>{busy?'Menyimpan…':'Simpan buku'}</button>
   </form>}
   {announcementId && announcement && <form onSubmit={saveAnnouncement} className="space-y-4">
     <label>Judul<input required value={announcement.title} onChange={e=>setAnnouncement({...announcement,title:e.target.value})} /></label>
     <label>Kategori<input required value={announcement.category} onChange={e=>setAnnouncement({...announcement,category:e.target.value})} /></label>
     <label>Jenis konten<select value={announcement.contentType ?? 'artikel'} onChange={e=>setAnnouncement({...announcement,contentType:e.target.value as 'artikel'|'pengumuman'})}><option value="artikel">Artikel</option><option value="pengumuman">Pengumuman</option></select></label>
     <label>URL foto Cloudinary<input type="url" value={announcement.coverImage ?? ''} onChange={e=>setAnnouncement({...announcement,coverImage:e.target.value})} /></label>
     <label>Isi artikel<textarea required rows={8} value={announcement.summary} onChange={e=>setAnnouncement({...announcement,summary:e.target.value})} /></label>
     <button disabled={busy}>{busy ? 'Menyimpan…' : 'Simpan perubahan'}</button>
   </form>}
 {path === 'katalog-buku' && <><div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 shadow-sm"><input value={catalogQuery} onChange={e=>setCatalogQuery(e.target.value)} placeholder="Cari judul, penulis, atau kategori..." className="min-w-[240px] flex-1 rounded-xl border px-4 py-3"/><Link className="rounded-xl bg-emerald-800 px-4 py-3 font-semibold text-white" to={base+'/katalog-buku/upload-buku'}>+ Tambah buku</Link><button className="rounded-xl border px-4 py-3" onClick={exportCsv}>Ekspor CSV</button></div>
     <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">{visibleBooks.map(b=><article key={b.id} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"><div className="relative aspect-[3/4] bg-[#F4EFEA]"><img src={b.coverImage || '/logo-lasem-mark.png'} onError={e=>{e.currentTarget.src='/logo-lasem-mark.png'}} alt={b.title} className="h-full w-full object-cover"/><span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${b.isPublished?'bg-emerald-600 text-white':'bg-amber-400 text-slate-900'}`}>{b.isPublished?'Terbit':'Draft'}</span></div><div className="space-y-3 p-4"><span className="text-xs font-semibold text-emerald-700">{b.category} · {b.format}</span><h2 className="line-clamp-2 min-h-[3rem] font-bold text-slate-900">{b.title}</h2><p className="truncate text-sm text-slate-500">{b.author}</p><p className="text-xs text-slate-500">Tersedia {b.availableCopies}/{b.totalCopies} · {b.pages || 0} halaman</p><div className="flex gap-2"><Link className="flex-1 rounded-lg border px-3 py-2 text-center text-sm font-semibold" to={base+'/katalog-buku/edit/'+b.id}>Edit</Link><button className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold ${b.isPublished?'bg-amber-100 text-amber-900':'bg-emerald-700 text-white'}`} disabled={busy} onClick={()=>void run(async()=>{if(!profile?.id)throw new Error('Sesi admin tidak ditemukan.');await db.setBookPublished(b.id,!b.isPublished,profile.id);await load();setMessage(b.isPublished?'Buku disembunyikan.':'Buku diterbitkan.');})}>{b.isPublished?'Sembunyikan':'Terbitkan'}</button></div></div></article>)}</div>
     {!visibleBooks.length && <p>Katalog tidak menemukan buku.</p>}</>}
   {path === 'katalog-buku/unggah-masal' && <>
     <p>CSV maksimal 2 MB dan 1.000 buku. ISBN yang sama akan diperbarui; tanpa ISBN akan menambah buku baru.</p>
     <div className="flex gap-4"><a href="/template-import-buku.csv" download>Unduh template & contoh</a><button onClick={exportCsv}>Ekspor katalog</button></div>
     <label>Pilih CSV<input type="file" accept=".csv,text/csv" disabled={busy} onChange={e=>{const f=e.target.files?.[0];setRows([]);if(f)void run(async()=>{if(f.size>2*1024*1024)throw new Error('File maksimal 2 MB.');setRows(parseCatalogCsv(await f.text()));});}} /></label>
     {!!rows.length && <><p>{rows.length} baris valid. Periksa pratinjau sebelum menyimpan.</p><div className="overflow-auto max-h-80"><table><thead><tr><th>Judul</th><th>Penulis</th><th>ISBN</th></tr></thead><tbody>{rows.map((r,i)=><tr key={i}><td>{r.title}</td><td>{r.author}</td><td>{r.isbn || 'Buku baru'}</td></tr>)}</tbody></table></div>
     <button disabled={busy} onClick={()=>void run(async()=>{const r=await db.bulkUpsertBooks(rows);if(!r.ok)throw new Error(r.error);setRows([]);await load();setMessage(r.count+' buku berhasil diimpor.');})}>{busy?'Mengimpor…':'Simpan '+rows.length+' buku'}</button></>}
   </>}
   {(path === 'unggah-artikel' || path === 'kelola-artikel' || path === 'kelola-pengumuman') && <>
     <form onSubmit={e=>{e.preventDefault();const form=e.currentTarget;const f=new FormData(form);void run(async()=>{const saved=await db.insertAnnouncement({title:String(f.get('title')),summary:String(f.get('summary')),category:String(f.get('category')),author:profile?.nama_lengkap || 'Pustakawan',badge:'Warta',content_type:String(f.get('content_type')),cover_image:String(f.get('cover_image') || ''),published:false});if(!saved)throw new Error('Artikel gagal disimpan.');await load();form.reset();setMessage('Konten tersimpan sebagai draft.');});}}>
       <label>Judul<input name="title" required /></label><label>Kategori<input name="category" defaultValue="Literasi" required /></label>
       <label>Jenis konten<select name="content_type" defaultValue="berita"><option value="berita">Berita</option><option value="artikel">Artikel</option><option value="agenda">Agenda</option><option value="kreasi_lasem">Kreasi Lasem</option></select></label><label>URL foto Cloudinary<input name="cover_image" type="url" placeholder="https://res.cloudinary.com/..." /></label><label>Upload foto<input type="file" accept="image/png,image/jpeg,image/webp" disabled={busy} onChange={e=>{const file=e.target.files?.[0];if(file)void run(async()=>{const uploaded=await uploadBookCover(file);const form=e.currentTarget.closest('form') as HTMLFormElement | null;const input=form?.elements.namedItem('cover_image') as HTMLInputElement | null;if(input) input.value=uploaded;setMessage('Foto berhasil diunggah ke Cloudinary.');});}} /></label>
       <label>Isi artikel<textarea name="summary" required rows={8}/></label><button disabled={busy}>Terbitkan artikel</button>
     </form>
     {articles.map(a=><article key={a.id} className="bg-white rounded-xl p-4 flex items-start justify-between gap-4"><div><h2 className="font-bold">{a.title}</h2><p className="whitespace-pre-wrap">{a.summary}</p><small className="text-slate-500">{a.contentType ?? a.category} · {a.published ? 'Terbit' : 'Draft'}</small></div><div className="flex gap-2"><Link className="rounded-lg border px-3 py-2 text-sm font-semibold" to={base+'/unggah-artikel/edit/'+a.id}>Edit</Link><button disabled={busy} onClick={()=>void run(async()=>{if(!profile?.id)throw new Error('Sesi admin tidak ditemukan.');const nextPublished=!a.published;await db.setAnnouncementPublished(a.id,nextPublished,profile.id);setArticles(items=>items.map(item=>item.id===a.id?{...item,published:nextPublished}:item));await load();setArticles(items=>items.map(item=>item.id===a.id?{...item,published:nextPublished}:item));setMessage(nextPublished?'Konten diterbitkan dan terverifikasi.':'Konten dikembalikan menjadi draft.');})}>{a.published?'Sembunyikan':'Terbitkan'}</button><button disabled={busy} onClick={()=>void run(async()=>{await db.deleteAnnouncement(a.id);await load();setMessage('Konten dihapus.');})}>Hapus</button></div></article>)}
   </>}
   {path === 'moderasi-kreasi' && <section className="space-y-3">{forumPosts.map(post => <article key={post.id} className="rounded-xl bg-white p-4"><p className="text-xs text-slate-500">{post.author_name} · {post.category}</p><h2 className="font-bold">{post.title}</h2><p className="whitespace-pre-line">{post.content}</p><div className="mt-3 flex gap-2"><button disabled={busy} onClick={()=>void run(async()=>{await db.setForumPostPublished(post.id, post.published === false); await load();})}>{post.published === false ? 'Terbitkan' : 'Sembunyikan'}</button><button disabled={busy} onClick={()=>void run(async()=>{if(!await db.deleteForumPost(post.id)) throw new Error('Gagal menghapus kreasi.'); await load();})}>Hapus</button></div></article>)}</section>}
   {(path === 'admin' || path === 'laporan') && <><div className="grid sm:grid-cols-3 gap-4">{[['Judul buku',books.length],['Salinan tersedia',books.reduce((n,b)=>n+b.availableCopies,0)],['Pinjaman aktif',loans.filter(l=>l.status!=='returned').length]].map(([label,value])=><div key={label} className="p-6 rounded-xl bg-white"><p>{label}</p><strong className="text-3xl">{value}</strong></div>)}</div><p>Statistik dihitung dari katalog dan transaksi yang berhasil dimuat.</p>{path==='laporan'&&<button onClick={()=>window.print()}>Cetak laporan</button>}</>}
   {path === 'sirkulasi' && <>{!loans.length && <p>Belum ada peminjaman.</p>}{loans.map(l=><div key={l.id} className="bg-white p-4 rounded-xl"><h2>{l.bookTitle}</h2><p>{l.status} · Jatuh tempo {l.dueDate}</p>{l.status!=='returned'&&<button disabled={busy} onClick={()=>void run(async()=>{if(!await db.returnBorrowing(l.id))throw new Error('Pengembalian gagal.');await load();setMessage('Pengembalian dicatat.');})}>Konfirmasi pengembalian</button>}</div>)}</>}
   {path === 'usulan-buku' && <>{!requests.length && <p>Belum ada usulan.</p>}{requests.map(r=><div key={r.id} className="p-4 bg-white rounded-xl"><h2>{r.title}</h2><p>{r.reason} · {r.status}</p>{r.status==='pending'&&<div className="flex gap-3">{(['approved','rejected'] as const).map(status=><button disabled={busy} key={status} onClick={()=>void run(async()=>{if(!await db.updateBookRequestStatus(r.id,status))throw new Error('Gagal menyimpan status.');await load();})}>{status==='approved'?'Setujui':'Tolak'}</button>)}</div>}</div>)}</>}
   </>}
 </div>;
}
