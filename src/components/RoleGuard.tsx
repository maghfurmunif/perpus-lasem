import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

interface RoleGuardProps {
  allowed: string[];
  children: React.ReactNode;
}

export default function RoleGuard({ allowed, children }: RoleGuardProps) {
  const { profile, loading, user } = useAuth();

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAF8] text-stone-500 text-sm">
        Memeriksa hak akses...
      </div>
    );

  if (!user || !profile) return <Navigate to="/login" replace />;

  if (!allowed.includes(profile.role)) return <Navigate to="/" replace />;

  return <>{children}</>;
}
