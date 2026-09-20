import { NavLink, useParams } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
interface Props { currentTab: string; onNavigate: (tab: string) => void; role?: import('../types').UserRole | null; userName: string; onLogout: () => void; }
export const AppSidebar = ({ userName, onLogout }: Props) => {
 const { username } = useParams();
 const base = `/app/${username}`;
 const { isAdmin } = useAuth();
 return <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 bg-white border-r p-6 flex-col overflow-y-auto">
 <NavLink to={base} end className="flex gap-3 items-center font-bold text-[#1E4D3E]"><img src="/logo-lasem-mark.png" alt="" className="w-12 h-12"/>Perpustakaan Desa Lasem</NavLink>
 <p className="my-6 text-sm">Masuk sebagai {userName}</p><nav className="space-y-2">
 {[['','Beranda'],['koleksi','Koleksi'],['peminjaman','Peminjaman'],['unduhan','Unduhan'],['komunitas','Warta & Kreasi'],['profil','Profil']].map(([path,label])=><NavLink key={path} end to={`${base}/${path}`} className={({isActive})=>`block p-3 rounded-xl ${isActive?'bg-emerald-50 text-emerald-900 font-bold':''}`}>{label}</NavLink>)}
 {isAdmin&&<NavLink className="block p-3 text-emerald-800 font-bold" to={`${base}/admin`}>Administrasi</NavLink>}
 </nav><button className="mt-auto p-3 text-left text-rose-700" onClick={onLogout}>Keluar</button></aside>;
};
