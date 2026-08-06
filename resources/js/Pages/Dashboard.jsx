import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {
    CheckCircle2,
    FileCheck2,
    FileX2,
    LineChart,
    Users,
    UserRoundCheck,
} from 'lucide-react';

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function createLinePoints(values) {
    const maxValue = Math.max(...values, 1);

    return values
        .map((value, index) => {
            const x = (index / Math.max(values.length - 1, 1)) * 100;
            const y = 86 - (value / maxValue) * 72;

            return `${x},${y}`;
        })
        .join(' ');
}

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
        { label: 'Sertifikat Upload', value: summary.sertifikat_upload, icon: FileCheck2, color: 'bg-[#EEEDFE] text-[#534AB7]' },
        { label: 'Belum Upload', value: summary.belum_upload, icon: FileX2, color: 'bg-[#FBEAE9] text-[#C0433D]' },
    ];

    const totalStatus = statusChart.reduce((carry, item) => carry + item.value, 0) || 1;
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

            <div className="space-y-6">
                <div className="rounded-[28px] border border-white bg-white p-6 shadow-[0_18px_40px_rgba(8,27,48,0.06)]">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94A0B3]">
                        Dashboard SIMPATIK
                    </p>
                    <h1 className="font-display mt-2 text-[28px] font-extrabold text-[#0E2A47]">
                        Selamat datang, {adminName}!
                    </h1>
                    <p className="mt-2 max-w-2xl text-[14px] leading-6 text-[#657085]">
                        Ringkasan program PKL, status sertifikat, dan tren peserta selama tahun {currentYear}.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                    {cards.map((card) => {
                        const Icon = card.icon;

                        return (
                            <div key={card.label} className="rounded-[24px] border border-[#E4E9F0] bg-white p-5 shadow-[0_12px_32px_rgba(8,27,48,0.05)]">
                                <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${card.color}`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div className="mt-4 text-[28px] font-extrabold leading-none text-[#0E2A47]">
                                    {card.value}
                                </div>
                                <p className="mt-2 text-[13px] font-semibold text-[#657085]">{card.label}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
                    <div className="rounded-[28px] border border-[#E4E9F0] bg-white p-6 shadow-[0_18px_40px_rgba(8,27,48,0.06)]">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#94A0B3]">
                                    Grafik Peserta PKL
                                </p>
                                <h2 className="font-display mt-1 text-[18px] font-extrabold text-[#0E2A47]">
                                    Jumlah peserta per bulan
                                </h2>
                            </div>
                            <LineChart className="h-5 w-5 text-[#1B63B0]" />
                        </div>

                        <div className="mt-6 overflow-hidden rounded-[24px] bg-[#F7F9FC] p-4">
                            <svg viewBox="0 0 100 100" className="h-72 w-full">
                                <defs>
                                    <linearGradient id="lineFill" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#1B63B0" stopOpacity="0.28" />
                                        <stop offset="100%" stopColor="#1B63B0" stopOpacity="0" />
                                    </linearGradient>
                                </defs>

                                {[20, 40, 60, 80].map((line) => (
                                    <line key={line} x1="4" y1={line} x2="96" y2={line} stroke="#E4E9F0" strokeDasharray="2 3" />
                                ))}

                                <polygon
                                    points={`4,86 ${createLinePoints(monthlyCounts)} 96,86`}
                                    fill="url(#lineFill)"
                                    stroke="none"
                                />

                                <polyline
                                    points={createLinePoints(monthlyCounts)}
                                    fill="none"
                                    stroke="#1B63B0"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />

                                {monthlyCounts.map((value, index) => {
                                    const x = 4 + (index / Math.max(monthlyCounts.length - 1, 1)) * 92;
                                    const maxValue = Math.max(...monthlyCounts, 1);
                                    const y = 86 - (value / maxValue) * 72;

                                    return (
                                        <g key={monthLabels[index]}>
                                            <circle cx={x} cy={y} r="1.7" fill="#1B63B0" />
                                            <text x={x} y="94" textAnchor="middle" className="fill-[#657085] text-[3px] font-semibold">
                                                {monthLabels[index]}
                                            </text>
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>
                    </div>

                    <div className="rounded-[28px] border border-[#E4E9F0] bg-white p-6 shadow-[0_18px_40px_rgba(8,27,48,0.06)]">
                        <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#94A0B3]">
                            Status Peserta
                        </p>
                        <h2 className="font-display mt-1 text-[18px] font-extrabold text-[#0E2A47]">
                            Distribusi status
                        </h2>

                        <div className="mt-6 flex items-center justify-center">
                            <div
                                className="relative h-56 w-56 rounded-full"
                                style={{ background: `conic-gradient(${donutGradient})` }}
                            >
                                <div className="absolute inset-[18px] rounded-full bg-white" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                    <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#94A0B3]">
                                        Total
                                    </span>
                                    <span className="font-display text-[34px] font-extrabold text-[#0E2A47]">
                                        {totalStatus}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            {statusChart.map((item) => (
                                <div key={item.label} className="flex items-center justify-between rounded-2xl bg-[#F7F9FC] px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${statusBadgeColor(item.label)}`}>
                                            {item.label}
                                        </span>
                                    </div>
                                    <span className="text-[15px] font-bold text-[#1B2733]">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
