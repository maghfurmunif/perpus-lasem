import React from 'react';
import { 
  BookMarked, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  RotateCcw, 
  MessageCircle, 
  ShieldCheck, 
  ArrowRight,
  Info
} from 'lucide-react';
import { BorrowRecord, Book } from '../types';

interface BorrowingTabProps {
  borrowRecords: BorrowRecord[];
  onExtendBorrow: (recordId: string) => void;
  onReturnBorrow: (recordId: string) => void;
  onReadBook: (bookId: string) => void;
  onBrowseCollection: () => void;
  onWhatsAppReminder: (record: BorrowRecord) => void;
}

export const BorrowingTab: React.FC<BorrowingTabProps> = ({
  borrowRecords,
  onExtendBorrow,
  onReturnBorrow,
  onReadBook,
  onBrowseCollection,
  onWhatsAppReminder,
}) => {
  const activeLoans = borrowRecords.filter((r) => r.status === 'active' || r.status === 'extended');
  const pastLoans = borrowRecords.filter((r) => r.status === 'returned');

  return (
    <div className="pb-24 pt-4 sm:pt-6 space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">
            Peminjaman Buku Saya
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Pantau masa aktif peminjaman buku digital & fisik, perpanjang waktu, atau lapor pengembalian
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300">
            {activeLoans.length} Buku Sedang Dipinjam
          </span>
        </div>
      </div>

      {/* Rules & Policy Box */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 flex items-start gap-3">
        <Info className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="font-bold">Ketentuan Peminjaman Desa:</strong>
          <p className="text-emerald-800 leading-relaxed">
            Setiap warga terdaftar dapat meminjam hingga <strong>3 judul buku</strong> sekaligus selama 14 hari. 
            Perpanjangan dapat diajukan secara daring 1 kali selama tidak ada warga lain dalam daftar antrean. 
            Pengingat batas waktu otomatis dikirimkan ke WhatsApp Anda.
          </p>
        </div>
      </div>

      {/* 1. Active Loans Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
          <BookMarked className="w-5 h-5 text-emerald-700" />
          <span>Pinjaman Aktif Saat Ini</span>
        </h2>

        {activeLoans.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-8 text-center space-y-3">
            <BookMarked className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="font-bold text-stone-800 text-base">Tidak Ada Peminjaman Aktif</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Anda sedang tidak meminjam buku. Jelajahi katalog buku pertanian, edukasi, atau UMKM untuk mulai membaca!
            </p>
            <button
              onClick={onBrowseCollection}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition"
            >
              Jelajahi Koleksi Sekarang
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeLoans.map((loan) => (
              <div
                key={loan.id}
                className="bg-white rounded-2xl border border-stone-200 shadow-xs p-4 sm:p-5 flex flex-col justify-between space-y-4"
              >
                <div className="flex gap-4">
                  {/* Book Cover */}
                  <img
                    src={loan.bookCover}
                    alt={loan.bookTitle}
                    className="w-20 sm:w-24 aspect-[3/4] object-cover rounded-xl shadow-sm border border-stone-200 flex-shrink-0"
                    referrerPolicy="no-referrer"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md">
                        {loan.format}
                      </span>
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md flex items-center gap-1 border border-amber-200">
                        <Clock className="w-3 h-3" />
                        Jatuh Tempo: {loan.dueDate}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm sm:text-base text-stone-900 leading-snug line-clamp-2 font-serif">
                      {loan.bookTitle}
                    </h3>

                    <p className="text-xs text-stone-500 truncate">
                      {loan.bookAuthor}
                    </p>

                    <div className="text-[11px] text-stone-500 pt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      <span>Dipinjam sejak: {loan.borrowDate}</span>
                    </div>

                    {loan.status === 'extended' && (
                      <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Masa pinjam telah diperpanjang (+7 hari)</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onReadBook(loan.bookId)}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 active:scale-95"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Buka e-Book</span>
                    </button>

                    {loan.canExtend && (
                      <button
                        onClick={() => onExtendBorrow(loan.id)}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold transition flex items-center gap-1 active:scale-95"
                        title="Perpanjang masa peminjaman selama 7 hari"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
                        <span>Perpanjang</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      onClick={() => onWhatsAppReminder(loan)}
                      className="text-xs text-emerald-800 hover:underline flex items-center gap-1"
                      title="Kirim pengingat WhatsApp ke HP saya"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-current" />
                      <span>Kirim ke WA</span>
                    </button>

                    <button
                      onClick={() => onReturnBorrow(loan.id)}
                      className="text-xs text-stone-500 hover:text-stone-800 underline"
                    >
                      Selesai Baca
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>

      {/* 2. Daftar Antrean & Rekomendasi Selanjutnya */}
      <section className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-7 space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-600" />
          <span>Buku dalam Antrean Pemesanan Warga</span>
        </h2>
        
        <p className="text-xs text-stone-500">
          Jika buku fisik yang Anda inginkan sedang dipinjam warga lain, sistem perpustakaan desa akan memberi notifikasi nomor antrean.
        </p>

        <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <span className="font-bold text-stone-800 text-sm">
              Pedoman Budidaya Padi Organik SRI (System of Rice Intensification)
            </span>
            <p className="text-stone-500">
              Antrean: <strong>Posisi ke-2</strong> • Estimasi ketersediaan: 28 September 2026
            </p>
          </div>
          <span className="px-3 py-1 bg-amber-100 text-amber-900 font-bold rounded-lg text-xs">
            Menunggu Giliran
          </span>
        </div>
      </section>

      {/* 3. Riwayat Peminjaman (History) */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-stone-900">
          Riwayat Pengembalian Buku
        </h2>

        {pastLoans.length === 0 ? (
          <p className="text-xs text-stone-500">Belum ada riwayat buku yang dikembalikan.</p>
        ) : (
          <div className="space-y-2">
            {pastLoans.map((loan) => (
              <div
                key={loan.id}
                className="bg-white p-3.5 rounded-xl border border-stone-200 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-stone-900">{loan.bookTitle}</span>
                    <span className="text-stone-400 block text-[11px]">Selesai dikembalikan • {loan.bookAuthor}</span>
                  </div>
                </div>
                <button
                  onClick={() => onReadBook(loan.bookId)}
                  className="text-emerald-700 hover:underline font-semibold"
                >
                  Pinjam Lagi
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};
