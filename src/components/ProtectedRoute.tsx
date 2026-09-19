import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[#F8FAF8] text-stone-500 text-sm">
        <div className="w-8 h-8 rounded-full border-3 border-emerald-600 border-t-transparent animate-spin" />
        Memuat aplikasi...
      </div>
    );

  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
