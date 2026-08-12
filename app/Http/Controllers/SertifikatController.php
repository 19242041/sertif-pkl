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
    private const MIN_FONT_SIZE = 10;

    private const MAX_FONT_SIZE = 120;

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

        $teksNama = $peserta->nama;
        $teksAsal = $peserta->asal_institusi;

        $teksPeriode = sprintf(
            '%s - %s',
            optional($tanggalMulai)->format('d M Y'),
            optional($tanggalSelesai)->format('d M Y')
        );

        $teksTanggal = optional($tanggalTandaTangan)->format('d M Y') ?? '';

<<<<<<< HEAD
        /*
         * Hitung ukuran font berdasarkan template.
         * "asal" (Asal Sekolah) ikut dihitung independen sama seperti field lain.
         */
        $fit = $this->autoFit([
            'nama' => [
                $teksNama,
                (float) $template->nama_lebar_max
            ],
            'asal' => [
                $teksAsal,
                (float) $template->asal_lebar_max
            ],
            'periode' => [
                $teksPeriode,
                (float) $template->periode_lebar_max
            ],
            'tanggal' => [
                $teksTanggal,
                (float) $template->tanggal_lebar_max
            ],
        ]);
=======
    /*
     * Hitung ukuran font berdasarkan template.
     */
    $fit = $this->autoFit([
        'nama' => [
            $teksNama,
            (float) $template->nama_lebar_max,
            (float) $template->nama_font_size,
            $template->nama_font_family,
        ],
        'periode' => [
            $teksPeriode,
            (float) $template->periode_lebar_max,
            (float) $template->periode_font_size,
            $template->periode_font_family,
        ],
        'tanggal' => [
            $teksTanggal,
            (float) $template->tanggal_lebar_max,
            (float) $template->tanggal_font_size,
            $template->tanggal_font_family,
        ],
    ]);
