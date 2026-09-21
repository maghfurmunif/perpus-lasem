// Database row contract. Regenerate this file from Supabase when the schema changes.
export type SampleChapter = { title: string; content: string }

export interface BookRow {
  id: string
  title: string
  author: string
  category: string
  cover_image: string | null
  file_url: string | null
  format: string
  access_type: string
  pages: number
  file_size: string | null
  description: string
  isbn: string | null
  year: number
  publisher: string | null
  tags: string[] | null
  sample_chapters: SampleChapter[] | null
  is_featured: boolean
  is_popular: boolean
  is_new: boolean
  is_published: boolean
  published_at: string | null
  total_copies: number
  available_copies: number
  created_at: string
  updated_at: string
}

export interface ProfileRow {
  id: string
  nama_lengkap: string | null
  email: string | null
  nomor_wa: string | null
  alamat: string | null
  role: string
  aktif: boolean
  created_at: string
}

export interface RatingSummaryRow {
  book_id: string
  rating: number
  rating_count: number
}

export interface BorrowingRow {
  id: string
  book_id: string
  borrow_date: string
  due_date: string
  returned_at: string | null
  status: string
  extended: boolean
  books?: { title: string; author: string; cover_image: string | null; format: string } | null
  profiles?: { nama_lengkap: string | null } | null
}
