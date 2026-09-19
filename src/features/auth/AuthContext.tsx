import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { Profile, UserRole } from "../../types";
import { supabase } from "../../lib/supabase";
import type { User } from "@supabase/supabase-js";

interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  role: UserRole | null;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  register: (data: RegisterData) => Promise<{ error: string | null; needVerify: boolean }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: { nama_lengkap: string; nomor_wa: string; alamat: string }) => Promise<{ error: string | null }>;
}

export interface RegisterData {
  nama_lengkap: string;
  email: string;
  password: string;
  nomor_wa: string;
  alamat: string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (id: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();
    setProfile((data as Profile) ?? null);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const current = data.session?.user ?? null;
      setUser(current);
      if (current) loadProfile(current.id);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const current = session?.user ?? null;
        setUser(current);
        if (current) loadProfile(current.id);
        else setProfile(null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [loadProfile]);

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? translateError(error.message) : null };
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const { data: res, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          nama_lengkap: data.nama_lengkap,
          nomor_wa: data.nomor_wa,
          alamat: data.alamat,
        },
      },
    });

    if (error) return { error: translateError(error.message), needVerify: false };

    // Jika project Supabase mengaktifkan konfirmasi email, session belum ada.
    const needVerify = !res.session;
    return { error: null, needVerify };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) await loadProfile(user.id);
  }, [user, loadProfile]);

  const updateProfile = useCallback(async (data: { nama_lengkap: string; nomor_wa: string; alamat: string }) => {
    if (!user) return { error: 'Sesi pengguna tidak ditemukan.' };
    const { error } = await supabase.from('profiles').update(data).eq('id', user.id);
    if (!error) await loadProfile(user.id);
    return { error: error?.message ?? null };
  }, [user, loadProfile]);

  const role = profile?.role ?? null;
  const isAdmin =
    role === "superadmin" || role === "admin" || role === "pustakawan" || role === "kepala_desa";

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, isAdmin, role, login, register, logout, refreshProfile, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function translateError(msg: string): string {
  if (msg.includes("Invalid login credentials")) return "Email atau password salah.";
  if (msg.includes("Email not confirmed"))
    return "Email belum dikonfirmasi. Silakan cek kotak masuk / folder spam Anda.";
  if (msg.includes("User already registered")) return "Email sudah terdaftar. Silakan login.";
  if (msg.includes("Password should be at least"))
    return "Password minimal 6 karakter.";
  if (msg.includes("valid email")) return "Format email tidak valid.";
  return msg;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam AuthProvider");
  return ctx;
}
