import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ summary, peserta = [], filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');

    // Fungsi submit filter saat tombol Cari diklik / tekan Enter
    const handleFilter = (e) => {
        if (e) e.preventDefault();

        router.get(
            route('laporan.index'),
            { search, status, start_date: startDate, end_date: endDate },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const handleReset = () => {
        setSearch('');
        setStatus('all');
        setStartDate('');
        setEndDate('');
        router.get(route('laporan.index'), {}, { preserveState: true, replace: true });
    };

    const handleDownloadPdf = () => {
        const queryParams = new URLSearchParams({
            search,
            status,
            start_date: startDate,
            end_date: endDate,
        }).toString();

        window.open(`${route('laporan.export-pdf')}?${queryParams}`, '_blank');
    };

    const cards = [
        { label: 'Total Peserta', value: summary?.total_peserta ?? 0, border: 'border-l-blue-500' },
        { label: 'PKL Aktif', value: summary?.aktif ?? 0, border: 'border-l-emerald-500' },
        { label: 'PKL Selesai', value: summary?.selesai ?? 0, border: 'border-l-indigo-500' },
        { label: 'Sertifikat Upload', value: summary?.sertifikat_upload ?? 0, border: 'border-l-amber-500' },
    ];

    const isFiltered = search || status !== 'all' || startDate || endDate;

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: 'Laporan' }]}>
            <Head title="Laporan Rekapitulasi PKL" />

            <div className="space-y-4">
                {/* Header Ringkas */}
                <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Laporan Realtime</p>
                        <h1 className="text-xl font-bold text-slate-800">Rekapitulasi Peserta PKL</h1>
                    </div>
                    <button
                        onClick={handleDownloadPdf}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0E2A47] px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-[#16385c] active:scale-95 shadow-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Unduh PDF
                    </button>
                </div>

                {/* Ringkasan Cards Ringkas & Tetap */}
                <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
                    {cards.map((card) => (
                        <div key={card.label} className={`rounded-xl border border-slate-200 border-l-4 ${card.border} bg-white p-3.5 shadow-sm`}>
                            <p className="text-[11px] font-semibold text-slate-500">{card.label}</p>
                            <div className="mt-1 text-xl font-extrabold text-slate-800">{card.value}</div>
                        </div>
                    ))}
                </div>

                {/* Filter Controls Card dengan Tombol Cari & Reset */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Filter Data</span>
                    </div>

                    <form onSubmit={handleFilter} className="grid gap-3 md:grid-cols-2 lg:grid-cols-5 items-end">
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Cari Nama / Instansi</label>
                            <input
                                type="text"
                                placeholder="Ketik nama / instansi..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800 focus:border-slate-800 focus:ring-0"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Status PKL</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800 focus:border-slate-800 focus:ring-0"
                            >
                                <option value="all">Semua Status</option>
                                <option value="aktif">Aktif</option>
                                <option value="selesai">Selesai</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Mulai Dari</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800 focus:border-slate-800 focus:ring-0"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Sampai Dengan</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800 focus:border-slate-800 focus:ring-0"
                            />
                        </div>

                        {/* Tombol Aksi: Cari & Reset */}
                        <div className="flex items-center gap-2">
                            <button
                                type="submit"
                                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-slate-700 active:scale-95 shadow-sm"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                Cari
                            </button>

                            {isFiltered && (
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Tabel Data Peserta */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-4 py-3">
                        <h3 className="text-xs font-bold text-slate-800">Detail Data Peserta</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-600">
                            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                <tr>
                                    <th className="px-4 py-3">Peserta</th>
                                    <th className="px-4 py-3">Instansi</th>
                                    <th className="px-4 py-3">Periode</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Sertifikat</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {peserta.data && peserta.data.length > 0 ? (
                                    peserta.data.map((item, index) => (
                                        <tr key={item.id || index} className="hover:bg-slate-50">
                                            <td className="px-4 py-2.5 font-semibold text-slate-800">
                                                {item.nama}
                                                <div className="text-[10px] font-normal text-slate-400">{item.nim_nisn || '-'}</div>
                                            </td>
                                            <td className="px-4 py-2.5">{item.instansi || '-'}</td>
                                            <td className="px-4 py-2.5 text-[11px]">
                                                {item.tanggal_mulai} s/d {item.tanggal_selesai}
                                            </td>
                                            <td className="px-4 py-2.5">
                                                <span className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold ${
                                                    item.status === 'aktif' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                                                }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2.5">
                                                {item.has_sertifikat ? (
                                                    <span className="font-semibold text-emerald-600">Tersedia</span>
                                                ) : (
                                                    <span className="text-slate-400">Belum Ada</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-6 text-center text-slate-400">
                                            Tidak ada data peserta ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}