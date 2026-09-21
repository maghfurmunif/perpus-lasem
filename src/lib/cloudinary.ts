/**
 * Cloudinary unsigned upload untuk cover buku.
 * Env: VITE_CLOUDINARY_CLOUD_NAME + VITE_CLOUDINARY_UPLOAD_PRESET
 */
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined

export const cloudinaryConfigured = Boolean(CLOUD_NAME && UPLOAD_PRESET)

export async function uploadBookCover(file: File): Promise<string> {
  return uploadCloudinary(file, 'covers')
}

export async function uploadCommunityImage(file: File): Promise<string> {
  return uploadCloudinary(file, 'news')
}

export async function uploadCloudinaryFile(file: File): Promise<{ url: string; publicId: string; bytes: number }> {
  if (!cloudinaryConfigured) throw new Error('Cloudinary belum dikonfigurasi.')
  const formData = new FormData(); formData.append('file', file); formData.append('upload_preset', UPLOAD_PRESET!); formData.append('folder', 'perpus-lasem/files')
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, { method: 'POST', body: formData })
  if (!res.ok) throw new Error(`Gagal upload file ke Cloudinary (${res.status}).`)
  const data = await res.json(); return { url: data.secure_url, publicId: data.public_id, bytes: data.bytes }
}

export async function uploadCloudinary(file: File, folder: 'covers' | 'files' | 'news'): Promise<string> {
  if (!cloudinaryConfigured) {
    throw new Error('Upload Cloudinary belum dikonfigurasi (.env). Gunakan URL gambar manual.')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET!)
  // Folder agar rapi di dashboard Cloudinary
  formData.append('folder', `perpus-lasem/${folder}`)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Gagal upload ke Cloudinary: ${res.status} ${text}`)
  }

  const data = await res.json()
  return data.secure_url as string
}
