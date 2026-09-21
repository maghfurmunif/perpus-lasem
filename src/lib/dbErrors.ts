export type DbErrorCode = 'configuration' | 'authorization' | 'network' | 'validation' | 'unknown'

export class DbError extends Error {
  constructor(
    message: string,
    public readonly code: DbErrorCode = 'unknown',
    public readonly cause?: unknown,
  ) {
    super(message)
    this.name = 'DbError'
  }
}

export function toDbError(error: unknown, fallback = 'Operasi database gagal.'): DbError {
  if (error instanceof DbError) return error
  const message = error instanceof Error ? error.message : String(error ?? '')
  if (message.includes('row-level security') || message.includes('permission denied')) {
    return new DbError('Anda tidak memiliki izin untuk aksi ini.', 'authorization', error)
  }
  if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
    return new DbError('Koneksi ke server gagal. Periksa jaringan Anda.', 'network', error)
  }
  return new DbError(message || fallback, 'unknown', error)
}
