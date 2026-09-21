import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  BookOpen, 
  DownloadCloud, 
  Star, 
  Bookmark, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  SlidersHorizontal,
  X,
  Sparkles,
  Sprout,
  Store,
  GraduationCap,
  Landmark
} from 'lucide-react';
import { Book, BookCategory, BookFormat, AccessType } from '../types';
import { BOOK_CATEGORIES } from '../data/mockBooks';

interface CollectionTabProps {
  books: Book[];
  selectedCategory: BookCategory | 'Semua';
  onCategoryChange: (category: BookCategory | 'Semua') => void;
  onSelectBook: (book: Book) => void;
  onBorrowBook: (book: Book) => void;
  onDownloadBook: (book: Book) => void;
  onReadBook: (book: Book) => void;
  downloadedBookIds: string[];
  borrowedBookIds: string[];
}

export const CollectionTab: React.FC<CollectionTabProps> = ({
  books,
  selectedCategory,
  onCategoryChange,
  onSelectBook,
  onBorrowBook,
  onDownloadBook,
  onReadBook,
  downloadedBookIds,
  borrowedBookIds,
}) => {
  const coverFallback: Record<string, string> = {
    'Pertanian': 'https://images.unsplash.com/photo-1492496913980-501348b61469?w=900&auto=format&fit=crop&q=85',
    'UMKM': 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=900&auto=format&fit=crop&q=85',
    'Edukasi': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=900&auto=format&fit=crop&q=85',
    'Budaya Desa': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=900&auto=format&fit=crop&q=85',
    'Fiksi & Populer': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=900&auto=format&fit=crop&q=85',
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [formatFilter, setFormatFilter] = useState<'Semua' | BookFormat>('Semua');
  const [accessFilter, setAccessFilter] = useState<'Semua' | AccessType>('Semua');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'newest' | 'title'>('rating');

  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        // Category filter
        if (selectedCategory !== 'Semua' && book.category !== selectedCategory) {
          return false;
        }
        // Format filter
        if (formatFilter !== 'Semua' && book.format !== formatFilter) {
          return false;
        }
        // Access filter
        if (accessFilter !== 'Semua' && book.accessType !== accessFilter) {
          return false;
        }
        // Availability
        if (onlyAvailable && book.availableCopies <= 0) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = book.title.toLowerCase().includes(q);
          const matchAuthor = book.author.toLowerCase().includes(q);
          const matchDesc = book.description.toLowerCase().includes(q);
          const matchTags = book.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchAuthor && !matchDesc && !matchTags) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return b.year - a.year;
        return a.title.localeCompare(b.title);
      });
  }, [books, selectedCategory, formatFilter, accessFilter, onlyAvailable, searchQuery, sortBy]);

  return (
    <div className="collection-shell pb-24 pt-4 sm:pt-6 space-y-6 max-w-[1500px] mx-auto px-4 sm:px-6 lg:pr-8 relative">

      
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">
            Koleksi Perpustakaan Desa
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Menampilkan buku pelajaran, panduan praktis pertanian, strategi wirausaha, dan dongeng nusantara
          </p>
        </div>

        <div className="text-xs text-stone-600 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200 font-semibold self-start sm:self-auto">
          {filteredBooks.length} judul buku siap baca
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input
            type="text"
            placeholder="Cari judul buku, nama pengarang, kata kunci (contoh: pupuk, kas, sains)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3.5 bg-white border border-stone-300 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills (Horizontal Scroll on mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => onCategoryChange('Semua')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedCategory === 'Semua'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            Semua Kategori
          </button>
          {BOOK_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Sub-Filters: Format, Access, Availability, Sort */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
          
          <div className="flex flex-wrap items-center gap-2">
            {/* Format Filter */}
            <div className="flex items-center gap-1 bg-white border border-stone-200 rounded-xl px-2.5 py-1.5">
              <span className="text-stone-400">Format:</span>
              <select
                value={formatFilter}
                onChange={(e) => setFormatFilter(e.target.value as any)}
                className="bg-transparent font-semibold text-stone-800 outline-none cursor-pointer"
              >
                <option value="Semua">Semua Format</option>
                <option value="PDF">PDF (Buku Digital)</option>
                <option value="EPUB">EPUB (e-Book Ringan)</option>
                <option value="Buku Fisik">Buku Fisik (Cetak)</option>
              </select>
            </div>

            {/* Access Filter */}
            <div className="flex items-center gap-1 bg-white border border-stone-200 rounded-xl px-2.5 py-1.5">
              <span className="text-stone-400">Akses:</span>
              <select
                value={accessFilter}
                onChange={(e) => setAccessFilter(e.target.value as any)}
                className="bg-transparent font-semibold text-stone-800 outline-none cursor-pointer"
              >
                <option value="Semua">Semua Akses</option>
                <option value="Akses Terbuka">Akses Terbuka (Gratis Bebas)</option>
                <option value="Lisensi Terbatas">Lisensi Perpustakaan</option>
              </select>
            </div>

            {/* Availability Toggle */}
            <label className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-xl px-2.5 py-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-semibold text-stone-700">Tersedia Saja</span>
            </label>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1 bg-white border border-stone-200 rounded-xl px-2.5 py-1.5">
            <span className="text-stone-400">Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-semibold text-stone-800 outline-none cursor-pointer"
            >
              <option value="rating">Rating Tertinggi</option>
              <option value="newest">Tahun Terbaru</option>
              <option value="title">Judul (A - Z)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Book List / Grid */}
      {filteredBooks.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-3">
          <BookOpen className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-bold text-stone-800 text-lg">Buku Tidak Ditemukan</h3>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
            Tidak ada buku yang sesuai dengan pencarian atau filter Anda. Coba ganti kata kunci atau reset filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              onCategoryChange('Semua');
              setFormatFilter('Semua');
              setAccessFilter('Semua');
              setOnlyAvailable(false);
            }}
            className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold hover:bg-emerald-800 transition"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
          {filteredBooks.map((book) => {
            const isDownloaded = downloadedBookIds.includes(book.id);
            const isBorrowed = borrowedBookIds.includes(book.id);

            return (
              <div
                key={book.id}
                className="bg-white rounded-2xl border border-stone-200 hover:border-emerald-500 hover:shadow-md transition flex flex-col overflow-hidden group"
              >
                {/* Book Card Top Image & Badges */}
                <div 
                  onClick={() => onSelectBook(book)}
                  className="relative aspect-[3/4] bg-stone-100 overflow-hidden cursor-pointer"
                >
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    onError={(event) => {
                      const fallback = coverFallback[book.category] ?? coverFallback.Edukasi;
                      if (event.currentTarget.src !== fallback) event.currentTarget.src = fallback;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Format badge */}
                  <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {book.format} • {book.fileSize}
                  </div>

                  {/* Access tag */}
                  <div className="absolute top-2.5 right-2.5">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                      book.accessType === 'Akses Terbuka'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-600 text-white'
                    }`}>
                      {book.accessType === 'Akses Terbuka' ? <ShieldCheck className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                      {book.accessType}
                    </span>
                  </div>

                  {/* Rating on cover bottom */}
                  <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white text-xs">
                    <span className="text-[11px] font-medium text-emerald-200">
                      {book.category}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-amber-300">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {book.rating}
                    </span>
                  </div>
                </div>

                {/* Card Information */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 
                      onClick={() => onSelectBook(book)}
                      className="font-bold text-sm sm:text-base text-stone-900 line-clamp-2 cursor-pointer hover:text-emerald-800 transition font-serif"
                      title={book.title}
                    >
                      {book.title}
                    </h3>
                    
                    <p className="text-xs text-stone-500 mt-1 font-medium truncate">
                      {book.author}
                    </p>

                    <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                      {book.description}
                    </p>
                  </div>

                  {/* Availability Indicator */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                    <span className="text-stone-500">
                      Tersedia: <strong>{book.availableCopies}</strong> eks.
                    </span>
                    <span className="text-stone-400">
                      {book.pages} halaman
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => onReadBook(book)}
                      className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 active:scale-95 shadow-xs"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Baca</span>
                    </button>

                    <button
                      onClick={() => onDownloadBook(book)}
                      className={`w-full py-2 rounded-xl text-xs font-semibold border transition flex items-center justify-center gap-1 active:scale-95 ${
                        isDownloaded 
                          ? 'bg-teal-50 text-teal-800 border-teal-200' 
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-300'
                      }`}
                      title={isDownloaded ? 'Tersimpan Offline' : 'Unduh ke memori'}
                    >
                      <DownloadCloud className="w-3.5 h-3.5" />
                      <span>{isDownloaded ? 'Tersimpan' : 'Unduh'}</span>
                    </button>
                  </div>

                  {/* Pinjam Button */}
                  <button
                    onClick={() => onBorrowBook(book)}
                    className={`w-full py-1.5 rounded-lg text-xs font-semibold border transition flex items-center justify-center gap-1 ${
                      isBorrowed
                        ? 'bg-amber-50 text-amber-900 border-amber-300'
                        : 'bg-white hover:bg-stone-50 text-stone-600 border-stone-200'
                    }`}
                  >
                    <Bookmark className="w-3 h-3 text-amber-600" />
                    <span>{isBorrowed ? 'Buku Sedang Dipinjam' : 'Ajukan Pinjaman Fisik / Digital'}</span>
                  </button>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
