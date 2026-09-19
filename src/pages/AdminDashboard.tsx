export default function AdminDashboard(){

return(
<div className="p-5">
<h1 className="text-2xl font-bold">
Dashboard Admin
</h1>

<div className="grid gap-3 mt-5">
<div className="p-4 bg-white rounded-xl shadow">📊 Statistik</div>
<div className="p-4 bg-white rounded-xl shadow">👥 User</div>
<div className="p-4 bg-white rounded-xl shadow">📚 Koleksi</div>
<div className="p-4 bg-white rounded-xl shadow">⚙ Pengaturan</div>
</div>

</div>
)
}
