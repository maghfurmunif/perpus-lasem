import React, { useEffect, useState } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Type, 
  Sun, 
  Moon, 
  BookOpen, 
  Bookmark, 
  Sliders, 
  Check, 
  Share2,
  Volume2
} from 'lucide-react';
import { Book } from '../types';
import { getCachedBookFile, useOnlineStatus } from '../lib/offline';

interface ReaderModalProps {
  book: Book | null;
  onClose: () => void;
  onDownload: (book: Book) => void;
  isDownloaded: boolean;
  onProgress?: (chapter: number, progress: number) => void;
}

export const ReaderModal: React.FC<ReaderModalProps> = ({
  book,
  onClose,
  onDownload,
  isDownloaded,
  onProgress,
}) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [themeMode, setThemeMode] = useState<'light' | 'sepia' | 'dark'>('sepia');
  const [fontScale, setFontScale] = useState<number>(18); // px
  const [useSerif, setUseSerif] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const isOnline = useOnlineStatus();
  const [cachedFileUrl, setCachedFileUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!book?.fileUrl || isOnline) {
      setCachedFileUrl(null);
      return () => { active = false };
    }
    void getCachedBookFile(book.id).then((url) => { if (active) setCachedFileUrl(url) });
    return () => { active = false };
  }, [book, isOnline]);

  // Early return SETELAH semua hooks (aturan React Hooks)
  if (!book) return null;

  if (book.fileUrl) {
    const readerUrl = isOnline ? book.fileUrl : cachedFileUrl;
    return <div className="fixed inset-0 z-50 bg-white flex flex-col"><div className="p-4 flex gap-4"><button className="min-h-11 px-3" onClick={onClose}>Kembali</button><strong className="truncate">{book.title}</strong>{readerUrl && <a className="min-h-11 px-3" href={readerUrl} target="_blank" rel="noreferrer">Buka file</a>}</div>{readerUrl && book.format === 'PDF' ? <iframe title={book.title} src={readerUrl} className="flex-1 w-full" /> : <p className="p-6">{isOnline ? 'Buka file EPUB menggunakan aplikasi pembaca di perangkat Anda.' : 'File ini belum tersimpan untuk dibaca offline.'}</p>}</div>;
  }
  if (!book.sampleChapters?.length) return <div className="fixed inset-0 z-50 bg-white p-8"><button onClick={onClose}>Kembali</button><p>Konten digital buku ini belum tersedia.</p></div>;
  const chapters = book.sampleChapters;
  const currentChapter = chapters[currentChapterIndex] || chapters[0];

  // Theme styling definitions
  const themeClasses = {
    light: 'bg-white text-stone-900 border-stone-200',
    sepia: 'bg-[#FAF6EE] text-[#2C2416] border-[#E8DFD0]',
    dark: 'bg-[#18191B] text-[#E0E2E6] border-[#2A2C30]'
  };

  const headerBgClasses = {
    light: 'bg-white/95 border-stone-200',
    sepia: 'bg-[#FAF6EE]/95 border-[#E8DFD0]',
    dark: 'bg-[#18191B]/95 border-[#2A2C30]'
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex flex-col justify-between overflow-hidden animate-in fade-in duration-150">
      
      {/* Top Controls Bar */}
      <header className={`px-4 sm:px-6 py-3 border-b flex items-center justify-between z-10 transition-colors ${headerBgClasses[themeMode]}`}>
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-stone-200/50 transition text-inherit flex items-center gap-1 text-xs font-bold"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Kembali</span>
          </button>

          <div className="min-w-0">
            <h2 className="text-xs sm:text-sm font-bold truncate">
              {book.title}
            </h2>
            <span className="text-[11px] opacity-70 block truncate">
              {book.author} • Format {book.format}
            </span>
          </div>
        </div>

        {/* Reader Customization Tools */}
        <div className="flex items-center gap-2">
          
          {/* Quick Settings Toggle */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-xl border border-stone-300/40 hover:bg-stone-200/40 transition text-xs flex items-center gap-1 font-semibold"
            title="Pengaturan Huruf & Tampilan"
          >
            <Type className="w-4 h-4" />
            <span className="hidden md:inline">Tampilan Baca</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-stone-200/50 transition"
            title="Tutup Pembaca"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Floating Settings Popover if open */}
      {showSettings && (
        <div className="absolute top-16 right-4 sm:right-6 z-20 w-72 bg-white text-stone-900 rounded-2xl shadow-2xl border border-stone-200 p-4 space-y-4 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500 uppercase">
            <span>Preferensi Baca</span>
            <button onClick={() => setShowSettings(false)} className="text-stone-400 hover:text-stone-700">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Theme Selector */}
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-stone-600 block">Warna Kertas:</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setThemeMode('light')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold border flex items-center justify-center gap-1 ${
                  themeMode === 'light' ? 'border-emerald-700 bg-stone-100 text-stone-950 ring-2 ring-emerald-600' : 'bg-white text-stone-700 border-stone-300'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-600" />
                <span>Terang</span>
              </button>
              <button
                onClick={() => setThemeMode('sepia')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold border flex items-center justify-center gap-1 ${
                  themeMode === 'sepia' ? 'border-amber-700 bg-[#FAF6EE] text-[#2C2416] ring-2 ring-amber-600' : 'bg-[#FAF6EE] text-[#554730] border-amber-200'
                }`}
              >
                <span>Krem</span>
              </button>
              <button
                onClick={() => setThemeMode('dark')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold border flex items-center justify-center gap-1 ${
                  themeMode === 'dark' ? 'border-emerald-500 bg-stone-900 text-white ring-2 ring-emerald-500' : 'bg-stone-800 text-stone-300 border-stone-700'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Malam</span>
              </button>
            </div>
          </div>

          {/* Font Size Adjuster */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium text-stone-600">
              <span>Ukuran Teks:</span>
              <span className="font-bold text-emerald-800">{fontScale} px</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFontScale((p) => Math.max(14, p - 2))}
                className="w-10 py-1 bg-stone-100 rounded-lg text-xs font-bold hover:bg-stone-200"
              >
                A-
              </button>
              <input
                type="range"
                min={14}
                max={26}
                step={2}
                value={fontScale}
                onChange={(e) => setFontScale(Number(e.target.value))}
                className="flex-1 accent-emerald-700 cursor-pointer"
              />
              <button
                onClick={() => setFontScale((p) => Math.min(26, p + 2))}
                className="w-10 py-1 bg-stone-100 rounded-lg text-sm font-bold hover:bg-stone-200"
              >
                A+
              </button>
            </div>
          </div>

          {/* Font Family Toggle */}
          <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-100">
            <span className="font-medium text-stone-600">Gaya Huruf Buku:</span>
            <button
              onClick={() => setUseSerif(!useSerif)}
              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-lg font-semibold text-stone-800"
            >
              {useSerif ? 'Serif (Koran/Buku)' : 'Sans-serif (Modern)'}
            </button>
          </div>
        </div>
      )}

      {/* Main Reading Canvas */}
      <main className={`flex-1 overflow-y-auto px-4 sm:px-8 py-8 sm:py-12 transition-colors ${themeClasses[themeMode]}`}>
        <article 
          className={`max-w-2xl mx-auto space-y-6 leading-relaxed ${
            useSerif ? 'font-serif' : 'font-sans'
          }`}
          style={{ fontSize: `${fontScale}px`, lineHeight: 1.75 }}
        >
          {/* Chapter Title */}
          <div className="border-b pb-4 mb-6 opacity-85">
            <span className="text-xs uppercase tracking-widest block font-sans font-bold opacity-60">
              Bagian {currentChapterIndex + 1} dari {chapters.length}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold mt-1">
              {currentChapter.title}
            </h1>
          </div>

          {/* Paragraphs */}
          <div className="whitespace-pre-line space-y-4">
            {currentChapter.content}
          </div>

          {/* End of chapter box */}
          <div className="pt-8 mt-12 border-t opacity-80 text-center text-xs font-sans space-y-2">
            <p>Anda sedang membaca buku berlisensi perpustakaan desa digital.</p>
            {!isDownloaded && (
              <button
                onClick={() => onDownload(book)}
                className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition"
              >
                Simpan Buku ini untuk Dibaca Offline di Sawah / Rumah
              </button>
            )}
          </div>
        </article>
      </main>

      {/* Bottom Chapter Navigator */}
      <footer className={`px-4 sm:px-6 py-3 border-t flex items-center justify-between z-10 transition-colors text-xs font-medium ${headerBgClasses[themeMode]}`}>
        <button
          disabled={currentChapterIndex === 0}
          onClick={() => { const next = Math.max(0, currentChapterIndex - 1); setCurrentChapterIndex(next); onProgress?.(next, Math.round((next / Math.max(1, chapters.length - 1)) * 100)); }}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-400/30 disabled:opacity-30 hover:bg-stone-200/40 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Bab Sebelumnya</span>
        </button>

        <span className="opacity-70">
          Bab {currentChapterIndex + 1} / {chapters.length}
        </span>

        <button
          disabled={currentChapterIndex === chapters.length - 1}
          onClick={() => { const next = Math.min(chapters.length - 1, currentChapterIndex + 1); setCurrentChapterIndex(next); onProgress?.(next, Math.round((next / Math.max(1, chapters.length - 1)) * 100)); }}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-400/30 disabled:opacity-30 hover:bg-stone-200/40 transition"
        >
          <span>Bab Selanjutnya</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </footer>

    </div>
  );
};
