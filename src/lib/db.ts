/**
 * Service layer database -> tipe UI.
 * Semua query Supabase terpusat di sini. Fase 2, 3, dan 5 memakai modul ini.
 */
import { supabase, hasSupabase } from './supabase'
import type {
  Book,
  Announcement,
  BookRequestItem,
  BorrowRecord,
  BookReview,
  ForumPost,
  Profile,
} from '../types'
import { fetchBooks as fetchBooksRepository, fetchBooksPage, fetchPublishedBooks as fetchPublishedBooksRepository } from './repositories/booksRepository'
import { fetchProfiles as fetchProfilesRepository } from './repositories/profilesRepository'
import { DbError, toDbError } from './dbErrors'

// ------------------------------------------------------------
// Mapping DB row <-> UI type
// ------------------------------------------------------------
type BookRow = {
  id: string
  title: string
  author: string
  category: string
  cover_image: string | null
  file_url?: string | null
  format: string
  access_type: string
  pages: number
  file_size: string | null
  description: string
  isbn: string | null
  year: number
  publisher: string | null
  tags: string[] | null
  sample_chapters: { title: string; content: string }[] | null
  is_featured: boolean
  is_popular: boolean
  is_new: boolean
  is_published?: boolean
  published_at?: string | null
  total_copies: number
  available_copies: number
}

function rowToBook(row: BookRow): Book {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    category: row.category as Book['category'],
    coverImage: row.cover_image ?? '',
    fileUrl: row.file_url ?? undefined,
    format: row.format as Book['format'],
    accessType: row.access_type as Book['accessType'],
    pages: row.pages,
    fileSize: row.file_size ?? '-',
    rating: 5.0,
    ratingCount: 0,
    totalCopies: row.total_copies,
    availableCopies: row.available_copies,
    description: row.description,
    isbn: row.isbn ?? undefined,
    year: row.year,
    publisher: row.publisher ?? '-',
    tags: row.tags ?? [],
    isFeatured: row.is_featured,
    isPopular: row.is_popular,
    isNew: row.is_new,
    isPublished: row.is_published ?? true,
    publishedAt: row.published_at ?? undefined,
    sampleChapters: row.sample_chapters ?? [],
    reviews: [],
  }
}

function bookToRow(book: Partial<Book> & { title: string; author: string }): Partial<BookRow> {
  return {
    title: book.title,
    author: book.author,
    category: book.category,
    cover_image: book.coverImage || null,
    file_url: book.fileUrl || null,
    format: book.format,
    access_type: book.accessType,
    pages: book.pages,
    file_size: book.fileSize,
    description: book.description,
    isbn: book.isbn ?? null,
    year: book.year,
    publisher: book.publisher,
    tags: book.tags,
    sample_chapters: book.sampleChapters,
    is_featured: book.isFeatured,
    is_popular: book.isPopular,
    is_new: book.isNew,
    is_published: book.isPublished,
    published_at: book.publishedAt ?? null,
    total_copies: book.totalCopies,
    available_copies: book.availableCopies,
  }
}

// ------------------------------------------------------------
// PHASE 2: BUKU
// ------------------------------------------------------------
export async function fetchBooks(): Promise<{ data: Book[]; live: boolean }> {
  return fetchBooksRepository()
}

export async function fetchPublishedBooks(): Promise<{ data: Book[]; live: boolean }> {
  return fetchPublishedBooksRepository()
}

export async function fetchBooksPaginated(page = 0, pageSize = 24, publishedOnly = false) {
  return fetchBooksPage(page, pageSize, publishedOnly)
}

export async function getReadingProgress(userId: string, bookId: string) {
  const { data, error } = await supabase.from('reading_progress').select('chapter,progress,updated_at').eq('user_id', userId).eq('book_id', bookId).maybeSingle()
  if (error) throw new Error(error.message); return data as { chapter: number; progress: number; updated_at: string } | null
}

export async function saveReadingProgress(userId: string, bookId: string, chapter: number, progress: number) {
  const { error } = await supabase.from('reading_progress').upsert({ user_id: userId, book_id: bookId, chapter, progress, updated_at: new Date().toISOString() }, { onConflict: 'user_id,book_id' })
  if (error) throw new Error(error.message)
}

export async function getFollowedBookIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase.from('book_follows').select('book_id').eq('user_id', userId)
  if (error) throw new Error(error.message); return (data ?? []).map((row) => row.book_id as string)
}

