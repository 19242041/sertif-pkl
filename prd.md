## 1. Latar Belakang
 
UPTD Pengawasan Ketenagakerjaan Wilayah II Karawang secara rutin menerima siswa/mahasiswa yang melaksanakan Praktik Kerja Lapangan (PKL/magang). Saat ini pencatatan data peserta PKL dan pengarsipan sertifikat magang dilakukan secara manual (dokumen fisik atau spreadsheet terpisah), sehingga rawan data hilang, sulit dicari, dan tidak ada riwayat terpusat.
 
**SI-PKL** dibangun sebagai sistem informasi berbasis web agar admin UPTD dapat mencatat, mengelola, dan mengarsipkan data peserta PKL beserta sertifikat magang mereka dalam satu tempat, lengkap dengan ringkasan dashboard dan laporan.
 
## 2. Tujuan Produk
 
1. Menyediakan satu sumber data (single source of truth) untuk seluruh peserta PKL yang pernah/sedang magang di UPTD Wilayah II Karawang.
2. Memudahkan admin mencatat, mencari, dan memperbarui data peserta PKL secara lengkap.
3. Menyediakan tempat penyimpanan digital untuk sertifikat magang, menggantikan arsip fisik, lengkap dengan riwayat penerbitan sertifikat.
4. Memberikan gambaran cepat (dashboard dengan grafik) mengenai jumlah peserta aktif, selesai, dan kelengkapan sertifikat.
5. Memudahkan admin menghasilkan laporan rekap peserta PKL untuk keperluan pelaporan ke pimpinan.
## 3. Nama & Identitas Produk
 
- **Nama aplikasi**: SI-PKL (Sistem Informasi PKL)
- **Identitas visual**: menggunakan logo resmi Disnakertrans Provinsi Jawa Barat, ditampilkan di halaman login dan sidebar, berdampingan dengan nama "SI-PKL"
- **Subjudul institusi**: "UPTD Pengawasan Ketenagakerjaan Wilayah II Karawang" selalu ditampilkan di bawah logo/nama aplikasi
## 4. Target Pengguna
 
Aplikasi ini **hanya digunakan oleh 1 jenis pengguna: Admin UPTD**. Tidak ada portal atau login untuk peserta PKL, sekolah, maupun publik.
 
| Peran | Jumlah Pengguna | Akses |
|---|---|---|
| Admin | 1 akun (struktur data disiapkan agar mudah ditambah multi-admin di masa depan) | Penuh (create, read, update, delete data peserta PKL, sertifikat, laporan, dan pengaturan akun) |
 
## 5. Lingkup (Scope)
 
### 5.1 Termasuk dalam Scope (In Scope)
- Login admin
- Dashboard ringkasan dengan kartu statistik dan grafik
- CRUD data peserta PKL (termasuk form tambah/ubah lengkap)
- Halaman detail peserta PKL
- Upload, lihat, unduh, dan hapus sertifikat magang (sebagai halaman tersendiri + riwayat sertifikat)
- Pencarian, filter, dan pagination pada daftar data peserta
- Laporan rekap peserta PKL
- Pengaturan akun admin
### 5.2 Tidak Termasuk dalam Scope (Out of Scope) — versi 2.0
- Login/portal untuk peserta PKL atau sekolah asal
- Notifikasi email/WhatsApp otomatis
- Pembuatan sertifikat otomatis (hanya upload, bukan generate/terbitkan sertifikat)
- Multi-role/multi-level approval
- Integrasi dengan sistem lain di lingkungan Disnakertrans
## 6. User Stories
 
