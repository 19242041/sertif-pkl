 ## 1. Prinsip Desain
 
Aplikasi ini adalah **alat kerja internal** untuk 1 admin, bukan situs publik. Prioritas desain:
 
1. **Kejelasan di atas dekorasi** — admin harus bisa menemukan dan mengedit data secepat mungkin.
2. **Identitas instansi** — nama aplikasi "SI-PKL" tampil berdampingan dengan logo Disnakertrans; palet warna diturunkan dari logo (biru, hijau, kuning emas) dengan tambahan ungu dan merah untuk kebutuhan status/kategori tambahan.
3. **Kepadatan informasi yang rapi** — dashboard dengan grafik, tabel berpagination, dan form panjang tetap nyaman dibaca lewat spasi dan tipografi yang jelas.
4. **Konsisten & dapat diprediksi** — pola interaksi (tombol, badge, modal, kartu statistik) sama di seluruh halaman.
## 2. Palet Warna
 
| Token | Hex | Penggunaan |
|---|---|---|
| `navy` | `#0E2A47` | Sidebar (gradient), header teks utama |
| `navy-deep` | `#081B30` | Bagian gelap gradient sidebar & background login |
| `blue` (Primary) | `#1B63B0` | Tombol utama, status "Aktif", kartu "Total Peserta"/"PKL Aktif", grafik garis |
| `blue-soft` | `#E8F1FB` | Background badge/ikon biru |
| `green` | `#2E8B4E` | Status "Selesai", kartu "PKL Selesai" |
| `green-soft` | `#E7F5EC` | Background badge/ikon hijau |
| `gold` | `#E8A712` | Status "Berhenti", kartu peringatan ringan |
| `gold-soft` | `#FDF3DD` | Background badge/ikon kuning |
| `purple` | `#534AB7` | Kartu "Sertifikat Terupload" |
| `purple-soft` | `#EEEDFE` | Background ikon ungu |
| `danger` (merah) | `#C0433D` | Aksi hapus, pesan error, kartu "Belum Upload" |
| `danger-soft` | `#FBEAE9` | Background ikon/badge merah |
| `bg` | `#F4F6F9` | Background halaman |
| `card` | `#FFFFFF` | Permukaan card, tabel, modal |
| `border` | `#E4E9F0` | Garis pembatas card, tabel, input |
| `ink` | `#1B2733` | Teks utama |
| `ink-muted` | `#657085` | Teks sekunder/label |
| `ink-faint` | `#94A0B3` | Teks placeholder/empty state |
 
**Catatan penggunaan warna status:**
- **Aktif** → biru
- **Selesai** → hijau
- **Berhenti** → kuning emas
- Kartu statistik dashboard boleh memakai 5 warna (biru/hijau/kuning/ungu/merah) untuk membedakan kategori metrik secara sekilas, mengikuti pola pada referensi desain.
## 3. Tipografi
 
| Peran | Font | Bobot | Penggunaan |
|---|---|---|---|
| Display/Heading | **Plus Jakarta Sans** | 600–800 | Judul halaman, judul card, nama aplikasi "SI-PKL" di login/sidebar |
| Body | **Inter** | 400–700 | Teks umum, label form, isi tabel |
| Data/Mono | **IBM Plex Mono** | 500–600 | NIS/NIM, tanggal, nomor sertifikat |
 
**Skala ukuran (indikatif):**
- Judul halaman: 20–21px / 800
- Judul card/section: 14.5–16.5px / 800
- Body teks: 13–13.5px / 400–600
- Label form: 12.5px / 700
- Caption/meta/angka statistik kecil: 11–12px / 500–600
- Angka besar kartu statistik: 24–28px / 800
## 4. Layout & Struktur Halaman
 
```
┌───────────┬─────────────────────────────────────────────┐
│  Sidebar  │  Topbar: breadcrumb + info admin             │
│  (navy)   ├─────────────────────────────────────────────┤
│  - Logo + │                                               │
│    SI-PKL │   Konten utama (dashboard / tabel / form)    │
│  - Menu   │                                               │
│  - Admin  │                                               │
│  - Keluar │                                               │
└───────────┴─────────────────────────────────────────────┘
```
 