export async function setBookFollow(userId: string, bookId: string, follow: boolean) {
  const result = follow ? await supabase.from('book_follows').upsert({ user_id: userId, book_id: bookId }) : await supabase.from('book_follows').delete().eq('user_id', userId).eq('book_id', bookId)
  if (result.error) throw new Error(result.error.message)
}

export async function setBookPublished(bookId: string, published: boolean, userId: string) {
  const { error } = await supabase.from('books').update({ is_published: published, published_at: published ? new Date().toISOString() : null, published_by: published ? userId : null }).eq('id', bookId)
  if (error) throw new Error(error.message)
}

export async function insertBook(book: Book): Promise<Book | null> {
  const row = bookToRow(book)
  const { data, error } = await supabase.from('books').insert(row).select('*').single()
  if (error) {
    console.error('insertBook:', error.message)
    return null
  }
  return rowToBook(data as BookRow)
}

export async function bulkUpsertBooks(rows: Record<string, unknown>[]): Promise<{ ok: boolean; count: number; error?: string }> {
  if (!hasSupabase) return { ok: false, count: 0, error: 'Koneksi Supabase belum aktif.' }
  const payload = rows.map((r) => ({
    title: String(r.title ?? '').trim(), author: String(r.author ?? 'Anonim').trim(),
    category: String(r.category ?? 'Edukasi'), format: String(r.format ?? 'PDF'),
    access_type: String(r.access_type ?? r.accessType ?? 'Akses Terbuka'),
    pages: Number(r.pages ?? 0), file_size: String(r.file_size ?? r.fileSize ?? '-'),
    description: String(r.description ?? ''), isbn: r.isbn ? String(r.isbn) : null,
    file_url: r.file_url ? String(r.file_url) : (r.fileUrl ? String(r.fileUrl) : null),
    year: Number(r.year ?? new Date().getFullYear()), publisher: String(r.publisher ?? 'Perpustakaan Lasem Sidayu'),
    cover_image: r.cover_image ? String(r.cover_image) : (r.coverImage ? String(r.coverImage) : null),
    tags: String(r.tags ?? '').split('|').map((v) => v.trim()).filter(Boolean),
    total_copies: Number(r.total_copies ?? r.totalCopies ?? 1), available_copies: Number(r.available_copies ?? r.availableCopies ?? 1),
    is_featured: String(r.is_featured ?? 'false').toLowerCase() === 'true',
    is_popular: String(r.is_popular ?? 'false').toLowerCase() === 'true',
    is_new: String(r.is_new ?? 'true').toLowerCase() !== 'false',
  })).filter((r) => r.title)
  const { error } = await supabase.rpc('import_catalog', { p_rows: payload })
  return error ? { ok: false, count: 0, error: error.message } : { ok: true, count: payload.length }
}