| ID | Sebagai | Saya ingin | Agar |
|---|---|---|---|
| US-01 | Admin | login ke sistem dengan username & password | data hanya bisa diakses oleh pihak yang berwenang |
| US-02 | Admin | melihat ringkasan jumlah peserta PKL beserta grafik di dashboard | dapat memantau kondisi program PKL secara cepat dan visual |
| US-03 | Admin | menambahkan data peserta PKL baru lengkap dengan data pribadi | data peserta yang baru masuk tercatat menyeluruh |
| US-04 | Admin | mengunggah foto peserta saat menambah/mengubah data | data peserta lebih mudah dikenali secara visual |
| US-05 | Admin | mengubah data peserta PKL | data tetap akurat saat ada perubahan (mis. status selesai) |
| US-06 | Admin | menghapus data peserta PKL | data yang salah input atau tidak relevan dapat dibersihkan |
| US-07 | Admin | mencari peserta berdasarkan nama/NIS/asal sekolah | dapat menemukan data dengan cepat tanpa scroll manual |
| US-08 | Admin | memfilter dan melihat daftar peserta dengan pagination | tetap nyaman menjelajah walau data sudah banyak |
| US-09 | Admin | melihat halaman detail satu peserta secara lengkap | dapat meninjau seluruh riwayat data & sertifikat peserta tersebut |
| US-10 | Admin | mengunggah sertifikat magang untuk peserta tertentu lewat drag & drop | proses unggah cepat dan mudah |
| US-11 | Admin | melihat riwayat sertifikat yang pernah diunggah | dapat memverifikasi/menelusuri sertifikat yang sudah diterbitkan |
| US-12 | Admin | melihat/mengunduh sertifikat yang sudah diunggah | dapat memverifikasi atau membagikan ulang saat dibutuhkan |
| US-13 | Admin | menghasilkan laporan rekap peserta PKL | dapat melaporkan hasil program PKL ke pimpinan |
| US-14 | Admin | mengubah pengaturan akun (username, password, profil) | akun tetap aman dan data profil sesuai |
 
## 7. Kebutuhan Fungsional
 
### 7.1 Autentikasi
- FR-1: Sistem menyediakan halaman login dengan username & password, menampilkan logo Disnakertrans dan nama aplikasi "SI-PKL".
- FR-2: Password disimpan dalam bentuk ter-enkripsi (hashed), tidak plain text.
- FR-3: Sesi admin berakhir otomatis setelah logout atau timeout tertentu.
### 7.2 Dashboard
- FR-4: Menampilkan kartu statistik: Total Peserta, PKL Aktif, PKL Selesai, Sertifikat Terupload, Belum Upload.
- FR-5: Menampilkan grafik garis jumlah peserta PKL per bulan.
- FR-6: Menampilkan grafik donut/pie distribusi status peserta (Aktif/Selesai).
- FR-7: Setiap kartu statistik dapat diklik untuk menuju daftar data yang relevan (mis. klik "PKL Aktif" membuka Data Peserta PKL terfilter status Aktif).
### 7.3 Manajemen Data Peserta PKL
- FR-8: Admin dapat menambah data peserta PKL baru melalui form terpisah (halaman "Tambah Peserta"), meliputi:
  - Nama lengkap
  - NIS/NIM
  - Asal sekolah/kampus
  - Jurusan
  - Jenis kelamin
  - Tempat lahir
  - Tanggal lahir
  - Pembimbing sekolah
  - Tanggal mulai PKL
  - Tanggal selesai PKL
  - No. HP
  - Status (Aktif/Selesai/Berhenti)
  - Email
  - Keterangan (opsional)
  - Foto peserta (opsional, upload gambar)
