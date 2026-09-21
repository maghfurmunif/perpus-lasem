import type { ReactNode } from 'react';

export function ContentSection({ id, eyebrow, title, loading, error, empty, children }: { id: string; eyebrow: string; title: string; loading?: boolean; error?: string; empty?: boolean; children: ReactNode }) {
  return <section id={id} className="mx-auto max-w-7xl px-5 py-14 lg:px-8" aria-labelledby={`${id}-title`}>
    <p className="text-sm font-semibold text-[#A86B12]">{eyebrow}</p>
    <h2 id={`${id}-title`} className="mt-1 text-3xl font-bold text-[#163B31]">{title}</h2>
    {loading && <p className="mt-6 text-sm text-slate-500" role="status">Memuat {title.toLowerCase()}…</p>}
    {error && <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800" role="alert">{error}</div>}
    {!loading && !error && empty && <div className="mt-6 rounded-2xl border border-dashed border-[#B8C9BF] bg-white p-8 text-center text-sm text-slate-500">Belum ada {title.toLowerCase()} yang diterbitkan.</div>}
    {!loading && !error && !empty && <div className="mt-7">{children}</div>}
  </section>;
}
