<?php

namespace App\Http\Controllers;

use App\Http\Requests\Sertifikat\StoreGeneratedSertifikatRequest;
use App\Http\Requests\Sertifikat\StoreTemplateSertifikatRequest;
use App\Models\PesertaPkl;
use App\Models\Sertifikat;
use App\Models\TemplateSertifikat;
use Barryvdh\DomPDF\Facade\Pdf;
use Dompdf\FontMetrics;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SertifikatController extends Controller
{
    /**
     * Halaman "Terbitkan Sertifikat" beserta riwayat sertifikat.
     */
    public function index(Request $request): Response
    {
        $template = TemplateSertifikat::query()->where('is_active', true)->latest()->first();

        $sertifikats = Sertifikat::query()
            ->with('pesertaPkl')
            ->latest('generated_at')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Sertifikat $sertifikat) => [
                'id' => $sertifikat->id,
                'nomor_sertifikat' => $sertifikat->nomor_sertifikat,
                'tanggal_sertifikat' => optional($sertifikat->tanggal_sertifikat)->format('d M Y'),
                'generated_at' => optional($sertifikat->generated_at)->format('d M Y H:i'),
                'file_path' => $sertifikat->file_path,
                'peserta' => [
                    'id' => $sertifikat->pesertaPkl?->id,
                    'nama' => $sertifikat->pesertaPkl?->nama,
                    'asal_institusi' => $sertifikat->pesertaPkl?->asal_institusi,
                ],
            ]);

        return Inertia::render('Sertifikat/Generate', [
            'pesertaOptions' => PesertaPkl::query()
                ->orderBy('nama')
                ->get(['id', 'nama', 'asal_institusi', 'tanggal_mulai', 'tanggal_selesai'])
                ->map(fn (PesertaPkl $item) => [
                    'id' => $item->id,
                    'nama' => $item->nama,
                    'asal_institusi' => $item->asal_institusi,
                    'tanggal_mulai' => optional($item->tanggal_mulai)->format('Y-m-d'),
                    'tanggal_selesai' => optional($item->tanggal_selesai)->format('Y-m-d'),
                ]),
            'sertifikats' => $sertifikats,
            'template' => $template ? $this->templateProps($template) : null,
        ]);
    }

    public function template(): Response
    {
        $this->ensureCertificateFonts();

        $template = TemplateSertifikat::query()->where('is_active', true)->latest()->first();

        return Inertia::render('Sertifikat/Template', [
            'template' => $template ? $this->templateProps($template) : null,
        ]);
    }

    public function store(StoreGeneratedSertifikatRequest $request): \Symfony\Component\HttpFoundation\Response
    {
        $template = TemplateSertifikat::query()
            ->where('is_active', true)
            ->latest()
            ->firstOrFail();

        /*
         * Pastikan font kustom sudah tersedia di lokal (unduh kalau belum ada
         * dan bersihkan duplikat) sebelum PDF dirender.
         */
        $this->ensureCertificateFonts();

        $peserta = PesertaPkl::query()
            ->findOrFail($request->integer('peserta_pkl_id'));

        $tanggalMulai = $request->date('tanggal_mulai_pkl') ?? $peserta->tanggal_mulai;
        $tanggalSelesai = $request->date('tanggal_selesai_pkl') ?? $peserta->tanggal_selesai;
        $tanggalTandaTangan = $request->date('tanggal_tanda_tangan');

        $teksNomor = $request
            ->string('nomor_sertifikat')
            ->toString();

        $teksNama = $peserta->nama;
        $teksAsal = $peserta->asal_institusi;

        $teksPeriode = sprintf(
            '%s - %s',
            $this->formatTanggalIndonesia($tanggalMulai),
            $this->formatTanggalIndonesia($tanggalSelesai)
        );

        $teksTanggal = $this->formatTanggalIndonesia($tanggalTandaTangan);

        $ttdNamaText = $request->string('ttd_nama')->toString();
        $nipText = $request->string('nip')->toString();

        /*
         * Ukuran font memakai nilai yang sudah diatur admin di halaman
         * "Kelola Sertifikat" (ukuran, posisi, warna, alignment sesuai
         * template). Tidak ada penyusutan otomatis maupun batas font
         * minimum — teks mengikuti pengaturan template apa adanya.
         */
        $fontSizes = [
            'nomor' => (int) round((float) $template->nomor_font_size),
            'nama' => (int) round((float) $template->nama_font_size),
            'asal' => (int) round((float) $template->asal_font_size),
            'periode' => (int) round((float) $template->periode_font_size),
            'tanggal' => (int) round((float) $template->tanggal_font_size),
            'ttd_nama' => (int) round((float) $template->ttd_nama_font_size),
            'nip' => (int) round((float) $template->nip_font_size),
        ];

        /*
         * AMBIL FILE TEMPLATE ASLI
         * Jangan gunakan Base64 karena sebelumnya gambar tidak muncul
         * di hasil PDF.
         */
        $templateImagePath = Storage::disk('public')->path(
            $template->file_path
        );

        if (! file_exists($templateImagePath)) {
            return response()->json([
                'errors' => [
                    'template' => 'File template tidak ditemukan: '.$template->file_path,
                ],
            ], 422);
        }

        /*
         * Gunakan file:// supaya DomPDF membaca gambar langsung
         * dari storage.
         */
        $templateImage = 'file://'.str_replace(
            '\\',
            '/',
            $templateImagePath
        );

        /*
         * Hitung posisi tiap teks agar PAS dengan titik (anchor) X/Y yang
         * diatur di "Kelola Sertifikat". DomPDF tidak mendukung CSS transform,
         * jadi perataan center/kanan dan perataan vertikal dihitung manual
         * dari lebar/tinggi teks lewat FontMetrics DomPDF.
         */
        $colors = [
            'nomor' => $template->nomor_color,
            'nama' => $template->nama_color,
            'asal' => $template->asal_color,
            'periode' => $template->periode_color,
            'tanggal' => $template->tanggal_color,
            'ttd_nama' => $template->ttd_nama_color,
            'nip' => $template->nip_color,
        ];

        $texts = [
            'nomor' => $teksNomor,
            'nama' => $teksNama,
            'asal' => $teksAsal,
            'periode' => $teksPeriode,
            'tanggal' => $teksTanggal,
            'ttd_nama' => $ttdNamaText,
            'nip' => $nipText,
        ];

        $fields = $this->computeFieldPositions(
            $texts,
            $fontSizes,
            $colors,
            $template
        );

        /*
         * Generate PDF dengan rasio 16:9 sesuai template.
         * "fields" berisi posisi/ukuran/warna hasil perhitungan di atas.
         */
        $pdf = Pdf::loadView('sertifikat.pdf', [
            'templateImage' => $templateImage,
            'fields' => $fields,
        ]);

        $this->registerCertificateFonts($template, $pdf);

        /*
         * Ukuran halaman PDF mengikuti rasio gambar template asli, supaya
         * persentase X/Y (yang disimpan relatif terhadap template) terpetakan
         * sama persis antara preview browser dan PDF. Lebar dipatok 1152pt,
         * tinggi dihitung dari rasio gambar. Kalau ukuran gambar tidak
         * terbaca, fallback ke rasio 16:9 (1152 x 648).
         */
        $imageSize = @getimagesize($templateImagePath);
        $pageWidth = 1152.0;
        $pageHeight = ($imageSize && $imageSize[0] > 0 && $imageSize[1] > 0)
            ? round($pageWidth * $imageSize[1] / $imageSize[0], 2)
            : 648.0;

        $pdf->setPaper([0, 0, $pageWidth, $pageHeight]);

        /*
         * Pastikan DomPDF boleh membaca file lokal.
         */
        $dompdf = $pdf->getDomPDF();

        $dompdf->getOptions()->set([
            'isRemoteEnabled' => true,
            'isHtml5ParserEnabled' => true,
            'chroot' => base_path(),
        ]);

        $filePath = 'sertifikat/'
            .now()->format('Y/m')
            .'/'
            .str()->uuid()
            .'.pdf';

        $output = $pdf->output();

        Storage::disk('public')->put(
            $filePath,
            $output
        );

        Sertifikat::create([
            'peserta_pkl_id' => $peserta->id,
            'nomor_sertifikat' => $request
                ->string('nomor_sertifikat')
                ->toString(),
            'tanggal_sertifikat' => $tanggalTandaTangan,
            'file_path' => $filePath,
            'generated_at' => now(),
        ]);

        /*
         * Kembalikan PDF langsung sebagai attachment supaya browser otomatis
         * mengunduhnya ke perangkat pengguna.
         */
        $filename = 'sertifikat-'.str()->slug($teksNama).'.pdf';

        return response($output, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
        ]);
    }

    public function storeTemplate(StoreTemplateSertifikatRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        return DB::transaction(function () use ($request, $validated) {
            $template = TemplateSertifikat::query()
                ->where('is_active', true)
                ->latest()
                ->first();

            /*
             * Kalau upload gambar baru, simpan gambar ke storage/public.
             */
            if ($request->hasFile('template')) {
                // Hapus gambar template lama kalau ada
                if ($template && $template->file_path) {
                    Storage::disk('public')->delete($template->file_path);
                }

                $filePath = $request->file('template')->store(
                    'sertifikat/template',
                    'public'
                );
            } elseif ($template) {
                // Kalau tidak upload baru, tetap gunakan template lama
                $filePath = $template->file_path;
            } else {
                return back()
                    ->withErrors([
                        'template' => 'Silakan upload gambar template sertifikat terlebih dahulu.',
                    ])
                    ->withInput();
            }

            unset($validated['template']);

            $validated['file_path'] = $filePath;
            $validated['is_active'] = true;

            /*
             * Nonaktifkan template lama.
             */
            TemplateSertifikat::query()->update([
                'is_active' => false,
            ]);

            /*
             * Simpan template baru / update template aktif.
             *
             * PERHATIAN: setelah kueri "nonaktifkan semua template" di atas,
             * model $template masih menyimpan nilai lama is_active=true di
             * memori. Tanpa refresh(), Eloquent menganggap is_active tidak
             * berubah (tidak dirty) sehingga kolomnya TIDAK ditulis — akibatnya
             * tidak ada template aktif tersisa. refresh() menyinkronkan nilai
             * dari database agar is_active=true benar-benar ditulis.
             */
            if ($template) {
                $template->refresh();
                $template->update($validated);
            } else {
                TemplateSertifikat::create($validated);
            }

            return redirect()
                ->route('sertifikat.template')
                ->with('status', 'Template sertifikat berhasil disimpan.');
        });
    }

    public function download(Sertifikat $sertifikat)
    {
        return Storage::disk('public')->download($sertifikat->file_path);
    }

    public function destroy(Sertifikat $sertifikat): RedirectResponse
    {
        Storage::disk('public')->delete($sertifikat->file_path);
        $sertifikat->delete();

        return redirect()->route('sertifikat.index')->with('status', 'Sertifikat berhasil dihapus.');
    }

    /*
     * Pastikan semua font kustom (lihat config/certificate_fonts.php) tersedia
     * secara fisik di storage/fonts. Font yang belum ada akan diunduh otomatis
     * dari URL sumbernya, lalu dibersihkan dari file duplikat.
     */
    private function ensureCertificateFonts(): void
    {
        $fontConfig = config('certificate_fonts', []);

        foreach ($fontConfig as $font) {
            $sources = $font['sources'] ?? [];

            foreach (['regular', 'bold'] as $weight) {
                $path = $font[$weight] ?? null;
                $source = $sources[$weight] ?? null;

                if (! $path || ! $source) {
                    continue;
                }

                if (! file_exists($path)) {
                    $this->downloadFontFile($source, $path);
                }
            }
        }

        $this->cleanupDuplicateFonts();
    }

    /*
     * Unduh file font dari URL sumber ke path lokal. Kalau unduhan gagal,
     * path lokal dibiarkan kosong (fallback font bawaan DomPDF yang dipakai).
     */
    private function downloadFontFile(string $source, string $destination): bool
    {
        try {
            $response = Http::timeout(30)->get($source);

            if (! $response->successful()) {
                return false;
            }

            $contents = $response->body();

            // Validasi minimal: pastikan ini file font (bukan halaman error).
            if ($contents === '' || str_starts_with($contents, '<')) {
                return false;
            }

            $dir = dirname($destination);
            if (! is_dir($dir)) {
                mkdir($dir, 0755, true);
            }

            return file_put_contents($destination, $contents) !== false;
        } catch (\Throwable $e) {
            return false;
        }
    }

    /*
     * Bersihkan file font duplikat di storage/fonts, mis. "FontName (1).ttf".
     * Sisakan satu file utama saja.
     */
    private function cleanupDuplicateFonts(): void
    {
        $fontDir = storage_path('fonts');

        if (! is_dir($fontDir)) {
            return;
        }

        $files = glob($fontDir.'/*.{ttf,woff,woff2,otf}', GLOB_BRACE) ?: [];

        foreach ($files as $file) {
            $name = basename($file);

            // Hanya file dengan pola duplikat "Nama (1).ttf".
            if (! preg_match('/^(.*?)\s+\(\d+\)\.(ttf|woff|woff2|otf)$/i', $name, $matches)) {
                continue;
            }

            $mainName = $matches[1].'.'.$matches[2];
            $mainFile = $fontDir.'/'.$mainName;

            if (file_exists($mainFile)) {
                @unlink($file);
            } elseif (! file_exists($mainFile)) {
                @rename($file, $mainFile);
            }
        }
    }

    /*
     * Daftarkan font kustom (lihat config/certificate_fonts.php) ke DomPDF
     * yang dipakai untuk me-render PDF, supaya metrik lebar hurufnya identik
     * dengan yang dipakai browser di Editor Visual.
     */
    private function registerCertificateFonts(TemplateSertifikat $template, $pdf): void
    {
        $this->registerTemplateFonts($template, $pdf->getDomPDF()->getFontMetrics());
    }

    /*
     * Registrasi font kustom pada instance FontMetrics tertentu. Font yang
     * tidak ada di config dilewati (biarkan penanganan bawaan DomPDF).
     */
    private function registerTemplateFonts(TemplateSertifikat $template, FontMetrics $fontMetrics): void
    {
        $fontConfig = config('certificate_fonts', []);

        if (empty($fontConfig)) {
            return;
        }

        $families = array_unique(array_filter([
            $template->nama_font_family,
            $template->asal_font_family,
            $template->nomor_font_family,
            $template->periode_font_family,
            $template->tanggal_font_family,
            $template->ttd_nama_font_family,
            $template->nip_font_family,
        ]));

        foreach ($families as $family) {
            if (! isset($fontConfig[$family])) {
                continue;
            }

            $files = $fontConfig[$family];

            if (! empty($files['regular']) && is_file($files['regular'])) {
                $fontMetrics->registerFont([
                    'family' => $family,
                    'weight' => 'normal',
                    'style' => 'normal',
                ], $files['regular']);
            }

            if (! empty($files['bold']) && is_file($files['bold'])) {
                $fontMetrics->registerFont([
                    'family' => $family,
                    'weight' => 'bold',
                    'style' => 'normal',
                ], $files['bold']);
            }
        }
    }

    /*
     * Hitung posisi tiap field dari nilai template. Mekanisme barunya memakai
     * kombinasi left + width + text-align (bukan CSS transform) supaya posisi
     * PDF konsisten dengan preview browser:
     *   - left:    left = x%        | center = (x - lebar_max/2)% | right = (x - lebar_max)%
     *   - width:   lebar_max%
     *   - top:     y%  +  margin-top: -0.55em (geser vertikal berbasis em)
     */
    private function computeFieldPositions(
        array $texts,
        array $fontSizes,
        array $colors,
        TemplateSertifikat $template
    ): array {
        $fields = [];

        foreach ($texts as $key => $text) {
            $x = (float) $template->{$key.'_x'};
            $y = (float) $template->{$key.'_y'};
            $lebarMax = (float) $template->{$key.'_lebar_max'};
            $alignment = $template->{$key.'_alignment'};

            $left = match ($alignment) {
                'center' => $x - $lebarMax / 2,
                'right' => $x - $lebarMax,
                default => $x,
            };

            $fields[$key] = [
                'text' => $text,
                'left' => $left,
                'top' => $y,
                'width' => $lebarMax,
                'font_size' => $fontSizes[$key],
                'font_family' => $this->pdfFontFamily($template->{$key.'_font_family'}),
                'color' => $colors[$key],
                'alignment' => $alignment,
            ];
        }

        return $fields;
    }

    /*
     * Format tanggal ke "d NamaBulan Y" (contoh: 28 Februari 2026) memakai
     * nama bulan Indonesia penuh, konsisten dengan preview di template.
     */
    private function formatTanggalIndonesia(?Carbon $date): string
    {
        if ($date === null) {
            return '';
        }

        $bulan = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
            5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
            9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember',
        ];

        return $date->format('d').' '.$bulan[$date->month].' '.$date->year;
    }

    /*
     * Petakan nama font template ke font yang benar-benar dikenal DomPDF.
     */
    private function pdfFontFamily(string $family): string
    {
        return match (strtolower(trim($family))) {
            'luxurious script' => 'Luxurious Script',
            'times new roman' => 'Times New Roman',
            'arial' => 'Helvetica',
            'courier new' => 'Courier',
            'dejavu serif' => 'DejaVu Serif',
            'dejavu sans mono' => 'DejaVu Sans Mono',
            default => 'DejaVu Sans',
        };
    }

    private function templateProps(TemplateSertifikat $template): array
    {
        return [
            'id' => $template->id,
            'file_path' => $template->file_path,
            'nomor_x' => $template->nomor_x,
            'nomor_y' => $template->nomor_y,
            'nomor_alignment' => $template->nomor_alignment,
            'nomor_lebar_max' => $template->nomor_lebar_max,
            'nomor_color' => $template->nomor_color,
            'nomor_font_family' => $template->nomor_font_family,
            'nomor_font_size' => $template->nomor_font_size,
            'nama_x' => $template->nama_x,
            'nama_y' => $template->nama_y,
            'nama_alignment' => $template->nama_alignment,
            'nama_lebar_max' => $template->nama_lebar_max,
            'nama_color' => $template->nama_color,
            'nama_font_family' => $template->nama_font_family,
            'nama_font_size' => $template->nama_font_size,
            'asal_x' => $template->asal_x,
            'asal_y' => $template->asal_y,
            'asal_alignment' => $template->asal_alignment,
            'asal_lebar_max' => $template->asal_lebar_max,
            'asal_color' => $template->asal_color,
            'asal_font_family' => $template->asal_font_family,
            'asal_font_size' => $template->asal_font_size,
            'periode_x' => $template->periode_x,
            'periode_y' => $template->periode_y,
            'periode_alignment' => $template->periode_alignment,
            'periode_lebar_max' => $template->periode_lebar_max,
            'periode_color' => $template->periode_color,
            'periode_font_family' => $template->periode_font_family,
            'periode_font_size' => $template->periode_font_size,
            'tanggal_x' => $template->tanggal_x,
            'tanggal_y' => $template->tanggal_y,
            'tanggal_alignment' => $template->tanggal_alignment,
            'tanggal_lebar_max' => $template->tanggal_lebar_max,
            'tanggal_color' => $template->tanggal_color,
            'tanggal_font_family' => $template->tanggal_font_family,
            'tanggal_font_size' => $template->tanggal_font_size,
            'ttd_nama_x' => $template->ttd_nama_x,
            'ttd_nama_y' => $template->ttd_nama_y,
            'ttd_nama_alignment' => $template->ttd_nama_alignment,
            'ttd_nama_lebar_max' => $template->ttd_nama_lebar_max,
            'ttd_nama_color' => $template->ttd_nama_color,
            'ttd_nama_font_family' => $template->ttd_nama_font_family,
            'ttd_nama_font_size' => $template->ttd_nama_font_size,
            'nip_x' => $template->nip_x,
            'nip_y' => $template->nip_y,
            'nip_alignment' => $template->nip_alignment,
            'nip_lebar_max' => $template->nip_lebar_max,
            'nip_color' => $template->nip_color,
            'nip_font_family' => $template->nip_font_family,
            'nip_font_size' => $template->nip_font_size,
        ];
    }
}
