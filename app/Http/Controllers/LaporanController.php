<?php

namespace App\Http\Controllers;

use App\Models\PesertaPkl;
use App\Models\Sertifikat;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LaporanController extends Controller
{
    public function index(Request $request): Response
    {
        [$peserta, $filters] = $this->buildQuery($request);

        $totalPeserta = PesertaPkl::count();
        $aktif = PesertaPkl::where('status', 'Aktif')->count();
        $selesai = PesertaPkl::where('status', 'Selesai')->count();
        $berhenti = PesertaPkl::where('status', 'Berhenti')->count();
        $sertifikatTerbit = Sertifikat::count();
        $belumBuat = PesertaPkl::doesntHave('sertifikats')->count();

        return Inertia::render('Laporan/Index', [
            'summary' => [
                'total_peserta' => $totalPeserta,
                'aktif' => $aktif,
                'selesai' => $selesai,
                'berhenti' => $berhenti,
                'sertifikat_terbit' => $sertifikatTerbit,
                'belum_buat' => $belumBuat,
            ],
            'peserta' => $peserta,
            'filters' => $filters,
        ]);
    }

    public function exportPdf(Request $request)
    {
        [$pesertaQuery, $filters] = $this->buildQuery($request, false);

        $data = $pesertaQuery->get();

        $pdf = Pdf::loadView('laporan.pdf', [
            'peserta' => $data,
            'filters' => $filters,
            'generatedAt' => now(),
        ])->setPaper('a4', 'portrait');

        return $pdf->download('laporan-rekap-peserta-pkl-' . now()->format('Ymd-His') . '.pdf');
    }

    /**
     * @return array{0: object, 1: array<string, string>}
     */
    private function buildQuery(Request $request, bool $paginate = true): array
    {
        $search = trim($request->string('search')->toString());
        $status = $request->string('status')->toString();
        $startDate = $request->date('start_date');
        $endDate = $request->date('end_date');

        $query = PesertaPkl::query()
            ->with('sertifikatTerbaru')
            ->when($search !== '', function ($q) use ($search): void {
                $q->where(function ($sub) use ($search): void {
                    $sub->where('nama', 'like', "%{$search}%")
                        ->orWhere('asal_institusi', 'like', "%{$search}%");
                });
            })
            ->when(in_array($status, ['Aktif', 'Selesai', 'Berhenti'], true), fn ($q) => $q->where('status', $status))
            ->when($startDate instanceof \Carbon\CarbonInterface, fn ($q) => $q->whereDate('tanggal_mulai', '>=', $startDate))
            ->when($endDate instanceof \Carbon\CarbonInterface, fn ($q) => $q->whereDate('tanggal_selesai', '<=', $endDate))
            ->latest('tanggal_mulai');

        $peserta = $paginate
            ? $query->paginate(10)->withQueryString()->through(fn (PesertaPkl $item) => $this->row($item))
            : $query;

        $filters = [
            'search' => $search,
            'status' => $status,
            'start_date' => optional($startDate)->format('Y-m-d') ?? '',
            'end_date' => optional($endDate)->format('Y-m-d') ?? '',
        ];

        return [$peserta, $filters];
    }

    private function row(PesertaPkl $item): array
    {
        $sertifikat = $item->sertifikatTerbaru;

        return [
            'id' => $item->id,
            'nama' => $item->nama,
            'nis_nim' => $item->nis_nim,
            'asal_institusi' => $item->asal_institusi,
            'jurusan' => $item->jurusan,
            'status' => $item->status,
            'tanggal_mulai' => optional($item->tanggal_mulai)->format('d M Y'),
            'tanggal_selesai' => optional($item->tanggal_selesai)->format('d M Y'),
            'has_sertifikat' => (bool) $sertifikat,
            'sertifikat' => $sertifikat ? [
                'id' => $sertifikat->id,
                'nomor_sertifikat' => $sertifikat->nomor_sertifikat,
            ] : null,
        ];
    }
}