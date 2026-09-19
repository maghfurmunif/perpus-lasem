import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  DownloadCloud, 
  Star, 
  FileText, 
  Smartphone, 
  Wifi, 
  CheckCircle2, 
  HelpCircle, 
  Calendar, 
  Users, 
  TrendingUp, 
  Bookmark, 
  ChevronLeft, 
  ChevronRight,
  MessageCircle,
  Clock,
  Sprout,
  Store,
  GraduationCap,
  Landmark,
  ShieldCheck,
  Lock,
  Building2
} from 'lucide-react';
import { Book, Announcement, BookCategory } from '../types';
import { BOOK_CATEGORIES, USAGE_TUTORIALS } from '../data/mockBooks';

interface HomeTabProps {
  books: Book[];
  announcements: Announcement[];
  villageName: string;
  onSelectBook: (book: Book) => void;
  onBorrowBook: (book: Book) => void;
  onDownloadBook: (book: Book) => void;
  onReadBook: (book: Book) => void;
  onCategoryClick: (category: BookCategory) => void;
  onSearchFocus: () => void;
  onWhatsAppClick: () => void;
  onRequestBookClick: () => void;
  onOpenAdminMode?: () => void;
  downloadedBookIds: string[];
  borrowedBookIds: string[];
}

export const HomeTab: React.FC<HomeTabProps> = ({
  books,
  announcements,
  villageName,
  onSelectBook,
  onBorrowBook,
  onDownloadBook,
  onReadBook,
  onCategoryClick,
  onSearchFocus,
  onWhatsAppClick,
  onRequestBookClick,
  onOpenAdminMode,
  downloadedBookIds,
  borrowedBookIds,
}) => {
  const [popularIndex, setPopularIndex] = useState(0);

  const popularBooks = books.filter((b) => b.isPopular || b.rating >= 4.8);
  const newBooks = books.filter((b) => b.isNew || b.year >= 2024);

  const handleNextPopular = () => {
    setPopularIndex((prev) => (prev + 1) % popularBooks.length);
  };

  const handlePrevPopular = () => {
    setPopularIndex((prev) => (prev - 1 + popularBooks.length) % popularBooks.length);
  };

  const getCategoryIcon = (category: BookCategory) => {
    switch (category) {
      case 'Pertanian':
        return <Sprout className="w-5 h-5 text-emerald-600" />;
      case 'UMKM':
        return <Store className="w-5 h-5 text-amber-600" />;
      case 'Edukasi':
        return <GraduationCap className="w-5 h-5 text-sky-600" />;
      case 'Budaya Desa':
        return <Landmark className="w-5 h-5 text-orange-600" />;
      case 'Fiksi & Populer':
        return <BookOpen className="w-5 h-5 text-purple-600" />;
    }
  };

  return (
    <div className="pb-24 pt-4 sm:pt-6 space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* 1. Welcoming Hero Banner with Village Metaphor & Calming Natural Tones */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 text-white p-6 sm:p-10 shadow-lg">
        {/* Subtle patterned background circles */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-600/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-60 h-60 bg-teal-600/30 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-emerald-950/40 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-semibold text-emerald-200 mb-4 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Pojok Literasi & Pengetahuan Desa</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight font-serif">
            Maju Bersama Lewat Membaca di {villageName}
          </h1>

          <p className="mt-3 text-sm sm:text-base text-emerald-100/90 leading-relaxed font-normal">
            Akses gratis ratusan buku pertanian, resep pakan ternak, panduan warung UMKM, dan buku pelajaran anak. 
            <strong> Hemat kuota</strong> dan dapat dibaca luring tanpa sinyal internet.
          </p>

          {/* Search Trigger Inside Hero */}
          <div className="mt-6 flex flex-col sm:flex-row gap-2">
            <div 
              onClick={onSearchFocus}
              className="flex-1 bg-white/95 text-stone-700 hover:bg-white px-4 py-3.5 rounded-2xl flex items-center gap-3 shadow-md cursor-pointer transition border border-emerald-100 group"
            >
              <Search className="w-5 h-5 text-emerald-700 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-stone-500 font-medium">
                Cari judul buku, topik pertanian, UMKM, atau pengarang...
              </span>
            </div>

            <button
              onClick={onWhatsAppClick}
              className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold px-5 py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-md transition active:scale-95 text-sm"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Tanya Pustakawan</span>
            </button>
          </div>

          {/* Quick indicators */}
          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-emerald-200/90">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>100% Bebas Biaya</span>
            </div>
            <div className="flex items-center gap-1.5">
              <DownloadCloud className="w-4 h-4 text-teal-300" />
              <span>Bisa Dibaca Offline</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-300" />
              <span>Ramah Segala Usia</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Kategori Unggulan Quick Cards */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <span>Kategori Pilihan Warga</span>
          </h2>
          <button 
            onClick={() => onCategoryClick('Pertanian')}
            className="text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 group"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {BOOK_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryClick(cat.id)}
              className="p-4 rounded-2xl bg-white border border-stone-200/90 hover:border-emerald-500 hover:shadow-md transition text-left group flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-xl bg-stone-100 group-hover:bg-emerald-50 flex items-center justify-center mb-3 transition">
                {getCategoryIcon(cat.id)}
              </div>
              <div>
                <h3 className="font-bold text-sm text-stone-900 group-hover:text-emerald-800 transition">
                  {cat.label}
                </h3>
                <p className="text-[11px] text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                  {cat.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. "Buku Terpopuler" (Most Popular Carousel) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-700" />
              <span>Buku Terpopuler di Desa</span>
            </h2>
            <p className="text-xs text-stone-500">Paling banyak dibaca dan dipelajari oleh kelompok tani & warga</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPopular}
              className="p-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 transition"
              title="Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextPopular}
              className="p-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 transition"
              title="Selanjutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Featured Popular Showcase Card */}
        {popularBooks.length > 0 && (
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden p-5 sm:p-7">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Cover Book */}
              <div className="md:col-span-4 lg:col-span-3 flex justify-center">
                <div 
                  onClick={() => onSelectBook(popularBooks[popularIndex])}
                  className="relative group cursor-pointer w-44 sm:w-52 aspect-[3/4] rounded-2xl overflow-hidden shadow-lg ring-1 ring-stone-900/10 transition transform group-hover:scale-102"
                >
                  <img
                    src={popularBooks[popularIndex].coverImage}
                    alt={popularBooks[popularIndex].title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                  
                  {/* Format & Size Badge */}
                  <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-[11px] font-bold">
                    {popularBooks[popularIndex].format} • {popularBooks[popularIndex].fileSize}
                  </div>

                  {/* Access type badge */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-xs text-white">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      popularBooks[popularIndex].accessType === 'Akses Terbuka'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-600 text-white'
                    }`}>
                      {popularBooks[popularIndex].accessType === 'Akses Terbuka' ? <ShieldCheck className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                      {popularBooks[popularIndex].accessType}
                    </span>
                  </div>
                </div>
              </div>

              {/* Book Details & Actions */}
              <div className="md:col-span-8 lg:col-span-9 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {popularBooks[popularIndex].category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{popularBooks[popularIndex].rating}</span>
                    <span className="text-stone-400 font-normal">({popularBooks[popularIndex].ratingCount} ulasan warga)</span>
                  </div>
                  <span className="text-xs text-stone-500">
                    Stok: <strong>{popularBooks[popularIndex].availableCopies}</strong> dari {popularBooks[popularIndex].totalCopies} salinan
                  </span>
                </div>

                <h3 
                  onClick={() => onSelectBook(popularBooks[popularIndex])}
                  className="text-xl sm:text-2xl font-bold text-stone-900 cursor-pointer hover:text-emerald-800 transition font-serif leading-snug"
                >
                  {popularBooks[popularIndex].title}
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 font-medium">
                  Penulis: <span className="text-stone-800">{popularBooks[popularIndex].author}</span> • Penerbit: {popularBooks[popularIndex].publisher} ({popularBooks[popularIndex].year})
                </p>

                <p className="text-xs sm:text-sm text-stone-600 line-clamp-3 leading-relaxed">
                  {popularBooks[popularIndex].description}
                </p>

                {/* Interactive Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => onReadBook(popularBooks[popularIndex])}
                    className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition active:scale-95 shadow-sm"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Baca Sekarang</span>
                  </button>

                  <button
                    onClick={() => onDownloadBook(popularBooks[popularIndex])}
                    className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 border transition active:scale-95 ${
                      downloadedBookIds.includes(popularBooks[popularIndex].id)
                        ? 'bg-teal-50 border-teal-300 text-teal-800'
                        : 'bg-white hover:bg-stone-50 border-stone-300 text-stone-700'
                    }`}
                  >
                    <DownloadCloud className="w-4 h-4 text-teal-600" />
                    <span>
                      {downloadedBookIds.includes(popularBooks[popularIndex].id)
                        ? 'Tersimpan Offline'
                        : `Unduh Gratis (${popularBooks[popularIndex].fileSize})`}
                    </span>
                  </button>

                  <button
                    onClick={() => onBorrowBook(popularBooks[popularIndex])}
                    className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 border transition active:scale-95 ${
                      borrowedBookIds.includes(popularBooks[popularIndex].id)
                        ? 'bg-amber-50 border-amber-300 text-amber-800'
                        : 'bg-white hover:bg-stone-50 border-stone-300 text-stone-700'
                    }`}
                  >
                    <Bookmark className="w-4 h-4 text-amber-600" />
                    <span>
                      {borrowedBookIds.includes(popularBooks[popularIndex].id) ? 'Sedang Dipinjam' : 'Ajukan Pinjam'}
                    </span>
                  </button>

                  <button
                    onClick={() => onSelectBook(popularBooks[popularIndex])}
                    className="px-3 py-2 text-stone-500 hover:text-stone-800 text-xs font-medium ml-auto"
                  >
                    Detail Lengkap & Ulasan &rarr;
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </section>

      {/* 4. "Buku Baru" (New Books Section Grid) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Buku Baru & Rekomendasi</span>
            </h2>
            <p className="text-xs text-stone-500">Koleksi buku terbaru yang siap dipinjam atau diunduh</p>
          </div>
          <button 
            onClick={() => onCategoryClick('Edukasi')}
            className="text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
          >
            Lihat Koleksi Lengkap &rarr;
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {newBooks.map((book) => {
            const isDownloaded = downloadedBookIds.includes(book.id);
            const isBorrowed = borrowedBookIds.includes(book.id);

            return (
              <div
                key={book.id}
                className="bg-white rounded-2xl border border-stone-200/90 hover:border-emerald-400 hover:shadow-md transition flex flex-col overflow-hidden group"
              >
                {/* Book Cover Image */}
                <div 
                  onClick={() => onSelectBook(book)}
                  className="relative aspect-[4/5] bg-stone-100 overflow-hidden cursor-pointer"
                >
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Format pill */}
                  <div className="absolute top-2 left-2 bg-stone-950/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {book.format}
                  </div>

                  {/* Size badge for village users */}
                  <div className="absolute top-2 right-2 bg-emerald-900/85 backdrop-blur-xs text-emerald-100 text-[10px] font-medium px-2 py-0.5 rounded-md">
                    {book.fileSize}
                  </div>

                  {/* Access type indicator */}
                  <div className="absolute bottom-2 left-2">
                    <span className="text-[10px] font-semibold bg-white/90 text-stone-800 px-2 py-0.5 rounded-full shadow-xs">
                      {book.accessType === 'Akses Terbuka' ? 'Bebas Kuota' : 'Perlu Izin'}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
                      <span className="text-emerald-800 font-semibold">{book.category}</span>
                      <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                        <Star className="w-3 h-3 fill-current" />
                        {book.rating}
                      </span>
                    </div>

                    <h4 
                      onClick={() => onSelectBook(book)}
                      className="font-bold text-sm text-stone-900 line-clamp-2 cursor-pointer hover:text-emerald-800 transition"
                      title={book.title}
                    >
                      {book.title}
                    </h4>

                    <p className="text-[11px] text-stone-500 mt-1 truncate">
                      {book.author}
                    </p>
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-3 pt-2 border-t border-stone-100 grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => onReadBook(book)}
                      className="w-full py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Baca</span>
                    </button>

                    <button
                      onClick={() => onDownloadBook(book)}
                      className={`w-full py-1.5 rounded-lg text-xs font-semibold border transition flex items-center justify-center gap-1 ${
                        isDownloaded 
                          ? 'bg-teal-50 text-teal-800 border-teal-200' 
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                      title={isDownloaded ? 'Sudah tersimpan di HP' : 'Unduh ke memori HP'}
                    >
                      <DownloadCloud className="w-3.5 h-3.5" />
                      <span>{isDownloaded ? 'Tersimpan' : 'Unduh'}</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* 5. "Tutorial Penggunaan" (Usage Guide for Varied Digital Literacy Levels) */}
      <section className="bg-stone-100/70 border border-stone-200/90 rounded-3xl p-5 sm:p-8 space-y-5">
        <div className="max-w-xl">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100 px-2.5 py-0.5 rounded-full">
            Panduan Mudah
          </span>
          <h2 className="text-lg sm:text-2xl font-bold text-stone-900 mt-2 font-serif">
            Tutorial Penggunaan untuk Seluruh Warga
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Dirancang sederhana agar mudah dipahami kakek, nenek, bapak, ibu tani, hingga anak-anak sekolah.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {USAGE_TUTORIALS.map((tut) => (
            <div 
              key={tut.step}
              className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="w-8 h-8 rounded-full bg-emerald-800 text-white font-extrabold text-xs flex items-center justify-center mb-3">
                  {tut.step}
                </div>
                <h3 className="font-bold text-sm sm:text-base text-stone-900">
                  {tut.title}
                </h3>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  {tut.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mudah & Gratis</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Agenda & Kabar Literasi Desa */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-700" />
              <span>Agenda & Berita Literasi Desa</span>
            </h2>
            <p className="text-xs text-stone-500">Kegiatan balai baca, pelatihan warga, dan pengumuman perpustakaan</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {announcements.map((anc) => (
            <div
              key={anc.id}
              className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    {anc.badge}
                  </span>
                  <span className="text-stone-400 text-[11px] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {anc.date}
                  </span>
                </div>
                <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-snug">
                  {anc.title}
                </h3>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  {anc.summary}
                </p>
              </div>

              <div className="text-[11px] text-stone-500 pt-2 border-t border-stone-100 font-medium">
                Penyelenggara: {anc.author}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Portal Khusus Perangkat Desa & Pengurus */}
      {onOpenAdminMode && (
        <section className="bg-stone-900 border border-stone-800 rounded-3xl p-5 sm:p-7 text-white flex flex-col md:flex-row items-center justify-between gap-5 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center flex-shrink-0 font-bold shadow-md">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
                  APARATUR DESA LASEM SIDAYU
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold font-serif text-white mt-1">
                Portal Manajemen & Laporan Perangkat Desa
              </h3>
              <p className="text-xs text-stone-400 max-w-xl mt-0.5">
                Kelola data buku fisik & digital, pantau sirkulasi peminjaman warga, verifikasi usulan buku APBDes, dan unduh laporan resmi untuk Musdes.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenAdminMode}
            className="w-full md:w-auto px-5 py-3 bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition active:scale-95 flex-shrink-0"
          >
            <Building2 className="w-4 h-4" />
            <span>Buka Portal Desa</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </section>
      )}

      {/* 8. Statistik Literasi Desa & Usulkan Buku CTA */}
      <section className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs uppercase font-bold text-amber-300 tracking-wider">
            Partisipasi Warga Desa
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-serif">
            Butuh Buku Tertentu untuk Tani atau Sekolah?
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-md">
            Warga bisa mengusulkan judul buku yang diinginkan. Pengurus perpustakaan desa akan menyediakannya untuk Anda.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <button
            onClick={onRequestBookClick}
            className="w-full sm:w-auto px-5 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-sm transition active:scale-95 shadow-md"
          >
            Usulkan Buku Baru
          </button>
          <button
            onClick={onWhatsAppClick}
            className="w-full sm:w-auto px-5 py-3 bg-emerald-950/60 hover:bg-emerald-950 border border-emerald-400/40 text-white font-semibold rounded-xl text-sm transition active:scale-95 flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4 fill-current text-emerald-300" />
            <span>Kontak Pustakawan WA</span>
          </button>
        </div>
      </section>

    </div>
  );
};
