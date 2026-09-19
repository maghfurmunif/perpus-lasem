import React, { useState } from 'react';
import { X, BookPlus, Send, Check, Sparkles } from 'lucide-react';
import { BookCategory } from '../types';

interface BookRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  villageName: string;
  userName?: string;
  userPhone?: string;
  onSubmitRequest?: (req: { title: string; author: string; category: BookCategory; reason: string; requesterName: string; requesterPhone?: string }) => void;
}

export const BookRequestModal: React.FC<BookRequestModalProps> = ({
  isOpen,
  onClose,
  villageName,
  userName = '',
  userPhone = '',
  onSubmitRequest,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState<BookCategory>('Pertanian');
  const [reason, setReason] = useState('');
  const [requesterName, setRequesterName] = useState(userName);
  const [requesterPhone, setRequesterPhone] = useState(userPhone);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (onSubmitRequest) {
      onSubmitRequest({
        title: title.trim(),
        author: author.trim() || 'Tidak disebutkan',
        category,
        reason: reason.trim() || 'Kebutuhan literasi warga',
        requesterName: requesterName.trim() || userName || 'Warga Lasem',
        requesterPhone: requesterPhone.trim() || userPhone,
      });
    }

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      setTitle('');
      setAuthor('');
      setReason('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <BookPlus className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-serif">
                Usulkan Buku untuk Desa
              </h3>
              <p className="text-xs text-emerald-100">
                Perpustakaan {villageName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-700/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-stone-900 text-lg">Usulan Berhasil Dikirim!</h4>
            <p className="text-xs text-stone-600 max-w-sm mx-auto">
              Terima kasih atas partisipasi Anda. Pengurus perpustakaan desa akan berkoordinasi untuk pengadaan buku ini.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-3.5 text-xs">
            
            <div className="space-y-1">
              <label className="font-bold text-stone-700">Judul Buku yang Diusulkan *</label>
              <input
                type="text"
                required
                placeholder="Contoh: Pembuatan Pupuk Kompos Cair dari Kotoran Ayam"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-1 focus:ring-emerald-600 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-stone-700">Kategori Buku</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as BookCategory)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-1 focus:ring-emerald-600 outline-none"
                >
                  <option value="Pertanian">Pertanian & Peternakan</option>
                  <option value="UMKM">UMKM & Wirausaha</option>
                  <option value="Edukasi">Edukasi & Sekolah</option>
                  <option value="Budaya Desa">Budaya & Sejarah</option>
                  <option value="Fiksi & Populer">Fiksi & Populer</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Pengarang (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: Ir. Supardi"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-1 focus:ring-emerald-600 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-700">Alasan & Manfaat untuk Warga</label>
              <textarea
                rows={2}
                placeholder="Contoh: Dibutuhkan untuk kelompok ternak RT 03 yang sedang belajar buat pakan fermentasi..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-1 focus:ring-emerald-600 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-700">Nama Pengusul</label>
              <input
                type="text"
                placeholder="Nama Anda / Kelompok Tani / Karang Taruna"
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-1 focus:ring-emerald-600 outline-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-stone-600 hover:text-stone-900 font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold flex items-center gap-1.5 transition active:scale-95 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Usulan Buku</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
