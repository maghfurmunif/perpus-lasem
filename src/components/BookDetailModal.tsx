import React, { useState } from 'react';
import { 
  X, 
  Star, 
  BookOpen, 
  DownloadCloud, 
  Bookmark, 
  ShieldCheck, 
  Lock, 
  Calendar, 
  FileText, 
  Share2, 
  MessageSquare, 
  Send, 
  Check, 
  User 
} from 'lucide-react';
import { Book, BookReview } from '../types';

interface BookDetailModalProps {
  book: Book | null;
  onClose: () => void;
  onRead: (book: Book) => void;
  onDownload: (book: Book) => void;
  onBorrow: (book: Book) => void;
  isDownloaded: boolean;
  isBorrowed: boolean;
  onAddReview: (bookId: string, review: Omit<BookReview, 'id' | 'date'>) => void;
  isFollowed?: boolean;
  onToggleFollow?: () => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  onClose,
  onRead,
  onDownload,
  onBorrow,
  isDownloaded,
  isBorrowed,
  onAddReview,
  isFollowed = false,
  onToggleFollow,
}) => {
  const [activeTab, setActiveTab] = useState<'sinopsis' | 'ulasan'>('sinopsis');
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newReviewerName, setNewReviewerName] = useState('');
  const [newReviewerRole, setNewReviewerRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Early return SETELAH semua hooks (aturan React Hooks)
  if (!book) return null;

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    onAddReview(book.id, {
      userName: newReviewerName.trim() || 'Warga Desa',
      userRole: newReviewerRole.trim() || 'Warga Pembaca',
      rating: newRating,
      comment: newComment.trim(),
    });

    setIsSubmitting(false);
    setSubmitSuccess(true);
    setNewComment('');
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              {book.category}
            </span>
            <span className="text-xs font-bold text-stone-500">
              Format {book.format} • {book.fileSize}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
          
          {/* Header section with book cover & key metadata */}
          <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
            
            {/* Book Cover */}
            <div className="w-36 sm:w-44 aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border border-stone-200 flex-shrink-0 relative">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2 left-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md text-white shadow-xs ${
                  book.accessType === 'Akses Terbuka' ? 'bg-emerald-600' : 'bg-amber-600'
                }`}>
                  {book.accessType}
                </span>
              </div>
            </div>

            {/* Main Info */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif leading-snug">
                {book.title}
              </h2>

              <p className="text-sm font-semibold text-stone-700">
                Penulis: <span className="text-emerald-800">{book.author}</span>
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-md text-xs font-bold border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{book.rating}</span>
                  <span className="text-stone-400 font-normal">({book.reviews.length} ulasan)</span>
                </div>

                <span className="text-xs text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-md font-medium">
                  {book.pages} Halaman
                </span>

                <span className="text-xs text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-md font-medium">
                  Tahun {book.year}
                </span>
              </div>

              {/* Availability Status Box */}
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80 text-xs text-emerald-900 mt-2 flex items-center justify-between">
                <div>
                  <span className="text-stone-500 block text-[11px]">Ketersediaan Buku</span>
                  <strong>{book.availableCopies} dari {book.totalCopies} eksemplar tersedia</strong>
                </div>
                <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 font-bold rounded-md text-[10px]">
                  Bisa Dipinjam
                </span>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            <button
              onClick={onToggleFollow}
              className="flex-1 px-4 py-3 border rounded-xl font-bold"
            ><Bookmark className="inline w-4 h-4 mr-1"/>{isFollowed ? 'Berhenti Mengikuti' : 'Ikuti Buku'}</button>
            <button
              onClick={() => {
                onClose();
                onRead(book);
              }}
              className="py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 active:scale-95 shadow-md"
            >
              <BookOpen className="w-4 h-4" />
              <span>Baca Sekarang</span>
            </button>

            <button
              onClick={() => onDownload(book)}
              className={`py-3 px-4 rounded-xl text-sm font-semibold border transition flex items-center justify-center gap-2 active:scale-95 ${
                isDownloaded
                  ? 'bg-teal-50 border-teal-300 text-teal-800'
                  : 'bg-white hover:bg-stone-50 border-stone-300 text-stone-700'
              }`}
            >
              <DownloadCloud className="w-4 h-4 text-teal-600" />
              <span>{isDownloaded ? 'Tersimpan Offline' : 'Unduh Gratis'}</span>
            </button>

            <button
              onClick={() => onBorrow(book)}
              className={`py-3 px-4 rounded-xl text-sm font-semibold border transition flex items-center justify-center gap-2 active:scale-95 ${
                isBorrowed
                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                  : 'bg-white hover:bg-stone-50 border-stone-300 text-stone-700'
              }`}
            >
              <Bookmark className="w-4 h-4 text-amber-600" />
              <span>{isBorrowed ? 'Sudah Dipinjam' : 'Ajukan Pinjaman'}</span>
            </button>
          </div>

          {/* Tab Switcher: Sinopsis vs Ulasan Warga */}
          <div className="border-b border-stone-200 flex items-center gap-6 text-sm font-bold pt-2">
            <button
              onClick={() => setActiveTab('sinopsis')}
              className={`pb-2 transition ${
                activeTab === 'sinopsis'
                  ? 'text-emerald-800 border-b-2 border-emerald-700'
                  : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              Sinopsis & Informasi Buku
            </button>
            <button
              onClick={() => setActiveTab('ulasan')}
              className={`pb-2 transition flex items-center gap-1.5 ${
                activeTab === 'ulasan'
                  ? 'text-emerald-800 border-b-2 border-emerald-700'
                  : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              <span>Ulasan Warga</span>
              <span className="text-xs bg-stone-100 text-stone-600 px-1.5 py-0.2 rounded-full">
                {book.reviews.length}
              </span>
            </button>
          </div>

          {/* Tab 1: Sinopsis */}
          {activeTab === 'sinopsis' && (
            <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
              <p className="whitespace-pre-line">{book.description}</p>

              {/* Tag Cloud */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-stone-500 block mb-1.5 uppercase tracking-wider">
                  Topik Bahasan:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {book.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 text-xs font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Publisher & Metadata */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs grid grid-cols-2 gap-2 text-stone-600">
                <div>
                  <span className="text-stone-400 block">Penerbit:</span>
                  <span className="font-semibold text-stone-800">{book.publisher}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Nomor ISBN:</span>
                  <span className="font-mono text-stone-800">{book.isbn || '-'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Ulasan & Komentar Warga */}
          {activeTab === 'ulasan' && (
            <div className="space-y-6">
              
              {/* Review list */}
              <div className="space-y-3">
                {book.reviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center">
                          {rev.userName.charAt(0)}
                        </div>
                        <div>
                          <strong className="text-stone-900 font-bold">{rev.userName}</strong>
                          {rev.userRole && (
                            <span className="text-stone-400 text-[10px] ml-1.5">({rev.userRole})</span>
                          )}
                        </div>
                      </div>
                      <span className="flex items-center gap-0.5 text-amber-600 font-bold text-[11px]">
                        <Star className="w-3 h-3 fill-current" />
                        {rev.rating}
                      </span>
                    </div>

                    <p className="text-stone-700 leading-relaxed pl-8">
                      {rev.comment}
                    </p>

                    <div className="text-[10px] text-stone-400 pl-8">
                      {rev.date}
                    </div>
                  </div>
                ))}
              </div>

              {/* Form Tulis Ulasan */}
              <form onSubmit={handleSubmitReview} className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-3">
                <h4 className="font-bold text-xs sm:text-sm text-stone-900">
                  Tulis Ulasan atau Pengalaman Anda
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Nama Anda (contoh: Pak Bambang RT 02)"
                    value={newReviewerName}
                    onChange={(e) => setNewReviewerName(e.target.value)}
                    className="text-xs p-2.5 bg-white border border-stone-300 rounded-xl outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                  <input
                    type="text"
                    placeholder="Pekerjaan / Peran (contoh: Petani Cabai)"
                    value={newReviewerRole}
                    onChange={(e) => setNewReviewerRole(e.target.value)}
                    className="text-xs p-2.5 bg-white border border-stone-300 rounded-xl outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-stone-600 font-medium">Beri Bintang:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setNewRating(s)}
                        className="p-0.5 text-amber-500 hover:scale-110 transition"
                      >
                        <Star className={`w-4 h-4 ${s <= newRating ? 'fill-current' : 'text-stone-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  rows={2}
                  placeholder="Ceritakan manfaat buku ini bagi Anda atau keluarga desa..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl outline-none focus:ring-1 focus:ring-emerald-600"
                  required
                />

                <div className="flex items-center justify-between">
                  {submitSuccess ? (
                    <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Ulasan berhasil dikirim!
                    </span>
                  ) : <span />}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Send className="w-3 h-3" />
                    <span>Kirim Ulasan</span>
                  </button>
                </div>
              </form>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
