<?php

namespace App\Http\Controllers;

use App\Http\Requests\Sertifikat\StoreGeneratedSertifikatRequest;
use App\Http\Requests\Sertifikat\StoreTemplateSertifikatRequest;
use App\Models\PesertaPkl;
use App\Models\Sertifikat;
use App\Models\TemplateSertifikat;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;
use Inertia\Response;

class SertifikatController extends Controller
{
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
                'pesertaOptions' => PesertaPkl::query()->orderBy('nama')->get(['id', 'nama', 'asal_institusi', 'tanggal_mulai', 'tanggal_selesai']),
            'sertifikats' => $sertifikats,
            'template' => $template ? [
                'id' => $template->id,
                'file_path' => $template->file_path,
                'nama_x' => $template->nama_x,
                'nama_y' => $template->nama_y,
                'nama_font_size' => $template->nama_font_size,
                'nama_alignment' => $template->nama_alignment,
                'periode_x' => $template->periode_x,
                'periode_y' => $template->periode_y,
                'periode_font_size' => $template->periode_font_size,
                'periode_alignment' => $template->periode_alignment,
                'tanggal_x' => $template->tanggal_x,
                'tanggal_y' => $template->tanggal_y,
                'tanggal_font_size' => $template->tanggal_font_size,
                'tanggal_alignment' => $template->tanggal_alignment,
            ] : null,
        ]);
    }

    public function template(): Response
    {
        $template = TemplateSertifikat::query()->where('is_active', true)->latest()->first();

        return Inertia::render('Sertifikat/Template', [
            'template' => $template ? [
                'id' => $template->id,
                'file_path' => $template->file_path,
                'nama_x' => $template->nama_x,
                'nama_y' => $template->nama_y,
                'nama_font_size' => $template->nama_font_size,
                'nama_alignment' => $template->nama_alignment,
                'periode_x' => $template->periode_x,
                'periode_y' => $template->periode_y,
                'periode_font_size' => $template->periode_font_size,
                'periode_alignment' => $template->periode_alignment,
                'tanggal_x' => $template->tanggal_x,
                'tanggal_y' => $template->tanggal_y,
                'tanggal_font_size' => $template->tanggal_font_size,
                'tanggal_alignment' => $template->tanggal_alignment,
            ] : null,
        ]);
    }

    public function store(StoreGeneratedSertifikatRequest $request): RedirectResponse
    {
        $template = TemplateSertifikat::query()->where('is_active', true)->latest()->firstOrFail();
        $peserta = PesertaPkl::query()->findOrFail($request->integer('peserta_pkl_id'));

        $tanggalMulai = $request->date('tanggal_mulai_pkl') ?? $peserta->tanggal_mulai;
        $tanggalSelesai = $request->date('tanggal_selesai_pkl') ?? $peserta->tanggal_selesai;
        $tanggalTandaTangan = $request->date('tanggal_tanda_tangan');
        $periodeText = sprintf('%s - %s', optional($tanggalMulai)->format('d M Y'), optional($tanggalSelesai)->format('d M Y'));

        $templateImage = Storage::disk('public')->get($template->file_path);
        $templateMime = Storage::disk('public')->mimeType($template->file_path) ?: 'image/png';

        $pdf = Pdf::loadView('sertifikat.pdf', [
            'templateImage' => 'data:' . $templateMime . ';base64,' . base64_encode($templateImage),
            'namaPeserta' => $peserta->nama,
            'periodeText' => $periodeText,
            'tanggalText' => optional($tanggalTandaTangan)->format('d M Y'),
            'template' => $template,
        ])->setPaper('a4', 'landscape');

        $filePath = 'sertifikat/' . now()->format('Y/m') . '/' . str()->uuid() . '.pdf';
        Storage::disk('public')->put($filePath, $pdf->output());

        Sertifikat::create([
            'peserta_pkl_id' => $peserta->id,
            'nomor_sertifikat' => $request->string('nomor_sertifikat')->toString(),
            'tanggal_sertifikat' => $tanggalTandaTangan,
            'file_path' => $filePath,
            'generated_at' => now(),
        ]);

        return redirect()->route('sertifikat.index')->with('status', 'Sertifikat berhasil digenerate.');
    }

    public function storeTemplate(StoreTemplateSertifikatRequest $request): RedirectResponse
    {
        $payload = $request->validated();
        $template = TemplateSertifikat::query()->where('is_active', true)->latest()->first();

        if (! $template && ! $request->hasFile('template')) {
            return redirect()->back()->withErrors(['template' => 'Template gambar wajib diunggah untuk penyimpanan pertama.']);
        }

        if ($request->hasFile('template')) {
            if ($template?->file_path) {
                Storage::disk('public')->delete($template->file_path);
            }

            $payload['file_path'] = $request->file('template')->store('sertifikat/template', 'public');
        } elseif ($template) {
            $payload['file_path'] = $template->file_path;
        }

        unset($payload['template']);

        DB::transaction(function () use ($payload, $template): void {
            TemplateSertifikat::query()->update(['is_active' => false]);

            if ($template) {
                $template->update($payload + ['is_active' => true]);
                return;
            }

            TemplateSertifikat::create($payload + ['is_active' => true]);
        });

        return redirect()->route('sertifikat.template')->with('status', 'Template sertifikat berhasil disimpan.');
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
}