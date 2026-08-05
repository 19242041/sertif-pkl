design.md
# Design Guide
## Sistem Data Anak PKL — UPTD Pengawasan Ketenagakerjaan Wilayah II Karawang
### Disnakertrans Provinsi Jawa Barat
 
---
 
## 1. Prinsip Desain
 
Aplikasi ini adalah **alat kerja internal** untuk 1 admin, bukan situs publik. Prioritas desain:
 
1. **Kejelasan di atas dekorasi** — admin harus bisa menemukan dan mengedit data secepat mungkin.
2. **Identitas instansi** — palet warna, dan nuansa visual diturunkan langsung dari logo Disnakertrans (biru, hijau, kuning emas) agar terasa resmi dan konsisten dengan instansi.
3. **Kepadatan informasi yang rapi** — tabel dan form padat data, tetap nyaman dibaca lewat spasi dan tipografi yang jelas.
4. **Konsisten & dapat diprediksi** — pola interaksi (tombol, badge, modal) sama di seluruh halaman.
## 2. Palet Warna
 
| Token | Hex | Penggunaan |
|---|---|---|
| `navy` | `#0E2A47` | Sidebar (gradient), header teks utama |
| `navy-deep` | `#081B30` | Bagian gelap gradient sidebar & background login |
| `blue` (Primary) | `#1B63B0` | Tombol utama, status "Aktif", aksen link/aktif |
| `blue-soft` | `#E8F1FB` | Background badge status Aktif |
| `green` | `#2E8B4E` | Status "Selesai", indikator positif |
| `green-soft` | `#E7F5EC` | Background badge status Selesai |
| `gold` | `#E8A712` | Status "Berhenti", indikator sertifikat, aksen ketiga (melengkapi 3 figur di logo) |
| `gold-soft` | `#FDF3DD` | Background badge status Berhenti / sertifikat |
| `bg` | `#F4F6F9` | Background halaman |
| `card` | `#FFFFFF` | Permukaan card, tabel, modal |
| `border` | `#E4E9F0` | Garis pembatas card, tabel, input |
| `ink` | `#1B2733` | Teks utama |
| `ink-muted` | `#657085` | Teks sekunder/label |
| `ink-faint` | `#94A0B3` | Teks placeholder/empty state |
| `danger` | `#C0433D` | Aksi hapus, pesan error |
| `danger-soft` | `#FBEAE9` | Background pesan error, tombol hapus (hover) |
 
**Catatan penggunaan warna status** — dipetakan agar konsisten dengan 3 figur pada logo (biru, hijau, kuning):
- **Aktif** → biru
- **Selesai** → hijau
- **Berhenti** → kuning emas (bukan merah, supaya tetap dalam keluarga warna brand; merah dikhususkan untuk aksi destruktif seperti hapus data)
## 3. Tipografi
 
| Peran | Font | Bobot | Penggunaan |
|---|---|---|---|
| Display/Heading | **Plus Jakarta Sans** | 600–800 | Judul halaman, judul card, nama aplikasi di login |
| Body | **Inter** | 400–700 | Teks umum, label form, isi tabel |
| Data/Mono | **IBM Plex Mono** | 500–600 | NISN/NIM, tanggal, kode-kode data agar mudah dipindai mata |
 
**Skala ukuran (indikatif):**
- Judul halaman: 21px / 800
- Judul card/section: 14.5–16.5px / 800
- Body teks: 13–13.5px / 400–600
- Label form: 12.5px / 700 (uppercase-tracking tipis untuk header tabel)
- Caption/meta: 11–12px / 500–600
## 4. Layout
 
```
┌───────────┬─────────────────────────────────────────────┐
│           │  Topbar: Judul halaman + subjudul            │
│  Sidebar  ├─────────────────────────────────────────────┤
│  (navy)   │                                               │
│  - Logo   │   Konten utama (dashboard / tabel data)      │
│  - Menu   │                                               │
│  - Admin  │                                               │
│  - Keluar │                                               │
└───────────┴─────────────────────────────────────────────┘
```
 
- **Sidebar**: lebar tetap ±250px, background gradient navy → navy-deep, berisi logo (di dalam kotak putih rounded agar kontras), menu navigasi (Dashboard, Data Anak PKL), info admin, dan tombol keluar di bagian bawah. Disembunyikan/collapse pada layar sempit (< 860px) menjadi menu alternatif (hamburger) jika diperlukan.
- **Topbar**: putih/transparan, menampilkan judul halaman (Plus Jakarta Sans bold) dan subjudul singkat penjelas konteks halaman.
- **Konten utama**: padding konsisten 24–28px, grid responsif untuk kartu statistik, card putih rounded (radius 14px) dengan border tipis dan shadow sangat halus untuk tabel/panel.
## 5. Komponen
 
