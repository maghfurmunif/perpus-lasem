import { useEffect, useState } from 'react'
import type { Book } from '../types'

const STORAGE_KEY = 'perpus-lasem-offline-books-v1'

interface StoredBook {
  id: string
  title: string
  author: string
  coverImage: string
  format: string
  fileSize: string
  sampleChapters: { title: string; content: string }[]
  savedAt: string
}

function readAll(): StoredBook[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as StoredBook[]
  } catch {
    return []
  }
}

function writeAll(items: StoredBook[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch (e) {
    console.warn('Gagal menyimpan rak offline (memori penuh?):', e)
  }
}

export function getDownloadedBookIds(): string[] {
  return readAll().map((b) => b.id)
}

export function saveDownloadedBook(book: Book) {
  const items = readAll().filter((b) => b.id !== book.id)
  items.unshift({
    id: book.id,
    title: book.title,
    author: book.author,
    coverImage: book.coverImage,
    format: book.format,
    fileSize: book.fileSize,
    sampleChapters: book.sampleChapters ?? [],
    savedAt: new Date().toISOString(),
  })
  // Batasi 20 buku agar localStorage aman (~5MB)
  writeAll(items.slice(0, 20))
}

export function removeDownloadedBook(bookId: string) {
  writeAll(readAll().filter((b) => b.id !== bookId))
}

export function getOfflineBook(bookId: string): Book | null {
  const found = readAll().find((b) => b.id === bookId)
  if (!found) return null
  return {
    ...emptyBook(bookId),
    title: found.title,
    author: found.author,
    coverImage: found.coverImage,
    format: found.format as Book['format'],
    fileSize: found.fileSize,
    sampleChapters: found.sampleChapters,
  } as Book
}

export function isBookOffline(bookId: string): boolean {
  return readAll().some((b) => b.id === bookId)
}

function emptyBook(id: string): Partial<Book> {
  return {
    id,
    category: 'Edukasi',
    accessType: 'Akses Terbuka',
    pages: 0,
    rating: 0,
    ratingCount: 0,
    totalCopies: 0,
    availableCopies: 0,
    description: '',
    year: 2026,
    publisher: '-',
    tags: [],
    reviews: [],
  }
}
export function useOnlineStatus(): boolean {
  const [online, setOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )

  useEffect(() => {
    const goOnline = () => setOnline(true)
    const goOffline = () => setOnline(false)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  return online
}
