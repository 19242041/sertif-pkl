import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {
    BarChart2,
    CheckCircle2,
    FileCheck2,
    FileX2,
    Users,
    UserRoundCheck,
} from 'lucide-react';

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function statusBadgeColor(label) {
    if (label === 'Aktif') return 'bg-[#E8F1FB] text-[#1B63B0]';
    if (label === 'Selesai') return 'bg-[#E7F5EC] text-[#2E8B4E]';
    return 'bg-[#FBEAE9] text-[#C0433D]';
}

export default function Dashboard({ summary, monthlyCounts, statusChart, adminName, currentYear }) {
    const cards = [
        { label: 'Total Peserta', value: summary.total_peserta, icon: Users, color: 'bg-[#E8F1FB] text-[#1B63B0]' },
        { label: 'PKL Aktif', value: summary.aktif, icon: UserRoundCheck, color: 'bg-[#E7F5EC] text-[#2E8B4E]' },
        { label: 'PKL Selesai', value: summary.selesai, icon: CheckCircle2, color: 'bg-[#FDF3DD] text-[#E8A712]' },
        { label: 'Sertifikat Dibuat', value: summary.sertifikat_terbit, icon: FileCheck2, color: 'bg-[#EEEDFE] text-[#534AB7]' },
        { label: 'Belum Dibuat', value: summary.belum_buat, icon: FileX2, color: 'bg-[#FBEAE9] text-[#C0433D]' },
    ];

    const totalStatus = statusChart.reduce((carry, item) => carry + item.value, 0) || 1;
    const maxMonthlyCount = Math.max(...monthlyCounts, 1);

    const donutGradient = statusChart
        .map((item, index) => {
            const start = statusChart.slice(0, index).reduce((carry, current) => carry + (current.value / totalStatus) * 100, 0);
            const end = start + (item.value / totalStatus) * 100;

            return `${item.color} ${start}% ${end}%`;
        })
        .join(', ');

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: 'Dashboard' }]}>
            <Head title="Dashboard" />

            <div className="space-y-4">
                {/* Sapaan */}
                <div className="rounded-[18px] border border-white bg-white p-4 shadow-[0_10px_24px_rgba(8,27,48,0.05)]">
                    <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[#94A0B3]">
                        Dashboard SIMPATIK
                    </p>
                    <h1 className="font-display mt-1 text-[19px] font-extrabold text-[#0E2A47]">
                        Selamat datang, {adminName}!
                    </h1>
                    <p className="mt-1 max-w-2xl text-[12.5px] leading-5 text-[#657085]">
                        Ringkasan program PKL, status sertifikat, dan tren peserta selama tahun {currentYear}.
                    </p>
                </div>

                {/* Kartu Statistik */}
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
                    {cards.map((card) => {
                        const Icon = card.icon;

                        return (
                            <div key={card.label} className="rounded-[14px] border border-[#E4E9F0] bg-white p-4 shadow-[0_6px_16px_rgba(8,27,48,0.04)]">
                                <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${card.color}`}>
                                    <Icon className="h-4 w-4" />
                                </div>
                                <div className="mt-2.5 text-[22px] font-extrabold leading-none text-[#0E2A47]">
                                    {card.value}
                                </div>
                                <p className="mt-1 text-[12px] font-semibold text-[#657085]">{card.label}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
                    {/* Diagram Batang (Sebelah Kiri) */}
                    <div className="flex flex-col justify-start rounded-[18px] border border-[#E4E9F0] bg-white p-4 shadow-[0_10px_24px_rgba(8,27,48,0.05)]">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[#94A0B3]">
                                    Grafik Peserta PKL
                                </p>
                                <h2 className="font-display text-[14.5px] font-extrabold text-[#0E2A47]">
                                    Jumlah peserta per bulan
                                </h2>
                            </div>
                            <BarChart2 className="h-4 w-4 text-[#1B63B0]" />
                        </div>

                        {/* Kontainer Diagram Batang - Jarak rapat ke judul (mt-2.5) */}
                        <div className="mt-3 rounded-[14px] bg-[#F7F9FC] p-3 sm:p-4">
                            <div className="flex h-32 items-end justify-between gap-1 sm:gap-2">
                                {monthlyCounts.map((value, index) => {
                                    const heightPercent = value > 0 ? (value / maxMonthlyCount) * 100 : 4;

                                    return (
                                        <div
                                            key={monthLabels[index]}
                                            className="group relative flex flex-1 flex-col items-center h-full justify-end"
                                        >
                                            {/* Tooltip Nilai Saat Hover */}
                                            <div className="pointer-events-none absolute -top-7 z-10 hidden rounded bg-[#0E2A47] px-2 py-0.5 text-[10px] font-bold text-white shadow group-hover:block">
                                                {value}
                                            </div>

                                            {/* Bar / Batang */}
                                            <div className="relative flex h-[80%] w-full max-w-[22px] items-end rounded-t-md bg-[#E4E9F0]/60 overflow-hidden">
                                                <div
                                                    style={{ height: `${heightPercent}%` }}
                                                    className="w-full rounded-t-md bg-[#1B63B0] transition-all duration-300 group-hover:bg-[#16579b]"
                                                />
                                            </div>

                                            {/* Label Bulan */}
                                            <span className="mt-1.5 text-[10px] font-semibold text-[#657085]">
                                                {monthLabels[index]}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Distribusi Status (Sebelah Kanan) */}
                    <div className="rounded-[18px] border border-[#E4E9F0] bg-white p-4 shadow-[0_10px_24px_rgba(8,27,48,0.05)]">
                        <p className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[#94A0B3]">
                            Status Peserta
                        </p>
                        <h2 className="font-display text-[14.5px] font-extrabold text-[#0E2A47]">
                            Distribusi status
                        </h2>

                        <div className="mt-2 flex items-center justify-center">
                            <div
                                className="relative h-24 w-24 rounded-full"
                                style={{ background: `conic-gradient(${donutGradient})` }}
                            >
                                <div className="absolute inset-[8px] rounded-full bg-white" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                    <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#94A0B3]">
                                        Total
                                    </span>
                                    <span className="font-display text-[17px] font-extrabold text-[#0E2A47]">
                                        {totalStatus}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-2.5 space-y-1.5">
                            {statusChart.map((item) => (
                                <div key={item.label} className="flex items-center justify-between rounded-xl bg-[#F7F9FC] px-3 py-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${statusBadgeColor(item.label)}`}>
                                            {item.label}
                                        </span>
                                    </div>
                                    <span className="text-[12.5px] font-bold text-[#1B2733]">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}