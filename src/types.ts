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
  fileUrl?: string;
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
  isPublished?: boolean;
  publishedAt?: string;
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
  coverImage?: string;
  contentType?: 'artikel' | 'pengumuman';
  published?: boolean;
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

/* ============================================================
   PHASE 1: AUTH & ROLE
   ============================================================ */
export type UserRole = 'superadmin' | 'admin' | 'pustakawan' | 'anggota' | 'kepala_desa';

export const ADMIN_ROLES: UserRole[] = ['superadmin', 'admin', 'pustakawan', 'kepala_desa'];

export interface Profile {
  id: string;
  nama_lengkap: string | null;
  email: string | null;
  nomor_wa: string | null;
  alamat: string | null;
  role: UserRole;
  aktif: boolean;
  created_at?: string;
}

/* ============================================================
   PHASE 5: KOMUNITAS (FORUM WARGA)
   ============================================================ */
export interface ForumPost {
  id: string;
  user_id: string;
  author_name: string;
  category: string;
  title: string;
  content: string;
  likes: number;
  created_at: string;
  image_url?: string | null;
  published?: boolean;
}

export type AnnouncementContentType = 'artikel' | 'pengumuman';
