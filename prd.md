## 1. Latar Belakang

UPTD Pengawasan Ketenagakerjaan Wilayah II Karawang secara rutin menerima siswa/mahasiswa yang melaksanakan Praktik Kerja Lapangan (PKL/magang). Saat ini pencatatan data peserta PKL dan pengarsipan sertifikat magang dilakukan secara manual (dokumen fisik atau spreadsheet terpisah), sehingga rawan data hilang, sulit dicari, dan tidak ada riwayat terpusat.

**SI-PKL** dibangun sebagai sistem informasi berbasis web agar admin UPTD dapat mencatat, mengelola, dan mengarsipkan data peserta PKL beserta sertifikat magang mereka dalam satu tempat, lengkap dengan ringkasan dashboard dan laporan.

## 2. Tujuan Produk

1. Menyediakan satu sumber data (single source of truth) untuk seluruh peserta PKL yang pernah/sedang magang di UPTD Wilayah II Karawang.
2. Memudahkan admin mencatat, mencari, dan memperbarui data peserta PKL secara lengkap.
3. Menyediakan tempat penyimpanan digital untuk sertifikat magang, menggantikan arsip fisik, lengkap dengan riwayat penerbitan sertifikat.
4. Memberikan gambaran cepat (dashboard dengan grafik) mengenai jumlah peserta aktif, selesai, dan kelengkapan sertifikat.
5. Memudahkan admin menghasilkan laporan rekap peserta PKL untuk keperluan pelaporan ke pimpinan.
6. Memungkinkan admin menerbitkan sertifikat secara konsisten dan cepat lewat 1 desain template yang dipakai berulang, tanpa perlu membuat desain manual per peserta.

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
- Kelola 1 template desain sertifikat (unggah sekali, atur posisi & gaya teks bebas), generate sertifikat otomatis per peserta dari template tersebut, plus riwayat sertifikat
- Pencarian, filter, dan pagination pada daftar data peserta
- Laporan rekap peserta PKL
- Pengaturan akun admin

### 5.2 Tidak Termasuk dalam Scope (Out of Scope) — versi 2.2
- Login/portal untuk peserta PKL atau sekolah asal
- Notifikasi email/WhatsApp otomatis
- Multi-role/multi-level approval
- Integrasi dengan sistem lain di lingkungan Disnakertrans
- Lebih dari 1 template sertifikat aktif dalam waktu bersamaan (hanya 1 template aktif per waktu, template lama otomatis nonaktif saat template baru disimpan)

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
| US-10 | Admin | mengunggah 1 desain template sertifikat kosong dan mengatur posisi, ukuran, font, warna, serta perataan tiap elemen teks lewat editor visual | template ini bisa dipakai berulang untuk semua peserta tanpa perlu diatur ulang tiap kali generate |
| US-11 | Admin | melihat pratinjau langsung (live preview) saat mengatur posisi/gaya teks di atas template | tahu persis bagaimana hasil akhirnya sebelum disimpan |
| US-12 | Admin | mengisi nomor sertifikat dan tanggal tanda tangan lalu langsung generate PDF, tanpa mengetik ulang nama/asal sekolah/periode peserta | proses penerbitan sertifikat cepat dan bebas salah ketik data yang sudah ada di sistem |
| US-13 | Admin | melihat riwayat sertifikat yang pernah digenerate | dapat memverifikasi/menelusuri sertifikat yang sudah diterbitkan |
| US-14 | Admin | mengunduh sertifikat yang sudah digenerate dalam bentuk PDF | dapat mencetak atau membagikan ulang saat dibutuhkan |
| US-15 | Admin | menghasilkan laporan rekap peserta PKL, dengan pencarian dan filter | dapat melaporkan hasil program PKL ke pimpinan sesuai kebutuhan |
| US-16 | Admin | mengubah pengaturan akun (username, password, profil) | akun tetap aman dan data profil sesuai |

## 7. Kebutuhan Fungsional

### 7.1 Autentikasi
- FR-1: Sistem menyediakan halaman login dengan username & password, menampilkan logo Disnakertrans dan nama aplikasi "SI-PKL".
- FR-2: Password disimpan dalam bentuk ter-enkripsi (hashed), tidak plain text.
- FR-3: Sesi admin berakhir otomatis setelah logout atau timeout tertentu.
- FR-3a: Tersedia fitur lupa kata sandi via kode verifikasi 6 digit yang dikirim ke email admin, dengan masa berlaku kode dan batas percobaan.

