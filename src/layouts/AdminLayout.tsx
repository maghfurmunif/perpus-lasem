import { NavLink, Outlet, useParams } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { adminRoutes } from '../routes/paths';
export default function AdminLayout() {
  const { username } = useParams();
  const { profile, logout, role } = useAuth();
  const base = `/app/${username}`;
  return <div className="min-h-screen bg-[#F8F9FA] text-[#1F2937] lg:grid lg:grid-cols-[256px_minmax(0,1fr)]">
    <aside className="bg-white border-r p-5 lg:sticky lg:top-0 lg:h-screen overflow-y-auto">
      <NavLink to={base} className="flex gap-3 items-center font-bold text-[#1E4D3E]"><img src="/logo-lasem-mark.png" alt="" className="w-12 h-12" />Perpustakaan Desa Lasem</NavLink>
      <p className="my-5 text-sm">{profile?.nama_lengkap} · {role}</p>
      <nav aria-label="Administrasi" className="flex lg:flex-col gap-1 overflow-x-auto">
        {adminRoutes.filter(([path, , superOnly]) => !path.includes(':') && (!superOnly || role === 'superadmin')).map(([path, title]) =>
          <NavLink end key={path} to={`${base}/${path}`} className={({isActive}) => `p-3 rounded-xl whitespace-nowrap text-sm ${isActive ? 'bg-emerald-50 text-emerald-900 font-bold' : 'hover:bg-stone-50'}`}>{title}</NavLink>)}
      </nav>
      <NavLink className="block p-3 mt-5" to={base}>Beranda anggota</NavLink><button className="p-3 text-rose-700" onClick={logout}>Keluar</button>
    </aside>
    <main className="min-w-0 p-5 sm:p-8"><Outlet /></main>
  </div>;
}
