<?php

namespace App\Http\Controllers;

use App\Http\Requests\PesertaPkl\StorePesertaPklRequest;
use App\Http\Requests\PesertaPkl\UpdatePesertaPklRequest;
use App\Models\PesertaPkl;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PesertaPklController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();
        $status = $request->string('status')->toString();

        $peserta = PesertaPkl::query()
            ->with('sertifikatTerbaru')
            ->when($search, function ($query) use ($search): void {
                $query->where(function ($subQuery) use ($search): void {
                    $subQuery->where('nama', 'like', "%{$search}%")
                        ->orWhere('asal_institusi', 'like', "%{$search}%")
                        ->orWhere('nis_nim', 'like', "%{$search}%");
                });
            })
            ->when($status && $status !== 'semua', fn ($query) => $query->where('status', $status))
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(function (PesertaPkl $item) {
                $sertifikat = $item->sertifikatTerbaru;

                return [
                    'id' => $item->id,
                    'nama' => $item->nama,
                    'nis_nim' => $item->nis_nim,
                    'asal_institusi' => $item->asal_institusi,
                    'jurusan' => $item->jurusan,
                    'tanggal_mulai' => optional($item->tanggal_mulai)->format('d M Y'),
                    'tanggal_selesai' => optional($item->tanggal_selesai)->format('d M Y'),
                    'status' => $item->status,
                    'foto_url' => $item->foto_url,
                    'sertifikat' => $sertifikat ? [
                        'id' => $sertifikat->id,
                        'nomor_sertifikat' => $sertifikat->nomor_sertifikat,
                        'tanggal_sertifikat' => optional($sertifikat->tanggal_sertifikat)->format('d M Y'),
                        'file_path' => $sertifikat->file_path,
                    ] : null,
                ];
            });

        return Inertia::render('PesertaPkl/Index', [
            'peserta' => $peserta,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('PesertaPkl/Create', [
            'mode' => 'create',
        ]);
    }

    public function store(StorePesertaPklRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('foto')) {
            $data['foto_url'] = $request->file('foto')->store('peserta-pkl/foto', 'public');
        }

        unset($data['foto']);

        PesertaPkl::create($data);

        return redirect()->route('peserta-pkl.index')->with('status', 'Peserta PKL berhasil ditambahkan.');
    }

    public function show(PesertaPkl $pesertaPkl): Response
    {
        $pesertaPkl->load(['sertifikats' => fn ($query) => $query->latest('generated_at')]);

        return Inertia::render('PesertaPkl/Show', [
            'peserta' => [
                'id' => $pesertaPkl->id,
                'nama' => $pesertaPkl->nama,
                'nis_nim' => $pesertaPkl->nis_nim,
                'asal_institusi' => $pesertaPkl->asal_institusi,
                'jurusan' => $pesertaPkl->jurusan,
                'jenis_kelamin' => $pesertaPkl->jenis_kelamin,
                'tempat_lahir' => $pesertaPkl->tempat_lahir,
                'tanggal_lahir' => optional($pesertaPkl->tanggal_lahir)->format('d M Y'),
                'no_hp' => $pesertaPkl->no_hp,
                'email' => $pesertaPkl->email,
                'pembimbing_sekolah' => $pesertaPkl->pembimbing_sekolah,
                'pembimbing_lapangan' => $pesertaPkl->pembimbing_lapangan,
                'tanggal_mulai' => optional($pesertaPkl->tanggal_mulai)->format('d M Y'),
                'tanggal_selesai' => optional($pesertaPkl->tanggal_selesai)->format('d M Y'),
                'status' => $pesertaPkl->status,
                'keterangan' => $pesertaPkl->keterangan,
                'foto_url' => $pesertaPkl->foto_url,
                'sertifikats' => $pesertaPkl->sertifikats->map(fn ($sertifikat) => [
                    'id' => $sertifikat->id,
                    'nomor_sertifikat' => $sertifikat->nomor_sertifikat,
                    'tanggal_sertifikat' => optional($sertifikat->tanggal_sertifikat)->format('d M Y'),
                    'file_path' => $sertifikat->file_path,
                    'generated_at' => optional($sertifikat->generated_at)->format('d M Y H:i'),
                ]),
            ],
        ]);
    }

    public function edit(PesertaPkl $pesertaPkl): Response
    {
        return Inertia::render('PesertaPkl/Edit', [
            'mode' => 'edit',
            'peserta' => [
                'id' => $pesertaPkl->id,
                'nama' => $pesertaPkl->nama,
                'nis_nim' => $pesertaPkl->nis_nim,
                'asal_institusi' => $pesertaPkl->asal_institusi,
                'jurusan' => $pesertaPkl->jurusan,
                'jenis_kelamin' => $pesertaPkl->jenis_kelamin,
                'tempat_lahir' => $pesertaPkl->tempat_lahir,
                'tanggal_lahir' => optional($pesertaPkl->tanggal_lahir)->format('Y-m-d'),
                'no_hp' => $pesertaPkl->no_hp,
                'email' => $pesertaPkl->email,
                'pembimbing_sekolah' => $pesertaPkl->pembimbing_sekolah,
                'pembimbing_lapangan' => $pesertaPkl->pembimbing_lapangan,
                'tanggal_mulai' => optional($pesertaPkl->tanggal_mulai)->format('Y-m-d'),
                'tanggal_selesai' => optional($pesertaPkl->tanggal_selesai)->format('Y-m-d'),
                'status' => $pesertaPkl->status,
                'keterangan' => $pesertaPkl->keterangan,
                'foto_url' => $pesertaPkl->foto_url,
            ],
        ]);
    }

    public function update(UpdatePesertaPklRequest $request, PesertaPkl $pesertaPkl): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('foto')) {
            if ($pesertaPkl->foto_url) {
                Storage::disk('public')->delete($pesertaPkl->foto_url);
            }

            $data['foto_url'] = $request->file('foto')->store('peserta-pkl/foto', 'public');
        }

        unset($data['foto']);

        $pesertaPkl->update($data);

        return redirect()->route('peserta-pkl.show', $pesertaPkl)->with('status', 'Data peserta berhasil diperbarui.');
    }

    public function destroy(PesertaPkl $pesertaPkl): RedirectResponse
    {
        DB::transaction(function () use ($pesertaPkl): void {
            $pesertaPkl->load('sertifikats');

            foreach ($pesertaPkl->sertifikats as $sertifikat) {
                Storage::disk('public')->delete($sertifikat->file_path);
            }

            if ($pesertaPkl->foto_url) {
                Storage::disk('public')->delete($pesertaPkl->foto_url);
            }

            $pesertaPkl->sertifikats()->delete();
            $pesertaPkl->delete();
        });

        return redirect()->route('peserta-pkl.index')->with('status', 'Data peserta berhasil dihapus.');
    }
}