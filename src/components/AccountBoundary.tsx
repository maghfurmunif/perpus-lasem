import { Navigate, Outlet, useLocation, useParams, Link } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { usernameFor } from '../routes/paths';
export function AccountBoundary() {
  const { user, profile, loading, logout, refreshProfile } = useAuth();
  const { username } = useParams();
  const location = useLocation();
  if (loading) return <p className="p-8">Memuat akun…</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (!profile) return <div className="p-8"><p role="alert">Profil tidak dapat dimuat. Periksa koneksi atau hubungi pengelola.</p><button onClick={refreshProfile}>Coba lagi</button><button onClick={logout}>Keluar</button></div>;
  if (!profile.aktif) return <div className="p-8"><p>Akun dinonaktifkan. Hubungi pengelola.</p><button onClick={logout}>Keluar</button></div>;
  const canonical = usernameFor(user);
  if (!username || username !== canonical) return <Navigate to={`/app/${canonical}${location.pathname.split('/').slice(3).length ? '/' + location.pathname.split('/').slice(3).join('/') : ''}`} replace />;
  return <Outlet />;
}
export function AdminGuard({ superOnly = false }: { superOnly?: boolean }) {
  const { isAdmin, role } = useAuth();
  const { username } = useParams();
  return isAdmin && (!superOnly || role === 'superadmin') ? <Outlet /> :
    <div className="p-8"><h1>Akses ditolak</h1><Link to={`/app/${username}`}>Kembali ke Beranda</Link></div>;
}
