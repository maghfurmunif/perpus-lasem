import type { Profile } from '../../types'
import type { ProfileRow } from '../database.types'
import { toDbError } from '../dbErrors'
import { hasSupabase, supabase } from '../supabase'

export async function fetchProfiles(): Promise<Profile[]> {
  if (!hasSupabase) return []
  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
  if (error || !data) throw toDbError(error, 'Profil gagal dimuat.')
  return (data as unknown as ProfileRow[]).map((row) => ({
    id: row.id,
    nama_lengkap: row.nama_lengkap,
    email: row.email,
    nomor_wa: row.nomor_wa,
    alamat: row.alamat,
    role: row.role as Profile['role'],
    aktif: row.aktif,
    created_at: row.created_at,
  }))
}

