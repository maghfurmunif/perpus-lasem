import React from 'react';
import { 
  DownloadCloud, 
  Trash2, 
  BookOpen, 
  HardDrive, 
  WifiOff, 
  Wifi, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Info,
  Layers
} from 'lucide-react';
import { DownloadItem } from '../types';

interface DownloadsTabProps {
  downloads: DownloadItem[];
  onReadBook: (bookId: string) => void;
  onDeleteDownload: (bookId: string) => void;
  onBrowseBooks: () => void;
  isSimulatedOffline: boolean;
  onToggleSimulatedOffline: () => void;
}

export const DownloadsTab: React.FC<DownloadsTabProps> = ({
  downloads,
  onReadBook,
  onDeleteDownload,
  onBrowseBooks,
  isSimulatedOffline,
  onToggleSimulatedOffline,
}) => {
  const completedDownloads = downloads.filter((d) => d.isCompleted);
  const activeDownloads = downloads.filter((d) => !d.isCompleted);

  // Calculate approximate total size
  const totalMB = completedDownloads.reduce((acc, curr) => {
    const num = parseFloat(curr.fileSize) || 1.5;
    return acc + num;
  }, 0);

  return (
    <div className="pb-24 pt-4 sm:pt-6 space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">
            Rak Buku Luring (Unduhan Offline)
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Buku yang tersimpan di memori HP Anda. Siap dibaca di sawah, kebun, atau rumah tanpa sinyal internet.
          </p>
        </div>

        {/* Offline Simulator Switcher */}
        <button
          onClick={onToggleSimulatedOffline}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition self-start sm:self-auto ${
            isSimulatedOffline
              ? 'bg-amber-600 text-white border-amber-700 shadow-sm'
              : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-300'
          }`}
          title="Uji coba membaca tanpa koneksi internet"
        >
          {isSimulatedOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4 text-emerald-600" />}
          <span>{isSimulatedOffline ? 'Mode Luring Aktif (Tanpa Sinyal)' : 'Uji Mode Tanpa Sinyal'}</span>
        </button>
      </div>

      {/* Storage Indicator Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-800">
              Penggunaan Memori HP Warga
            </h3>
            <p className="text-xs text-stone-500">
              Total <strong>{totalMB.toFixed(1)} MB</strong> terpakai untuk {completedDownloads.length} judul buku
            </p>
          </div>
        </div>

        {/* Mini progress meter */}
        <div className="w-full sm:w-64 space-y-1">
          <div className="flex justify-between text-[11px] text-stone-500 font-medium">
            <span>Kapasitas Digunakan</span>
            <span className="text-emerald-700 font-bold">{totalMB.toFixed(1)} MB / Hemat</span>
          </div>
          <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-teal-600 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, Math.max(10, totalMB * 5))}%` }}
            />
          </div>
        </div>
      </div>

      {/* 1. Active Downloads In Progress (Simulated Speed & Progress) */}
      {activeDownloads.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
            <DownloadCloud className="w-4 h-4 text-amber-600 animate-bounce" />
            <span>Sedang Mengunduh ke HP ({activeDownloads.length})</span>
          </h2>

          <div className="space-y-2">
            {activeDownloads.map((item) => (
              <div
                key={item.bookId}
                className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-12 h-16 object-cover rounded-lg shadow-xs"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="font-bold text-stone-900 text-sm">{item.title}</span>
                    <span className="text-stone-500 block text-[11px]">{item.author} • Format {item.format}</span>
                    <span className="text-amber-800 font-semibold text-[11px] mt-0.5 block">
                      Mengunduh: {item.progress}% • Kecepatan: ~160 KB/detik (Ramah sinyal 3G)
                    </span>
                  </div>
                </div>

                <div className="w-full sm:w-48 space-y-1">
                  <div className="w-full h-2.5 bg-amber-200/80 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-600 rounded-full transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 2. Downloaded Books Ready to Read Offline */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          <span>Buku Tersimpan (Bisa Dibaca Tanpa Kuota)</span>
        </h2>

        {completedDownloads.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 text-center space-y-4">
            <DownloadCloud className="w-12 h-12 text-stone-300 mx-auto" />
            <div className="space-y-1">
              <h3 className="font-bold text-stone-800 text-base sm:text-lg">
                Belum Ada Buku yang Diunduh
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
                Unduh buku favorit Anda sekarang saat terhubung WiFi balai desa atau ada sinyal, lalu baca kapan saja secara luring.
              </p>
            </div>
            <button
              onClick={onBrowseBooks}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-sm"
            >
              Cari Buku untuk Diunduh
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedDownloads.map((item) => (
              <div
                key={item.bookId}
                className="bg-white rounded-2xl border border-stone-200 shadow-xs p-4 flex flex-col justify-between space-y-3 hover:border-teal-400 transition group"
              >
                <div className="flex gap-3">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-16 sm:w-20 aspect-[3/4] object-cover rounded-xl shadow-xs border border-stone-200 flex-shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md">
                        {item.format}
                      </span>
                      <span className="text-[11px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md font-semibold">
                        {item.fileSize}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-stone-900 leading-snug line-clamp-2 font-serif">
                      {item.title}
                    </h3>

                    <p className="text-xs text-stone-500 truncate">
                      {item.author}
                    </p>

                    <p className="text-[10px] text-stone-400">
                      Diunduh: {item.downloadDate}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onReadBook(item.bookId)}
                    className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95 shadow-xs"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Baca Luring (Offline)</span>
                  </button>

                  <button
                    onClick={() => onDeleteDownload(item.bookId)}
                    className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                    title="Hapus file untuk hemat memori HP"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>

      {/* Helpful Village Tip */}
      <div className="bg-stone-100/80 rounded-2xl p-4 text-xs text-stone-600 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Tip Hemat Kuota:</strong> Warga dapat memanfaatkan WiFi gratis di <strong>Balai Desa atau Pojok Baca</strong> setiap hari kerja pukul 08.00 - 15.00 WIB untuk mengunduh buku pelajaran atau panduan tani ke HP masing-masing.
        </p>
      </div>

    </div>
  );
};
