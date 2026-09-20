export const memberRoutes = ['', 'koleksi', 'koleksi/:bookSlug', 'peminjaman', 'unduhan', 'profil', 'komunitas'];
export const adminRoutes = [
  ['admin', 'Ikhtisar', false], ['katalog-buku', 'Katalog Buku', false],
  ['katalog-buku/upload-buku', 'Unggah Buku', false], ['katalog-buku/edit/:bookId', 'Edit Buku', false],
  ['unggah-artikel', 'Unggah Artikel', false], ['unggah-artikel/edit/:announcementId', 'Edit Artikel', false], ['sirkulasi', 'Sirkulasi Pinjam', false],
  ['usulan-buku', 'Usulan Buku', false], ['laporan', 'Laporan', false],
  ['pengaturan-admin', 'Pengaturan Admin', true], ['katalog-buku/unggah-masal', 'Unggah Masal', true],
] as const;
export const usernameFor = (user: { id: string; email?: string }) =>
  (user.email?.split('@')[0] || user.id).toLowerCase().replace(/[^a-z0-9-]+/g, '-') || user.id;