- FR-9: Field wajib minimal: nama lengkap, asal sekolah/kampus. Field lain direkomendasikan diisi lengkap.
- FR-10: Admin dapat mengubah seluruh field data peserta yang sudah ada melalui halaman/form yang sama dengan mode edit.
- FR-11: Admin dapat menghapus data peserta PKL, disertai dialog konfirmasi sebelum penghapusan final.
- FR-12: Menghapus data peserta turut menghapus file sertifikat & foto terkait dari penyimpanan.
- FR-13: Admin dapat mencari data berdasarkan nama atau asal sekolah/kampus (pencarian real-time).
- FR-14: Admin dapat memfilter data berdasarkan status.
- FR-15: Daftar data peserta ditampilkan dengan pagination (menampilkan jumlah data per halaman, mis. 5–10 baris per halaman).
- FR-16: Admin dapat membuka halaman Detail Peserta yang menampilkan seluruh data pribadi, data PKL, foto, status, dan informasi sertifikat (nomor, tanggal, file) dari satu peserta. Dari halaman ini admin dapat langsung mengubah (Edit) atau menghapus (Hapus) data peserta tersebut.
### 7.4 Manajemen Sertifikat (Generate Otomatis dari Template)
- FR-17: Admin mengunggah **1 file template desain sertifikat kosong** (JPG/PNG, tanpa teks nama/tanggal) melalui halaman "Template Sertifikat". Template ini dipakai ulang untuk semua peserta, bukan diunggah satu-satu per peserta.
- FR-17a: Admin dapat mengatur posisi (koordinat X/Y), ukuran font, dan perataan teks untuk 3 elemen yang akan ditimpakan otomatis di atas template: Nama Peserta, Periode PKL, dan Tanggal (baris di bawah tanda tangan Kepala UPTD). Pengaturan ini disimpan dan berlaku untuk seluruh proses generate berikutnya.
- FR-18: Di halaman "Upload Sertifikat" (fungsinya berubah jadi "Generate Sertifikat"), admin memilih peserta, mengisi nomor sertifikat dan tanggal sertifikat, lalu menekan tombol "Generate Sertifikat". Sistem otomatis menimpakan nama peserta, periode PKL (dari data tanggal mulai–selesai peserta), dan tanggal ke posisi yang sudah diatur di atas template, lalu menyimpan hasilnya sebagai file sertifikat milik peserta tersebut.
- FR-19: Hasil generate tercatat dalam tabel "Riwayat Sertifikat" yang menampilkan nama peserta, nomor sertifikat, tanggal, dan aksi lihat/unduh — sama seperti sebelumnya, hanya sumber filenya kini hasil generate otomatis, bukan unggahan manual.
- FR-20: Sistem menampilkan indikator status sertifikat ("Sudah Dibuat"/"Belum Dibuat") pada daftar data peserta.
- FR-21: Admin dapat men-generate ulang (replace) sertifikat seorang peserta apabila data berubah atau ada kesalahan, serta menghapus hasil sertifikat yang sudah dibuat.
### 7.5 Laporan
- FR-22: Admin dapat melihat halaman Laporan berisi rekap jumlah peserta PKL berdasarkan periode (mis. per bulan/semester/tahun) dan status.
- FR-23: Admin dapat mengekspor laporan rekap peserta PKL ke format Excel dan/atau PDF.
- FR-24: Laporan dapat difilter berdasarkan rentang tanggal mulai/selesai PKL.
### 7.6 Pengaturan
- FR-25: Admin dapat mengubah data akunnya sendiri: nama, username, password.
- FR-26: Admin dapat mengubah pengaturan tampilan instansi (nama instansi, logo) jika diperlukan di kemudian hari — opsional untuk versi awal, dapat berupa data statis dahulu.
## 8. Kebutuhan Data (Model Data Minimal)
 
**Entity: PesertaPKL**
 
| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID/Int | Primary key |
| nama | String | Wajib |
| nis_nim | String | NIS (sekolah) atau NIM (kampus) |
| asal_institusi | String | Wajib |
| jurusan | String | Jurusan/program studi |
| jenis_kelamin | Enum | Laki-laki, Perempuan |
| tempat_lahir | String | |
| tanggal_lahir | Date | |
| no_hp | String | Nomor HP/WhatsApp |
| email | String | |
| pembimbing_sekolah | String | Guru/dosen pembimbing dari institusi asal |
| pembimbing_lapangan | String | Staf UPTD yang membimbing |
| tanggal_mulai | Date | Tanggal mulai PKL |
| tanggal_selesai | Date | Tanggal selesai PKL |
| status | Enum | Aktif, Selesai, Berhenti |
| keterangan | Text | Opsional |
| foto_url | String/nullable | Path/URL foto peserta |
| created_at | Timestamp | |
| updated_at | Timestamp | |
 
**Entity: Sertifikat**
 
| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID/Int | Primary key |
| peserta_id | FK → PesertaPKL | |
| nomor_sertifikat | String | |
| tanggal_sertifikat | Date | |
| file_path | String | Path/URL file hasil generate (gambar/PDF) |
| generated_at | Timestamp | Waktu sertifikat dibuat/di-generate ulang |
 
**Entity: TemplateSertifikat**
 
| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID/Int | Primary key |
| file_path | String | Path file desain template kosong (JPG/PNG) |
| posisi_nama_x / posisi_nama_y | Integer | Koordinat teks Nama Peserta |
| posisi_periode_x / posisi_periode_y | Integer | Koordinat teks Periode PKL |
| posisi_tanggal_x / posisi_tanggal_y | Integer | Koordinat teks Tanggal (bawah tanda tangan Kepala UPTD) |
| font_size | Integer | Ukuran font default untuk semua teks (bisa dipecah per elemen bila diperlukan) |
| alignment | Enum | Kiri, Tengah, Kanan |
| updated_at | Timestamp | |
 
**Entity: Admin**
 
| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID/Int | Primary key |
| nama | String | |
| username | String | Unik |
| password_hash | String | |
 
## 9. Kebutuhan Non-Fungsional
 
- **Keamanan**: hanya admin ter-autentikasi yang dapat mengakses seluruh fitur; password ter-enkripsi; validasi input di sisi server; validasi tipe & ukuran file upload (foto & sertifikat).
- **Performa**: pencarian, filter, dan pagination merespons dalam < 1 detik untuk jumlah data hingga beberapa ribu baris.
- **Ketersediaan**: aplikasi dapat diakses selama jam kerja tanpa gangguan berarti; backup data berkala direkomendasikan.
- **Kompatibilitas**: berjalan baik di browser modern (Chrome, Edge, Firefox) versi terbaru, desktop-first namun tetap dapat digunakan di layar tablet/laptop kecil.
- **Skalabilitas data**: mendukung penyimpanan data peserta PKL untuk beberapa tahun ajaran/periode tanpa penurunan performa signifikan.
- **Auditability**: setiap data memiliki `created_at` dan `updated_at` untuk keperluan penelusuran perubahan.
## 10. Kriteria Keberhasilan (Success Metrics)
 
- 100% data peserta PKL yang aktif tercatat dalam sistem (tidak ada lagi pencatatan manual paralel).
- Waktu pencarian data peserta tertentu berkurang signifikan dibanding metode manual sebelumnya.
- Seluruh sertifikat peserta yang telah menyelesaikan program tersimpan digital dan tercatat dalam riwayat sertifikat.
- Laporan rekap dapat dihasilkan dalam hitungan detik tanpa rekap manual.
## 11. Risiko & Asumsi
 
| Risiko/Asumsi | Mitigasi |
|---|---|
| Admin lupa password dan tidak ada mekanisme reset | Sediakan mekanisme reset password oleh super-admin/developer, atau minimal reset manual via database |
| File sertifikat/foto berukuran besar membebani penyimpanan server | Batasi ukuran unggah maksimal 5MB per file, pertimbangkan kompresi gambar |
| Data hilang karena tidak ada backup | Terapkan backup database berkala (harian/mingguan) |
| Kebutuhan multi-admin di masa depan | Struktur database/role sudah disiapkan agar mudah ditambah tanpa migrasi besar |
| Fitur Laporan/Pengaturan berkembang lebih kompleks dari kebutuhan awal | Mulai dengan versi sederhana (rekap dasar + export), tambahkan fitur lanjutan secara bertahap |
 
## 12. Roadmap Potensial (Versi Berikutnya)
 
- Multi-admin dengan log aktivitas (siapa mengubah data apa dan kapan).
- Notifikasi otomatis (mis. pengingat PKL akan selesai dalam 7 hari).
- Statistik tahunan/periode lanjutan untuk laporan kinerja UPTD.
- Kustomisasi identitas instansi (nama, logo) langsung dari halaman Pengaturan.
 