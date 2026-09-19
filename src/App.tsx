import React, { useState, useEffect } from 'react';
import { Book, BookCategory, BorrowRecord, DownloadItem, Announcement, DeviceViewMode, BookReview, BookRequestItem } from './types';
import { INITIAL_BOOKS, INITIAL_ANNOUNCEMENTS, INITIAL_BOOK_REQUESTS } from './data/mockBooks';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeTab } from './components/HomeTab';
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
import { DeviceFrameWrapper } from './components/DeviceFrameWrapper';

export default function App() {
  // App state
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [bookRequests, setBookRequests] = useState<BookRequestItem[]>(INITIAL_BOOK_REQUESTS);
  const [villageName, setVillageName] = useState<string>('Lasem Sidayu');
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<BookCategory | 'Semua'>('Semua');

  // Device Showcase & Preview Mode
  const [viewMode, setViewMode] = useState<DeviceViewMode>('responsive');
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);

  // User Profile
  const [userName, setUserName] = useState('Maghfur Munif');
  const [userPhone, setUserPhone] = useState('0812-7788-9900');
  const [userAddress, setUserAddress] = useState('Dusun Krajan RT 02 / RW 01, Lasem');
  const [memberId, setMemberId] = useState('LIB-LSM-2026-0841');
  const [fontSizePreference, setFontSizePreference] = useState<'normal' | 'large' | 'extralarge'>('normal');
  const [lowDataMode, setLowDataMode] = useState(false);

  // Initial Borrow Records
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>([
    {
      id: 'borrow-1',
      bookId: 'bk-pertanian-01',
      bookTitle: 'Panduan Praktis Budidaya Sayur Organik di Pekarangan Rumah',
      bookAuthor: 'Ir. H. Sudirman & Tim Balai Tani',
      bookCover: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=600&auto=format&fit=crop&q=80',
      borrowDate: '15 September 2026',
      dueDate: '29 September 2026',
      format: 'PDF',
      status: 'active',
      canExtend: true,
    },
    {
      id: 'borrow-2',
      bookId: 'bk-umkm-01',
      bookTitle: 'Manajemen Keuangan Sederhana untuk Warung & UMKM Desa',
      bookAuthor: 'Dra. Nur Indahsari, M.Ak',
      bookCover: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
      borrowDate: '10 September 2026',
      dueDate: '24 September 2026',
      format: 'EPUB',
      status: 'active',
      canExtend: true,
    },
    {
      id: 'borrow-3',
      bookId: 'bk-budaya-01',
      bookTitle: 'Kumpulan Cerita Rakyat & Kearifan Lokal Nusantara untuk Generasi Muda',
      bookAuthor: 'Ki Anom Suwito & Lembaga Adat Desa',
      bookCover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
      borrowDate: '20 Agustus 2026',
      dueDate: '03 September 2026',
      format: 'EPUB',
      status: 'returned',
      canExtend: false,
    }
  ]);

  // Initial Downloaded Items
  const [downloadItems, setDownloadItems] = useState<DownloadItem[]>([
    {
      bookId: 'bk-pertanian-01',
      title: 'Panduan Praktis Budidaya Sayur Organik di Pekarangan Rumah',
      author: 'Ir. H. Sudirman & Tim Balai Tani',
      coverImage: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=600&auto=format&fit=crop&q=80',
      format: 'PDF',
      fileSize: '2.4 MB',
      downloadDate: '16 September 2026',
      progress: 100,
      isCompleted: true,
    },
    {
      bookId: 'bk-umkm-01',
      title: 'Manajemen Keuangan Sederhana untuk Warung & UMKM Desa',
      author: 'Dra. Nur Indahsari, M.Ak',
      coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
      format: 'EPUB',
      fileSize: '820 KB',
      downloadDate: '14 September 2026',
      progress: 100,
      isCompleted: true,
    }
  ]);

  // Modal States
  const [selectedBookForDetail, setSelectedBookForDetail] = useState<Book | null>(null);
  const [selectedBookForReader, setSelectedBookForReader] = useState<Book | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRequestBookModalOpen, setIsRequestBookModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [whatsAppInitialMessage, setWhatsAppInitialMessage] = useState('');

  // Derived counts
  const activeBorrowCount = borrowRecords.filter((r) => r.status === 'active' || r.status === 'extended').length;
  const downloadCount = downloadItems.filter((d) => d.isCompleted).length;
  const downloadedBookIds = downloadItems.filter((d) => d.isCompleted).map((d) => d.bookId);
  const borrowedBookIds = borrowRecords.filter((r) => r.status === 'active' || r.status === 'extended').map((r) => r.bookId);

  // Handle Download Book (with realistic progress animation)
  const handleDownloadBook = (book: Book) => {
    // If already downloaded, navigate to downloads tab
    if (downloadedBookIds.includes(book.id)) {
      setCurrentTab('downloads');
      return;
    }

    // Check if already in progress
    const existing = downloadItems.find((d) => d.bookId === book.id);
    if (existing && !existing.isCompleted) {
      setCurrentTab('downloads');
      return;
    }

    // Start download simulation
    const newItem: DownloadItem = {
      bookId: book.id,
      title: book.title,
      author: book.author,
      coverImage: book.coverImage,
      format: book.format,
      fileSize: book.fileSize,
      downloadDate: 'Hari ini',
      progress: 15,
      isCompleted: false,
    };

    setDownloadItems((prev) => [newItem, ...prev.filter((d) => d.bookId !== book.id)]);

    // Simulate progressive download chunks
    let currentProgress = 15;
    const timer = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 25) + 15;
      if (currentProgress >= 100) {
        clearInterval(timer);
        setDownloadItems((prev) =>
          prev.map((item) =>
            item.bookId === book.id
              ? { ...item, progress: 100, isCompleted: true, downloadDate: 'Baru saja' }
              : item
          )
        );
      } else {
        setDownloadItems((prev) =>
          prev.map((item) =>
            item.bookId === book.id
              ? { ...item, progress: currentProgress }
              : item
          )
        );
      }
    }, 400);
  };

  // Handle Borrow Book
  const handleBorrowBook = (book: Book) => {
    const isAlreadyBorrowed = borrowedBookIds.includes(book.id);
    if (isAlreadyBorrowed) {
      setCurrentTab('borrowing');
      return;
    }

    const newRecord: BorrowRecord = {
      id: `borrow-${Date.now()}`,
      bookId: book.id,
      bookTitle: book.title,
      bookAuthor: book.author,
      bookCover: book.coverImage,
      borrowDate: '19 September 2026',
      dueDate: '03 Oktober 2026',
      format: book.format,
      status: 'active',
      canExtend: true,
    };

    setBorrowRecords((prev) => [newRecord, ...prev]);
    // Also reduce available copy
    setBooks((prev) =>
      prev.map((b) =>
        b.id === book.id
          ? { ...b, availableCopies: Math.max(0, b.availableCopies - 1) }
          : b
      )
    );
    setCurrentTab('borrowing');
  };

  // Handle Extend Borrow
  const handleExtendBorrow = (recordId: string) => {
    setBorrowRecords((prev) =>
      prev.map((r) =>
        r.id === recordId
          ? {
              ...r,
              dueDate: '10 Oktober 2026',
              status: 'extended',
              canExtend: false,
            }
          : r
      )
    );
  };

  // Handle Return Borrow
  const handleReturnBorrow = (recordId: string) => {
    setBorrowRecords((prev) =>
      prev.map((r) =>
        r.id === recordId
          ? { ...r, status: 'returned', canExtend: false }
          : r
      )
    );
  };

  // Handle Delete Download
  const handleDeleteDownload = (bookId: string) => {
    setDownloadItems((prev) => prev.filter((d) => d.bookId !== bookId));
  };

  // Handle Add Review
  const handleAddReview = (bookId: string, reviewData: Omit<BookReview, 'id' | 'date'>) => {
    const newRev: BookReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: 'Baru saja',
    };

    setBooks((prev) =>
      prev.map((b) => {
        if (b.id !== bookId) return b;
        const updatedReviews = [newRev, ...b.reviews];
        const avgRating = (
          updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length
        ).toFixed(1);

        return {
          ...b,
          reviews: updatedReviews,
          rating: parseFloat(avgRating),
          ratingCount: b.ratingCount + 1,
        };
      })
    );
  };

  // WhatsApp helpers
  const handleOpenWhatsAppGeneral = () => {
    setWhatsAppInitialMessage(`Halo Pustakawan Perpustakaan Desa ${villageName}, saya ${userName}. Saya ingin berkonsultasi mengenai buku bacaan.`);
    setIsWhatsAppModalOpen(true);
  };

  const handleWhatsAppReminder = (record: BorrowRecord) => {
    setWhatsAppInitialMessage(`Halo Pustakawan Desa ${villageName}, konfirmasi pengingat untuk buku "${record.bookTitle}" jatuh tempo ${record.dueDate}. Terima kasih.`);
    setIsWhatsAppModalOpen(true);
  };

  // Admin Actions Handlers
  const handleAddBook = (newBook: Book) => {
    setBooks((prev) => [newBook, ...prev]);
  };

  const handleUpdateBook = (updatedBook: Book) => {
    setBooks((prev) => prev.map((b) => (b.id === updatedBook.id ? updatedBook : b)));
  };

  const handleDeleteBook = (bookId: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
  };

  const handleUpdateRequestStatus = (
    requestId: string,
    status: 'approved' | 'rejected' | 'fulfilled',
    adminNotes?: string
  ) => {
    setBookRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status, notes: adminNotes } : r))
    );
  };

  const handleAddAnnouncement = (newAnc: Announcement) => {
    setAnnouncements((prev) => [newAnc, ...prev]);
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  const handleCreateBookRequest = (req: {
    title: string;
    author: string;
    category: BookCategory;
    reason: string;
    requesterName: string;
    requesterPhone?: string;
  }) => {
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

  // Main interactive UI content
  const appContent = (
    <div className={`min-h-screen flex flex-col ${getFontSizeClass()}`}>
      
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        villageName={villageName}
        onVillageNameChange={setVillageName}
        onSearchClick={() => {
          setCurrentTab('collection');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onWhatsAppClick={handleOpenWhatsAppGeneral}
        onProfileClick={() => setCurrentTab('profile')}
        activeBorrowCount={activeBorrowCount}
        downloadCount={downloadCount}
        isSimulatedOffline={isSimulatedOffline}
        onToggleSimulatedOffline={() => setIsSimulatedOffline(!isSimulatedOffline)}
      />

      {/* Dynamic Main View */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomeTab
            books={books}
            announcements={announcements}
            villageName={villageName}
            onSelectBook={(b) => setSelectedBookForDetail(b)}
            onBorrowBook={handleBorrowBook}
            onDownloadBook={handleDownloadBook}
            onReadBook={(b) => setSelectedBookForReader(b)}
            onCategoryClick={(cat) => {
              setSelectedCategory(cat);
              setCurrentTab('collection');
            }}
            onSearchFocus={() => setCurrentTab('collection')}
            onWhatsAppClick={handleOpenWhatsAppGeneral}
            onRequestBookClick={() => setIsRequestBookModalOpen(true)}
            onOpenAdminMode={() => {
              setCurrentTab('admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            downloadedBookIds={downloadedBookIds}
            borrowedBookIds={borrowedBookIds}
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
            isSimulatedOffline={isSimulatedOffline}
            onToggleSimulatedOffline={() => setIsSimulatedOffline(!isSimulatedOffline)}
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
            onOpenAdminMode={() => {
              setCurrentTab('admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'admin' && (
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
        onTabChange={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        activeBorrowCount={activeBorrowCount}
        downloadCount={downloadCount}
        pendingRequestsCount={bookRequests.filter((r) => r.status === 'pending').length}
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
        onSaveProfile={(n, p, a) => {
          setUserName(n);
          setUserPhone(p);
          setUserAddress(a);
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

  return (
    <DeviceFrameWrapper
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      villageName={villageName}
    >
      {appContent}
    </DeviceFrameWrapper>
  );
}