export function booksToCsv(books: Book[]): string {
  const headers = ['title','author','category','format','access_type','pages','file_size','description','isbn','year','publisher','cover_image','file_url','tags','total_copies','available_copies','is_featured','is_popular','is_new']
  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`
  return [headers.join(','), ...books.map((b) => [b.title,b.author,b.category,b.format,b.accessType,b.pages,b.fileSize,b.description,b.isbn ?? '',b.year,b.publisher,b.coverImage,b.fileUrl ?? '',b.tags.join('|'),b.totalCopies,b.availableCopies,b.isFeatured ?? false,b.isPopular ?? false,b.isNew ?? true].map(esc).join(','))].join('\n')
}

export async function updateBook(book: Book): Promise<Book | null> {
  const { data, error } = await supabase
    .from('books')
    .update(bookToRow(book))
    .eq('id', book.id)
    .select('*')
    .single()
  if (error) {
    console.error('updateBook:', error.message)
    return null
  }
  return rowToBook(data as BookRow)
}

export async function deleteBook(bookId: string): Promise<boolean> {
  const { error } = await supabase.from('books').delete().eq('id', bookId)
  if (error) {
    console.error('deleteBook:', error.message)
    return false
  }
  return true
}

// ------------------------------------------------------------
// PHASE 2: ULASAN
// ------------------------------------------------------------
export async function fetchReviews(bookId: string): Promise<BookReview[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('book_id', bookId)
    .order('created_at', { ascending: false })

  if (error || !data) return []

  return (data as any[]).map((r) => ({
    id: r.id,
    userName: r.user_name,
    userRole: r.user_role ?? undefined,
    rating: r.rating,
    comment: r.comment,
    date: new Date(r.created_at).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
  }))
}

export async function insertReview(
  bookId: string,
  userId: string,
  review: Omit<BookReview, 'id' | 'date'>
): Promise<BookReview | null> {
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      book_id: bookId,
      user_id: userId,
      user_name: review.userName,
      user_role: review.userRole ?? null,
      rating: review.rating,
      comment: review.comment,
    })
    .select('*')
    .single()

  if (error) {
    console.error('insertReview:', error.message)
    return null
  }

  return {
    id: data.id,
    userName: data.user_name,
    userRole: data.user_role ?? undefined,
    rating: data.rating,
    comment: data.comment,
    date: new Date(data.created_at).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
  }
}

// ------------------------------------------------------------
// PHASE 3: PEMINJAMAN
// ------------------------------------------------------------
export async function fetchBorrowings(profileId: string): Promise<BorrowRecord[]> {
  if (!hasSupabase) return []

  const { data, error } = await supabase
    .from('borrowings')
    .select(
      `id, borrow_date, due_date, returned_at, status, extended,
       books (title, author, cover_image, format),
       profiles (nama_lengkap)`
    )
    .eq('borrower_id', profileId)
    .order('borrow_date', { ascending: false })

  if (error || !data) {
    console.warn('fetchBorrowings:', error?.message)
    return []
  }

  return (data as any[]).map((r) => ({
    id: r.id,
    bookId: r.book_id,
    bookTitle: r.books?.title ?? '-',
    bookAuthor: r.books?.author ?? '-',
    bookCover: r.books?.cover_image ?? '',
    borrowDate: fmtDate(r.borrow_date),
    dueDate: fmtDate(r.due_date),
    format: r.books?.format ?? 'Buku Fisik',
    status: mapStatus(r.status, r.due_date, r.returned_at),
    canExtend: !r.extended && !r.returned_at,
  }))
}

/** Semua peminjaman (untuk dashboard pustakawan) */
export async function fetchAllBorrowings(): Promise<
  (BorrowRecord & { borrowerName: string })[]
> {
  if (!hasSupabase) return []

  const { data, error } = await supabase
    .from('borrowings')
    .select(
      `id, borrow_date, due_date, returned_at, status, extended,
       books (title, author, cover_image, format),
       profiles (nama_lengkap)`
    )
    .order('borrow_date', { ascending: false })

  if (error || !data) {
    console.warn('fetchAllBorrowings:', error?.message)
    return []
  }

  return (data as any[]).map((r) => ({
    id: r.id,
    bookId: r.book_id,
    bookTitle: r.books?.title ?? '-',
    bookAuthor: r.books?.author ?? '-',
    bookCover: r.books?.cover_image ?? '',
    borrowDate: fmtDate(r.borrow_date),
    dueDate: fmtDate(r.due_date),
    format: r.books?.format ?? 'Buku Fisik',
    status: mapStatus(r.status, r.due_date, r.returned_at),
    canExtend: !r.extended && !r.returned_at,
    borrowerName: r.profiles?.nama_lengkap ?? 'Warga',
  }))
}

function mapStatus(
  status: string,
  dueDate: string,
  returnedAt: string | null
): BorrowRecord['status'] {
  if (returnedAt || status === 'returned') return 'returned'
  if (status === 'extended') return 'extended'
  if (status === 'active') {
    const overdue = new Date(dueDate) < new Date(new Date().toDateString())
    return overdue ? 'overdue' : 'active'
  }
  return status as BorrowRecord['status']
}

function fmtDate(d: string | null): string {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export async function createBorrowing(
  bookId: string,
  borrowerId: string,
  days = 14
): Promise<{ ok: boolean; error?: string }> {
  if (!hasSupabase) return { ok: false, error: 'Mode demo: koneksi database belum aktif.' }

  const { error } = await supabase.rpc('borrow_book', { p_book_id: bookId })

  if (error) {
    // Paling sering: stok habis dicek RLS/trigger, atau buku fisik tidak tersedia
    console.error('createBorrowing:', error.message)
    return { ok: false, error: translateDbError(error.message) }
  }
  return { ok: true }
}

export async function extendBorrowing(recordId: string): Promise<boolean> {
  const { error } = await supabase.rpc('extend_loan', { p_loan_id: recordId })

  if (error) {
    console.error('extendBorrowing:', error.message)
    return false
  }
  return true
}

export async function returnBorrowing(recordId: string): Promise<boolean> {
  const { error } = await supabase.rpc('return_loan', { p_loan_id: recordId })

  if (error) {
    console.error('returnBorrowing:', error.message)
    return false
  }
  return true
}

function translateDbError(msg: string): string {
  if (msg.includes('available_copies') || msg.includes('check'))
    return 'Stok buku tidak tersedia.'
  if (msg.includes('row-level security'))
    return 'Anda tidak memiliki izin untuk aksi ini.'
  return msg
}

// ------------------------------------------------------------
// PHASE 5: WARTA / AGENDA
// ------------------------------------------------------------
export async function fetchAnnouncements(publishedOnly?: boolean): Promise<{ data: Announcement[]; live: boolean }> {
  if (!hasSupabase) throw new Error('Koneksi Supabase belum dikonfigurasi.')

  let query = supabase.from('announcements').select('*').order('created_at', { ascending: false })
  if (publishedOnly !== undefined) query = query.eq('published', publishedOnly)
  const { data, error } = await query

  if (error || !data) {
    throw new Error(error?.message ?? 'Gagal memuat data Supabase.')
  }

  return {
    data: (data as any[]).map((a) => ({
      id: a.id,
      title: a.title,
      date: a.event_date ? fmtDate(a.event_date) : fmtDate(a.created_at),
      category: a.category,
      summary: a.summary,
      author: a.author,
      badge: a.badge,
      coverImage: a.cover_image ?? undefined,
      contentType: a.content_type === 'pengumuman' ? 'pengumuman' : 'artikel',
      published: a.published ?? true,
    })),
    live: true,
  }
}

export async function insertAnnouncement(a: {
  title: string
  category: string
  summary: string
  author: string
  badge: string
  content_type?: string
  cover_image?: string | null
  published?: boolean
}): Promise<Announcement | null> {
  const normalized = { ...a, content_type: a.content_type === 'berita' ? 'artikel' : (a.content_type ?? 'artikel') }
  const { data, error } = await supabase.from('announcements').insert(normalized).select('*').single()
  if (error) {
    console.error('insertAnnouncement:', error.message)
    return null
  }
  return {
    id: data.id,
    title: data.title,
    date: data.event_date ? fmtDate(data.event_date) : 'Baru saja',
    category: data.category,
    summary: data.summary,
    author: data.author,
    badge: data.badge,
    coverImage: data.cover_image ?? undefined,
    contentType: data.content_type === 'pengumuman' ? 'pengumuman' : 'artikel',
    published: data.published ?? false,
  }
}

export async function deleteAnnouncement(id: string): Promise<boolean> {
  const { error } = await supabase.from('announcements').delete().eq('id', id)
  if (error) {
    console.error('deleteAnnouncement:', error.message)
    return false
  }
  return true
}

export async function setAnnouncementPublished(id: string, published: boolean, userId: string): Promise<void> {
  const { data, error } = await supabase.from('announcements').update({
    published,
    published_at: published ? new Date().toISOString() : null,
    created_by: userId,
  }).eq('id', id).select('id,published').maybeSingle()
  if (error) throw new Error(error.message)
  if (!data) throw new Error('Status tidak dapat diverifikasi: konten tidak ditemukan atau izin database menolak pengembalian data update.')
  if (data.published !== published) {
    throw new Error(`Database tidak menyimpan status ${published ? 'terbit' : 'draft'} untuk konten ini.`)
  }
}

export async function updateAnnouncement(id: string, values: { title: string; category: string; summary: string; content_type: string; cover_image?: string | null }): Promise<void> {
  const { error } = await supabase.from('announcements').update(values).eq('id', id)
  if (error) throw new Error(error.message)
}

// ------------------------------------------------------------
// USULAN BUKU WARGA
// ------------------------------------------------------------
export async function fetchBookRequests(): Promise<{ data: BookRequestItem[]; live: boolean }> {
  if (!hasSupabase) throw new Error('Koneksi Supabase belum dikonfigurasi.')

  const { data, error } = await supabase
    .from('book_requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (error || !data) {
    throw new Error(error?.message ?? 'Gagal memuat data Supabase.')
  }

  return {
    data: (data as any[]).map((r) => ({
      id: r.id,
      title: r.title,
      author: r.author ?? undefined,
      category: r.category,
      reason: r.reason,
      requesterName: r.requester_name,
      requesterDusun: r.requester_dusun ?? '-',
      requesterPhone: r.requester_phone ?? undefined,
      requestDate: fmtDate(r.created_at),
      status: r.status,
      budgetEstimated: r.budget_estimated ?? undefined,
      notes: r.notes ?? undefined,
    })),
    live: true,
  }
}

export async function insertBookRequest(req: {
  title: string
  author?: string
  category: string
  reason: string
  requesterName: string
  requesterDusun?: string
  requesterPhone?: string
}): Promise<BookRequestItem | null> {
  const { data, error } = await supabase
    .from('book_requests')
    .insert({
      requester_id: (await supabase.auth.getUser()).data.user?.id,
      title: req.title,
      author: req.author || null,
      category: req.category,
      reason: req.reason,
      requester_name: req.requesterName,
      requester_dusun: req.requesterDusun || null,
      requester_phone: req.requesterPhone || null,
    })
    .select('*')
    .single()

  if (error) {
    console.error('insertBookRequest:', error.message)
    return null
  }

  return {
    id: data.id,
    title: data.title,
    author: data.author ?? undefined,
    category: data.category,
    reason: data.reason,
    requesterName: data.requester_name,
    requesterDusun: data.requester_dusun ?? '-',
    requesterPhone: data.requester_phone ?? undefined,
    requestDate: fmtDate(data.created_at),
    status: data.status,
  }
}

export async function updateBookRequestStatus(
  id: string,
  status: 'approved' | 'rejected' | 'fulfilled',
  notes?: string
): Promise<boolean> {
  const { error } = await supabase
    .from('book_requests')
    .update({ status, notes: notes ?? null })
    .eq('id', id)
  if (error) {
    console.error('updateBookRequestStatus:', error.message)
    return false
  }
  return true
}

// ------------------------------------------------------------
// PHASE 5: FORUM KOMUNITAS
// ------------------------------------------------------------
export async function fetchForumPosts(): Promise<ForumPost[]> {
  if (!hasSupabase) return []

  const { data, error } = await supabase
    .from('forum_posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return (data as ForumPost[]).filter((post) => post.published !== false)
}

export async function fetchAllForumPosts(): Promise<ForumPost[]> {
  if (!hasSupabase) return []
  const { data, error } = await supabase.from('forum_posts').select('*').order('created_at', { ascending: false })
  return error || !data ? [] : data as ForumPost[]
}

export async function setForumPostPublished(id: string, published: boolean): Promise<void> {
  const { error } = await supabase.from('forum_posts').update({ published }).eq('id', id)
  if (error) throw new Error(error.message)
}

export async function deleteForumPost(id: string): Promise<boolean> {
  const { error } = await supabase.from('forum_posts').delete().eq('id', id)
  return !error
}

export async function insertForumPost(post: {
  user_id: string
  author_name: string
  category: string
  title: string
  content: string
  image_url?: string | null
}): Promise<ForumPost | null> {
  const { data, error } = await supabase.from('forum_posts').insert(post).select('*').single()
  if (error) {
    console.error('insertForumPost:', error.message)
    return null
  }
  return data as ForumPost
}

export async function fetchForumPostsPage(page = 0, pageSize = 12): Promise<{ data: ForumPost[]; hasMore: boolean }> {
  if (!hasSupabase) return { data: [], hasMore: false }
  const from = page * pageSize
  const to = from + pageSize
  const { data, error } = await supabase.from('forum_posts').select('*').eq('published', true).order('created_at', { ascending: false }).range(from, to)
  if (error || !data) return { data: [], hasMore: false }
  return { data: (data as ForumPost[]).slice(0, pageSize), hasMore: data.length > pageSize }
}

export async function likeForumPost(postId: string, likes: number): Promise<boolean> {
  const { error } = await supabase
    .from('forum_posts')
    .update({ likes: likes + 1 })
    .eq('id', postId)
  return !error
}

// ------------------------------------------------------------
// PHASE 5: STATISTIK
// ------------------------------------------------------------
export interface LibraryStats {
  total_books: number
  total_copies: number
  available_copies: number
  total_members: number
  active_borrows: number
  total_borrows: number
  returned_borrows: number
  pending_requests: number
  total_forum_posts: number
}

export async function fetchLibraryStats(): Promise<LibraryStats | null> {
  if (!hasSupabase) return null

  const { data, error } = await supabase.from('library_stats').select('*').single()
  if (error || !data) {
    console.warn('fetchLibraryStats:', error?.message)
    return null
  }
  return data as LibraryStats
}

export async function fetchProfiles(): Promise<Profile[]> {
  return fetchProfilesRepository()
}