### 7.2 Dashboard
- FR-4: Menampilkan kartu statistik: Total Peserta, PKL Aktif, PKL Selesai, Sertifikat Terupload, Belum Upload.
- FR-5: Menampilkan grafik garis jumlah peserta PKL per bulan.
- FR-6: Menampilkan grafik donut/pie distribusi status peserta (Aktif/Selesai).
- FR-7: Setiap kartu statistik dapat diklik untuk menuju daftar data yang relevan (mis. klik "PKL Aktif" membuka Data Peserta PKL terfilter status Aktif).

### 7.3 Manajemen Data Peserta PKL
- FR-8: Admin dapat menambah data peserta PKL baru melalui form terpisah (halaman "Tambah Peserta"), meliputi: nama lengkap, NIS/NIM, asal sekolah/kampus, jurusan, jenis kelamin, tempat lahir, tanggal lahir, pembimbing sekolah, tanggal mulai PKL, tanggal selesai PKL, no. HP, status (Aktif/Selesai/Berhenti), email, keterangan (opsional), foto peserta (opsional).
- FR-9: Field wajib minimal: nama lengkap, asal sekolah/kampus. Field lain direkomendasikan diisi lengkap.
- FR-10: Admin dapat mengubah seluruh field data peserta yang sudah ada melalui halaman/form yang sama dengan mode edit.
- FR-11: Admin dapat menghapus data peserta PKL, disertai dialog konfirmasi sebelum penghapusan final.
- FR-12: Menghapus data peserta turut menghapus file sertifikat & foto terkait dari penyimpanan.
- FR-13: Admin dapat mencari data berdasarkan nama atau asal sekolah/kampus (pencarian real-time).
- FR-14: Admin dapat memfilter data berdasarkan status.
- FR-15: Daftar data peserta ditampilkan dengan pagination.
- FR-16: Admin dapat membuka halaman Detail Peserta yang menampilkan seluruh data pribadi, data PKL, foto, status, dan informasi sertifikat dari satu peserta, dengan tombol Edit/Hapus.

### 7.4 Kelola Template Sertifikat

- FR-17: Admin mengunggah **1 file desain template sertifikat kosong** (JPG/PNG, tanpa teks nama/tanggal) melalui halaman "Kelola Template Sertifikat". Template ini dipakai berulang untuk semua peserta — bukan diunggah satu per satu per peserta.
- FR-17a: Template memiliki **5 elemen teks** yang posisinya diatur admin secara independen satu sama lain: **Nama Peserta**, **Asal Sekolah**, **Nomor Sertifikat**, **Periode PKL**, dan **Tanggal** (baris tanda tangan Kepala UPTD).
- FR-17b: Untuk tiap elemen, admin dapat mengatur secara **bebas tanpa batas minimum/maksimum yang dipaksakan sistem**:
  - Posisi X dan Y (dalam persen, mendukung nilai desimal, bisa diatur lewat drag langsung di atas preview atau input angka)
  - Ukuran font (px, angka bebas termasuk desimal)
  - Jenis font (dipilih dari daftar font yang didukung sistem, minimal: Luxurious Script, Times New Roman, DejaVu Sans, Arial)
  - Warna teks (dipilih lewat color picker visual ATAU diketik langsung sebagai kode hex `#RRGGBB`, kedua cara input saling sinkron)
  - Perataan teks (kiri/tengah/kanan)
  - Lebar area maksimum tempat teks tersebut boleh melebar (persen), supaya teks panjang tidak tertimpa elemen lain
- FR-17c: Admin melihat **pratinjau langsung (live preview)** dengan teks contoh yang bergerak mengikuti perubahan pengaturan di atas, sebelum disimpan.
- FR-17d: Saat admin mengganti gambar template, tersedia opsi untuk memakai ulang seluruh pengaturan posisi/gaya dari template sebelumnya sebagai titik awal, atau mengatur dari nol.
- FR-17e: Menyimpan template ("Simpan Template") langsung menonaktifkan template sebelumnya dan mengaktifkan yang baru — hanya ada 1 template aktif dalam satu waktu, dan konfigurasi ini **langsung tersedia** di halaman Terbitkan Sertifikat pada kunjungan berikutnya tanpa perlu diatur ulang.

