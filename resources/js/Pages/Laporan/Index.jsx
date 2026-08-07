import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Index({ summary }) {
    const cards = [
        ['Total Peserta', summary.total_peserta],
        ['PKL Aktif', summary.aktif],
        ['PKL Selesai', summary.selesai],
        ['Sertifikat Dibuat', summary.sertifikat_terbit],
    ];

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: 'Laporan' }]}>
            <Head title="Laporan" />

            <div className="space-y-6">
                <div className="rounded-[28px] border border-[#E4E9F0] bg-white p-6 shadow-[0_18px_40px_rgba(8,27,48,0.06)]">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#94A0B3]">Laporan</p>
                    <h1 className="font-display mt-2 text-[26px] font-extrabold text-[#0E2A47]">Rekap peserta PKL</h1>
                    <p className="mt-2 text-[14px] text-[#657085]">Halaman laporan siap dipakai untuk filter periode dan ekspor saat modul lanjut dibuat.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {cards.map(([label, value]) => (
                        <div key={label} className="rounded-[24px] border border-[#E4E9F0] bg-white p-5 shadow-[0_12px_32px_rgba(8,27,48,0.05)]">
                            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#94A0B3]">{label}</p>
                            <div className="mt-3 text-[30px] font-extrabold text-[#0E2A47]">{value}</div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}