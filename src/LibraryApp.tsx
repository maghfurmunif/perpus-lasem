import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Book, BookCategory, BorrowRecord, DownloadItem, Announcement, BookReview, BookRequestItem } from './types';
import { INITIAL_BOOKS, INITIAL_ANNOUNCEMENTS, INITIAL_BOOK_REQUESTS } from './data/mockBooks';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { TargetHomeTab } from './components/TargetHomeTab';
import { CollectionTab } from './components/CollectionTab';
import { BorrowingTab } from './components/BorrowingTab';
import { DownloadsTab } from './components/DownloadsTab';
import { ProfileTab } from './components/ProfileTab';
import { AdminDashboard } from './components/AdminDashboard';
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
  saveDownloadedBook,
  removeDownloadedBook,
} from './lib/offline';

export default function LibraryApp() {
  const { user, profile, isAdmin, logout, updateProfile } = useAuth();
  const { username } = useParams<{ username: string }>();

  // App state
  const [books, setBooks] = useState<Book[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [bookRequests, setBookRequests] = useState<BookRequestItem[]>([]);
  const [villageName, setVillageName] = useState<string>('Lasem Sidayu');
  const [currentTab, setCurrentTab] = useState<string>('home');
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

  // Modal States
  const [selectedBookForDetail, setSelectedBookForDetail] = useState<Book | null>(null);
  const [selectedBookForReader, setSelectedBookForReader] = useState<Book | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRequestBookModalOpen, setIsRequestBookModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [whatsAppInitialMessage, setWhatsAppInitialMessage] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user && profile && (!profile.nama_lengkap || !profile.nomor_wa || !profile.alamat)) setIsLoginModalOpen(true);
  }, [user, profile]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Gerbang akses: Portal Desa hanya untuk role pengelola (Fase 1: role)
  const openAdmin = () => {
    setCurrentTab('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleTabChange = (tab: string) => {
    if (tab.startsWith('admin-')) tab = 'admin';
    if (tab === 'admin' && !isAdmin) {
      showToast('Portal Desa hanya dapat dibuka oleh pustakawan & perangkat desa.');
      return;
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    const [booksRes, ancRes, reqRes] = await Promise.all([
      db.fetchBooks(),
      db.fetchAnnouncements(),
      db.fetchBookRequests(),
    ]);
    setBooks(booksRes.data);
    setAnnouncements(ancRes.data);
    setBookRequests(reqRes.data);
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
  const handleDownloadBook = (book: Book) => {
    if (downloadedBookIds.includes(book.id)) {
      setCurrentTab('downloads');
      return;
    }

    // Cek apakah buku punya konten baca offline (sample chapters)
    const hasContent = book.sampleChapters && book.sampleChapters.length > 0;

    const newItem: DownloadItem = {
      bookId: book.id,
      title: book.title,
      author: book.author,
      coverImage: book.coverImage,
      format: book.format,
      fileSize: book.fileSize,
      downloadDate: 'Baru saja',
      progress: 15,
      isCompleted: false,
    };

    setDownloadItems((prev) => [newItem, ...prev.filter((d) => d.bookId !== book.id)]);

    // Simulasi progres unduh lalu simpan ke localStorage
    let currentProgress = 15;
    const timer = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 25) + 15;
      if (currentProgress >= 100) {
        clearInterval(timer);
        if (hasContent) saveDownloadedBook(book);
        setDownloadItems((prev) =>
          prev.map((item) =>
            item.bookId === book.id
              ? { ...item, progress: 100, isCompleted: true, downloadDate: 'Baru saja' }
              : item
          )
        );
        showToast(hasContent
          ? `Buku "${book.title}" tersimpan, bisa dibaca offline.`
          : `Buku "${book.title}" ditandai (belum ada konten digital lengkap).`);
      } else {
        setDownloadItems((prev) =>
          prev.map((item) =>
            item.bookId === book.id ? { ...item, progress: currentProgress } : item
          )
        );
      }
    }, 400);
  };

  // Handle Delete Download
  const handleDeleteDownload = (bookId: string) => {
    removeDownloadedBook(bookId);
    setDownloadItems((prev) => prev.filter((d) => d.bookId !== bookId));
  };

  // ----------------------------------------------------------
  // PHASE 3: Peminjaman nyata via tabel borrowings
  // ----------------------------------------------------------
  const handleBorrowBook = async (book: Book) => {
    const isAlreadyBorrowed = borrowedBookIds.includes(book.id);
    if (isAlreadyBorrowed) {
      setCurrentTab('borrowing');
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
    setCurrentTab('borrowing');
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
  }, [selectedBookForDetail]);

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
  // Admin actions (live ke database bila tersedia)
  // ----------------------------------------------------------
  const handleAddBook = async (newBook: Book) => {
    if (hasSupabase) {
      const saved = await db.insertBook({ ...newBook, title: newBook.title, author: newBook.author });
      if (saved) {
        setBooks((prev) => [saved, ...prev]);
        showToast('Buku baru tersimpan ke database.');
        return;
      }
      showToast('Gagal simpan ke database (cek role pengelola).');
      return;
    }
    setBooks((prev) => [newBook, ...prev]);
  };

  const handleUpdateBook = async (updatedBook: Book) => {
    if (hasSupabase) {
      const saved = await db.updateBook(updatedBook);
      if (!saved) {
        showToast('Gagal update ke database (cek role pengelola).');
        return;
      }
      setBooks((prev) => prev.map((b) => (b.id === saved.id ? saved : b)));
      return;
    }
    setBooks((prev) => prev.map((b) => (b.id === updatedBook.id ? updatedBook : b)));
  };

  const handleDeleteBook = async (bookId: string) => {
    if (hasSupabase) {
      const ok = await db.deleteBook(bookId);
      if (!ok) {
        showToast('Gagal hapus dari database (cek role pengelola).');
        return;
      }
    }
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
    showToast('Buku dihapus dari katalog.');
  };

  const handleUpdateRequestStatus = async (
    requestId: string,
    status: 'approved' | 'rejected' | 'fulfilled',
    adminNotes?: string
  ) => {
    if (hasSupabase) {
      const ok = await db.updateBookRequestStatus(requestId, status, adminNotes);
      if (!ok) {
        showToast('Gagal update status usulan.');
        return;
      }
    }
    setBookRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status, notes: adminNotes } : r))
    );
  };

  const handleAddAnnouncement = async (newAnc: Announcement) => {
    if (hasSupabase) {
      const saved = await db.insertAnnouncement({
        title: newAnc.title,
        category: newAnc.category,
        summary: newAnc.summary,
        author: newAnc.author,
        badge: newAnc.badge,
      });
      if (saved) {
        setAnnouncements((prev) => [saved, ...prev]);
        return;
      }
      showToast('Gagal publikasikan warta ke database.');
      return;
    }
    setAnnouncements((prev) => [newAnc, ...prev]);
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (hasSupabase) {
      const ok = await db.deleteAnnouncement(id);
      if (!ok) {
        showToast('Gagal hapus warta.');
        return;
      }
    }
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

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
    const newReq: BookRequestItem = {
      id: `req-${Date.now()}`,
      ...req,
      requesterDusun: 'Krajan (Lasem)',
      requestDate: 'Hari ini',
      status: 'pending',
    };
    setBookRequests((prev) => [newReq, ...prev]);
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
  if (books.length === 0 && announcements.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[#F8FAF8] text-stone-500 text-sm">
        <div className="w-8 h-8 rounded-full border-[3px] border-emerald-600 border-t-transparent animate-spin" />
        Memuat katalog perpustakaan...
      </div>
    );
  }

  // Main interactive UI content
  const appContent = (
    <div className={`min-h-screen flex flex-col ${getFontSizeClass()}`}>

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
      <main className="flex-1 lg:ml-64">
        {currentTab === 'home' && (
          <TargetHomeTab
            books={books}
            onSelectBook={(b) => setSelectedBookForDetail(b)}
            onReadBook={(b) => setSelectedBookForReader(b)}
            onSearchFocus={() => setCurrentTab('collection')}
            onNavigate={setCurrentTab}
            onLogout={logout}
          />
        )}

        {currentTab === 'collection' && (
          <CollectionTab
            books={books}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onSelectBook={(b) => setSelectedBookForDetail(b)}
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
            onBrowseCollection={() => setCurrentTab('collection')}
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
            onBrowseBooks={() => setCurrentTab('collection')}
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
            onOpenAdminMode={isAdmin ? openAdmin : undefined}
            profileRole={profile?.role}
            onLogout={logout}
          />
        )}

        {currentTab === 'admin' && isAdmin && (
          <AdminDashboard
            books={books}
            borrowRecords={borrowRecords}
            bookRequests={bookRequests}
            announcements={announcements}
            villageName={villageName}
            onAddBook={handleAddBook}
            onUpdateBook={handleUpdateBook}
            onDeleteBook={handleDeleteBook}
            onUpdateRequestStatus={handleUpdateRequestStatus}
            onAddAnnouncement={handleAddAnnouncement}
            onDeleteAnnouncement={handleDeleteAnnouncement}
            onReturnBorrow={handleReturnBorrow}
            onExtendBorrow={handleExtendBorrow}
            onBackToUserMode={() => {
              setCurrentTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
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
      />

      {/* Modals */}
      <BookDetailModal
        book={selectedBookForDetail}
        onClose={() => setSelectedBookForDetail(null)}
        onRead={(b) => setSelectedBookForReader(b)}
        onDownload={handleDownloadBook}
        onBorrow={handleBorrowBook}
        isDownloaded={selectedBookForDetail ? downloadedBookIds.includes(selectedBookForDetail.id) : false}
        isBorrowed={selectedBookForDetail ? borrowedBookIds.includes(selectedBookForDetail.id) : false}
        onAddReview={handleAddReview}
      />

      <ReaderModal
        book={selectedBookForReader}
        onClose={() => setSelectedBookForReader(null)}
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
