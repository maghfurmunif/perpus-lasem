import { Book, Announcement, BookCategory, BookRequestItem } from '../types';

export const BOOK_CATEGORIES: { id: BookCategory; label: string; iconName: string; desc: string }[] = [
  { 
    id: 'Pertanian', 
    label: 'Pertanian & Ternak', 
    iconName: 'Sprout',
    desc: 'Bercocok tanam padi, hortikultura, ternak kambing & ikan air tawar' 
  },
  { 
    id: 'UMKM', 
    label: 'UMKM & Keterampilan', 
    iconName: 'Store',
    desc: 'Wirausaha rumahan, pembukuan kas desa, dan pemasaran produk' 
  },
  { 
    id: 'Edukasi', 
    label: 'Edukasi & Sekolah', 
    iconName: 'GraduationCap',
    desc: 'Buku pelajaran SD, SMP, SMA, sains sederhana, dan kamus' 
  },
  { 
    id: 'Budaya Desa', 
    label: 'Budaya & Sejarah', 
    iconName: 'Landmark',
    desc: 'Babat desa, cerita rakyat nusantara, kearifan lokal, dan seni tradisi' 
  },
  { 
    id: 'Fiksi & Populer', 
    label: 'Fiksi & Inspiratif', 
    iconName: 'BookOpen',
    desc: 'Kisah motivasi, novel keluarga desa, cerpen, dan bacaan santai' 
  },
];

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'bk-pertanian-01',
    title: 'Panduan Praktis Budidaya Sayur Organik di Pekarangan Rumah',
    author: 'Ir. H. Sudirman & Tim Balai Tani',
    category: 'Pertanian',
    coverImage: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=600&auto=format&fit=crop&q=80',
    format: 'PDF',
    accessType: 'Akses Terbuka',
    pages: 148,
    fileSize: '2.4 MB',
    rating: 4.8,
    ratingCount: 38,
    totalCopies: 12,
    availableCopies: 8,
    description: 'Buku panduan langkah-demi-langkah memanfaatkan lahan sempit dan pekarangan desa untuk menanam cabai, terong, sawi, dan tomat menggunakan pupuk kompos alami buatan sendiri tanpa pestisida kimia berlebih.',
    isbn: '978-602-8491-12-4',
    year: 2024,
    publisher: 'Pustaka Tani Makmur',
    tags: ['Organik', 'Pekarangan', 'Pupuk Kompos', 'Ketahanan Pangan'],
    isFeatured: true,
    isPopular: true,
    sampleChapters: [
      {
        title: 'Bab 1: Menyiapkan Media Tanam Murah dari Sekam dan Tanah',
        content: `Pekarangan rumah di pedesaan sering kali belum dimanfaatkan secara optimal. Padahal, hanya dengan bedengan kecil berukuran 2x3 meter atau memanfaatkan polybag bekas karung beras, keluarga bisa memanen sayuran segar setiap minggu.\n\nLangkah pertama yang paling penting adalah mencampurkan tanah gembur, sekam bakar, dan kotoran ternak matang dengan perbandingan 2:1:1. Biarkan campuran ini selama 3 hingga 5 hari sebelum ditanami agar mikroba pengurai bekerja maksimal.`
      },
      {
        title: 'Bab 2: Pembuatan Pestisida Nabati Daun Mimba dan Bawang Putih',
        content: `Hama kutu putih dan ulat daun dapat diatasi dengan pestisida nabati yang aman bagi kesehatan keluarga. Tumbuk 5 siung bawang putih bersama segenggam daun mimba atau daun sirsak. Larutkan dalam 2 liter air dan diamkan semalam.\n\nSaring larutan tersebut, tambahkan beberapa tetes sabun cuci piring sebagai perekat, lalu semprotkan pada sore hari saat hama aktif dan terik matahari sudah mereda.`
      }
    ],
    reviews: [
      {
        id: 'rev-1',
        userName: 'Pak Joko (Ketua RT 03)',
        userRole: 'Petani Sayur',
        rating: 5,
        comment: 'Sangat bermanfaat! Penjelasannya pakai bahasa yang gampang dipahami orang tua seperti saya. Resep pupuk komposnya berhasil kami terapkan di kelompok tani.',
        date: '12 September 2026'
      },
      {
        id: 'rev-2',
        userName: 'Bu Sumi',
        userRole: 'Ibu Rumah Tangga',
        rating: 5,
        comment: 'Sekarang terong dan cabai di samping dapur sudah berbuah lebat tanpa beli pupuk toko. Format PDF-nya ringan dibuka di HP.',
        date: '04 September 2026'
      }
    ]
  },
  {
    id: 'bk-umkm-01',
    title: 'Manajemen Keuangan Sederhana untuk Warung & UMKM Desa',
    author: 'Dra. Nur Indahsari, M.Ak',
    category: 'UMKM',
    coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    format: 'EPUB',
    accessType: 'Akses Terbuka',
    pages: 112,
    fileSize: '820 KB',
    rating: 4.9,
    ratingCount: 45,
    totalCopies: 15,
    availableCopies: 11,
    description: 'Cara mudah memisahkan uang belanja dapur dengan kas modal usaha dagang. Dilengkapi contoh buku kas harian, pencatatan piutang pelanggan, dan strategi penetapan harga jual agar tidak boncos.',
    isbn: '978-623-7182-03-9',
    year: 2025,
    publisher: 'Literasi Usaha Desa',
    tags: ['Buku Kas', 'Warung Sembako', 'Modal Usaha', 'Kelola Keuangan'],
    isFeatured: true,
    isPopular: true,
    sampleChapters: [
      {
        title: 'Bab 1: Jebakan Utama - Mengapa Modal Warung Sering Habis?',
        content: `Penyakit paling umum pada pedagang kecil dan warung kelontong adalah mencampurkan kantong uang dagang dengan dompet belanja dapur pribadi. Sering kali saat anak meminta uang jajan atau butuh membeli beras, tangan langsung mengambil dari laci kasir warung tanpa dicatat.\n\nPrinsip emas pertama: "Pemilik warung wajib menggaji dirinya sendiri secara tetap, bukan mengambil keuntungan secara acak setiap hari."`
      },
      {
        title: 'Bab 2: Cara Membuat Format Buku Kas 3 Kolom',
        content: `Cukup sediakan satu buku tulis bergaris. Buat 4 kolom sederhana: Tanggal, Keterangan Transaksi, Uang Masuk, dan Uang Keluar. Setiap malam sebelum menutup warung, luangkan waktu 10 menit untuk menjumlahkan selisih kas fisik di toples dengan catatan di buku.`
      }
    ],
    reviews: [
      {
        id: 'rev-3',
        userName: 'Mbak Rina',
        userRole: 'Pengusaha Keripik Singkong',
        rating: 5,
        comment: 'Formatnya pas banget buat pemula. Dulu uang keripik campur sama uang jajan anak. Sekarang pembukuan jadi tertib dan tabungan kelihatan.',
        date: '10 September 2026'
      }
    ]
  },
  {
    id: 'bk-pertanian-02',
    title: 'Sukses Beternak Kambing Gibas & Etawa Sistem Modern Mandiri Pakan',
    author: 'Drh. Bambang Triyono',
    category: 'Pertanian',
    coverImage: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?w=600&auto=format&fit=crop&q=80',
    format: 'PDF',
    accessType: 'Lisensi Terbatas',
    pages: 186,
    fileSize: '3.1 MB',
    rating: 4.7,
    ratingCount: 29,
    totalCopies: 6,
    availableCopies: 2,
    description: 'Kunci efisiensi peternakan kambing adalah fermentasi silase hijauan dan pembuatan konsentrat mandiri. Menjelaskan desain kandang panggung bersih, pencegahan penyakit kembung, dan manajemen reproduksi indukan unggul.',
    isbn: '978-602-9912-77-1',
    year: 2024,
    publisher: 'AgriDesa Press',
    tags: ['Kambing', 'Silase Pakan', 'Peternakan', 'Kandang Panggung'],
    isPopular: true,
    isNew: true,
    sampleChapters: [
      {
        title: 'Bab 1: Desain Kandang Panggung yang Sehat dan Ramah Lingkungan',
        content: `Kambing yang sehat membutuhkan sirkulasi udara yang baik dan lantai yang selalu kering. Kandang panggung dengan jarak kolong minimal 1 meter dari tanah memudahkan pembersihan kotoran padat dan penampungan urine untuk dijadikan pupuk cair organik POC bernilai tinggi.`
      }
    ],
    reviews: [
      {
        id: 'rev-4',
        userName: 'Pak Slamet',
        userRole: 'Kelompok Ternak Lembu Mukti',
        rating: 5,
        comment: 'Teknik silase rumput odot di buku ini menghemat waktu ngarit kami saat musim kemarau!',
        date: '02 September 2026'
      }
    ]
  },
  {
    id: 'bk-edukasi-01',
    title: 'Ensiklopedia Cilik: Rahasia Alam Semesta & Sains Menakjubkan',
    author: 'Tim Sains Sahabat Belajar',
    category: 'Edukasi',
    coverImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
    format: 'PDF',
    accessType: 'Akses Terbuka',
    pages: 96,
    fileSize: '4.5 MB',
    rating: 4.9,
    ratingCount: 52,
    totalCopies: 20,
    availableCopies: 16,
    description: 'Buku sains bergambar penuh warna yang dirancang khusus untuk anak-anak sekolah dasar. Menjelaskan siklus air hujan, mengapa pelangi melengkung, metamorfosis kupu-kupu, hingga sistem tata surya dengan eksperimen rumah sederhana.',
    isbn: '978-602-1294-81-0',
    year: 2025,
    publisher: 'Balai Pustaka Ramah Anak',
    tags: ['Sains Anak', 'Eksperimen', 'Sekolah Dasar', 'Bergambar'],
    isFeatured: true,
    isNew: true,
    sampleChapters: [
      {
        title: 'Bab 1: Dari Mana Datangnya Air Hujan yang Menyiram Sawah Kita?',
        content: `Pernahkah kamu memperhatikan tetesan embun di pagi hari atau genangan air hujan di jalanan desa yang menghilang saat siang terik? Air itu tidak hilang, melainkan menguap menjadi butiran uap yang terbang tinggi ke langit membentuk awan putih!\n\nKetika awan sudah terlalu berat dan dingin, butiran air bersatu dan turun kembali sebagai hujan berkah yang menyuburkan padi para petani.`
      }
    ],
    reviews: [
      {
        id: 'rev-5',
        userName: 'Bu Guru Wahyu',
        userRole: 'Guru SDN 01 Sukamaju',
        rating: 5,
        comment: 'Siswa-siswi kami sangat antusias membaca buku ini di pojok baca sekolah. Gambar dan bahasanya sangat ramah anak.',
        date: '15 September 2026'
      }
    ]
  },
  {
    id: 'bk-budaya-01',
    title: 'Kumpulan Cerita Rakyat & Kearifan Lokal Nusantara untuk Generasi Muda',
    author: 'Ki Anom Suwito & Lembaga Adat Desa',
    category: 'Budaya Desa',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    format: 'EPUB',
    accessType: 'Akses Terbuka',
    pages: 130,
    fileSize: '740 KB',
    rating: 4.8,
    ratingCount: 31,
    totalCopies: 10,
    availableCopies: 9,
    description: 'Antologi cerita lisan kakek nenek moyang, dongeng fabel satwa bijak, tradisi gotong royong sambatan, dan pitutur luhur yang mengajarkan sopan santun serta cinta tanah air.',
    isbn: '978-623-8801-44-2',
    year: 2023,
    publisher: 'Pustaka Tradisi Desa',
    tags: ['Cerita Rakyat', 'Kearifan Lokal', 'Gotong Royong', 'Budi Pekerti'],
    isPopular: false,
    isNew: false,
    sampleChapters: [
      {
        title: 'Kisah 1: Asal-Usul Sendang Bening dan Pohon Beringin Keramat',
        content: `Di ujung barat desa kita, terdapat sebuah mata air jernih yang tak pernah surut kendati kemarau panjang melanda. Para sesepuh terdahulu menanam pohon beringin dan beringin karet bukan untuk disembah, melainkan sebagai payung penahan erosi dan penyerap cadangan air bawah tanah.\n\nPesan leluhur ini mengingatkan kita untuk selalu merawat hutan desa demi kelangsungan anak cucu kita.`
      }
    ],
    reviews: [
      {
        id: 'rev-6',
        userName: 'Mbah Darmo',
        userRole: 'Tokoh Masyarakat',
        rating: 5,
        comment: 'Bagus sekali agar generasi muda tidak melupakan asal usul desanya di tengah serbuan handphone.',
        date: '28 Agustus 2026'
      }
    ]
  },
  {
    id: 'bk-fiksi-01',
    title: 'Lentera di Balik Bukit Kapur: Novel Perjuangan Guru Pengabdi',
    author: 'Ahmad Fauzi & Nurlaila',
    category: 'Fiksi & Populer',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    format: 'EPUB',
    accessType: 'Lisensi Terbatas',
    pages: 240,
    fileSize: '980 KB',
    rating: 4.9,
    ratingCount: 64,
    totalCopies: 8,
    availableCopies: 3,
    description: 'Kisah menyentuh hati tentang seorang sarjana muda yang memilih pulang kampung untuk mendirikan rumah baca di perbukitan kapur, melawan keputusasaan, dan membangkitkan harapan anak-anak buruh tani.',
    isbn: '978-602-0331-50-6',
    year: 2024,
    publisher: 'Bentang Kata Semesta',
    tags: ['Novel Inspiratif', 'Pendidikan Desa', 'Perjuangan', 'Keluarga'],
    isFeatured: true,
    isPopular: true,
    sampleChapters: [
      {
        title: 'Bab 1: Suara Peluit Kereta Senja',
        content: `Langkah sepatu butut Danu menjejak tanah becek stasiun kecil di perbatasan kabupaten. Udara senja beraroma jerami basah dan aroma asap kayu bakar yang membumbung dari cerobong rumah-rumah warga.\n\nBanyak kawan sekampusnya di kota besar menertawakan keputusannya menolak tawaran kerja kantoran. Namun saat Danu menatap barisan bukit kapur tempat ia tumbuh, ia tahu bahwa hutang baktinya ada di sini, di tanah kelahirannya.`
      }
    ],
    reviews: [
      {
        id: 'rev-7',
        userName: 'Siti Maryam',
        userRole: 'Mahasiswi KKN',
        rating: 5,
        comment: 'Membaca buku ini membuat air mata menetes dan hati bergetar. Sangat menginspirasi anak muda untuk berkontribusi bagi desanya.',
        date: '08 September 2026'
      }
    ]
  },
  {
    id: 'bk-umkm-02',
    title: 'Strategi Pemasaran Digital & Foto Produk Pakai HP untuk Pengrajin Desa',
    author: 'Fajar Nugraha, S.Kom',
    category: 'UMKM',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
    format: 'PDF',
    accessType: 'Akses Terbuka',
    pages: 124,
    fileSize: '3.2 MB',
    rating: 4.8,
    ratingCount: 39,
    totalCopies: 14,
    availableCopies: 10,
    description: 'Solusi memasarkan anyaman bambu, batik lurik, kopi lokal, dan olahan sambal desa ke luar kota lewat WhatsApp Bisnis dan toko online tanpa perlu kamera mahal, cukup ponsel pintar.',
    isbn: '978-623-0199-22-8',
    year: 2025,
    publisher: 'Desa Digital Madani',
    tags: ['Foto Produk HP', 'WhatsApp Bisnis', 'Pasar Online', 'Desa Digital'],
    isNew: true,
    sampleChapters: [
      {
        title: 'Bab 1: Menyiapkan Studio Foto Mini Modal Kardus Bekas dan Kertas HVS',
        content: `Tidak perlu membeli lampu studio mahal seharga jutaan rupiah. Cukup manfaatkan kardus mie instan bekas yang dipotong bagian atas dan sisinya, lalu lapisi dengan kertas HVS putih bersih sebagai pemantul cahaya matahari pagi dekat jendela.\n\nLetakkan produk olahan pangan Anda di tengah, dan potretlah sejajar dengan mata calon pembeli.`
      }
    ],
    reviews: [
      {
        id: 'rev-8',
        userName: 'Mas Dani',
        userRole: 'Pengrajin Anyaman Bambu',
        rating: 5,
        comment: 'Trik foto dekat jendela matahari pagi beneran bikin produk anyaman saya kelihatan mewah di status WhatsApp! Pembeli luar kota jadi percaya.',
        date: '16 September 2026'
      }
    ]
  },
  {
    id: 'bk-pertanian-03',
    title: 'Teknik Budidaya Ikan Nila & Lele Bioflok Hemat Air untuk Kolam Rumahan',
    author: 'Ir. Hendra Saputra',
    category: 'Pertanian',
    coverImage: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=600&auto=format&fit=crop&q=80',
    format: 'PDF',
    accessType: 'Lisensi Terbatas',
    pages: 140,
    fileSize: '2.8 MB',
    rating: 4.6,
    ratingCount: 22,
    totalCopies: 7,
    availableCopies: 4,
    description: 'Panduan lengkap budidaya ikan air tawar hemat air dengan sistem bioflok. Cocok untuk pekarangan kering, minim bau, dan padat tebar tinggi yang mampu panen melimpah setiap 3 bulan.',
    isbn: '978-602-7721-39-5',
    year: 2024,
    publisher: 'Pustaka Bahari Tani',
    tags: ['Perikanan', 'Nila Bioflok', 'Hemat Air', 'Wirausaha Desa'],
    isNew: false,
    sampleChapters: [
      {
        title: 'Bab 1: Mengenal Mikroorganisme Bioflok Pembasmi Amonia',
        content: `Sistem bioflok bekerja dengan memanfaatkan bakteri pembentuk flok (seperti Bacillus sp.) yang merombak kotoran ikan dan sisa pakan beracun menjadi gumpalan nutrisi protein tinggi yang bisa dimakan kembali oleh ikan nila. Hasilnya, air tidak perlu sering dikuras dan hemat biaya pakan hingga 30%.`
      }
    ],
    reviews: [
      {
        id: 'rev-9',
        userName: 'Pak Basuki',
        userRole: 'Kelompok Pembudidaya Ikan Mina Lestari',
        rating: 5,
        comment: 'Sangat cocok untuk wilayah desa kami yang sering minim pasokan air saat kemarau.',
        date: '25 Agustus 2026'
      }
    ]
  },
  {
    id: 'bk-lasem-01',
    title: 'Budidaya Bandeng & Udang Vaname Pesisir Sidayu: Manajemen Tambak Tradisional-Modern',
    author: 'H. Abdul Ghofur & Balai Penyuluhan Pesisir Sidayu',
    category: 'Pertanian',
    coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80',
    format: 'PDF',
    accessType: 'Akses Terbuka',
    pages: 165,
    fileSize: '3.4 MB',
    rating: 4.9,
    ratingCount: 47,
    totalCopies: 14,
    availableCopies: 10,
    description: 'Panduan komprehensif bagi petambak Desa Lasem Sidayu dan sekitarnya dalam mengelola air tambak payau, pencegahan penyakit udang berak putih, seleksi bibit nener bandeng unggul, hingga siklus panen berkesinambungan.',
    isbn: '978-623-9081-12-8',
    year: 2025,
    publisher: 'Pustaka Pesisir Gresik',
    tags: ['Tambak Bandeng', 'Udang Vaname', 'Lasem Sidayu', 'Perikanan Payau'],
    isFeatured: true,
    isPopular: true,
    isNew: true,
    sampleChapters: [
      {
        title: 'Bab 1: Menjaga Kualitas Salinitas & Aerasi Air Tambak Pesisir Lasem',
        content: `Kawasan tambak di pesisir Sidayu memiliki karakteristik fluktuasi salinitas air laut dan muara sungai yang dinamis. Petambak di Desa Lasem yang sukses umumnya mengandalkan pengendapan air di petak tandon sebelum dialirkan ke petak pembesaran bandeng dan udang vaname.\n\nPertahankan kadar pH air antara 7.5 hingga 8.2 dan pantau sirkulasi oksigen terlarut terutama menjelang subuh.`
      }
    ],
    reviews: [
      {
        id: 'rev-lasem-1',
        userName: 'Cak Mukhlas',
        userRole: 'Petambak Dusun Tambak Sari, Lasem',
        rating: 5,
        comment: 'Sangat pas dengan kondisi tambak kami di Desa Lasem Sidayu! Penjelasan pakan alami lumut sutra sangat membantu pangkas ongkos pelet pabrikan.',
        date: '16 September 2026'
      }
    ]
  },
  {
    id: 'bk-lasem-02',
    title: 'Sejarah Peradaban Kadipaten Sidayu, Jejak Santri & Kearifan Pesisir Gresik',
    author: 'Drs. H. M. Zainuri, M.Hum & Lembaga Sejarah Sidayu',
    category: 'Budaya Desa',
    coverImage: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&auto=format&fit=crop&q=80',
    format: 'EPUB',
    accessType: 'Akses Terbuka',
    pages: 210,
    fileSize: '1.2 MB',
    rating: 5.0,
    ratingCount: 58,
    totalCopies: 10,
    availableCopies: 8,
    description: 'Menelusuri sejarah kebesaran Kadipaten Sidayu di masa lampau, peran para ulama dan santri dalam perjuangan kemerdekaan, perkembangan desa-desa pesisir seperti Lasem, serta nilai-nilai tradisi keagamaan yang luhur.',
    isbn: '978-602-5431-88-3',
    year: 2024,
    publisher: 'Pustaka Santri Sedayu',
    tags: ['Sejarah Sidayu', 'Babat Desa', 'Pesantren', 'Budaya Gresik'],
    isFeatured: true,
    isPopular: true,
    sampleChapters: [
      {
        title: 'Bab 1: Sidayu Sebagai Bandar Dagang dan Gerbang Ilmu Pesisir Utara',
        content: `Di masa silam, Sidayu bukan sekadar kadipaten biasa, melainkan pusat pemerintahan maritim yang menghubungkan jalur perdagangan Selat Madura dengan pedalaman Jawa Timur. Hubungan erat antara penguasa kadipaten, ulama pesantren, dan masyarakat pesisir melahirkan peradaban santri yang ramah, menjunjung tinggi pendidikan dan gotong royong.`
      }
    ],
    reviews: [
      {
        id: 'rev-lasem-2',
        userName: 'Gus Farhan',
        userRole: 'Pengajar Madrasah Sidayu',
        rating: 5,
        comment: 'Buku wajib bagi generasi muda dan anak cucu kita di Lasem Sidayu agar mengerti sejarah luhur leluhurnya.',
        date: '10 September 2026'
      }
    ]
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'anc-1',
    title: 'Musyawarah Literasi Desa Lasem: Alokasi Dana Desa 2027 untuk Ruang Baca Anak',
    date: '24 September 2026',
    category: 'Pemerintahan Desa',
    summary: 'Pemerintah Desa Lasem Sidayu bersama BPD mengundang warga dan pengurus RT/RW dalam pemaparan program pojok baca digital serta pengadaan 250 buku budidaya tambak & pelajaran sekolah.',
    author: 'Pemerintah Desa Lasem & BPD',
    badge: 'Penting'
  },
  {
    id: 'anc-2',
    title: 'Kelas Bedah Buku: Sukses Tambak Bandeng & Udang Bersama Dinas Perikanan',
    date: '20 September 2026',
    category: 'Pelatihan Warga',
    summary: 'Diadakan di Aula Balai Desa Lasem Sidayu pukul 09.00 WIB. Gratis untuk seluruh petambak dan warga. Disediakan modul PDF dan e-sertifikat dari pengurus perpustakaan.',
    author: 'Pengurus Perpusdes Lasem & PPL Perikanan',
    badge: 'Agenda'
  },
  {
    id: 'anc-3',
    title: 'Layanan Pinjam Buku Khusus Lansia & Santri Pondok di Lasem Sidayu',
    date: '15 September 2026',
    category: 'Layanan Desa',
    summary: 'Relawan perpustakaan desa kini membuka layanan pengantaran buku bacaan ke rumah warga lanjut usia dan pondok pesantren di wilayah Desa Lasem setiap akhir pekan.',
    author: 'Relawan Literasi Lasem Sidayu',
    badge: 'Layanan'
  }
];