### 5.1 Kartu Statistik (Stat Card)
- Border kiri setebal 4px berwarna sesuai kategori (navy/biru/hijau/kuning) — mengulang motif 3 warna logo.
- Ikon kecil dalam kotak rounded soft-color di kanan atas.
- Angka besar (Plus Jakarta Sans, 28px/800) sebagai fokus utama.
- Label kecil di atas angka, sublabel opsional di bawah.
### 5.2 Badge Status
- Bentuk pil (`border-radius: 999px`), dot kecil + teks status.
- Warna latar soft + warna teks solid sesuai token status (Aktif/Selesai/Berhenti).
### 5.3 Tabel Data
- Header tabel: background abu sangat muda (`#F7F9FC`), teks uppercase kecil, bold, warna `ink-muted`.
- Baris: hover state halus (`#FAFBFD`), border bawah tipis antar baris.
- Kolom aksi: ikon-ikon kecil (edit, hapus) dalam tombol bulat/rounded outline, berubah warna sesuai konteks saat hover (biru untuk edit, merah untuk hapus).
- Sel sertifikat: badge "Ada"/tombol "Unggah", plus ikon lihat/unduh dan hapus jika sudah ada file.
### 5.4 Tombol
- **Primary**: latar biru solid, teks putih, bold, radius 10px — untuk aksi utama (Simpan, Tambah Anak PKL, Masuk).
- **Ghost**: latar putih, border tipis, teks gelap — untuk aksi sekunder (Batal, Lihat semua).
- **Icon button**: kotak 32×32px, border tipis, berubah warna kontekstual saat hover (biru/hijau/kuning/merah).
- Semua tombol punya state disabled (opacity turun) dan state focus-visible (outline biru) untuk aksesibilitas keyboard.
### 5.5 Form & Modal
- Modal terpusat dengan overlay gelap semi-transparan + sedikit blur.
- Form dikelompokkan per bagian (Identitas, Asal Institusi, Penempatan PKL, Catatan) dengan label ikon kecil dan judul uppercase kecil di atas tiap grup — membantu admin mengisi form panjang tanpa kehilangan konteks.
- Input field: border tipis, radius 9px, padding nyaman diklik, state focus dengan outline biru.
- Dialog konfirmasi hapus: ikon peringatan dalam kotak soft-red, judul tegas, pesan penjelasan konsekuensi sebelum tombol "Hapus" (merah) ditekan.
### 5.6 Halaman Login
- Background gradient navy gelap dengan aksen glow lembut 3 warna brand (biru/hijau/kuning) sebagai elemen dekoratif — merefleksikan motif pinwheel 3 figur pada logo tanpa meniru bentuknya secara literal.
- Kartu login putih terpusat, logo di bagian atas, judul aplikasi, form username/password, tombol masuk full-width.
## 6. Elemen Penanda Identitas (Signature Element)
 
Motif **tiga titik warna (biru–hijau–kuning)** yang berdampingan digunakan sebagai elemen dekoratif kecil berulang (mis. pada empty state, glow dekoratif halaman login, indikator breakdown data) — merepresentasikan tiga figur berwarna pada logo Disnakertrans secara abstrak dan konsisten, tanpa berlebihan.
 
## 7. Aksesibilitas & Kualitas Dasar
 
- Kontras teks terhadap latar minimal memenuhi standar WCAG AA untuk teks body.
- Semua elemen interaktif (tombol, input, link) memiliki state focus yang terlihat jelas untuk navigasi keyboard.
- Ukuran target sentuh/klik minimal ±32px untuk tombol ikon.
- Pesan error dan empty state ditulis jelas, langsung menyebutkan apa yang terjadi dan apa yang bisa dilakukan admin selanjutnya (mis. "Belum ada data anak PKL. Klik 'Tambah Anak PKL' untuk mulai.").
- Desain diprioritaskan untuk layar desktop/laptop (alat kerja admin), namun tetap dapat digunakan pada layar sedang (tablet landscape) tanpa elemen terpotong.
## 8. Referensi Implementasi
 
Palet warna dan tipografi di atas dapat langsung dipetakan ke Tailwind config (`tailwind.config.js`) sebagai custom color tokens dan `fontFamily`, atau ke CSS custom properties (`:root { --color-blue: #1B63B0; ... }`) bila stack tidak menggunakan Tailwind.
 