export type BookCategory = 
  | 'Edukasi'
  | 'Pertanian'
  | 'UMKM'
  | 'Budaya Desa'
  | 'Fiksi & Populer';

export type BookFormat = 'PDF' | 'EPUB' | 'Buku Fisik';

export type AccessType = 'Akses Terbuka' | 'Lisensi Terbatas';

export interface BookReview {
  id: string;
  userName: string;
  userRole?: string; // e.g., 'Petani Desa', 'Guru SD', 'Pengrajin Tempe'
  rating: number;
  comment: string;
  date: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  coverImage: string;
  format: BookFormat;
  accessType: AccessType;
  pages: number;
  fileSize: string; // e.g., '1.8 MB' or '850 KB'
  rating: number;
  ratingCount: number;
  totalCopies: number;
  availableCopies: number;
  description: string;
  isbn?: string;
  year: number;
  publisher: string;
  tags: string[];
  isFeatured?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  sampleChapters: {
    title: string;
    content: string;
  }[];
  reviews: BookReview[];
}

export interface BorrowRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCover: string;
  borrowDate: string;
  dueDate: string;
  format: BookFormat;
  status: 'active' | 'overdue' | 'returned' | 'extended';
  canExtend: boolean;
}

export interface DownloadItem {
  bookId: string;
  title: string;
  author: string;
  coverImage: string;
  format: BookFormat;
  fileSize: string;
  downloadDate: string;
  progress: number; // 0 - 100
  isCompleted: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  author: string;
  badge: string;
}

export interface BookRequestItem {
  id: string;
  title: string;
  author?: string;
  category: BookCategory;
  reason: string;
  requesterName: string;
  requesterDusun: string;
  requesterPhone?: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled';
  budgetEstimated?: string;
  notes?: string;
}

export type VillageOfficialRole = 
  | 'Kepala Desa'
  | 'Sekretaris Desa'
  | 'Kaur Kesra'
  | 'Pustakawan Desa'
  | 'Relawan Literasi';

export interface AdminUser {
  name: string;
  role: VillageOfficialRole;
  nipOrId: string;
  phone: string;
  dusun: string;
}

export type DeviceViewMode = 'responsive' | 'smartphone' | 'tablet' | 'showcase';

