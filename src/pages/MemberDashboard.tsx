import {useAuth} from "../features/auth/AuthContext";

export default function MemberDashboard(){

 const {profile,logout}=useAuth();

 return (
 <div className="p-5 space-y-4">
  <h1 className="text-2xl font-bold">
   Halo, {profile?.nama_lengkap}
  </h1>

  <div className="grid gap-3">
   <div className="rounded-2xl bg-white shadow p-4">
    📚 Koleksi Saya
   </div>
   <div className="rounded-2xl bg-white shadow p-4">
    📖 Pinjaman Buku
   </div>
   <div className="rounded-2xl bg-white shadow p-4">
    📅 Agenda
   </div>
   <div className="rounded-2xl bg-white shadow p-4">
    👥 Komunitas
   </div>
  </div>

  <button
   className="bg-red-600 text-white p-3 rounded-xl"
   onClick={logout}>
   Keluar
  </button>
 </div>
 )
}
