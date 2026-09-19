import React, { useEffect, useState, useCallback } from 'react';
import {
  Users, MessageSquare, Calendar, Heart, Send, Sparkles, BookOpen,
  TrendingUp, HelpCircle, Star, Loader2,
} from 'lucide-react';
import { ForumPost, Announcement } from '../types';
import * as db from '../lib/db';
import { hasSupabase } from '../lib/supabase';

interface CommunityTabProps {
  userName: string;
  userId: string;
  announcements: Announcement[];
}

const FORUM_CATEGORIES = ['Umum', 'Tani & Tambak', 'UMKM', 'Edukasi Anak', 'Baca Bersama'];

export const CommunityTab: React.FC<CommunityTabProps> = ({ userName, userId, announcements }) => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('Umum');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await db.fetchForumPosts();
    setPosts(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (!hasSupabase || !userId) {
      setError('Forum aktif setelah database & login anggota tersambung.');
      return;
    }

    setSending(true);
    setError(null);
    const saved = await db.insertForumPost({
      user_id: userId,
      author_name: userName,
      category,
      title: title.trim(),
      content: content.trim(),
    });
    setSending(false);

    if (saved) {
      setPosts((prev) => [saved, ...prev]);
      setTitle('');
      setContent('');
    } else {
      setError('Gagal mengirim postingan. Coba lagi.');
    }
  };

  const handleLike = async (post: ForumPost) => {
    const ok = await db.likeForumPost(post.id, post.likes);
    if (ok) {
      setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, likes: p.likes + 1 } : p)));
    }
  };

  return (
    <div className="pb-24 pt-4 sm:pt-6 space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">
            Komunitas Warga Pembaca
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Forum diskusi buku, cerita tani & tambak, dan agenda kegiatan desa
          </p>
        </div>
        <div className="text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 font-semibold self-start sm:self-auto">
          {posts.length} postingan warga
        </div>
      </div>

      {/* Agenda (dari tabel announcements) */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-700" />
          <span>Agenda & Kegiatan Terdekat</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {announcements.slice(0, 3).map((anc) => (
            <div key={anc.id} className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  {anc.badge}
                </span>
                <span className="text-[11px] text-stone-400">{anc.date}</span>
              </div>
              <h3 className="font-bold text-sm text-stone-900 leading-snug">{anc.title}</h3>
              <p className="text-[11px] text-stone-500 line-clamp-2">{anc.summary}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Form Posting Baru */}
      <section className="bg-white rounded-3xl border border-stone-200 p-5 space-y-3">
        <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-emerald-700" />
          <span>Bagikan Cerita atau Pertanyaan</span>
        </h2>

        {error && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-2.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl outline-none focus:ring-1 focus:ring-emerald-600 font-semibold text-stone-800"
            >
              {FORUM_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input
              type="text"
              required
              placeholder="Judul postingan..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="sm:col-span-2 px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>
          <textarea
            rows={3}
            required
            placeholder="Tulis cerita, pertanyaan, atau rekomendasi buku untuk warga lain..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl outline-none focus:ring-1 focus:ring-emerald-600"
          />
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-stone-400">
              Menulis sebagai <strong>{userName}</strong>
            </span>
            <button
              type="submit"
              disabled={sending}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white rounded-xl font-bold flex items-center gap-1.5 transition active:scale-95"
            >
              {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>{sending ? 'Mengirim...' : 'Kirim Postingan'}</span>
            </button>
          </div>
        </form>
      </section>

      {/* Daftar Postingan */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-700" />
          <span>Diskusi Warga</span>
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-10 text-stone-400 text-xs gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Memuat diskusi...
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-10 text-center space-y-2">
            <Sparkles className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="font-bold text-stone-800">Belum Ada Diskusi</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Jadilah yang pertama berbagi cerita buku favorit atau pertanyaan pertanian di forum warga!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-2xl border border-stone-200 shadow-xs p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center">
                      {post.author_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <strong className="text-stone-900">{post.author_name}</strong>
                      <span className="text-stone-400 text-[10px] block">
                        {new Date(post.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-bold text-[10px]">
                    {post.category}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-stone-900">{post.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed whitespace-pre-line">{post.content}</p>

                <button
                  onClick={() => handleLike(post)}
                  className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-rose-600 transition pt-1"
                >
                  <Heart className={`w-4 h-4 ${post.likes > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{post.likes > 0 ? post.likes : 'Suka'}</span>
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};
