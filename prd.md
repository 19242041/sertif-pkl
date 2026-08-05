 Product Requirements Document (PRD)
## Sistem Data Anak PKL — UPTD Pengawasan Ketenagakerjaan Wilayah II Karawang
### Disnakertrans Provinsi Jawa Barat
 
| **Pemilik Produk** | UPTD Pengawasan Ketenagakerjaan Wilayah II Karawang |
 
---
 
## 1. Latar Belakang
 
UPTD Pengawasan Ketenagakerjaan Wilayah II Karawang secara rutin menerima siswa/mahasiswa yang melaksanakan Praktik Kerja Lapangan (PKL/magang). Saat ini pencatatan data anak PKL dan pengarsipan sertifikat magang dilakukan secara manual (dokumen fisik atau spreadsheet terpisah), sehingga rawan data hilang, sulit dicari, dan tidak ada riwayat terpusat.
 
Dibutuhkan sebuah sistem berbasis web sederhana yang memungkinkan admin UPTD mencatat, mengelola, dan mengarsipkan data anak PKL beserta sertifikat magang mereka dalam satu tempat.
 
## 2. Tujuan Produk
 
1. Menyediakan satu sumber data (single source of truth) untuk seluruh anak PKL yang pernah/sedang magang di UPTD Wilayah II Karawang.
2. Memudahkan admin mencatat, mencari, dan memperbarui data anak PKL.
3. Menyediakan tempat penyimpanan digital untuk sertifikat magang, menggantikan arsip fisik.
4. Memberikan gambaran cepat (dashboard) mengenai jumlah anak PKL aktif, selesai, dan kelengkapan sertifikat.
## 3. Target Pengguna
 
Aplikasi ini **hanya digunakan oleh 1 jenis pengguna: Admin UPTD**. Tidak ada portal atau login untuk anak PKL, sekolah, maupun publik.
 
| Peran | Jumlah Pengguna | Akses |
|---|---|---|
| Admin | 1 akun (bisa ditambah jika diperlukan di kemudian hari) | Penuh (create, read, update, delete data anak PKL & sertifikat) |
 
## 4. Lingkup (Scope)
 
### 4.1 Termasuk dalam Scope (In Scope)
- Login admin
- Dashboard ringkasan
- CRUD data anak PKL
- Upload, lihat, unduh, dan hapus sertifikat magang per anak PKL
- Pencarian dan filter data anak PKL
### 4.2 Tidak Termasuk dalam Scope (Out of Scope) — versi 1.0
- Login/portal untuk anak PKL atau sekolah asal
- Notifikasi email/WhatsApp otomatis
- Pembuatan sertifikat otomatis (hanya upload, bukan generate)
- Multi-role/multi-level approval
- Laporan/export ke PDF atau Excel (dapat menjadi kandidat versi berikutnya)
- Integrasi dengan sistem lain di lingkungan Disnakertrans
## 5. User Stories
 
| ID | Sebagai | Saya ingin | Agar |
|---|---|---|---|
| US-01 | Admin | login ke sistem dengan username & password | data hanya bisa diakses oleh pihak yang berwenang |
| US-02 | Admin | melihat ringkasan jumlah anak PKL di dashboard | dapat memantau kondisi program PKL secara cepat |
| US-03 | Admin | menambahkan data anak PKL baru | data anak PKL yang baru masuk tercatat |
| US-04 | Admin | mengubah data anak PKL | data tetap akurat saat ada perubahan (mis. status selesai) |
| US-05 | Admin | menghapus data anak PKL | data yang salah input atau tidak relevan dapat dibersihkan |
| US-06 | Admin | mencari anak PKL berdasarkan nama/NISN/asal institusi | dapat menemukan data dengan cepat tanpa scroll manual |
| US-07 | Admin | memfilter data berdasarkan status (Aktif/Selesai/Berhenti) | dapat fokus pada kelompok anak PKL tertentu |
| US-08 | Admin | mengunggah file sertifikat magang untuk anak PKL tertentu | sertifikat tersimpan digital dan tidak hilang |
| US-09 | Admin | melihat/mengunduh sertifikat yang sudah diunggah | dapat memverifikasi atau membagikan ulang saat dibutuhkan |
| US-10 | Admin | menghapus/mengganti sertifikat yang sudah diunggah | dapat memperbaiki jika salah upload |
 
## 6. Kebutuhan Fungsional
 
