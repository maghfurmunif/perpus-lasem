import type { Book, BookReview } from '../../types'
import { hasSupabase, supabase } from '../supabase'
import type { BookRow, RatingSummaryRow } from '../database.types'
import { DbError, toDbError } from '../dbErrors'

const DEFAULT_PAGE_SIZE = 24

function mapBook(row: BookRow, rating: RatingSummaryRow | undefined): Book {
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
    rating: rating?.rating ?? 0,
    ratingCount: rating?.rating_count ?? 0,
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
    isPublished: row.is_published,
    publishedAt: row.published_at ?? undefined,
    sampleChapters: row.sample_chapters ?? [],
    reviews: [] as BookReview[],
  }
}

async function fetchRatingSummaries(bookIds: string[]): Promise<Map<string, RatingSummaryRow>> {
  if (!bookIds.length) return new Map()
  const { data, error } = await supabase.from('book_rating_summary').select('*').in('book_id', bookIds)
  if (error) throw toDbError(error, 'Rating buku gagal dimuat.')
  return new Map((data as RatingSummaryRow[]).map((row) => [row.book_id, row]))
}

export async function fetchBooksPage(page = 0, pageSize = DEFAULT_PAGE_SIZE, publishedOnly = false) {
  if (!hasSupabase) throw new DbError('Koneksi Supabase belum dikonfigurasi.', 'configuration')
  const from = page * pageSize
  const to = from + pageSize - 1
  let query = supabase.from('books').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(from, to)
  if (publishedOnly) query = query.eq('is_published', true)
  const { data, error, count } = await query
  if (error || !data) throw toDbError(error, 'Gagal memuat buku.')
  const rows = data as unknown as BookRow[]
  const ratings = await fetchRatingSummaries(rows.map((row) => row.id))
  return {
    data: rows.map((row) => mapBook(row, ratings.get(row.id))),
    hasMore: count !== null && to + 1 < count,
    total: count ?? rows.length,
  }
}

export async function fetchBooks(): Promise<{ data: Book[]; live: boolean }> {
  const result = await fetchBooksPage(0, 1000)
  return { data: result.data, live: true }
}

export async function fetchPublishedBooks(): Promise<{ data: Book[]; live: boolean }> {
  const result = await fetchBooksPage(0, 1000, true)
  return { data: result.data, live: true }
}

