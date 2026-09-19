import React, { useState } from 'react';
import { 
  BarChart3, 
  BookOpen, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Printer, 
  ArrowLeft, 
  Check, 
  X, 
  Send, 
  MessageCircle, 
  FileText, 
  Building2, 
  Sparkles, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  RefreshCw, 
  ShieldCheck,
  ChevronRight,
  BookMarked,
  Tag,
  UserCheck
} from 'lucide-react';
import { Book, BorrowRecord, BookCategory, Announcement, BookRequestItem, VillageOfficialRole } from '../types';

interface AdminDashboardProps {
  books: Book[];
  onAddBook: (newBook: Book) => void;
  onUpdateBook: (updatedBook: Book) => void;
  onDeleteBook: (bookId: string) => void;
  borrowRecords: BorrowRecord[];
  onExtendBorrow: (recordId: string) => void;
  onReturnBorrow: (recordId: string) => void;
  announcements: Announcement[];
  onAddAnnouncement: (announcement: Announcement) => void;
  onDeleteAnnouncement: (id: string) => void;
  bookRequests: BookRequestItem[];
  onUpdateRequestStatus: (id: string, status: 'approved' | 'rejected' | 'fulfilled', notes?: string) => void;
  onBackToUserMode: () => void;
  villageName: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  books,
  onAddBook,
  onUpdateBook,
  onDeleteBook,
  borrowRecords,
  onExtendBorrow,
  onReturnBorrow,
  announcements,
  onAddAnnouncement,
  onDeleteAnnouncement,
  bookRequests,
  onUpdateRequestStatus,
  onBackToUserMode,
  villageName,
}) => {
  // Navigation Tabs in Admin Portal
  const [adminTab, setAdminTab] = useState<'overview' | 'books' | 'circulation' | 'requests' | 'announcements' | 'report'>('overview');

  // Village Official Identity (Role Switcher)
  const [activeOfficialRole, setActiveOfficialRole] = useState<VillageOfficialRole>('Sekretaris Desa');
  const [officialName, setOfficialName] = useState('Bpk. H. Abdul Malik, S.Sos');

  // Search & Filter States
  const [bookSearchQuery, setBookSearchQuery] = useState('');
  const [bookCategoryFilter, setBookCategoryFilter] = useState<string>('Semua');
  const [circulationFilter, setCirculationFilter] = useState<'all' | 'active' | 'overdue' | 'returned'>('all');

  // Add/Edit Book Modal State
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [bookFormData, setBookFormData] = useState({
    title: '',
    author: '',
    category: 'Pertanian' as BookCategory,
    format: 'PDF' as 'PDF' | 'EPUB' | 'Buku Fisik',
    accessType: 'Akses Terbuka' as 'Akses Terbuka' | 'Lisensi Terbatas',
    pages: 120,
    fileSize: '2.5 MB',
    totalCopies: 10,
    availableCopies: 10,
    description: '',
    publisher: 'Pemerintah Desa Lasem',
    year: 2026,
    tags: 'Lasem Sidayu, Panduan',
    coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80'
  });

  // Add Announcement Modal State
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [announcementFormData, setAnnouncementFormData] = useState({
    title: '',
    category: 'Pemerintahan Desa',
    summary: '',
    author: 'Pemerintah Desa Lasem Sidayu',
    badge: 'Penting'
  });

  // Action feedback message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Open Book Modal for Adding
  const handleOpenAddBook = () => {
    setEditingBookId(null);
    setBookFormData({
      title: '',
      author: '',
      category: 'Pertanian',
      format: 'PDF',
      accessType: 'Akses Terbuka',
      pages: 120,
      fileSize: '2.5 MB',
      totalCopies: 10,
      availableCopies: 10,
      description: '',
      publisher: 'Pemerintah Desa Lasem Sidayu',
      year: 2026,
      tags: 'Lasem Sidayu, Tambak, Desa',
      coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80'
    });
    setIsBookModalOpen(true);
  };

  // Open Book Modal for Editing
  const handleOpenEditBook = (book: Book) => {
    setEditingBookId(book.id);
    setBookFormData({
      title: book.title,
      author: book.author,
      category: book.category,
      format: book.format,
      accessType: book.accessType,
      pages: book.pages,
      fileSize: book.fileSize,
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies,
      description: book.description,
      publisher: book.publisher,
      year: book.year,
      tags: book.tags.join(', '),
      coverImage: book.coverImage
    });
    setIsBookModalOpen(true);
  };

  // Handle Save Book
  const handleSaveBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookFormData.title.trim() || !bookFormData.author.trim()) return;

    const tagsArray = bookFormData.tags.split(',').map((t) => t.trim()).filter(Boolean);

    if (editingBookId) {
      const existing = books.find((b) => b.id === editingBookId);
      if (existing) {
        const updated: Book = {
          ...existing,
          title: bookFormData.title.trim(),
          author: bookFormData.author.trim(),
          category: bookFormData.category,
          format: bookFormData.format,
          accessType: bookFormData.accessType,
          pages: Number(bookFormData.pages),
          fileSize: bookFormData.fileSize,
          totalCopies: Number(bookFormData.totalCopies),
          availableCopies: Number(bookFormData.availableCopies),
          description: bookFormData.description.trim(),
          publisher: bookFormData.publisher.trim(),
          year: Number(bookFormData.year),
          tags: tagsArray.length > 0 ? tagsArray : ['Lasem Sidayu'],
          coverImage: bookFormData.coverImage
        };
        onUpdateBook(updated);
        showToast(`Buku "${updated.title}" berhasil diperbarui.`);
      }
    } else {
      const newBook: Book = {
        id: `bk-custom-${Date.now()}`,
        title: bookFormData.title.trim(),
        author: bookFormData.author.trim(),
        category: bookFormData.category,
        format: bookFormData.format,
        accessType: bookFormData.accessType,
        pages: Number(bookFormData.pages),
        fileSize: bookFormData.fileSize,
        rating: 5.0,
        ratingCount: 1,
        totalCopies: Number(bookFormData.totalCopies),
        availableCopies: Number(bookFormData.availableCopies),
        description: bookFormData.description.trim() || 'Buku koleksi Perpustakaan Desa Lasem Sidayu.',
        publisher: bookFormData.publisher.trim() || 'Perpustakaan Lasem Sidayu',
        year: Number(bookFormData.year) || 2026,
        tags: tagsArray.length > 0 ? tagsArray : ['Lasem Sidayu', 'Desa'],
        coverImage: bookFormData.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
        isNew: true,
        sampleChapters: [
          {
            title: 'Bab 1: Pengantar Buku',
            content: `${bookFormData.title}\n\n${bookFormData.description}\n\nDisusun untuk memajukan pengetahuan warga Desa Lasem, Kecamatan Sidayu, Kabupaten Gresik.`
          }
        ],
        reviews: []
      };
      onAddBook(newBook);
      showToast(`Buku baru "${newBook.title}" berhasil ditambahkan ke katalog.`);
    }

    setIsBookModalOpen(false);
  };

  // Handle Save Announcement
  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementFormData.title.trim() || !announcementFormData.summary.trim()) return;

    const newAnn: Announcement = {
      id: `anc-${Date.now()}`,
      title: announcementFormData.title.trim(),
      category: announcementFormData.category,
      summary: announcementFormData.summary.trim(),
      author: announcementFormData.author.trim(),
      badge: announcementFormData.badge,
      date: 'Hari ini'
    };

    onAddAnnouncement(newAnn);
    setIsAnnouncementModalOpen(false);
    showToast('Warta desa baru berhasil dipublikasikan ke warga.');
  };

  // Send WhatsApp reminder from Admin to Citizen
  const handleSendAdminWhatsApp = (record: BorrowRecord) => {
    const text = `Yth. Warga Desa Lasem Sidayu, kami dari Pengurus Perpustakaan Desa Lasem mengingatkan bahwa masa peminjaman buku "${record.bookTitle}" jatuh tempo pada tanggal ${record.dueDate}. Apabila membutuhkan perpanjangan atau pengembalian, silakan hubungi ruang baca Balai Desa Lasem Sidayu. Terima kasih.`;
    window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Calculations for KPI
  const totalBooks = books.length;
  const totalPhysicalCopies = books.reduce((acc, b) => acc + b.totalCopies, 0);
  const totalAvailableCopies = books.reduce((acc, b) => acc + b.availableCopies, 0);
  const activeBorrows = borrowRecords.filter((b) => b.status === 'active' || b.status === 'extended').length;
  const pendingRequests = bookRequests.filter((r) => r.status === 'pending').length;

  // Filtered books for catalog
  const filteredBooks = books.filter((b) => {
    const matchCat = bookCategoryFilter === 'Semua' || b.category === bookCategoryFilter;
    const matchSearch = b.title.toLowerCase().includes(bookSearchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(bookSearchQuery.toLowerCase()) ||
      b.tags.some((t) => t.toLowerCase().includes(bookSearchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  // Filtered circulations
  const filteredCirculations = borrowRecords.filter((r) => {
    if (circulationFilter === 'active') return r.status === 'active' || r.status === 'extended';
    if (circulationFilter === 'overdue') return r.status === 'overdue';
    if (circulationFilter === 'returned') return r.status === 'returned';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F4F6F4] text-stone-900 pb-28 sm:pb-16 font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-stone-700 flex items-center gap-2 text-xs sm:text-sm animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Official Village Header Bar */}
      <header className="bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white shadow-lg sticky top-0 z-30 border-b border-emerald-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center flex-shrink-0 text-amber-300 shadow-inner">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 bg-amber-950/70 border border-amber-500/40 px-2 py-0.5 rounded-full">
                    PORTAL PERANGKAT DESA
                  </span>
                  <span className="text-[11px] text-emerald-200 hidden sm:inline">
                    Kec. Sidayu, Kab. Gresik
                  </span>
                </div>
                <h1 className="text-base sm:text-lg font-bold font-serif tracking-tight truncate mt-0.5">
                  Pengelola Perpustakaan Lasem Sidayu
                </h1>
              </div>
            </div>

            {/* Official Persona Switcher & Back to Citizen Mode */}
            <div className="flex items-center justify-between sm:justify-end gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-white/10">
              
              {/* Role Indicator */}
              <div className="flex items-center gap-1.5 bg-black/30 border border-white/15 px-2.5 py-1 rounded-xl text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <select
                  value={activeOfficialRole}
                  onChange={(e) => setActiveOfficialRole(e.target.value as VillageOfficialRole)}
                  className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="Sekretaris Desa" className="text-stone-900">Sekretaris Desa (Sekdes)</option>
                  <option value="Kepala Desa" className="text-stone-900">Kepala Desa Lasem</option>
                  <option value="Kaur Kesra" className="text-stone-900">Kaur Kesra & Pembangunan</option>
                  <option value="Pustakawan Desa" className="text-stone-900">Pustakawan Desa Lasem</option>
                  <option value="Relawan Literasi" className="text-stone-900">Relawan Literasi Karang Taruna</option>
                </select>
              </div>

              {/* Exit to Citizen Mode Button */}
              <button
                onClick={onBackToUserMode}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-stone-100 text-stone-900 font-bold rounded-xl text-xs shadow-md transition active:scale-95 flex-shrink-0"
                title="Beralih ke tampilan pembaca warga desa"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-emerald-800" />
                <span>Mode Warga</span>
              </button>

            </div>

          </div>

          {/* Horizontal Scrollable Admin Tabs for Mobile Touch Navigation */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-3 mt-2 border-t border-white/10 text-xs font-semibold">
            <button
              onClick={() => setAdminTab('overview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition ${
                adminTab === 'overview' 
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-sm' 
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Ikhtisar & Statistik</span>
            </button>

            <button
              onClick={() => setAdminTab('books')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition ${
                adminTab === 'books' 
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-sm' 
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Katalog Buku ({books.length})</span>
            </button>

            <button
              onClick={() => setAdminTab('circulation')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition relative ${
                adminTab === 'circulation' 
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-sm' 
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <BookMarked className="w-3.5 h-3.5" />
              <span>Sirkulasi Pinjam</span>
              {activeBorrows > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-emerald-500 text-white rounded-full text-[10px] font-bold">
                  {activeBorrows}
                </span>
              )}
            </button>

            <button
              onClick={() => setAdminTab('requests')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition relative ${
                adminTab === 'requests' 
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-sm' 
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Usulan Buku Warga</span>
              {pendingRequests > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px] font-bold">
                  {pendingRequests} baru
                </span>
              )}
            </button>

            <button
              onClick={() => setAdminTab('announcements')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition ${
                adminTab === 'announcements' 
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-sm' 
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Warta & Agenda Desa</span>
            </button>

            <button
              onClick={() => setAdminTab('report')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition ${
                adminTab === 'report' 
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-sm' 
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Laporan Desa</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">

        {/* ========================================================
            TAB 1: IKHTISAR & STATISTIK (DESA LASEM SIDAYU)
           ======================================================== */}
        {adminTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Top Banner Notice for Village Meeting / Musdes */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-800 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-md">
                  Laporan Musdes Literasi 2026
                </span>
                <h3 className="text-base sm:text-lg font-bold font-serif">
                  Indeks Pembangunan Literasi Masyarakat Desa Lasem Sidayu
                </h3>
                <p className="text-xs text-emerald-100 max-w-2xl leading-relaxed">
                  Data sirkulasi peminjaman buku fisik dan e-book luring terintegrasi untuk mendukung prioritas Dana Desa bidang pendidikan dan ketahanan pangan tambak/pertanian.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setAdminTab('report')}
                  className="px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition active:scale-95"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Ekspor Laporan Resmi</span>
                </button>
              </div>
            </div>

            {/* Key KPI Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1">
                <div className="flex items-center justify-between text-stone-500 text-xs font-medium">
                  <span>Total Judul Buku</span>
                  <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-700">
                    <BookOpen className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
                  {totalBooks} Judul
                </div>
                <p className="text-[11px] text-stone-500">
                  {totalPhysicalCopies} eksemplar fisik & digital
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1">
                <div className="flex items-center justify-between text-stone-500 text-xs font-medium">
                  <span>Pemustaka Warga Terdaftar</span>
                  <div className="p-1.5 bg-teal-50 rounded-lg text-teal-700">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
                  1.190 Warga
                </div>
                <p className="text-[11px] text-emerald-700 font-medium">
                  ↑ 14% dari 5 Dusun di Desa Lasem
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1">
                <div className="flex items-center justify-between text-stone-500 text-xs font-medium">
                  <span>Peminjaman Aktif</span>
                  <div className="p-1.5 bg-amber-50 rounded-lg text-amber-700">
                    <BookMarked className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
                  {activeBorrows} Buku
                </div>
                <p className="text-[11px] text-stone-500">
                  Tingkat kembali tepat waktu: <strong className="text-emerald-700">97.8%</strong>
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1">
                <div className="flex items-center justify-between text-stone-500 text-xs font-medium">
                  <span>Alokasi Dana Desa Perpustakaan</span>
                  <div className="p-1.5 bg-blue-50 rounded-lg text-blue-700">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
                  Rp 18.500.000
                </div>
                <p className="text-[11px] text-stone-500">
                  Realisasi pengadaan: <span className="font-semibold text-stone-800">Rp 12.840.000</span>
                </p>
              </div>

            </div>

            {/* Visual Analytics 2-Column: Sebaran Dusun & Kategori */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              
              {/* Dusun Breakdown */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-stone-900 font-serif flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-700" />
                    <span>Sebaran Pembaca per Dusun (Desa Lasem Sidayu)</span>
                  </h4>
                  <span className="text-[11px] text-stone-500">Bulan September 2026</span>
                </div>

                <div className="space-y-3 text-xs">
                  {[
                    { dusun: 'Dusun Krajan', count: 345, percent: 85, badge: 'Teraktif' },
                    { dusun: 'Dusun Kauman (Pesantren & Madrasah)', count: 280, percent: 72, badge: 'Pendidikan' },
                    { dusun: 'Dusun Sedagaran (Sentra Usaha & UMKM)', count: 210, percent: 64, badge: 'Wirausaha' },
                    { dusun: 'Dusun Tambak Sari (Kawasan Petambak Bandeng)', count: 195, percent: 58, badge: 'Perikanan' },
                    { dusun: 'Dusun Sidomulyo', count: 160, percent: 49, badge: 'Petanian' },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-semibold text-stone-800 flex items-center gap-1.5">
                          <span>{item.dusun}</span>
                          <span className="text-[9px] px-1.5 py-0.2 bg-stone-100 text-stone-600 rounded">
                            {item.badge}
                          </span>
                        </span>
                        <span className="text-stone-500 font-mono font-medium">
                          {item.count} Warga ({item.percent}%)
                        </span>
                      </div>
                      <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-emerald-700 h-full rounded-full transition-all duration-500"
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Breakdown & Action Priority */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-stone-900 font-serif flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-700" />
                    <span>Minat Baca Buku Berdasarkan Kategori</span>
                  </h4>
                  <span className="text-[11px] text-stone-500">Persentase Unduh & Pinjam</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  {[
                    { cat: 'Pertanian & Tambak Pesisir', share: '38%', desc: 'Budidaya bandeng, udang vaname, hidroponik sayur pekarangan', color: 'bg-emerald-600' },
                    { cat: 'UMKM & Usaha Desa', share: '26%', desc: 'Buku kas warung, foto produk HP, olahan bandeng tanpa duri', color: 'bg-teal-600' },
                    { cat: 'Edukasi & Sekolah Dasar/SMP', share: '21%', desc: 'Buku tema kurikulum, sains cilik, kamus bahasa', color: 'bg-blue-600' },
                    { cat: 'Budaya & Sejarah Sidayu', share: '15%', desc: 'Babat Sidayu, cerita rakyat nusantara, kearifan santri', color: 'bg-amber-600' },
                  ].map((catItem, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <span className="font-bold text-stone-900 block truncate">{catItem.cat}</span>
                        <span className="text-[11px] text-stone-500 block truncate">{catItem.desc}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="font-mono font-bold text-xs text-stone-900">{catItem.share}</span>
                        <span className={`w-2.5 h-2.5 rounded-full ${catItem.color}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Quick Action Cards for Village Officials */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <h4 className="font-bold text-sm text-stone-900 font-serif">
                Aksi Cepat Pengurus & Perangkat Desa Hari Ini:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={handleOpenAddBook}
                  className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-left transition flex items-center gap-3 active:scale-95"
                >
                  <div className="p-2 bg-emerald-700 text-white rounded-lg">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-xs text-emerald-950 block">Tambah Buku Baru</strong>
                    <span className="text-[11px] text-emerald-800">Unggah PDF / daftarkan buku fisik</span>
                  </div>
                </button>

                <button
                  onClick={() => setAdminTab('requests')}
                  className="p-3.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-left transition flex items-center gap-3 active:scale-95"
                >
                  <div className="p-2 bg-amber-600 text-white rounded-lg">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-xs text-amber-950 block">Verifikasi Usulan Warga</strong>
                    <span className="text-[11px] text-amber-800">{pendingRequests} usulan menunggu review</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsAnnouncementModalOpen(true);
                  }}
                  className="p-3.5 rounded-xl border border-blue-300 bg-blue-50 hover:bg-blue-100 text-left transition flex items-center gap-3 active:scale-95"
                >
                  <div className="p-2 bg-blue-600 text-white rounded-lg">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-xs text-blue-950 block">Buat Agenda / Warta Desa</strong>
                    <span className="text-[11px] text-blue-800">Bedah buku & bimbel belajar</span>
                  </div>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================
            TAB 2: KATALOG & MANAJEMEN BUKU (CRUD)
           ======================================================== */}
        {adminTab === 'books' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            
            {/* Action Bar: Search, Category Filter, and Add Book Button */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              
              <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari judul buku, penulis, atau tagar..."
                    value={bookSearchQuery}
                    onChange={(e) => setBookSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-emerald-600 outline-none"
                  />
                </div>

                {/* Category Selector */}
                <select
                  value={bookCategoryFilter}
                  onChange={(e) => setBookCategoryFilter(e.target.value)}
                  className="px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-emerald-600 outline-none text-stone-700 font-medium"
                >
                  <option value="Semua">Semua Kategori ({books.length})</option>
                  <option value="Pertanian">Pertanian & Tambak</option>
                  <option value="UMKM">UMKM & Keterampilan</option>
                  <option value="Edukasi">Edukasi & Sekolah</option>
                  <option value="Budaya Desa">Budaya & Sejarah</option>
                  <option value="Fiksi & Populer">Fiksi & Populer</option>
                </select>
              </div>

              {/* Add Book Button */}
              <button
                onClick={handleOpenAddBook}
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Buku Desa</span>
              </button>

            </div>

            {/* Book Cards / Table for Mobile and Desktop */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-stone-200 flex items-center justify-between text-xs text-stone-500 font-medium">
                <span>Daftar Koleksi Terdaftar ({filteredBooks.length} buku)</span>
                <span>Perpustakaan Desa Lasem Sidayu</span>
              </div>

              <div className="divide-y divide-stone-100">
                {filteredBooks.map((book) => (
                  <div key={book.id} className="p-3.5 sm:p-4 hover:bg-stone-50/80 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-12 h-16 sm:w-14 sm:h-20 object-cover rounded-lg border border-stone-200 shadow-xs flex-shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold px-2 py-0.2 rounded-md bg-emerald-100 text-emerald-800">
                            {book.category}
                          </span>
                          <span className="text-[10px] text-stone-500 font-medium">
                            Format {book.format} • {book.fileSize}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            book.accessType === 'Akses Terbuka' ? 'bg-teal-50 text-teal-800 border border-teal-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            {book.accessType}
                          </span>
                        </div>

                        <h4 className="font-bold text-xs sm:text-sm text-stone-900 line-clamp-1">
                          {book.title}
                        </h4>

                        <p className="text-[11px] text-stone-600">
                          Penulis: <span className="font-semibold text-stone-800">{book.author}</span> • Penerbit: {book.publisher} ({book.year})
                        </p>

                        <div className="flex items-center gap-3 text-[11px] text-stone-500 pt-0.5">
                          <span>Stok Fisik: <strong className="text-emerald-700">{book.availableCopies}</strong>/{book.totalCopies} tersedia</span>
                          <span>Rating: ★ {book.rating} ({book.ratingCount})</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                      <button
                        onClick={() => handleOpenEditBook(book)}
                        className="p-2 text-stone-600 hover:text-emerald-800 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition active:scale-95"
                        title="Edit Data Buku"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Yakin ingin menghapus buku "${book.title}" dari katalog perpustakaan desa?`)) {
                            onDeleteBook(book.id);
                            showToast(`Buku "${book.title}" telah dihapus.`);
                          }
                        }}
                        className="p-2 text-stone-400 hover:text-rose-700 bg-stone-100 hover:bg-rose-50 rounded-xl text-xs font-semibold flex items-center gap-1 transition active:scale-95"
                        title="Hapus Buku"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Hapus</span>
                      </button>
                    </div>

                  </div>
                ))}

                {filteredBooks.length === 0 && (
                  <div className="p-8 text-center text-xs text-stone-500 space-y-2">
                    <p>Tidak ditemukan buku yang sesuai dengan pencarian atau filter.</p>
                    <button
                      onClick={() => {
                        setBookSearchQuery('');
                        setBookCategoryFilter('Semua');
                      }}
                      className="px-3 py-1.5 bg-stone-100 rounded-lg text-emerald-800 font-bold"
                    >
                      Reset Filter
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================
            TAB 3: SIRKULASI & PEMINJAMAN WARGA
           ======================================================== */}
        {adminTab === 'circulation' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            
            {/* Circulation Summary & Filter */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <h3 className="font-bold text-sm text-stone-900 font-serif">
                  Buku Registrasi Sirkulasi Warga Lasem Sidayu
                </h3>
                <p className="text-xs text-stone-500">
                  Verifikasi pengembalian, perpanjangan, dan pengiriman notifikasi pengingat via WhatsApp warga.
                </p>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-medium">
                <button
                  onClick={() => setCirculationFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    circulationFilter === 'all' ? 'bg-white text-stone-900 font-bold shadow-xs' : 'text-stone-600'
                  }`}
                >
                  Semua ({borrowRecords.length})
                </button>
                <button
                  onClick={() => setCirculationFilter('active')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    circulationFilter === 'active' ? 'bg-white text-emerald-800 font-bold shadow-xs' : 'text-stone-600'
                  }`}
                >
                  Aktif Pinjam ({activeBorrows})
                </button>
                <button
                  onClick={() => setCirculationFilter('returned')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    circulationFilter === 'returned' ? 'bg-white text-stone-900 font-bold shadow-xs' : 'text-stone-600'
                  }`}
                >
                  Sudah Kembali
                </button>
              </div>
            </div>

            {/* Circulation Records List */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs divide-y divide-stone-100 overflow-hidden">
              {filteredCirculations.map((record) => {
                const isOngoing = record.status === 'active' || record.status === 'extended';

                return (
                  <div key={record.id} className="p-4 hover:bg-stone-50 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    
                    <div className="flex items-start gap-3 min-w-0">
                      <img
                        src={record.bookCover}
                        alt={record.bookTitle}
                        className="w-12 h-16 rounded-lg object-cover border border-stone-200 shadow-xs flex-shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            record.status === 'active' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : record.status === 'extended' 
                              ? 'bg-amber-100 text-amber-900' 
                              : 'bg-stone-100 text-stone-600'
                          }`}>
                            {record.status === 'active' ? 'Sedang Dipinjam' : record.status === 'extended' ? 'Telah Diperpanjang' : 'Selesai Dikembalikan'}
                          </span>
                          <span className="text-[11px] text-stone-400">ID: {record.id}</span>
                        </div>

                        <h4 className="font-bold text-xs sm:text-sm text-stone-900 line-clamp-1">
                          {record.bookTitle}
                        </h4>
                        <p className="text-[11px] text-stone-600">
                          Penulis: {record.bookAuthor} • Format: {record.format}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-stone-500 pt-0.5">
                          <span>Dipinjam: <strong>{record.borrowDate}</strong></span>
                          <span>Jatuh Tempo: <strong className={isOngoing ? 'text-amber-800 font-bold' : 'text-stone-700'}>{record.dueDate}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Action Controls for Librarian/Official */}
                    <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                      {isOngoing && (
                        <>
                          <button
                            onClick={() => {
                              onReturnBorrow(record.id);
                              showToast(`Peminjaman "${record.bookTitle}" telah diverifikasi kembali.`);
                            }}
                            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 active:scale-95 shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Verifikasi Kembali</span>
                          </button>

                          {record.canExtend && (
                            <button
                              onClick={() => {
                                onExtendBorrow(record.id);
                                showToast(`Peminjaman buku telah diperpanjang 7 hari.`);
                              }}
                              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition flex items-center gap-1 active:scale-95"
                            >
                              <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
                              <span>Perpanjang</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleSendAdminWhatsApp(record)}
                            className="p-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] rounded-xl text-xs font-semibold transition flex items-center gap-1 active:scale-95"
                            title="Kirim Pesan Pengingat WhatsApp Resmi Desa"
                          >
                            <MessageCircle className="w-4 h-4 fill-current" />
                            <span className="hidden md:inline">Ingatkan WA</span>
                          </button>
                        </>
                      )}

                      {record.status === 'returned' && (
                        <span className="px-3 py-1 rounded-lg bg-stone-100 text-stone-500 text-xs font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Telah Di Rak Desa</span>
                        </span>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ========================================================
            TAB 4: USULAN BUKU DARI WARGA DESA
           ======================================================== */}
        {adminTab === 'requests' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <h3 className="font-bold text-sm text-stone-900 font-serif">
                  Aspirasi & Usulan Pengadaan Buku Warga Lasem Sidayu
                </h3>
                <p className="text-xs text-stone-500">
                  Diusulkan oleh kelompok petambak, poktan tani, ibu PKK, guru madrasah, dan pemuda desa untuk dianggarkan pada APBDes.
                </p>
              </div>

              <span className="px-3 py-1 bg-amber-100 text-amber-900 font-bold rounded-xl text-xs">
                {pendingRequests} Menunggu Verifikasi
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookRequests.map((req) => (
                <div key={req.id} className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3 flex flex-col justify-between">
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                        {req.category}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        req.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.status === 'fulfilled'
                          ? 'bg-blue-100 text-blue-800'
                          : req.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {req.status === 'approved' ? '✓ Disetujui Masuk APBDes' : req.status === 'fulfilled' ? '★ Sudah Tersedia' : req.status === 'rejected' ? '✕ Ditolak' : '⏳ Menunggu Telaah'}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-stone-900 font-serif leading-snug">
                      {req.title}
                    </h4>

                    {req.author && (
                      <p className="text-xs text-stone-600">
                        Pengarang: <span className="font-medium text-stone-800">{req.author}</span>
                      </p>
                    )}

                    <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-700 leading-relaxed border border-stone-100">
                      <strong className="text-stone-900 block mb-0.5">Alasan Kebutuhan:</strong>
                      {req.reason}
                    </div>

                    <div className="text-[11px] text-stone-500 space-y-0.5 pt-1">
                      <div>Pengusul: <strong className="text-stone-800">{req.requesterName}</strong> ({req.requesterDusun})</div>
                      <div>Tanggal Masuk: {req.requestDate} • Estimasi Harga: <strong className="text-emerald-800">{req.budgetEstimated || '-'}</strong></div>
                      {req.notes && (
                        <div className="text-amber-800 italic bg-amber-50/70 p-2 rounded-lg mt-1 border border-amber-200/60">
                          Catatan Perangkat: {req.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Decision Buttons for Officials */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2 text-xs">
                    {req.status === 'pending' && (
                      <>
                        <button
                          onClick={() => {
                            onUpdateRequestStatus(req.id, 'approved', 'Disetujui Sekdes untuk dialokasikan pada belanja buku perpustakaan APBDes.');
                            showToast(`Usulan "${req.title}" disetujui untuk pengadaan.`);
                          }}
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center gap-1 active:scale-95 transition"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Setujui APBDes</span>
                        </button>

                        <button
                          onClick={() => {
                            onUpdateRequestStatus(req.id, 'rejected', 'Judul telah memiliki padanan serupa di rak baca desa.');
                            showToast(`Usulan telah ditolak dengan catatan.`);
                          }}
                          className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl flex items-center gap-1 active:scale-95 transition"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Tolak</span>
                        </button>
                      </>
                    )}

                    {req.status === 'approved' && (
                      <button
                        onClick={() => {
                          onUpdateRequestStatus(req.id, 'fulfilled', 'Buku telah dibeli dan diunggah ke katalog perpustakaan.');
                          showToast(`Status diperbarui: Buku telah tersedia.`);
                        }}
                        className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl flex items-center gap-1 active:scale-95 transition"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Tandai Sudah Tersedia di Rak</span>
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================================
            TAB 5: WARTA & AGENDA LITERASI DESA
           ======================================================== */}
        {adminTab === 'announcements' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <h3 className="font-bold text-sm text-stone-900 font-serif">
                  Publikasi Warta & Kegiatan Perpustakaan Lasem Sidayu
                </h3>
                <p className="text-xs text-stone-500">
                  Pengumuman akan langsung tampil di beranda aplikasi seluruh warga desa.
                </p>
              </div>

              <button
                onClick={() => setIsAnnouncementModalOpen(true)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Buat Pengumuman Baru</span>
              </button>
            </div>

            <div className="space-y-3">
              {announcements.map((ann) => (
                <div key={ann.id} className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900">
                        {ann.badge}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {ann.category}
                      </span>
                      <span className="text-[11px] text-stone-400">• {ann.date}</span>
                    </div>

                    <h4 className="font-bold text-sm sm:text-base text-stone-900 font-serif">
                      {ann.title}
                    </h4>

                    <p className="text-xs text-stone-600 leading-relaxed max-w-3xl">
                      {ann.summary}
                    </p>

                    <span className="text-[11px] text-stone-400 block pt-1">
                      Penerbit: {ann.author}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm(`Hapus pengumuman "${ann.title}"?`)) {
                        onDeleteAnnouncement(ann.id);
                        showToast('Pengumuman berhasil dihapus.');
                      }
                    }}
                    className="p-2 text-stone-400 hover:text-rose-700 bg-stone-100 hover:bg-rose-50 rounded-xl text-xs font-semibold flex items-center gap-1 self-end sm:self-center transition"
                    title="Hapus Pengumuman"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================================
            TAB 6: CETAK LAPORAN MUSDES RESMI
           ======================================================== */}
        {adminTab === 'report' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-stone-900 font-serif">
                  Pratinjau Dokumen Berita Acara & Laporan Literasi Desa
                </h3>
                <p className="text-xs text-stone-500">
                  Dapat dicetak untuk lampiran Musrenbangdes / LPPD Desa Lasem Sidayu.
                </p>
              </div>

              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition active:scale-95"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Cetak / Simpan PDF</span>
              </button>
            </div>

            {/* Formal Report Sheet with Official Letterhead */}
            <div className="bg-white p-6 sm:p-10 rounded-2xl border-2 border-stone-300 shadow-lg text-stone-900 space-y-6 print:m-0 print:border-none print:shadow-none">
              
              {/* Kop Surat Pemerintahan Desa Lasem Sidayu */}
              <div className="border-b-4 border-double border-stone-900 pb-4 text-center space-y-1">
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-stone-700">
                  PEMERINTAH KABUPATEN GRESIK
                </h4>
                <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-stone-800">
                  KECAMATAN SIDAYU - KANTOR KEPALA DESA LASEM
                </h3>
                <h2 className="text-base sm:text-xl font-extrabold uppercase text-emerald-950 font-serif">
                  PENGELOLA PERPUSTAKAAN DESA DIGITAL "SIMPUL LITERASI LASEM"
                </h2>
                <p className="text-[11px] text-stone-500 italic">
                  Jl. Raya Lasem Sidayu No. 12, Kode Pos 61153, Kabupaten Gresik, Jawa Timur
                </p>
              </div>

              {/* Title of Document */}
              <div className="text-center space-y-1 pt-2">
                <h3 className="font-bold text-sm sm:text-base underline uppercase tracking-wide">
                  LAPORAN PERKEMBANGAN LITERASI & SIRKULASI KOLEKSI DESA
                </h3>
                <p className="text-xs text-stone-600">
                  Nomor: 041/PERPUS-LSM/IX/2026 • Periode: Triwulan III Tahun Anggaran 2026
                </p>
              </div>

              {/* Executive Summary Table */}
              <div className="space-y-3 text-xs sm:text-sm">
                <p className="leading-relaxed">
                  Berdasarkan sistem pendataan sirkulasi digital Perpustakaan Desa Lasem Sidayu, dilaporkan rekapitulasi data sebagai berikut:
                </p>

                <div className="border border-stone-300 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-100 border-b border-stone-300 text-stone-700">
                      <tr>
                        <th className="p-2.5 font-bold">No.</th>
                        <th className="p-2.5 font-bold">Indikator Kinerja Literasi</th>
                        <th className="p-2.5 font-bold">Realisasi Capaian</th>
                        <th className="p-2.5 font-bold">Keterangan / Sumber</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 text-stone-800">
                      <tr>
                        <td className="p-2.5 font-mono">1</td>
                        <td className="p-2.5 font-medium">Jumlah Judul Buku Tersedia</td>
                        <td className="p-2.5 font-bold text-emerald-800">{totalBooks} Judul Buku</td>
                        <td className="p-2.5 text-stone-500">Katalog Fisik & e-Book Luring</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-mono">2</td>
                        <td className="p-2.5 font-medium">Total Eksemplar Fisik & Digital</td>
                        <td className="p-2.5 font-bold text-emerald-800">{totalPhysicalCopies} Eksemplar</td>
                        <td className="p-2.5 text-stone-500">Ruang Baca & Server Desa</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-mono">3</td>
                        <td className="p-2.5 font-medium">Pemustaka / Warga Terdaftar</td>
                        <td className="p-2.5 font-bold text-emerald-800">1.190 Jiwa</td>
                        <td className="p-2.5 text-stone-500">5 Dusun Wilayah Desa Lasem</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-mono">4</td>
                        <td className="p-2.5 font-medium">Sirkulasi Pinjaman Berjalan</td>
                        <td className="p-2.5 font-bold text-emerald-800">{activeBorrows} Peminjaman</td>
                        <td className="p-2.5 text-stone-500">Tingkat Kembali Tepat Waktu: 97.8%</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-mono">5</td>
                        <td className="p-2.5 font-medium">Realisasi Dana Desa Bidang Literasi</td>
                        <td className="p-2.5 font-bold text-emerald-800">Rp 12.840.000</td>
                        <td className="p-2.5 text-stone-500">Dari Pagu APBDes Rp 18.500.000 (69.4%)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="leading-relaxed text-xs pt-2">
                  Demikian laporan ini dibuat secara transparan dan akuntabel sebagai wujud komitmen Pemerintah Desa Lasem Sidayu dalam mencerdaskan kehidupan masyarakat serta memperkuat ketahanan ekonomi pesisir dan pertanian desa.
                </p>
              </div>

              {/* Signatures */}
              <div className="pt-8 grid grid-cols-2 text-center text-xs sm:text-sm">
                <div className="space-y-16">
                  <div>
                    <span className="block text-stone-500">Mengetahui,</span>
                    <strong className="block text-stone-900 font-serif">Kepala Desa Lasem</strong>
                  </div>
                  <div>
                    <strong className="block underline text-stone-900 font-bold">H. M. SYAMSUL HADI, S.E.</strong>
                    <span className="text-stone-500 block text-xs">Pemerintah Desa Lasem Sidayu</span>
                  </div>
                </div>

                <div className="space-y-16">
                  <div>
                    <span className="block text-stone-500">Lasem Sidayu, 19 September 2026</span>
                    <strong className="block text-stone-900 font-serif">Pengurus Perpustakaan Desa</strong>
                  </div>
                  <div>
                    <strong className="block underline text-stone-900 font-bold">H. ABDUL MALIK, S.Sos</strong>
                    <span className="text-stone-500 block text-xs">Sekretaris Desa / Koordinator Perpusdes</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* ========================================================
          MODAL: TAMBAH / EDIT BUKU DESA
         ======================================================== */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            
            <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300">
                  {editingBookId ? 'Perbarui Data' : 'Pendaftaran Koleksi Baru'}
                </span>
                <h3 className="font-bold text-base sm:text-lg font-serif">
                  {editingBookId ? 'Edit Buku Perpustakaan' : 'Tambah Buku Baru ke Katalog'}
                </h3>
              </div>
              <button onClick={() => setIsBookModalOpen(false)} className="p-1 text-emerald-200 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBook} className="p-5 overflow-y-auto space-y-3.5 text-xs">
              
              <div className="space-y-1">
                <label className="font-bold text-stone-700">Judul Buku *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Tata Kelola Tambak Udang & Bandeng Desa Lasem"
                  value={bookFormData.title}
                  onChange={(e) => setBookFormData({ ...bookFormData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-1 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Penulis / Penyusun *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Tim Balai PPL Sidayu"
                    value={bookFormData.author}
                    onChange={(e) => setBookFormData({ ...bookFormData, author: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-1 focus:ring-emerald-600 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Kategori</label>
                  <select
                    value={bookFormData.category}
                    onChange={(e) => setBookFormData({ ...bookFormData, category: e.target.value as BookCategory })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-1 focus:ring-emerald-600 outline-none"
                  >
                    <option value="Pertanian">Pertanian & Tambak Pesisir</option>
                    <option value="UMKM">UMKM & Keterampilan Wirausaha</option>
                    <option value="Edukasi">Edukasi & Sekolah Dasar/SMP</option>
                    <option value="Budaya Desa">Budaya & Sejarah Sidayu</option>
                    <option value="Fiksi & Populer">Fiksi & Populer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Format Buku</label>
                  <select
                    value={bookFormData.format}
                    onChange={(e) => setBookFormData({ ...bookFormData, format: e.target.value as any })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-1 focus:ring-emerald-600 outline-none"
                  >
                    <option value="PDF">PDF (Digital Luring)</option>
                    <option value="EPUB">EPUB (e-Reader)</option>
                    <option value="Buku Fisik">Buku Fisik (Rak Desa)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Hak Akses</label>
                  <select
                    value={bookFormData.accessType}
                    onChange={(e) => setBookFormData({ ...bookFormData, accessType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-1 focus:ring-emerald-600 outline-none"
                  >
                    <option value="Akses Terbuka">Akses Terbuka (Bebas Baca)</option>
                    <option value="Lisensi Terbatas">Lisensi Terbatas (Wajib Pinjam)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Ukuran File / Tebal</label>
                  <input
                    type="text"
                    value={bookFormData.fileSize}
                    onChange={(e) => setBookFormData({ ...bookFormData, fileSize: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-1 focus:ring-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Jumlah Salinan Total</label>
                  <input
                    type="number"
                    min={1}
                    value={bookFormData.totalCopies}
                    onChange={(e) => setBookFormData({ ...bookFormData, totalCopies: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-1 focus:ring-emerald-600 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Salinan Tersedia</label>
                  <input
                    type="number"
                    min={0}
                    value={bookFormData.availableCopies}
                    onChange={(e) => setBookFormData({ ...bookFormData, availableCopies: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-1 focus:ring-emerald-600 outline-none"
                  />
                </div>

                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <label className="font-bold text-stone-700">Tahun Terbit</label>
                  <input
                    type="number"
                    value={bookFormData.year}
                    onChange={(e) => setBookFormData({ ...bookFormData, year: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-1 focus:ring-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Sinopsis & Keterangan Buku</label>
                <textarea
                  rows={3}
                  placeholder="Tuliskan ringkasan isi buku dan manfaatnya bagi warga..."
                  value={bookFormData.description}
                  onChange={(e) => setBookFormData({ ...bookFormData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-1 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">URL Gambar Sampul (Cover Image)</label>
                <input
                  type="text"
                  value={bookFormData.coverImage}
                  onChange={(e) => setBookFormData({ ...bookFormData, coverImage: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-1 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="px-4 py-2 font-semibold text-stone-600 hover:text-stone-900"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-sm transition active:scale-95"
                >
                  {editingBookId ? 'Simpan Perubahan' : 'Daftarkan Buku'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: TAMBAH PENGUMUMAN / WARTA DESA
         ======================================================== */}
      {isAnnouncementModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between">
              <h3 className="font-bold text-base font-serif">
                Buat Warta / Agenda Desa Lasem
              </h3>
              <button onClick={() => setIsAnnouncementModalOpen(false)} className="p-1 text-emerald-200 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAnnouncement} className="p-5 space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-stone-700">Judul Kegiatan / Warta *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bedah Buku Budidaya Tambak Bandeng Pesisir Lasem"
                  value={announcementFormData.title}
                  onChange={(e) => setAnnouncementFormData({ ...announcementFormData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Kategori</label>
                  <select
                    value={announcementFormData.category}
                    onChange={(e) => setAnnouncementFormData({ ...announcementFormData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl outline-none focus:ring-1 focus:ring-emerald-600"
                  >
                    <option value="Pemerintahan Desa">Pemerintahan Desa</option>
                    <option value="Pelatihan Warga">Pelatihan Warga</option>
                    <option value="Layanan Desa">Layanan Desa</option>
                    <option value="Koleksi Baru">Koleksi Baru</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Lencana (Badge)</label>
                  <select
                    value={announcementFormData.badge}
                    onChange={(e) => setAnnouncementFormData({ ...announcementFormData, badge: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl outline-none focus:ring-1 focus:ring-emerald-600"
                  >
                    <option value="Penting">Penting</option>
                    <option value="Agenda">Agenda</option>
                    <option value="Layanan">Layanan</option>
                    <option value="Koleksi">Koleksi</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Ringkasan Isi Warta *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tuliskan waktu, tempat, dan detail kegiatan untuk warga..."
                  value={announcementFormData.summary}
                  onChange={(e) => setAnnouncementFormData({ ...announcementFormData, summary: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAnnouncementModalOpen(false)}
                  className="px-4 py-2 font-semibold text-stone-600 hover:text-stone-900"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-sm transition active:scale-95"
                >
                  Publikasikan ke Warga
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
