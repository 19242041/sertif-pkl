<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PesertaPklController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SertifikatController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => redirect()->route('dashboard'))->middleware('auth');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('peserta-pkl', PesertaPklController::class)
        ->parameters(['peserta-pkl' => 'pesertaPkl']);

    Route::get('/sertifikat', [SertifikatController::class, 'index'])->name('sertifikat.index');
    Route::post('/sertifikat', [SertifikatController::class, 'store'])->name('sertifikat.store');
    Route::delete('/sertifikat/{sertifikat}', [SertifikatController::class, 'destroy'])->name('sertifikat.destroy');
    Route::get('/sertifikat/{sertifikat}/download', [SertifikatController::class, 'download'])->name('sertifikat.download');

    Route::get('/laporan', fn () => Inertia::render('Laporan/Index', [
        'summary' => [
            'total_peserta' => \App\Models\PesertaPkl::count(),
            'aktif' => \App\Models\PesertaPkl::where('status', 'Aktif')->count(),
            'selesai' => \App\Models\PesertaPkl::where('status', 'Selesai')->count(),
            'sertifikat_upload' => \App\Models\Sertifikat::count(),
        ],
    ]))->name('laporan.index');

    Route::get('/pengaturan', [ProfileController::class, 'edit'])->name('pengaturan.edit');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
