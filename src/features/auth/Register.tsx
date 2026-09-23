import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nama_lengkap: "",
    email: "",
    nomor_wa: "",
    alamat: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function set(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (form.password.length < 6) {
      setErrorMsg("Password minimal 6 karakter.");
      return;
    }

    setBusy(true);
    const { error, needVerify } = await register(form);
    setBusy(false);

    if (error) {
      setErrorMsg(error);
      return;
    }

    if (needVerify) {
      setSuccessMsg(
        "Pendaftaran berhasil! Silakan cek email untuk verifikasi, lalu login."
      );
      setTimeout(() => navigate("/login", { replace: true }), 2500);
    } else {
      // Konfirmasi email nonaktif: langsung masuk aplikasi
      const slug = (form.nama_lengkap || form.email.split('@')[0]).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
      navigate("/app", { replace: true });
    }
  }

  const fields: { key: keyof typeof form; label: string; type: string; placeholder: string }[] = [
    { key: "nama_lengkap", label: "Nama Lengkap", type: "text", placeholder: "Contoh: Bpk. Bambang Sutrisno" },
    { key: "email", label: "Email", type: "email", placeholder: "nama@email.com" },
    { key: "nomor_wa", label: "Nomor WhatsApp", type: "tel", placeholder: "0812-3456-7890" },
    { key: "alamat", label: "Dusun / RT / RW", type: "text", placeholder: "Dusun Krajan RT 02 / RW 01" },
    { key: "password", label: "Password", type: "password", placeholder: "Minimal 6 karakter" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-[#F8FAF8]">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg border border-stone-200 p-7 space-y-5">
        <div className="text-center space-y-2">
          <img src="/logo-terang-literasi-transparent.png" alt="Terang Literasi" className="mx-auto h-20 w-64 object-contain shadow-md" />
          <h1 className="text-xl font-bold text-stone-900 font-serif">
            Daftar Anggota Perpustakaan
          </h1>
          <p className="text-xs text-stone-500">
            Gratis untuk seluruh warga Desa Lasem Sidayu
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
            {successMsg}
          </div>
        )}

        <form onSubmit={submit} className="space-y-3">
          {fields.map((f) => (
            <div key={f.key} className="space-y-1">
              <label className="text-xs font-bold text-stone-700">{f.label}</label>
              <input
                type={f.type}
                required
                placeholder={f.placeholder}
                autoComplete={f.key === "password" ? "new-password" : "on"}
                value={form[f.key]}
                onChange={(e) => set(f.key, e.target.value)}
                className="border border-stone-300 rounded-xl p-3 w-full text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={busy}
            className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white rounded-xl p-3 w-full font-bold text-sm transition active:scale-[0.98]"
          >
            {busy ? "Mendaftarkan..." : "Daftar Sekarang"}
          </button>
        </form>

        <p className="text-xs text-stone-500 text-center">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-emerald-800 font-bold hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