**Menu sidebar** (urutan tetap): Dashboard, Data Peserta PKL, Upload Sertifikat, Laporan, Pengaturan, Keluar.
 
**Halaman yang tersedia:**
1. **Login** — kartu putih terpusat dengan logo Disnakertrans + nama "SI-PKL", form username/password.
2. **Dashboard** — sapaan admin, 5 kartu statistik warna-warni, grafik garis (peserta per bulan) + grafik donut (distribusi status).
3. **Data Peserta PKL** — tabel dengan kolom No, Nama, Asal Sekolah/Kampus, Jurusan, Periode, Status, Sertifikat, Aksi (lihat/ubah/hapus); dilengkapi search bar, filter, dan pagination di bagian bawah.
4. **Tambah/Ubah Peserta** — form 2 kolom dikelompokkan per bagian (Data Pribadi, Data Institusi, Data PKL), termasuk upload foto.
5. **Upload Sertifikat** — form pilih peserta, nomor sertifikat, tanggal, drag & drop file PDF; di bawahnya tabel Riwayat Sertifikat.
6. **Detail Peserta** — foto/avatar besar di kiri, data pribadi & PKL di kanan dalam format label-nilai, bagian sertifikat (nomor, tanggal, file unduh) di bawah, tombol Edit/Hapus di header.
7. **Laporan** — filter rentang tanggal/periode, ringkasan rekap, tombol ekspor Excel/PDF.
8. **Pengaturan** — form ubah profil admin (nama, username, password).
## 5. Komponen
 
### 5.1 Kartu Statistik Dashboard (Stat Card)
- Ikon dalam kotak rounded soft-color (28–30px) sebagai penanda kategori, warna mengikuti tabel palet di atas.
- Angka besar (Plus Jakarta Sans, 22–28px/700–800) sebagai fokus utama.
- Label kecil di bawah angka menjelaskan metrik.
- Kartu dapat diklik untuk membuka daftar data terkait (opsional, sesuai FR-7).
### 5.2 Grafik Dashboard
- **Grafik garis**: menunjukkan tren jumlah peserta PKL per bulan, warna garis biru primer, titik data ditandai bulatan kecil.
- **Grafik donut**: distribusi status peserta (Aktif/Selesai), warna sesuai token status, legenda di samping dengan kotak warna kecil + label + angka.
- Kedua grafik ditempatkan berdampingan (grafik garis lebih lebar) dalam card terpisah.
### 5.3 Badge Status
- Bentuk pil (`border-radius: 999px`), dot kecil + teks status.
- Warna latar soft + warna teks solid sesuai token status (Aktif/Selesai/Berhenti).
- Badge serupa juga dipakai untuk status sertifikat: "Sudah Upload" (hijau/emas) vs "Belum Upload" (merah).
### 5.4 Tabel Data & Pagination
- Header tabel: background abu sangat muda (`#F7F9FC`), teks uppercase kecil, bold, warna `ink-muted`.
- Baris: hover state halus (`#FAFBFD`), border bawah tipis antar baris, nomor urut di kolom pertama.
- Kolom aksi: ikon-ikon kecil (lihat, ubah, hapus) dalam tombol bulat/rounded outline, berubah warna sesuai konteks saat hover (biru untuk lihat/ubah, merah untuk hapus).
- Pagination di bagian bawah tabel: info "Menampilkan X–Y dari Z data" di kiri, kontrol nomor halaman (dengan halaman aktif ditandai warna biru solid) di kanan.
### 5.5 Tombol
- **Primary**: latar biru solid, teks putih, bold, radius 10px — untuk aksi utama (Simpan, Tambah Peserta, Masuk, Upload Sertifikat).
- **Ghost**: latar putih, border tipis, teks gelap — untuk aksi sekunder (Batal, Kembali).
- **Icon button**: kotak/lingkaran ±32px, berubah warna kontekstual saat hover (biru/hijau/kuning/merah).
- Semua tombol punya state disabled (opacity turun) dan state focus-visible (outline biru) untuk aksesibilitas keyboard.
### 5.6 Form Tambah/Ubah Peserta
- Layout 2 kolom, dikelompokkan per bagian dengan judul kecil (Data Pribadi, Data Institusi, Data PKL) — membantu admin mengisi form panjang tanpa kehilangan konteks.
- Field mencakup: nama lengkap, NIS/NIM, jenis kelamin (select), tempat & tanggal lahir, asal sekolah/kampus, jurusan, pembimbing sekolah, tanggal mulai & selesai PKL, no HP, email, status (select), keterangan (textarea), dan upload foto peserta (preview bulat/avatar setelah dipilih).
- Tombol "Simpan" primary di kanan atas/header form, "Kembali" di kiri.
### 5.7 Upload Sertifikat (Drag & Drop)
- Area drop zone besar dengan border putus-putus, ikon upload cloud di tengah, teks instruksi "Drag & drop file PDF di sini atau klik untuk memilih file", keterangan ukuran maksimal.
- Setelah file dipilih, tampilkan nama file & ukuran sebagai konfirmasi sebelum submit.
- Tabel "Riwayat Sertifikat" di bawah form: kolom No, Nama Peserta, Nomor Sertifikat, Tanggal, ikon File (PDF), aksi unduh.
### 5.8 Halaman Detail Peserta
- Foto/avatar bulat besar (atau inisial jika tanpa foto) di kolom kiri, nama dan badge status di bawahnya.
- Data pribadi & PKL ditampilkan sebagai daftar label-nilai dua kolom di kanan.
- Bagian "Sertifikat" terpisah di bawah, menampilkan nomor sertifikat, tanggal, dan tombol unduh file.
- Tombol "Edit" (biru) dan "Hapus" (merah) di pojok kanan atas header halaman, tombol "Kembali" di kiri atas.
### 5.9 Modal & Konfirmasi
- Modal terpusat dengan overlay gelap semi-transparan + sedikit blur.
- Dialog konfirmasi hapus: ikon peringatan dalam kotak soft-red, judul tegas, pesan penjelasan konsekuensi sebelum tombol "Hapus" (merah) ditekan.
### 5.10 Halaman Login
- Background gradient navy gelap dengan aksen glow lembut 3 warna brand (biru/hijau/kuning) sebagai elemen dekoratif — merefleksikan motif pinwheel 3 figur pada logo tanpa meniru bentuknya secara literal.
- Kartu login putih terpusat, logo Disnakertrans + nama "SI-PKL" di bagian atas, form username/password, tombol masuk full-width.
## 6. Elemen Penanda Identitas (Signature Element)
 
