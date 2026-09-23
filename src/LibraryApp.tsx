import { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Book, BookCategory, BorrowRecord, DownloadItem, Announcement, BookReview, BookRequestItem } from './types';


import { BottomNav } from './components/BottomNav';
import { TargetHomeTab } from './components/TargetHomeTab';
import { CollectionTab } from './components/CollectionTab';
import { BorrowingTab } from './components/BorrowingTab';
import { DownloadsTab } from './components/DownloadsTab';
import { ProfileTab } from './components/ProfileTab';

import { BookDetailModal } from './components/BookDetailModal';
import { ReaderModal } from './components/ReaderModal';
import { LoginModal } from './components/LoginModal';
import { BookRequestModal } from './components/BookRequestModal';
import { WhatsAppModal } from './components/WhatsAppModal';
import { CommunityTab } from './components/CommunityTab';
import { AppSidebar } from './components/AppSidebar';
import { useAuth } from './features/auth/AuthContext';
import * as db from './lib/db';
import { hasSupabase } from './lib/supabase';
import {
  getDownloadedBookIds,
  cacheBookFile,
  saveDownloadedBook,
  removeDownloadedBook,
  removeCachedBookFile,
} from './lib/offline';

const bookSlug = (title: string) => title.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function LibraryApp() {
  const { user, profile, isAdmin, logout, updateProfile } = useAuth();
  const { username } = useParams<{ username: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  // App state
  const [books, setBooks] = useState<Book[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [bookRequests, setBookRequests] = useState<BookRequestItem[]>([]);
  const [villageName, setVillageName] = useState<string>('Lasem Sidayu');
  const suffix = location.pathname.split('/').slice(3);
  const currentTab = ({ koleksi: 'collection', peminjaman: 'borrowing', unduhan: 'downloads', profil: 'profile', komunitas: 'community' } as Record<string, string>)[suffix[0]] ?? 'home';
  const [loadingData, setLoadingData] = useState(true);
  const [dataError, setDataError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<BookCategory | 'Semua'>('Semua');


  // User Profile (identitas kartu anggota dari Supabase profile)
  const userName = profile?.nama_lengkap ?? 'Warga Desa';
  const userPhone = profile?.nomor_wa ?? '-';
  const userAddress = profile?.alamat ?? '-';
  const memberId = profile?.id.slice(0, 8).toUpperCase() ?? 'LIB-LSM-0000';
  const [fontSizePreference, setFontSizePreference] = useState<'normal' | 'large' | 'extralarge'>('normal');
  const [lowDataMode, setLowDataMode] = useState(false);

  // Borrow & download records
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>([]);
  const [downloadItems, setDownloadItems] = useState<DownloadItem[]>([]);
  const [followedBookIds, setFollowedBookIds] = useState<string[]>([]);

  // Modal States
  const selectedBookForDetail = suffix[0] === 'koleksi' && suffix[1]
    ? books.find(b => bookSlug(b.title) === suffix[1] || b.id === suffix[1]) ?? null : null;
  const [selectedBookForReader, setSelectedBookForReader] = useState<Book | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRequestBookModalOpen, setIsRequestBookModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [whatsAppInitialMessage, setWhatsAppInitialMessage] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user && profile && (!profile.nama_lengkap || !profile.nomor_wa || !profile.alamat)) setIsLoginModalOpen(true);
  }, [user, profile]);
  useEffect(() => { if (user) void db.getFollowedBookIds(user.id).then(setFollowedBookIds).catch(() => undefined); }, [user]);
  const toggleFollow = async (book: Book) => { if (!user) return; const follow = !followedBookIds.includes(book.id); try { await db.setBookFollow(user.id, book.id, follow); setFollowedBookIds((ids) => follow ? [...ids, book.id] : ids.filter((id) => id !== book.id)); } catch (e) { showToast(e instanceof Error ? e.message : 'Gagal mengubah mengikuti.'); } };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleTabChange = (tab: string) => {
    const paths: Record<string, string> = { home: '', collection: 'koleksi', borrowing: 'peminjaman', downloads: 'unduhan', profile: 'profil', community: 'komunitas', admin: 'admin', 'admin-settings': 'pengaturan-admin', 'admin-books': 'katalog-buku/upload-buku', 'admin-articles': 'unggah-artikel', 'admin-import': 'katalog-buku/unggah-masal' };
    navigate(`/app/${username}/${paths[tab] ?? ''}`);
  };
  const openBookDetail = (book: Book) => {
    const duplicate = books.filter(b => bookSlug(b.title) === bookSlug(book.title)).length > 1;
    navigate(`/app/${username}/koleksi/${duplicate ? book.id : bookSlug(book.title)}`);
  };

  // Derived counts
  const activeBorrowCount = borrowRecords.filter((r) => r.status === 'active' || r.status === 'extended').length;
  const downloadCount = downloadItems.filter((d) => d.isCompleted).length;
  const downloadedBookIds = downloadItems.filter((d) => d.isCompleted).map((d) => d.bookId);
  const borrowedBookIds = borrowRecords.filter((r) => r.status === 'active' || r.status === 'extended').map((r) => r.bookId);

  // ----------------------------------------------------------
  // PHASE 2: Muat buku + warta + usulan dari database Supabase
  // ----------------------------------------------------------
  const loadAll = useCallback(async () => {
    setLoadingData(true); setDataError('');
    try {
    const [booksRes, ancRes, reqRes] = await Promise.all([
      db.fetchBooks(),
      db.fetchAnnouncements(true),
      db.fetchBookRequests(),
    ]);
    setBooks(booksRes.data);
    setAnnouncements(ancRes.data);
    setBookRequests(reqRes.data);
    } catch (error) { setDataError(error instanceof Error ? error.message : 'Gagal memuat data.'); }
    finally { setLoadingData(false); }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // ----------------------------------------------------------
  // PHASE 3: Muat peminjaman nyata milik anggota
  // ----------------------------------------------------------
  const loadBorrowings = useCallback(async () => {
    if (!user) return;
    if (!hasSupabase || !profile) {
      setBorrowRecords([]);
      return;
    }
    const recs = await db.fetchBorrowings(profile.id);
    setBorrowRecords(recs);
  }, [user, profile, books]);

  useEffect(() => {
    loadBorrowings();
  }, [loadBorrowings]);

  // ----------------------------------------------------------
  // PHASE 4: Rak offline (localStorage) saat aplikasi dibuka
  // ----------------------------------------------------------
  useEffect(() => {
    const ids = getDownloadedBookIds();
    if (books.length > 0) {
      const items: DownloadItem[] = ids
        .map((id) => books.find((b) => b.id === id))
        .filter((b): b is Book => Boolean(b))
        .map((b) => ({
          bookId: b.id,
          title: b.title,
          author: b.author,
          coverImage: b.coverImage,
          format: b.format,
          fileSize: b.fileSize,
          downloadDate: 'Tersimpan di HP ini',
          progress: 100,
          isCompleted: true,
        }));
      setDownloadItems(items);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [books.length]);

  // Handle Download Book (offline save - Phase 4)
  const handleDownloadBook = async (book: Book) => {
    if (book.accessType === 'Lisensi Terbatas' && !borrowedBookIds.includes(book.id)) { showToast('Pinjam buku terlebih dahulu.'); return; }
    try {
      if (!book.fileUrl && !book.sampleChapters.length) throw new Error('Konten digital belum tersedia.');
      if (book.fileUrl) {
        const response = await fetch(book.fileUrl);
        if (!response.ok) throw new Error('File gagal diunduh.');
        await cacheBookFile(book.id, response);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob); const link = document.createElement('a');
        link.href = url; link.download = book.title + '.' + book.format.toLowerCase(); link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } else saveDownloadedBook(book);
      setDownloadItems(prev => [{ bookId: book.id, title: book.title, author: book.author, coverImage: book.coverImage, format: book.format, fileSize: book.fileSize, downloadDate: new Date().toLocaleDateString('id-ID'), progress: 100, isCompleted: true }, ...prev.filter(d => d.bookId !== book.id)]);
      showToast(book.fileUrl ? 'File berhasil diunduh ke perangkat.' : 'Konten tersedia tersimpan di perangkat.');
    } catch (error) { showToast((error as Error).message); }
  };

  // Handle Delete Download
  const handleDeleteDownload = (bookId: string) => {
    removeDownloadedBook(bookId);
    void removeCachedBookFile(bookId);
    setDownloadItems((prev) => prev.filter((d) => d.bookId !== bookId));
  };

  // ----------------------------------------------------------
  // PHASE 3: Peminjaman nyata via tabel borrowings
  // ----------------------------------------------------------
  const handleBorrowBook = async (book: Book) => {
    const isAlreadyBorrowed = borrowedBookIds.includes(book.id);
    if (isAlreadyBorrowed) {
      handleTabChange('borrowing');
      return;
    }

    if (!hasSupabase || !profile) {
      showToast('Mode demo: peminjaman butuh koneksi database & login anggota.');
      return;
    }

    if (book.availableCopies <= 0) {
      showToast('Maaf, stok buku ini sedang habis dipinjam. Coba lagi nanti.');
      return;
    }

    const res = await db.createBorrowing(book.id, profile.id);
    if (!res.ok) {
      showToast(res.error ?? 'Gagal mengajukan peminjaman.');
      return;
    }

    showToast(`Peminjaman "${book.title}" berhasil diajukan! Jatuh tempo 14 hari.`);
    await loadBorrowings();
    await loadAll();
    handleTabChange('borrowing');
  };

  const handleExtendBorrow = async (recordId: string) => {
    const ok = await db.extendBorrowing(recordId);
    if (ok) {
      showToast('Masa pinjam diperpanjang 7 hari.');
      await loadBorrowings();
    } else {
      showToast('Gagal memperpanjang. Coba lagi.');
    }
  };

  const handleReturnBorrow = async (recordId: string) => {
    const ok = await db.returnBorrowing(recordId);
    if (ok) {
      showToast('Buku telah dikembalikan. Terima kasih!');
      await loadBorrowings();
      await loadAll();
    } else {
      showToast('Gagal memproses pengembalian.');
    }
  };

  // ----------------------------------------------------------
  // PHASE 2: Ulasan tersimpan ke tabel reviews
  // ----------------------------------------------------------
  const handleAddReview = async (bookId: string, reviewData: Omit<BookReview, 'id' | 'date'>) => {
    if (!user) {
      showToast('Login dulu untuk menulis ulasan.');
      return;
    }
    const saved = await db.insertReview(bookId, user.id, reviewData);
    if (!saved) {
      showToast('Gagal mengirim ulasan. Pastikan koneksi aktif.');
      return;
    }
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id !== bookId) return b;
        const updatedReviews = [saved, ...b.reviews];
        const avg = (updatedReviews.reduce((a, r) => a + r.rating, 0) / updatedReviews.length).toFixed(1);
        return { ...b, reviews: updatedReviews, rating: parseFloat(avg), ratingCount: b.ratingCount + 1 };
      })
    );
    showToast('Ulasan berhasil dikirim!');
  };

  // Muat ulasan saat detail buku dibuka
  useEffect(() => {
    if (!selectedBookForDetail || !hasSupabase) return;
    db.fetchReviews(selectedBookForDetail.id).then((revs) => {
      if (revs.length > 0) {
        setBooks((prev) =>
          prev.map((b) =>
            b.id === selectedBookForDetail.id ? { ...b, reviews: revs } : b
          )
        );
      }
    });
  }, [selectedBookForDetail?.id]);

  // ----------------------------------------------------------
  // WhatsApp helpers
  // ----------------------------------------------------------
  const handleOpenWhatsAppGeneral = () => {
    setWhatsAppInitialMessage(`Halo Pustakawan Perpustakaan Desa ${villageName}, saya ${userName}. Saya ingin berkonsultasi mengenai buku bacaan.`);
    setIsWhatsAppModalOpen(true);
  };

  const handleWhatsAppReminder = (record: BorrowRecord) => {
    setWhatsAppInitialMessage(`Halo Pustakawan Desa ${villageName}, konfirmasi pengingat untuk buku "${record.bookTitle}" jatuh tempo ${record.dueDate}. Terima kasih.`);
    setIsWhatsAppModalOpen(true);
  };

  // ----------------------------------------------------------
  const handleCreateBookRequest = async (req: {
    title: string;
    author: string;
    category: BookCategory;
    reason: string;
    requesterName: string;
    requesterPhone?: string;
  }) => {
    if (hasSupabase && user) {
      const saved = await db.insertBookRequest({
        ...req,
        requesterDusun: profile?.alamat ?? 'Lasem Sidayu',
      });
      if (saved) {
        setBookRequests((prev) => [saved, ...prev]);
        showToast('Usulan buku terkirim ke pengurus desa.');
        return;
      }
      showToast('Gagal mengirim usulan (cek koneksi).');
      return;
    }
    showToast('Koneksi server tidak tersedia.');

  };

  // Helper for font size class
  const getFontSizeClass = () => {
    switch (fontSizePreference) {
      case 'large':
        return 'text-lg';
      case 'extralarge':
        return 'text-xl';
      default:
        return 'text-base';
    }
  };

  // Loading state awal
  if (loadingData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[#F8FAF8] text-stone-500 text-sm">
        <div className="w-8 h-8 rounded-full border-[3px] border-emerald-600 border-t-transparent animate-spin" />
        Memuat katalog perpustakaan...
      </div>
    );
  }

  if (dataError) return <div className="p-8" role="alert"><h1>Data belum dapat dimuat</h1><p>{dataError}</p><button onClick={loadAll}>Coba lagi</button></div>;

  // Main interactive UI content
  const appContent = (
    <div className={`app-shell min-h-screen flex flex-col bg-[#F8FAF8] text-stone-900 ${getFontSizeClass()}`}>

      {/* Data mode banner */}
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-stone-700 flex items-center gap-2 text-xs sm:text-sm animate-in fade-in slide-in-from-top-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Dynamic Main View */}
      <AppSidebar currentTab={currentTab} onNavigate={handleTabChange} role={profile?.role} userName={userName} onLogout={logout} />
      <main className="flex-1 min-w-0 lg:ml-64">
        {suffix[0] === 'koleksi' && suffix[1] && !selectedBookForDetail && <p role="alert" className="p-6">Buku tidak ditemukan. Pilih buku dari koleksi.</p>}
        {currentTab === 'home' && (
          <TargetHomeTab
            books={books}
            announcements={announcements}
            onSelectBook={openBookDetail}
            onReadBook={(b) => setSelectedBookForReader(b)}
            onSearchFocus={() => handleTabChange('collection')}
            onNavigate={handleTabChange}
            onLogout={logout}
          />
        )}

        {currentTab === 'collection' && (
          <CollectionTab
            books={books}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onSelectBook={openBookDetail}
            onBorrowBook={handleBorrowBook}
            onDownloadBook={handleDownloadBook}
            onReadBook={(b) => setSelectedBookForReader(b)}
            downloadedBookIds={downloadedBookIds}
            borrowedBookIds={borrowedBookIds}
          />
        )}

        {currentTab === 'borrowing' && (
          <BorrowingTab
            borrowRecords={borrowRecords}
            onExtendBorrow={handleExtendBorrow}
            onReturnBorrow={handleReturnBorrow}
            onReadBook={(bookId) => {
              const found = books.find((b) => b.id === bookId);
              if (found) setSelectedBookForReader(found);
            }}
            onBrowseCollection={() => handleTabChange('collection')}
            onWhatsAppReminder={handleWhatsAppReminder}
          />
        )}

        {currentTab === 'downloads' && (
          <DownloadsTab
            downloads={downloadItems}
            onReadBook={(bookId) => {
              const found = books.find((b) => b.id === bookId);
              if (found) setSelectedBookForReader(found);
            }}
            onDeleteDownload={handleDeleteDownload}
            onBrowseBooks={() => handleTabChange('collection')}
          />
        )}

        {currentTab === 'community' && (
          <CommunityTab
            userName={userName}
            userId={user?.id ?? ''}
            announcements={announcements}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileTab
            villageName={villageName}
            userName={userName}
            userPhone={userPhone}
            userAddress={userAddress}
            memberId={memberId}
            fontSizePreference={fontSizePreference}
            onFontSizeChange={setFontSizePreference}
            lowDataMode={lowDataMode}
            onToggleLowDataMode={() => setLowDataMode(!lowDataMode)}
            onRequestBookClick={() => setIsRequestBookModalOpen(true)}
            onWhatsAppClick={handleOpenWhatsAppGeneral}
            onEditProfileClick={() => setIsLoginModalOpen(true)}
            onOpenAdminMode={isAdmin ? () => handleTabChange('admin') : undefined}
            profileRole={profile?.role}
            onLogout={logout}
          />
        )}


      </main>

      {/* Mobile Sticky Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={handleTabChange}
        activeBorrowCount={activeBorrowCount}
        downloadCount={downloadCount}
        pendingRequestsCount={isAdmin ? bookRequests.filter((r) => r.status === 'pending').length : 0}
        isAdmin={isAdmin}
      />

      {/* Modals */}
      <BookDetailModal
        book={selectedBookForDetail}
        onClose={() => navigate(`/app/${username}/koleksi`)}
        onRead={(b) => setSelectedBookForReader(b)}
        onDownload={handleDownloadBook}
        onBorrow={handleBorrowBook}
        isDownloaded={selectedBookForDetail ? downloadedBookIds.includes(selectedBookForDetail.id) : false}
        isBorrowed={selectedBookForDetail ? borrowedBookIds.includes(selectedBookForDetail.id) : false}
        onAddReview={handleAddReview}
        isFollowed={selectedBookForDetail ? followedBookIds.includes(selectedBookForDetail.id) : false}
        onToggleFollow={() => { if (selectedBookForDetail) void toggleFollow(selectedBookForDetail); }}
      />

      <ReaderModal
        book={selectedBookForReader}
        onClose={() => setSelectedBookForReader(null)}
        onProgress={(chapter, progress) => { if (user && selectedBookForReader) void db.saveReadingProgress(user.id, selectedBookForReader.id, chapter, progress); }}
        onDownload={handleDownloadBook}
        isDownloaded={selectedBookForReader ? downloadedBookIds.includes(selectedBookForReader.id) : false}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        villageName={villageName}
        currentName={userName}
        currentPhone={userPhone}
        currentAddress={userAddress}
        onSaveProfile={async (name, phone, address) => {
          const result = await updateProfile({ nama_lengkap: name, nomor_wa: phone, alamat: address });
          showToast(result.error ? `Profil gagal disimpan: ${result.error}` : 'Profil tersimpan ke Supabase.');
        }}
      />

      <BookRequestModal
        isOpen={isRequestBookModalOpen}
        onClose={() => setIsRequestBookModalOpen(false)}
        villageName={villageName}
        userName={userName}
        userPhone={userPhone}
        onSubmitRequest={handleCreateBookRequest}
      />

      <WhatsAppModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        villageName={villageName}
        userName={userName}
        initialMessage={whatsAppInitialMessage}
      />

    </div>
  );

  return appContent;
}