export const INITIAL_BOOK_REQUESTS: BookRequestItem[] = [
  {
    id: 'req-1',
    title: 'Teknologi Kincir Air Tenaga Surya untuk Penghematan Listrik Tambak',
    author: 'Dr. Ir. Wahyudi M.T.',
    category: 'Pertanian',
    reason: 'Kelompok Petambak Dusun Tambak Sari Lasem butuh referensi untuk menekan biaya tagihan listrik PLN kincir tambak bandeng.',
    requesterName: 'H. Sudarno (Ketua Pokdakan Tambak Sari)',
    requesterDusun: 'Dusun Tambak Sari, RT 03',
    requesterPhone: '0813-2233-4455',
    requestDate: '17 September 2026',
    status: 'approved',
    budgetEstimated: 'Rp 185.000',
    notes: 'Disetujui Sekdes untuk dimasukkan pengadaan buku APBDes Triwulan IV.'
  },
  {
    id: 'req-2',
    title: 'Kumpulan Soal Asesmen Nasional (AKM) & SNBT 2027 untuk Siswa SMA/MA',
    author: 'Tim Guru Bimbingan Belajar Nasional',
    category: 'Edukasi',
    reason: 'Banyak anak-anak SMA dan Madrasah Aliyah di Lasem Sidayu yang ingin berlatih tes masuk perguruan tinggi negeri secara mandiri.',
    requesterName: 'Ahmad Muzakki (Karang Taruna Tunas Bangsa)',
    requesterDusun: 'Dusun Kauman, RT 01',
    requesterPhone: '0857-9988-1122',
    requestDate: '15 September 2026',
    status: 'approved',
    budgetEstimated: 'Rp 240.000',
    notes: 'Diprioritaskan pengadaan 3 eksemplar fisik + e-book PDF.'
  },
  {
    id: 'req-3',
    title: 'Olahan Bandeng Cabut Duri & Otak-Otak Vakum Tahan Lama',
    author: 'Chef Ratna Sari & Tim PKK Pesisir',
    category: 'UMKM',
    reason: 'Ibu-ibu PKK Desa Lasem berencana membuat unit usaha kemasan bandeng siap saji untuk dijual sebagai oleh-oleh khas Sidayu Gresik.',
    requesterName: 'Ibu Hj. Aminah (Ketua TP PKK Desa Lasem)',
    requesterDusun: 'Dusun Sedagaran, RT 02',
    requesterPhone: '0812-4455-6677',
    requestDate: '12 September 2026',
    status: 'fulfilled',
    budgetEstimated: 'Rp 120.000',
    notes: 'Sudah tersedia di rak perpustakaan dan diunggah versi digitalnya.'
  },
  {
    id: 'req-4',
    title: 'Panduan Legalitas NIB, PIRT, dan Sertifikasi Halal Gratis untuk UMKM Desa',
    author: 'Kementerian Koperasi & UKM RI',
    category: 'UMKM',
    reason: 'Pedagang rempeyek, kue tradisional klemben, dan krupuk ikan di Lasem perlu panduan urus izin edar resmi agar bisa masuk minimarket.',
    requesterName: 'Cak Sholeh (Warung Berkah)',
    requesterDusun: 'Dusun Krajan, RT 04',
    requesterPhone: '0818-0987-6543',
    requestDate: '18 September 2026',
    status: 'pending',
    budgetEstimated: 'Rp 95.000',
    notes: 'Menunggu verifikasi Kaur Kesra & Pustakawan.'
  }
];

export const USAGE_TUTORIALS = [
  {
    step: 1,
    title: 'Cari & Pilih Buku',
    description: 'Ketik judul, pengarang, atau pilih kategori (Pertanian, UMKM, Pelajaran). Gunakan filter PDF/EPUB sesuai kapasitas penyimpanan HP.',
    icon: 'Search'
  },
  {
    step: 2,
    title: 'Unduh Sekali, Baca Selamanya',
    description: 'Tekan tombol "Unduh Gratis". File tersimpan aman di aplikasi sehingga Anda dapat membaca di sawah atau rumah tanpa perlu kuota internet.',
    icon: 'DownloadCloud'
  },
  {
    step: 3,
    title: 'Pinjam & Perpanjang Mudah',
    description: 'Buku berlisensi dapat dipinjam dengan 1 klik. Notifikasi otomatis akan mengingatkan H-2 sebelum tanggal pengembalian melalui WhatsApp.',
    icon: 'BookMarked'
  },
  {
    step: 4,
    title: 'Bantuan Ramah Pustakawan',
    description: 'Bingung cara mengoperasikan? Tekan tombol WhatsApp di pojok kanan untuk langsung mengobrol dengan pustakawan desa setempat.',
    icon: 'MessageCircle'
  }
];