### 7.5 Terbitkan Sertifikat (Generate Otomatis dari Template)

- FR-18: Di halaman "Terbitkan Sertifikat", admin memilih peserta dari daftar. **Nama Peserta dan Asal Sekolah otomatis terisi** dari data peserta yang tersimpan (tidak diketik ulang manual). **Periode PKL otomatis terbentuk** dari tanggal mulai-selesai peserta (dapat disesuaikan bila perlu). Admin hanya perlu mengisi manual: **Nomor Sertifikat** dan **Tanggal Tanda Tangan**.
- FR-19: Panel pratinjau menampilkan template aktif beserta simulasi ke-5 elemen teks (nama, asal, nomor, periode, tanggal) sesuai posisi/gaya yang tersimpan di template, memakai data yang sedang diisi admin secara real-time.
- FR-20: Tombol "Generate Sertifikat" menghasilkan 1 file **PDF** yang menimpakan ke-5 elemen teks ke atas gambar template sesuai posisi, ukuran, font, warna, dan perataan yang tersimpan — **hasil PDF harus identik secara visual dengan pratinjau di Editor Visual Template Sertifikat**, termasuk kesesuaian font (bukan font pengganti yang berbeda lebar).
- FR-21: Hasil generate tersimpan otomatis sebagai record baru di "Riwayat Sertifikat" (nama peserta, nomor sertifikat, tanggal, file PDF), dan file PDF-nya tersimpan di penyimpanan server.
- FR-22: Riwayat Sertifikat menampilkan daftar sertifikat yang sudah digenerate dengan aksi lihat/unduh PDF, terbaru di atas.
- FR-23: Sistem menampilkan indikator status sertifikat ("Sudah Dibuat"/"Belum Dibuat") pada daftar data peserta.
- FR-24: Tombol "Generate Sertifikat" nonaktif dan menampilkan pesan yang jelas apabila belum ada template aktif tersimpan.

### 7.6 Laporan
- FR-25: Admin dapat melihat halaman Laporan berisi rekap jumlah peserta PKL berdasarkan periode dan status.
- FR-26: Admin dapat mencari (nama/asal institusi) dan memfilter (rentang tanggal PKL, status) data pada halaman Laporan.
- FR-27: Admin dapat mengekspor laporan rekap peserta PKL ke PDF, dengan isi PDF mengikuti hasil pencarian/filter yang sedang aktif di layar (bukan seluruh data tanpa filter).

### 7.7 Pengaturan
- FR-28: Admin dapat mengubah data akunnya sendiri: nama, username, password.
- FR-29: Admin dapat mengubah pengaturan tampilan instansi (nama instansi, logo) jika diperlukan di kemudian hari — opsional untuk versi awal.

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
| tanggal_sertifikat | Date | Tanggal tanda tangan yang dipakai saat generate |
| file_path | String | Path file PDF hasil generate |
| generated_at | Timestamp | Waktu sertifikat dibuat/digenerate ulang |

**Entity: TemplateSertifikat**

Menyimpan 1 baris = 1 template. Hanya 1 baris berstatus `is_active = true` dalam satu waktu. Untuk **masing-masing dari 5 elemen** (`nama`, `asal`, `nomor`, `periode`, `tanggal`), tersimpan 7 atribut berikut (nama kolom mengikuti pola `{elemen}_{atribut}`, contoh: `nama_x`, `asal_font_family`, `nomor_color`, dst):

| Atribut | Tipe | Keterangan |
|---|---|---|
| `{elemen}_x` | Decimal | Posisi X (persen), bebas nilai termasuk desimal, tanpa batas min/maks yang dipaksakan |
| `{elemen}_y` | Decimal | Posisi Y (persen), sama seperti di atas |
| `{elemen}_font_size` | Decimal | Ukuran font (px), bebas nilai |
| `{elemen}_font_family` | String | Nama font yang dipakai (Luxurious Script, Times New Roman, DejaVu Sans, Arial, dst) |
| `{elemen}_color` | String(7) | Kode warna hex `#RRGGBB` |
| `{elemen}_alignment` | Enum | left, center, right |
| `{elemen}_lebar_max` | Decimal | Lebar area maksimum teks (persen) |

