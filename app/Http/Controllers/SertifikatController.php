<?php

namespace App\Http\Controllers;

use App\Http\Requests\Sertifikat\StoreGeneratedSertifikatRequest;
use App\Http\Requests\Sertifikat\StoreTemplateSertifikatRequest;
use App\Models\PesertaPkl;
use App\Models\Sertifikat;
use App\Models\TemplateSertifikat;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
        $template = TemplateSertifikat::query()->where('is_active', true)->latest()->first();

        return Inertia::render('Sertifikat/Template', [
            'template' => $template ? $this->templateProps($template) : null,
        ]);
    }

    public function store(StoreGeneratedSertifikatRequest $request): RedirectResponse
    {
        $template = TemplateSertifikat::query()
            ->where('is_active', true)
            ->latest()
            ->firstOrFail();

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
            optional($tanggalMulai)->format('d M Y'),
            optional($tanggalSelesai)->format('d M Y')
        );

        $teksTanggal = optional($tanggalTandaTangan)->format('d M Y') ?? '';

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
            return redirect()
                ->back()
                ->withErrors([
                    'template' => 'File template tidak ditemukan: '.$template->file_path,
                ]);
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
        ];

        $texts = [
            'nomor' => $teksNomor,
            'nama' => $teksNama,
            'asal' => $teksAsal,
            'periode' => $teksPeriode,
            'tanggal' => $teksTanggal,
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

        /*
         * Ukuran 16:9.
         * 1152 x 648 point = rasio 16:9.
         */
        $pdf->setPaper([0, 0, 1152, 648]);

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

        Storage::disk('public')->put(
            $filePath,
            $pdf->output()
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

        $status = 'Sertifikat berhasil digenerate.';

        return redirect()
            ->route('sertifikat.index')
            ->with('status', $status);
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
     * Hitung koordinat (pt) tiap field dari anchor X/Y (persen) di template.
     * Mengukur lebar teks dengan FontMetrics DomPDF karena transform CSS tidak
     * didukung — center/right dan perataan vertikal dihitung manual.
     */
    private function computeFieldPositions(
        array $texts,
        array $fontSizes,
        array $colors,
        TemplateSertifikat $template
    ): array {
        $pageWidth = 1152;
        $pageHeight = 648;

        $preheat = Pdf::loadHTML(
            '<!DOCTYPE html>
            <html>
            <meta charset="UTF-8">
            <body style="font-family: DejaVu Sans, sans-serif;">x</body>
            </html>'
        );

        $preheat->setPaper([0, 0, $pageWidth, $pageHeight]);
        $preheatDompdf = $preheat->getDompdf();
        $preheatDompdf->render();

        $fontMetrics = $preheatDompdf->getFontMetrics();
        $fonts = [];

        $fields = [];

        foreach ($texts as $key => $text) {
            $x = (float) $template->{$key.'_x'};
            $y = (float) $template->{$key.'_y'};
            $lebarMax = (float) $template->{$key.'_lebar_max'};
            $alignment = $template->{$key.'_alignment'};
            $fontPx = $fontSizes[$key];
            $fontPt = $fontPx * 0.75;

            $family = $this->pdfFontFamily($template->{$key.'_font_family'});
            $fonts[$family] ??= $fontMetrics->getFont($family);

            $textWidth = $fontMetrics->getTextWidth($text, $fonts[$family], $fontPt);
            $maxWidthPt = $lebarMax / 100 * $pageWidth;
            $boxWidth = min($textWidth, $maxWidthPt);
            $lineCount = ($maxWidthPt > 0 && $textWidth > $maxWidthPt)
                ? (int) ceil($textWidth / $maxWidthPt)
                : 1;

            $anchorX = $x / 100 * $pageWidth;
            $anchorY = $y / 100 * $pageHeight;
            $boxHeight = $lineCount * $fontPt * 1.15;

            $left = $anchorX - match ($alignment) {
                'center' => $boxWidth / 2,
                'right' => $boxWidth,
                default => 0,
            };

            $top = $anchorY - $boxHeight / 2;

            $left = max(0, (float) min($left, $pageWidth - $boxWidth));
            $top = max(0, (float) min($top, $pageHeight - $boxHeight));

            $fields[$key] = [
                'text' => $text,
                'left' => round($left, 2),
                'top' => round($top, 2),
                'width' => round($boxWidth, 2),
                'font_size' => $fontPx,
                'font_family' => $family,
                'color' => $colors[$key],
                'alignment' => $alignment,
            ];
        }

        return $fields;
    }

    /*
     * Petakan nama font template ke font yang benar-benar dikenal DomPDF.
     */
    private function pdfFontFamily(string $family): string
    {
        return match (strtolower(trim($family))) {
            'times new roman' => 'Times',
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
        ];
    }
}