### 6.1 Autentikasi
- FR-1: Sistem menyediakan halaman login dengan username & password.
- FR-2: Password disimpan dalam bentuk ter-enkripsi (hashed), tidak plain text.
- FR-3: Sesi admin berakhir otomatis setelah logout atau timeout tertentu.
### 6.2 Dashboard
- FR-4: Menampilkan total anak PKL, jumlah status Aktif, jumlah status Selesai, dan jumlah anak PKL yang sudah memiliki sertifikat.
- FR-5: Menampilkan 5 data anak PKL terbaru berdasarkan tanggal mulai PKL.
- FR-6: Menampilkan ringkasan asal institusi dengan jumlah anak PKL terbanyak.
### 6.3 Manajemen Data Anak PKL
- FR-7: Admin dapat menambah data anak PKL baru melalui form.
- FR-8: Field wajib: nama lengkap, asal institusi. Field lain bersifat opsional namun direkomendasikan diisi.
- FR-9: Admin dapat mengubah seluruh field data anak PKL yang sudah ada.
- FR-10: Admin dapat menghapus data anak PKL, disertai dialog konfirmasi sebelum penghapusan final.
- FR-11: Menghapus data anak PKL turut menghapus file sertifikat terkait dari penyimpanan.
- FR-12: Admin dapat mencari data berdasarkan nama, NISN/NIM, atau asal institusi (pencarian real-time/instan).
- FR-13: Admin dapat memfilter data berdasarkan status: Aktif, Selesai, Berhenti, atau Semua.
### 6.4 Manajemen Sertifikat
- FR-14: Admin dapat mengunggah 1 file sertifikat per anak PKL, format PDF/JPG/PNG, ukuran maksimal 5MB.
- FR-15: Sistem menampilkan indikator status sertifikat ("Ada"/"Belum Ada") pada tiap baris data anak PKL.
- FR-16: Admin dapat melihat pratinjau (untuk gambar) atau mengunduh (untuk PDF) sertifikat yang sudah diunggah.
- FR-17: Admin dapat menghapus atau mengganti file sertifikat yang sudah diunggah.
- FR-18: Sistem mencatat tanggal unggah sertifikat.
## 7. Kebutuhan Data (Model Data Minimal)
 
**Entity: AnakPKL**
 
| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID/Int | Primary key |
| nama | String | Wajib |
| nisn | String | NISN (sekolah) atau NIM (kampus) |
| no_hp | String | Nomor HP/WhatsApp |
| asal_institusi | String | Wajib |
| jenjang | Enum | SMK, SMA, D3, D4, S1 |
| jurusan | String | Jurusan/program studi |
| pembimbing_sekolah | String | Guru/dosen pembimbing dari institusi asal |
| unit_penempatan | Enum | Pengawasan Norma Kerja, Pengawasan Norma K3, Tata Usaha, Pelayanan & Informasi |
| pembimbing_lapangan | String | Staf UPTD yang membimbing |
| tanggal_mulai | Date | Tanggal mulai PKL |
| tanggal_selesai | Date | Tanggal selesai PKL |
| status | Enum | Aktif, Selesai, Berhenti |
| catatan | Text | Opsional |
| sertifikat_path | String/nullable | Path/URL file sertifikat |
| sertifikat_uploaded_at | Date/nullable | Tanggal unggah sertifikat |
| created_at | Timestamp | |
| updated_at | Timestamp | |
 
**Entity: Admin**
 
| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID/Int | Primary key |
| username | String | Unik |
| password_hash | String | |
 
## 8. Kebutuhan Non-Fungsional
 
- **Keamanan**: hanya admin ter-autentikasi yang dapat mengakses seluruh fitur; password ter-enkripsi; validasi input di sisi server untuk mencegah injeksi data.
- **Performa**: pencarian dan filter data merespons dalam < 1 detik untuk jumlah data hingga beberapa ribu baris.
- **Ketersediaan**: aplikasi dapat diakses selama jam kerja tanpa gangguan berarti; backup data berkala direkomendasikan.
- **Kompatibilitas**: berjalan baik di browser modern (Chrome, Edge, Firefox) versi terbaru, desktop-first namun tetap dapat digunakan di layar tablet/laptop kecil.
- **Skalabilitas data**: mendukung penyimpanan data anak PKL untuk beberapa tahun ajaran/periode tanpa penurunan performa signifikan.
- **Auditability**: setiap data memiliki `created_at` dan `updated_at` untuk keperluan penelusuran perubahan.
## 9. Kriteria Keberhasilan (Success Metrics)
 
- 100% data anak PKL yang aktif tercatat dalam sistem (tidak ada lagi pencatatan manual paralel).
- Waktu pencarian data anak PKL tertentu berkurang signifikan dibanding metode manual sebelumnya.
- Seluruh sertifikat anak PKL yang telah menyelesaikan program tersimpan digital dalam sistem.
## 10. Risiko & Asumsi
 
| Risiko/Asumsi | Mitigasi |
|---|---|
| Admin lupa password dan tidak ada mekanisme reset | Sediakan mekanisme reset password oleh super-admin/developer, atau minimal reset manual via database |
| File sertifikat berukuran besar membebani penyimpanan server | Batasi ukuran unggah maksimal 5MB per file, pertimbangkan kompresi gambar |
| Data hilang karena tidak ada backup | Terapkan backup database berkala (harian/mingguan) |
| Kebutuhan multi-admin di masa depan | Struktur database/role sudah disiapkan agar mudah ditambah tanpa migrasi besar |
 
## 11. Roadmap Potensial (Versi Berikutnya)
 
- Export data anak PKL ke Excel/PDF untuk laporan ke pimpinan.
- Multi-admin dengan log aktivitas (siapa mengubah data apa dan kapan).
- Notifikasi otomatis (mis. pengingat PKL akan selesai dalam 7 hari).
- Statistik tahunan/periode untuk laporan kinerja UPTD.
 