import React, { useState } from 'react';
import { 
  X, 
  User, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Check, 
  Sparkles 
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  villageName: string;
  currentName: string;
  currentPhone: string;
  currentAddress: string;
  onSaveProfile: (name: string, phone: string, address: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  villageName,
  currentName,
  currentPhone,
  currentAddress,
  onSaveProfile,
}) => {
  const [name, setName] = useState(currentName || '');
  const [phone, setPhone] = useState(currentPhone || '');
  const [address, setAddress] = useState(currentAddress || 'Dusun Krajan, RT 02 / RW 01');

  // Early return SETELAH semua hooks (aturan React Hooks)
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSaveProfile(name.trim(), phone.trim() || '0812-3456-7890', address.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4" role="presentation">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200" role="dialog" aria-modal="true" aria-labelledby="member-modal-title">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-5 sm:p-6 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-200 block">
              Registrasi & Kartu Warga
            </span>
            <h3 id="member-modal-title" className="text-lg font-bold font-serif">
              Masuk Anggota Perpustakaan
            </h3>
            <p className="text-xs text-emerald-100 mt-0.5">
              Perpustakaan {villageName}
            </p>
          </div>

          <button
            type="button"
            aria-label="Tutup dialog profil"
            onClick={onClose}
            className="p-1 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-700/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-700" />
              Nama Lengkap Warga
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Bpk. Bambang Sutrisno"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              Nomor WhatsApp (untuk info pengingat pinjam)
            </label>
            <input
              type="tel"
              placeholder="Contoh: 0812-3456-7890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              Dusun / RT / RW Domisili
            </label>
            <input
              type="text"
              placeholder="Contoh: Dusun Krajan RT 02 / RW 01"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none"
            />
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl text-[11px] text-emerald-900 border border-emerald-200/80 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
            <p>
              Data hanya digunakan untuk penerbitan Kartu Anggota Digital dan pengingat pengembalian buku desa tanpa biaya langganan apapun.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-sm active:scale-95"
            >
              Simpan & Dapatkan Kartu
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