Field lain di tabel ini:

| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID/Int | Primary key |
| file_path | String | Path file gambar template kosong (JPG/PNG) |
| is_active | Boolean | Hanya 1 baris boleh `true` dalam satu waktu |
| created_at / updated_at | Timestamp | |

**Entity: Admin**

| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID/Int | Primary key |
| nama | String | |
| username | String | Unik |
| email | String | Dipakai juga untuk fitur lupa kata sandi |
| password_hash | String | |

## 9. Kebutuhan Non-Fungsional

- **Keamanan**: hanya admin ter-autentikasi yang dapat mengakses seluruh fitur; password ter-enkripsi; validasi input di sisi server; validasi tipe & ukuran file upload (foto & template sertifikat).
- **Performa**: pencarian, filter, dan pagination merespons dalam < 1 detik untuk jumlah data hingga beberapa ribu baris.
- **Kesetiaan render (fidelity)**: hasil PDF sertifikat yang digenerate harus identik secara visual (posisi, ukuran, font, warna) dengan pratinjau yang dilihat admin di Editor Visual Template Sertifikat maupun di halaman Terbitkan Sertifikat — termasuk font yang tidak tersedia secara bawaan di mesin pembuat PDF harus didaftarkan/disematkan secara eksplisit agar metrik lebar hurufnya konsisten.
- **Ketersediaan**: aplikasi dapat diakses selama jam kerja tanpa gangguan berarti; backup data berkala direkomendasikan.
- **Kompatibilitas**: berjalan baik di browser modern (Chrome, Edge, Firefox) versi terbaru, desktop-first namun tetap dapat digunakan di layar tablet/laptop kecil.
- **Skalabilitas data**: mendukung penyimpanan data peserta PKL untuk beberapa tahun ajaran/periode tanpa penurunan performa signifikan.
- **Auditability**: setiap data memiliki `created_at` dan `updated_at` untuk keperluan penelusuran perubahan.

## 10. Kriteria Keberhasilan (Success Metrics)

- 100% data peserta PKL yang aktif tercatat dalam sistem (tidak ada lagi pencatatan manual paralel).
- Waktu pencarian data peserta tertentu berkurang signifikan dibanding metode manual sebelumnya.
- Seluruh sertifikat peserta yang telah menyelesaikan program tergenerate otomatis dan tercatat dalam riwayat sertifikat, tanpa perlu desain ulang manual per peserta.
- Laporan rekap dapat dihasilkan dalam hitungan detik tanpa rekap manual.

## 11. Risiko & Asumsi

| Risiko/Asumsi | Mitigasi |
|---|---|
| Admin lupa password dan tidak ada mekanisme reset | Fitur lupa kata sandi via kode email sudah tersedia (FR-3a) |
| File template/foto berukuran besar membebani penyimpanan server | Batasi ukuran unggah maksimal per file, pertimbangkan kompresi gambar |
| Data hilang karena tidak ada backup | Terapkan backup database berkala (harian/mingguan) |
| Kebutuhan multi-admin di masa depan | Struktur database/role sudah disiapkan agar mudah ditambah tanpa migrasi besar |
| Font custom (mis. Luxurious Script) tidak dikenali mesin pembuat PDF sehingga hasil generate meleset dari pratinjau | Daftarkan/sematkan file font secara eksplisit ke mesin PDF sebelum render, jaga daftar font yang didukung tetap terdokumentasi dan mudah ditambah |

## 12. Roadmap Potensial (Versi Berikutnya)

- Multi-admin dengan log aktivitas (siapa mengubah data apa dan kapan).
- Notifikasi otomatis (mis. pengingat PKL akan selesai dalam 7 hari).
- Statistik tahunan/periode lanjutan untuk laporan kinerja UPTD.
- Kustomisasi identitas instansi (nama, logo) langsung dari halaman Pengaturan.
- Dukungan lebih dari 1 template sertifikat aktif (mis. berbeda per jenis peserta atau tahun ajaran).