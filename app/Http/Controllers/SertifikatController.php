<?php

namespace App\Http\Controllers;

use App\Http\Requests\Sertifikat\StoreSertifikatRequest;
use App\Models\PesertaPkl;
use App\Models\Sertifikat;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SertifikatController extends Controller
{
    public function index(Request $request): Response
    {
        $sertifikats = Sertifikat::query()
            ->with('pesertaPkl')
            ->latest('uploaded_at')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Sertifikat $sertifikat) => [
                'id' => $sertifikat->id,
                'nomor_sertifikat' => $sertifikat->nomor_sertifikat,
                'tanggal_sertifikat' => optional($sertifikat->tanggal_sertifikat)->format('d M Y'),
                'uploaded_at' => optional($sertifikat->uploaded_at)->format('d M Y H:i'),
                'file_path' => $sertifikat->file_path,
                'peserta' => [
                    'id' => $sertifikat->pesertaPkl?->id,
                    'nama' => $sertifikat->pesertaPkl?->nama,
                    'asal_institusi' => $sertifikat->pesertaPkl?->asal_institusi,
                ],
            ]);

        return Inertia::render('Sertifikat/Index', [
            'pesertaOptions' => PesertaPkl::query()->orderBy('nama')->get(['id', 'nama', 'asal_institusi']),
            'sertifikats' => $sertifikats,
        ]);
    }

    public function store(StoreSertifikatRequest $request): RedirectResponse
    {
        $filePath = $request->file('file')->store('sertifikat', 'public');

        Sertifikat::create([
            'peserta_pkl_id' => $request->integer('peserta_pkl_id'),
            'nomor_sertifikat' => $request->string('nomor_sertifikat')->toString(),
            'tanggal_sertifikat' => $request->date('tanggal_sertifikat'),
            'file_path' => $filePath,
            'uploaded_at' => now(),
        ]);

        return redirect()->route('sertifikat.index')->with('status', 'Sertifikat berhasil diunggah.');
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