Motif **tiga titik warna (biru–hijau–kuning)** yang berdampingan digunakan sebagai elemen dekoratif kecil berulang (mis. pada empty state, glow dekoratif halaman login) — merepresentasikan tiga figur berwarna pada logo Disnakertrans secara abstrak dan konsisten. Warna ungu dan merah pada kartu statistik dashboard tetap dijaga agar tidak mendominasi — hanya dipakai pada 2 dari 5 kartu, sisanya tetap memakai 3 warna brand utama.
 
## 7. Aksesibilitas & Kualitas Dasar
 
- Kontras teks terhadap latar minimal memenuhi standar WCAG AA untuk teks body.
- Semua elemen interaktif (tombol, input, link, area drag & drop) memiliki state focus yang terlihat jelas untuk navigasi keyboard.
- Ukuran target sentuh/klik minimal ±32px untuk tombol ikon.
- Pesan error dan empty state ditulis jelas, langsung menyebutkan apa yang terjadi dan apa yang bisa dilakukan admin selanjutnya.
- Desain diprioritaskan untuk layar desktop/laptop (alat kerja admin), namun tetap dapat digunakan pada layar sedang (tablet landscape) tanpa elemen terpotong.
## 8. Referensi Implementasi
 
Palet warna dan tipografi di atas dapat langsung dipetakan ke Tailwind config (`tailwind.config.js`) sebagai custom color tokens dan `fontFamily`, atau ke CSS custom properties (`:root { --color-blue: #1B63B0; ... }`) bila stack tidak menggunakan Tailwind. Untuk grafik garis dan donut, gunakan library ringan seperti Chart.js atau Recharts, dengan warna diambil langsung dari token di atas.
 