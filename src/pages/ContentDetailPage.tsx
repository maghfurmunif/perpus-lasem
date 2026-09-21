import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import * as db from '../lib/db'
import { contentSlug } from '../lib/contentSlug'
import type { Announcement, ForumPost } from '../types'

type ContentType = 'artikel' | 'pengumuman' | 'kreasi'

export default function ContentDetailPage({ type }: { type: ContentType }) {
  const { contentSlug: slug } = useParams()
  const [announcement, setAnnouncement] = useState<Announcement | null>(null)
  const [post, setPost] = useState<ForumPost | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    void Promise.all([db.fetchAnnouncements(true), db.fetchForumPosts()])
      .then(([announcements, posts]) => {
        if (type === 'kreasi') setPost(posts.find((item) => contentSlug(item.title) === slug) ?? null)
        else setAnnouncement(announcements.data.find((item) => item.contentType === type && contentSlug(item.title) === slug) ?? null)
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : 'Konten gagal dimuat.'))
  }, [slug, type])

  const title = type === 'kreasi' ? post?.title : announcement?.title
  const body = type === 'kreasi' ? post?.content : announcement?.summary
  const image = type === 'kreasi' ? post?.image_url : announcement?.coverImage
  const author = type === 'kreasi' ? post?.author_name : announcement?.author

  if (error) return <main className="min-h-screen p-8 text-rose-700">Konten gagal dimuat: {error}</main>
  if (!title) return <main className="min-h-screen p-8 text-slate-500">Memuat konten…</main>

  return <main className="min-h-screen bg-[#F7F4ED] px-5 py-10 text-[#17231F]"><article className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-sm sm:p-10"><Link to={`/${type}`} className="text-sm font-semibold text-emerald-800">← Kembali</Link>{image && <img src={image} alt="" className="mt-6 max-h-[28rem] w-full rounded-2xl object-cover" onError={(event) => { event.currentTarget.style.display = 'none' }} /> }<p className="mt-6 text-sm text-emerald-700">{author}</p><h1 className="mt-2 text-3xl font-bold text-[#163B31] sm:text-4xl">{title}</h1><div className="mt-6 whitespace-pre-line text-base leading-8 text-slate-700">{body}</div></article></main>
}