>>>>>>> 3bb9cb7891f17e44bd23793f456857729951a19e

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
                    'template' => 'File template tidak ditemukan: ' . $template->file_path
                ]);
        }

        /*
         * Gunakan file:// supaya DomPDF membaca gambar langsung
         * dari storage.
         */
        $templateImage = 'file://' . str_replace(
            '\\',
            '/',
            $templateImagePath
        );

        /*
         * Generate PDF dengan rasio 16:9 sesuai template.
         * "asalText" dan warna tiap field (dari template) ikut dikirim ke view.
         */
        $pdf = Pdf::loadView('sertifikat.pdf', [
            'templateImage' => $templateImage,
            'namaPeserta' => $teksNama,
            'asalText' => $teksAsal,
            'periodeText' => $teksPeriode,
            'tanggalText' => $teksTanggal,
            'template' => $template,
            'fontSizes' => $fit['sizes'],
            'colors' => [
                'nama' => $template->nama_color,
                'asal' => $template->asal_color,
                'periode' => $template->periode_color,
                'tanggal' => $template->tanggal_color,
            ],
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
            . now()->format('Y/m')
            . '/'
            . str()->uuid()
            . '.pdf';

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

        if ($fit['warnings']) {
            $status .= ' Catatan: area '
                . implode(', ', $fit['warnings'])
                . ' terlalu sempit sehingga memakai ukuran font minimum ('
                . self::MIN_FONT_SIZE
                . 'px).';
        }

        return redirect()
            ->route('sertifikat.index')
            ->with('status', $status);
    }

    public function storeTemplate(StoreTemplateSertifikatRequest $request): RedirectResponse
    {
        $validated = $request->validated();

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
                    'template' => 'Silakan upload gambar template sertifikat terlebih dahulu.'
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
         */
        if ($template) {
            $template->update($validated);
        } else {
            TemplateSertifikat::create($validated);
        }

        return redirect()
            ->route('sertifikat.template')
            ->with('status', 'Template sertifikat berhasil disimpan.');
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

    /**
     * Hitung ukuran font paling besar yang muat untuk tiap teks di dalam
     * lebar area maksimal (persen dari lebar halaman). Setiap field dihitung
     * independen sesuai isi teks dan lebar area miliknya.
     *
     * @param array<string, array{0: string, 1: float}> $fields text & lebar_max (persen)
     *
     * @return array{sizes: array<string, int>, warnings: array<int, string>}
     */
    private function autoFit(array $fields): array
    {
        $preheat = Pdf::loadHTML(
            '<!DOCTYPE html>
            <html>
            <meta charset="UTF-8">
            <body style="font-family: DejaVu Sans, sans-serif;">x</body>
            </html>'
        );

        $preheat->setPaper([0, 0, 1152, 648]);
        $dompdf = $preheat->getDompdf();
        $dompdf->render();

        $fontMetrics = $dompdf->getFontMetrics();
        $canvasWidthPt = $dompdf->getCanvas()->get_width();

        $sizes = [];
        $warnings = [];

        foreach ($fields as $key => [$text, $maxWidthPercent, $targetSize, $fontFamily]) {
            $maxWidthPt = ($canvasWidthPt * $maxWidthPercent) / 100;
            $size = min(max($targetSize, self::MIN_FONT_SIZE), self::MAX_FONT_SIZE);
            $hitMinimum = false;

            $font = $fontMetrics->getFont($this->resolveFontFamily($fontMetrics, $fontFamily));

            while ($size > self::MIN_FONT_SIZE) {
                $widthPt = $fontMetrics->getTextWidth($text, $font, $size * 0.75);

                if ($widthPt <= $maxWidthPt) {
                    break;
                }

                $size -= 0.5;
            }

            if ($size <= self::MIN_FONT_SIZE && $fontMetrics->getTextWidth($text, $font, self::MIN_FONT_SIZE * 0.75) > $maxWidthPt) {
                $size = self::MIN_FONT_SIZE;
                $hitMinimum = true;
            }

            $sizes[$key] = round($size, 1);

            if ($hitMinimum) {
                $warnings[] = $key;
            }
        }

        return ['sizes' => $sizes, 'warnings' => $warnings];
    }

    private function resolveFontFamily($fontMetrics, string $fontFamily): string
    {
        $fontFamily = trim($fontFamily);

        if ($fontFamily === 'Times New Roman') {
            return 'Times-Roman';
        }

        if ($fontFamily === 'Luxurious Script') {
            return 'DejaVu Sans';
        }

        if (in_array($fontFamily, ['Arial', 'DejaVu Sans'], true)) {
            return $fontFamily;
        }

        return 'DejaVu Sans';
    }

    private function templateProps(TemplateSertifikat $template): array
    {
        return [
            'id' => $template->id,
            'file_path' => $template->file_path,
            'nama_x' => $template->nama_x,
            'nama_y' => $template->nama_y,
            'nama_alignment' => $template->nama_alignment,
            'nama_lebar_max' => $template->nama_lebar_max,
            'nama_color' => $template->nama_color,
            'asal_x' => $template->asal_x,
            'asal_y' => $template->asal_y,
            'asal_alignment' => $template->asal_alignment,
            'asal_lebar_max' => $template->asal_lebar_max,
            'asal_color' => $template->asal_color,
            'periode_x' => $template->periode_x,
            'periode_y' => $template->periode_y,
            'periode_alignment' => $template->periode_alignment,
            'periode_lebar_max' => $template->periode_lebar_max,
            'periode_color' => $template->periode_color,
            'tanggal_x' => $template->tanggal_x,
            'tanggal_y' => $template->tanggal_y,
            'tanggal_alignment' => $template->tanggal_alignment,
            'tanggal_lebar_max' => $template->tanggal_lebar_max,
<<<<<<< HEAD
            'tanggal_color' => $template->tanggal_color,
=======
            'nama_color' => $template->nama_color,
            'nama_font_family' => $template->nama_font_family,
            'periode_color' => $template->periode_color,
            'periode_font_family' => $template->periode_font_family,
            'tanggal_color' => $template->tanggal_color,
            'tanggal_font_family' => $template->tanggal_font_family,
>>>>>>> 3bb9cb7891f17e44bd23793f456857729951a19e
        ];
    }
}