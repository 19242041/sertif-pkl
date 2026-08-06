<?php

namespace App\Http\Controllers;

use App\Models\PesertaPkl;
use App\Models\Sertifikat;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $year = (int) $request->integer('year', now()->year);

        $monthlyCounts = array_fill(1, 12, 0);
        PesertaPkl::query()
            ->selectRaw('MONTH(tanggal_mulai) as month, COUNT(*) as total')
            ->whereYear('tanggal_mulai', $year)
            ->groupBy('month')
            ->pluck('total', 'month')
            ->each(function ($total, $month) use (&$monthlyCounts) {
                $monthlyCounts[(int) $month] = (int) $total;
            });

        $totalPeserta = PesertaPkl::count();
        $aktif = PesertaPkl::where('status', 'Aktif')->count();
        $selesai = PesertaPkl::where('status', 'Selesai')->count();
        $sertifikatUpload = Sertifikat::count();
        $belumUpload = PesertaPkl::doesntHave('sertifikats')->count();

        return Inertia::render('Dashboard', [
            'summary' => [
                'total_peserta' => $totalPeserta,
                'aktif' => $aktif,
                'selesai' => $selesai,
                'sertifikat_upload' => $sertifikatUpload,
                'belum_upload' => $belumUpload,
            ],
            'monthlyCounts' => array_values($monthlyCounts),
            'statusChart' => [
                ['label' => 'Aktif', 'value' => $aktif, 'color' => '#1B63B0'],
                ['label' => 'Selesai', 'value' => $selesai, 'color' => '#2E8B4E'],
                ['label' => 'Belum Upload', 'value' => $belumUpload, 'color' => '#C0433D'],
            ],
            'adminName' => $request->user()?->name,
            'currentYear' => $year,
        ]);
    }
}