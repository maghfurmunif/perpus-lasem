import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Wifi, 
  WifiOff, 
  MessageCircle, 
  User, 
  MapPin, 
  ChevronDown, 
  Check, 
  Sparkles,
  Home,
  Layers,
  BookMarked,
  DownloadCloud,
  Building2
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  villageName: string;
  onVillageNameChange: (name: string) => void;
  onSearchClick: () => void;
  onWhatsAppClick: () => void;
  onProfileClick: () => void;
  activeBorrowCount: number;
  downloadCount: number;
  isSimulatedOffline: boolean;
  onToggleSimulatedOffline: () => void;
}

const VILLAGE_OPTIONS = [
  'Lasem Sidayu',
  'Dusun Krajan (Lasem)',
  'Dusun Kauman (Lasem)',
  'Dusun Sedagaran (Lasem)',
  'Dusun Tambak Sari (Lasem)',
  'Dusun Sidomulyo (Lasem)'
];

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  villageName,
  onVillageNameChange,
  onSearchClick,
  onWhatsAppClick,
  onProfileClick,
  activeBorrowCount,
  downloadCount,
  isSimulatedOffline,
  onToggleSimulatedOffline,
}) => {
  const [showVillageMenu, setShowVillageMenu] = useState(false);
  const [customVillageInput, setCustomVillageInput] = useState('');
  const [isEditingCustom, setIsEditingCustom] = useState(false);

  const handleSelectVillage = (name: string) => {
    onVillageNameChange(name);
    setShowVillageMenu(false);
    setIsEditingCustom(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customVillageInput.trim()) {
      onVillageNameChange(`Desa ${customVillageInput.trim()}`);
      setShowVillageMenu(false);
      setIsEditingCustom(false);
      setCustomVillageInput('');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 transition-all shadow-xs">
      {/* Offline Alert Bar if triggered */}
      {isSimulatedOffline && (
        <div className="bg-amber-600 text-white text-xs px-4 py-1.5 flex items-center justify-between font-medium">
          <div className="flex items-center gap-1.5 mx-auto">
            <WifiOff className="w-3.5 h-3.5 animate-pulse" />
            <span>Mode Luring Aktif: Anda sedang mengakses buku yang telah terunduh di HP tanpa kuota internet.</span>
          </div>
          <button 
            onClick={onToggleSimulatedOffline}
            className="text-[11px] underline hover:text-amber-100 ml-2"
          >
            Nyalakan Sinyal
          </button>
        </div>
      )}

      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Brand Logo & Village Title */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Simple Engaging Logo: Book + Village Tree & House Metaphor */}
            <div 
              onClick={() => onTabChange('home')}
              className="cursor-pointer group flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-700/20 ring-2 ring-emerald-500/30 transition-transform active:scale-95"
            >
              <div className="relative">
                {/* Stylized Book with Leaf/Sprout */}
                <BookOpen className="w-6 h-6 text-white group-hover:scale-105 transition-transform" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-emerald-700 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-emerald-900 rounded-full" />
                </span>
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                  Simpul Literasi
                </span>
                <button
                  onClick={onToggleSimulatedOffline}
                  className={`hidden sm:flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border transition ${
                    isSimulatedOffline 
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  }`}
                  title="Klik untuk tes mode offline tanpa koneksi"
                >
                  {isSimulatedOffline ? <WifiOff className="w-3 h-3" /> : <Wifi className="w-3 h-3 text-emerald-600" />}
                  <span>{isSimulatedOffline ? 'Luring' : 'Hemat Kuota'}</span>
                </button>
              </div>

              {/* Village Name Selector Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowVillageMenu(!showVillageMenu)}
                  className="flex items-center gap-1 text-base sm:text-lg font-extrabold text-stone-900 hover:text-emerald-800 transition truncate group text-left"
                >
                  <span className="truncate">Perpustakaan {villageName}</span>
                  <ChevronDown className="w-4 h-4 text-stone-400 group-hover:text-emerald-700 transition flex-shrink-0" />
                </button>

                {showVillageMenu && (
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-1 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                      Pilih Nama Desa
                    </div>
                    {VILLAGE_OPTIONS.map((name) => (
                      <button
                        key={name}
                        onClick={() => handleSelectVillage(name)}
                        className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-emerald-50 transition ${
                          villageName === name ? 'text-emerald-700 font-semibold bg-emerald-50/60' : 'text-stone-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{name}</span>
                        </div>
                        {villageName === name && <Check className="w-4 h-4 text-emerald-600" />}
                      </button>
                    ))}

                    <div className="border-t border-stone-100 mt-1 pt-1 px-3 py-2">
                      {!isEditingCustom ? (
                        <button
                          onClick={() => setIsEditingCustom(true)}
                          className="text-xs text-emerald-700 font-medium hover:underline flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" /> Masukkan Nama Desa Lain...
                        </button>
                      ) : (
                        <form onSubmit={handleCustomSubmit} className="mt-1 flex gap-1">
                          <input
                            type="text"
                            placeholder="Contoh: Maju Jaya"
                            value={customVillageInput}
                            onChange={(e) => setCustomVillageInput(e.target.value)}
                            className="text-xs w-full px-2 py-1 border border-stone-300 rounded-md focus:ring-1 focus:ring-emerald-500 outline-none"
                            autoFocus
                          />
                          <button
                            type="submit"
                            className="text-xs bg-emerald-700 text-white px-2 py-1 rounded-md hover:bg-emerald-800"
                          >
                            Simpan
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links (>= md screens) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => onTabChange('home')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition ${
                currentTab === 'home'
                  ? 'bg-emerald-100/80 text-emerald-900'
                  : 'text-stone-600 hover:text-emerald-800 hover:bg-stone-100/70'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Beranda</span>
            </button>

            <button
              onClick={() => onTabChange('collection')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition ${
                currentTab === 'collection'
                  ? 'bg-emerald-100/80 text-emerald-900'
                  : 'text-stone-600 hover:text-emerald-800 hover:bg-stone-100/70'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Koleksi Buku</span>
            </button>

            <button
              onClick={() => onTabChange('borrowing')}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition ${
                currentTab === 'borrowing'
                  ? 'bg-emerald-100/80 text-emerald-900'
                  : 'text-stone-600 hover:text-emerald-800 hover:bg-stone-100/70'
              }`}
            >
              <BookMarked className="w-4 h-4" />
              <span>Peminjaman</span>
              {activeBorrowCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-amber-500 text-stone-900 text-[11px] font-bold rounded-full">
                  {activeBorrowCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onTabChange('downloads')}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition ${
                currentTab === 'downloads'
                  ? 'bg-emerald-100/80 text-emerald-900'
                  : 'text-stone-600 hover:text-emerald-800 hover:bg-stone-100/70'
              }`}
            >
              <DownloadCloud className="w-4 h-4" />
              <span>Unduhan Offline</span>
              {downloadCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-teal-600 text-white text-[11px] font-bold rounded-full">
                  {downloadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onTabChange('admin')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition ${
                currentTab === 'admin'
                  ? 'bg-amber-400 text-stone-950 shadow-xs'
                  : 'text-amber-900 hover:bg-amber-100/70 bg-amber-50/60 border border-amber-200/80'
              }`}
            >
              <Building2 className="w-4 h-4 text-amber-700" />
              <span>Portal Desa</span>
            </button>
          </nav>

          {/* Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search trigger */}
            <button
              onClick={onSearchClick}
              className="flex items-center gap-2 px-3 py-2 text-stone-600 bg-stone-100 hover:bg-stone-200/80 rounded-xl text-xs sm:text-sm font-medium transition active:scale-95"
              title="Cari Buku / Topik"
            >
              <Search className="w-4 h-4 text-emerald-700" />
              <span className="hidden sm:inline">Cari Koleksi...</span>
            </button>

            {/* Portal Desa Shortcut for Mobile & Desktop */}
            <button
              onClick={() => onTabChange(currentTab === 'admin' ? 'home' : 'admin')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition shadow-xs active:scale-95 ${
                currentTab === 'admin'
                  ? 'bg-emerald-800 text-white hover:bg-emerald-900'
                  : 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 hover:from-amber-500 hover:to-amber-600 border border-amber-400/80'
              }`}
              title="Beralih ke Portal Perangkat Desa & Pengurus"
            >
              <Building2 className="w-4 h-4" />
              <span className="text-[11px] sm:text-xs">{currentTab === 'admin' ? 'Mode Warga' : 'Portal Desa'}</span>
            </button>

            {/* Tanya Pustakawan WA Button */}
            <button
              onClick={onWhatsAppClick}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition shadow-sm active:scale-95"
              title="Tanya Pustakawan Desa via WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-emerald-200 fill-current" />
              <span>Tanya Pustakawan</span>
            </button>

            {/* Profile / Member Card */}
            <button
              onClick={onProfileClick}
              className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 text-stone-700 bg-stone-100/80 hover:bg-stone-200/80 rounded-xl transition active:scale-95"
              title="Kartu Anggota & Profil"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                <User className="w-4 h-4" />
              </div>
              <span className="hidden sm:inline text-xs font-semibold">Warga Desa</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
