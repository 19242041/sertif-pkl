<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Rekap Peserta PKL</title>
    <style>
        @page { margin: 24mm 18mm; }
        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 11px;
            color: #1a1a1a;
            line-height: 1.45;
        }
        .header { text-align: center; margin-bottom: 6mm; }
        .header h1 {
            font-size: 15px;
            text-transform: uppercase;
            margin: 0 0 2mm;
            letter-spacing: 0.2px;
        }
        .header h2 {
            font-size: 13px;
            font-weight: normal;
            margin: 0 0 1mm;
        }
        .header p { font-size: 11px; margin: 0; color: #444; }
        .divider { border-top: 1.6px solid #1a1a1a; margin: 5mm 0; }
        .filter-info { font-size: 10.5px; margin-bottom: 4mm; color: #333; }
        .filter-info b { color: #111; }
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10px;
        }
        table th, table td {
            border: 0.8px solid #1a1a1a;
            padding: 2.5mm 2mm;
            text-align: left;
            vertical-align: top;
        }
        table th {
            background: #f0f0f0;
            font-size: 10px;
            font-weight: bold;
        }
        .text-center { text-align: center; }
        .muted { color: #555; }
        .footer {
            margin-top: 12mm;
            text-align: right;
            font-size: 10.5px;
        }
        .footer .sign-block { display: inline-block; text-align: center; width: 90mm; }
        .footer .name { margin-top: 16mm; text-decoration: underline; font-weight: bold; }
        .footer .role { margin-top: 1mm; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Laporan Rekap Peserta PKL</h1>
        <h2>UPTD Pengawasan Ketenagakerjaan Wilayah II Karawang</h2>
        <p>Dinas Tenaga Kerja dan Transmigrasi Provinsi Jawa Barat</p>
    </div>

    <div class="divider"></div>

    <div class="filter-info">
        @php
            $filters = $filters ?? [];
            $statusLabel = in_array($filters['status'] ?? '', ['Aktif', 'Selesai', 'Berhenti'], true) ? $filters['status'] : 'Semua';
            $periode = 'Semua Periode';
            if (!empty($filters['start_date']) && !empty($filters['end_date'])) {
                $periode = \Carbon\Carbon::parse($filters['start_date'])->format('d M Y') . ' s/d ' . \Carbon\Carbon::parse($filters['end_date'])->format('d M Y');
            } elseif (!empty($filters['start_date'])) {
                $periode = 'Mulai ' . \Carbon\Carbon::parse($filters['start_date'])->format('d M Y');
            } elseif (!empty($filters['end_date'])) {
                $periode = 'Sampai ' . \Carbon\Carbon::parse($filters['end_date'])->format('d M Y');
            }
        @endphp
        <div>
            <b>Status:</b> {{ $statusLabel }} &nbsp;|&nbsp;
            <b>Periode PKL:</b> {{ $periode }} &nbsp;|&nbsp;
            <b>Pencarian:</b> {{ !empty($filters['search']) ? $filters['search'] : '—' }}
        </div>
        <div><b>Total data:</b> {{ $peserta->count() }} peserta</div>
    </div>

    <table>
        <thead>
            <tr>
                <th class="text-center" style="width: 8mm;">No</th>
                <th>Nama Peserta</th>
                <th>NIS/NIM</th>
                <th>Asal Institusi</th>
                <th>Jurusan</th>
                <th>Periode PKL</th>
                <th>Status</th>
                <th>Sertifikat</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($peserta as $index => $item)
                <tr>
                    <td class="text-center">{{ $loop->iteration }}</td>
                    <td><b>{{ $item->nama }}</b></td>
                    <td>{{ $item->nis_nim ?: '—' }}</td>
                    <td>{{ $item->asal_institusi ?: '—' }}</td>
                    <td>{{ $item->jurusan ?: '—' }}</td>
                    <td>
                        {{ optional($item->tanggal_mulai)->format('d M Y') ?? '—' }}
                        s/d
                        {{ optional($item->tanggal_selesai)->format('d M Y') ?? '—' }}
                    </td>
                    <td class="text-center">{{ $item->status }}</td>
                    <td>{{ $item->sertifikatTerbaru?->nomor_sertifikat ?: 'Belum Ada' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="8" class="text-center muted">Tidak ada data peserta yang cocok dengan filter.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        <div class="sign-block">
            <div>Karawang, {{ $generatedAt->format('d F Y') }}</div>
            <div>Kepala UPTD Pengawasan Ketenagakerjaan</div>
            <div class="name">( ______________________________ )</div>
            <div class="role">NIP. ________________</div>
        </div>
    </div>
</body>
</html>