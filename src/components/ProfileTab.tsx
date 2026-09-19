import React, { useState } from 'react';
import { 
  User, 
  QrCode, 
  MessageCircle, 
  Settings, 
  Bell, 
  Type, 
  Wifi, 
  Check, 
  Copy, 
  Share2, 
  Sparkles, 
  BookPlus, 
  HelpCircle,
  ShieldCheck,
  MapPin,
  Barcode,
  Building2,
  ArrowRight
} from 'lucide-react';

interface ProfileTabProps {
  villageName: string;
  userName: string;
  userPhone: string;
  userAddress: string;
  memberId: string;
  fontSizePreference: 'normal' | 'large' | 'extralarge';
  onFontSizeChange: (size: 'normal' | 'large' | 'extralarge') => void;
  lowDataMode: boolean;
  onToggleLowDataMode: () => void;
  onRequestBookClick: () => void;
  onWhatsAppClick: () => void;
  onEditProfileClick: () => void;
  onOpenAdminMode?: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  villageName,
  userName,
  userPhone,
  userAddress,
  memberId,
  fontSizePreference,
  onFontSizeChange,
  lowDataMode,
  onToggleLowDataMode,
  onRequestBookClick,
  onWhatsAppClick,
  onEditProfileClick,
  onOpenAdminMode,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyMemberId = () => {
    navigator.clipboard?.writeText(memberId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pb-24 pt-4 sm:pt-6 space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Title */}
      <div className="border-b border-stone-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">
          Profil & Kartu Anggota Warga
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Identitas peminjam sah Perpustakaan {villageName}, layanan bantuan pustakawan, dan pengaturan kenyamanan baca
        </p>
      </div>

      {/* 1. Digital Membership Card (Kartu Anggota Digital) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 text-white p-6 sm:p-8 shadow-xl max-w-xl mx-auto border border-emerald-600/50">
        
        {/* Background watermark badge */}
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/5 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
          
          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-emerald-500/40 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-amber-300 border border-white/20">
                📚
              </div>
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-emerald-200 block">
                  KARTU TANDA ANGGOTA DIGITAL
                </span>
                <h3 className="font-extrabold text-sm sm:text-base font-serif text-white">
                  Perpustakaan {villageName}
                </h3>
              </div>
            </div>

            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 text-[10px] font-extrabold">
              AKTIF
            </span>
          </div>

          {/* Member Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            
            <div className="sm:col-span-2 space-y-2">
              <div>
                <span className="text-[10px] text-emerald-300 uppercase tracking-wider block font-semibold">
                  Nama Warga
                </span>
                <p className="text-lg sm:text-xl font-bold tracking-wide font-serif">
                  {userName}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-emerald-300 uppercase block font-semibold">
                    Dusun / Wilayah
                  </span>
                  <p className="font-medium text-emerald-100 truncate">{userAddress}</p>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-300 uppercase block font-semibold">
                    No. WhatsApp
                  </span>
                  <p className="font-medium text-emerald-100">{userPhone}</p>
                </div>
              </div>
            </div>

            {/* Simulated QR Code */}
            <div className="bg-white p-2.5 rounded-2xl flex flex-col items-center justify-center shadow-md w-28 h-28 mx-auto sm:ml-auto">
              <QrCode className="w-16 h-16 text-emerald-950" />
              <span className="text-[9px] font-bold text-stone-600 mt-1">SCAN DI BALAI</span>
            </div>

          </div>

          {/* Card Footer with Member ID Barcode */}
          <div className="pt-3 border-t border-emerald-500/40 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 font-mono text-emerald-200">
              <span className="text-stone-300">ID:</span>
              <strong className="tracking-wider">{memberId}</strong>
            </div>

            <button
              onClick={handleCopyMemberId}
              className="flex items-center gap-1 text-[11px] bg-emerald-900/80 hover:bg-emerald-900 text-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-400/30 transition"
            >
              {copied ? <Check className="w-3 h-3 text-amber-300" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Tersalin' : 'Salin Nomor ID'}</span>
            </button>
          </div>

        </div>
      </section>

      {/* 2. Quick Actions: Usulkan Buku & Tanya Pustakawan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Tanya Pustakawan WA */}
        <div 
          onClick={onWhatsAppClick}
          className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition cursor-pointer flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
            <MessageCircle className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 text-sm sm:text-base">
              Tanya Pustakawan via WhatsApp
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Konsultasi buku tani, perpanjangan pinjaman, atau kesulitan pakai aplikasi
            </p>
          </div>
        </div>

        {/* Usulkan Buku Baru */}
        <div 
          onClick={onRequestBookClick}
          className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:border-amber-500 hover:shadow-md transition cursor-pointer flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition">
            <BookPlus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 text-sm sm:text-base">
              Usulkan Buku Kebutuhan Desa
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Ajukan buku ternak, resep kue, atau buku sekolah yang belum tersedia
            </p>
          </div>
        </div>

      </div>

      {/* 3. Aksesibilitas & Kenyamanan Membaca (Untuk Warga Senior & Koneksi Desa) */}
      <section className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-7 space-y-5">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-700" />
            <span>Kenyamanan Tampilan & Aksesibilitas</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Sesuaikan ukuran huruf dan penghematan kuota agar membaca semakin nyaman di segala kondisi
          </p>
        </div>

        <div className="space-y-4 divide-y divide-stone-100 text-sm">
          
          {/* Font size choice */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-stone-800 flex items-center gap-1.5">
                <Type className="w-4 h-4 text-emerald-700" />
                Ukuran Huruf Teks
              </span>
              <p className="text-xs text-stone-500 mt-0.5">
                Pilih ukuran huruf yang jelas dan nyaman untuk mata Anda
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onFontSizeChange('normal')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  fontSizePreference === 'normal'
                    ? 'bg-emerald-800 text-white border-emerald-800'
                    : 'bg-white text-stone-700 border-stone-300'
                }`}
              >
                Normal
              </button>
              <button
                onClick={() => onFontSizeChange('large')}
                className={`px-3 py-1.5 rounded-xl text-sm font-semibold border transition ${
                  fontSizePreference === 'large'
                    ? 'bg-emerald-800 text-white border-emerald-800'
                    : 'bg-white text-stone-700 border-stone-300'
                }`}
              >
                Besar
              </button>
              <button
                onClick={() => onFontSizeChange('extralarge')}
                className={`px-3.5 py-1.5 rounded-xl text-base font-bold border transition ${
                  fontSizePreference === 'extralarge'
                    ? 'bg-emerald-800 text-white border-emerald-800'
                    : 'bg-white text-stone-700 border-stone-300'
                }`}
              >
                Sangat Besar
              </button>
            </div>
          </div>

          {/* Low data mode toggle */}
          <div className="pt-4 flex items-center justify-between gap-3">
            <div>
              <span className="font-bold text-stone-800 flex items-center gap-1.5">
                <Wifi className="w-4 h-4 text-teal-700" />
                Mode Hemat Kuota & Sinyal Lemah
              </span>
              <p className="text-xs text-stone-500 mt-0.5">
                Mengutamakan teks dan format EPUB ringan agar hemat paket data warga
              </p>
            </div>

            <button
              onClick={onToggleLowDataMode}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${
                lowDataMode ? 'bg-emerald-600 justify-end' : 'bg-stone-300 justify-start'
              }`}
            >
              <div className="bg-white w-4 h-4 rounded-full shadow-md transform" />
            </button>
          </div>

        </div>

      </section>

      {/* 4. Notifikasi & Pemberitahuan Perpustakaan */}
      <section className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-7 space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
          <Bell className="w-5 h-5 text-amber-600" />
          <span>Pemberitahuan Terbaru untuk Anda</span>
        </h2>

        <div className="space-y-2 text-xs">
          <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-emerald-900 block font-bold">Kartu Anggota Siap Digunakan</strong>
              <p className="text-emerald-800 mt-0.5">
                Tunjukkan nomor ID atau scan QR code Anda saat meminjam buku fisik di Balai Pustaka Desa.
              </p>
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-start gap-3 text-stone-600">
            <Bell className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-stone-800 block font-bold">Jadwal Kelas Belajar Baca-Tulis Anak</strong>
              <p className="text-stone-500 mt-0.5">
                Setiap Sabtu sore pukul 15.30 WIB di teras perpustakaan desa. Terbuka gratis untuk semua anak.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Akses Khusus Perangkat Desa & Pustakawan */}
      <section className="bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 text-white rounded-3xl p-5 sm:p-7 shadow-lg border border-emerald-800/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 bg-amber-950/70 border border-amber-500/40 px-2 py-0.5 rounded-full">
              PORTAL PERANGKAT DESA
            </span>
          </div>
          <span className="text-[11px] text-emerald-200">Desa Lasem Sidayu</span>
        </div>

        <div>
          <h3 className="font-bold text-base sm:text-lg font-serif">
            Manajemen Perpustakaan & Laporan Desa
          </h3>
          <p className="text-xs text-stone-300 leading-relaxed mt-1">
            Khusus Kepala Desa, Sekretaris Desa, Kaur Kesra, dan Pengurus Pustakawan untuk mengelola katalog buku, sirkulasi peminjaman warga, verifikasi usulan APBDes, dan cetak laporan resmi Musdes.
          </p>
        </div>

        {onOpenAdminMode && (
          <div className="pt-2">
            <button
              onClick={onOpenAdminMode}
              className="w-full sm:w-auto px-5 py-3 bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition active:scale-95"
            >
              <Building2 className="w-4 h-4" />
              <span>Buka Dashboard Perangkat Desa</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        )}
      </section>

      {/* Edit Profile / Ganti Data */}
      <div className="text-center pt-2">
        <button
          onClick={onEditProfileClick}
          className="text-xs text-stone-500 hover:text-stone-800 underline font-medium"
        >
          Perbarui Data Warga / Ubah Nomor HP
        </button>
      </div>

    </div>
  );
};
