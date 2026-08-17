<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Font Sertifikat Kustom
    |--------------------------------------------------------------------------
    |
    | Memetakan nama font persis seperti yang tampil di dropdown "Kelola
    | Template Sertifikat" ke file TTF yang dipakai DomPDF. Metrik lebar
    | huruf dari file ini harus identik dengan yang dipakai browser, supaya
    | posisi teks (terutama yang di-rata-tengah) di PDF sama dengan preview.
    |
    | - "Luxurious Script" memakai file reguler asli dari Google Fonts.
    | - "Times New Roman" dipetakan ke Tinos (metrik identik dengan Times
    |   New Roman versi TrueType).
    |
    | Font lain di dropdown (DejaVu Sans, Arial) tidak perlu didaftarkan:
    | DejaVu Sans sudah bawaan DomPDF dan Arial otomatis dipetakan DomPDF ke
    | font pengganti bawaan.
    |
    */

    'Luxurious Script' => [
        'regular' => storage_path('fonts/LuxuriousScript-Regular.ttf'),
        'bold' => null,
    ],

    'Times New Roman' => [
        'regular' => storage_path('fonts/Tinos-Regular.ttf'),
        'bold' => storage_path('fonts/Tinos-Bold.ttf'),
    ],

];
