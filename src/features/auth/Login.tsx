import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "./AuthContext";

export default function Login() {
  const { login, profile, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setBusy(true);

    const { error } = await login(email, password);
    setBusy(false);

    if (error) {
      setErrorMsg(error);
      return;
    }

    // Berhasil: arahkan sesuai role (profile di-load ulang oleh onAuthStateChange)
    const slug = (profile?.nama_lengkap || email.split('@')[0]).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    navigate("/app", { replace: true });
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-[#F8FAF8]">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg border border-stone-200 p-7 space-y-5">
        <div className="text-center space-y-2">
          <img src="/logo-terang-literasi-transparent.png" alt="Terang Literasi" className="mx-auto h-20 w-64 object-contain shadow-md" />
          <h1 className="text-xl font-bold text-stone-900 font-serif">
            Terang Literasi
          </h1>
          <p className="text-xs text-stone-500">
            Masuk dengan akun anggota perpustakaan desa
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {profile && isAdmin && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
            Anda login sebagai <strong>{profile.role}</strong>. Portal pengelola tersedia setelah masuk aplikasi.
          </div>
        )}

        <form onSubmit={submit} className="space-y-3">
          <input
            className="border border-stone-300 rounded-xl p-3 w-full text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
            placeholder="Email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="border border-stone-300 rounded-xl p-3 w-full text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
            placeholder="Password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={busy}
            className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white rounded-xl p-3 w-full font-bold text-sm transition active:scale-[0.98]"
          >
            {busy ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="text-xs text-stone-500 text-center">
          Belum jadi anggota?{" "}
          <Link to="/register" className="text-emerald-800 font-bold hover:underline">
            Daftar Anggota
          </Link>
        </p>

        <p className="text-[11px] text-stone-400 text-center pt-2 border-t border-stone-100">
          Lupa password? Hubungi pustakawan desa atau{" "}
          <button
            type="button"
            className="underline hover:text-stone-600"
            onClick={async () => {
              if (!email) {
                setErrorMsg("Isi email Anda dulu, lalu tekan kirim ulang.");
                return;
              }
              await supabase.auth.resetPasswordForEmail(email);
              setErrorMsg("Link reset password sudah dikirim ke email Anda.");
            }}
          >
            kirim link reset
          </button>
          .
        </p>
      </div>
    </div>
  );
}
