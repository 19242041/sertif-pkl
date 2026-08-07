import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Download, PencilLine, Trash2 } from 'lucide-react';

function statusClass(status) {
    if (status === 'Aktif') return 'bg-[#E8F1FB] text-[#1B63B0]';
    if (status === 'Selesai') return 'bg-[#E7F5EC] text-[#2E8B4E]';
    return 'bg-[#FDF3DD] text-[#E8A712]';
}

function photoUrl(path) {
    return path ? `/storage/${path}` : null;
}

export default function Show({ peserta }) {
    const destroy = () => {
        if (!window.confirm(`Hapus data peserta ${peserta.nama}?`)) {
            return;
        }

        router.delete(route('peserta-pkl.destroy', peserta.id));
    };

    return (
        <AuthenticatedLayout breadcrumbs={[
            { label: 'Data Peserta PKL', href: route('peserta-pkl.index') },
            { label: peserta.nama },
        ]}>
            <Head title={peserta.nama} />

            <div className="space-y-4">
                {/* Top Action Bar */}
                <div className="flex items-center justify-between rounded-[18px] border border-[#E4E9F0] bg-white p-3.5 shadow-[0_10px_24px_rgba(8,27,48,0.05)]">
                    <Link
                        href={route('peserta-pkl.index')}
                        className="rounded-xl border border-[#E4E9F0] px-3.5 py-1.5 text-[12.5px] font-semibold text-[#1B2733] transition hover:bg-[#F7F9FC]"
                    >
                        Kembali
                    </Link>
                    <div className="flex gap-2">
                        <Link
                            href={route('peserta-pkl.edit', peserta.id)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#1B63B0] px-3.5 py-1.5 text-[12.5px] font-bold text-white transition hover:bg-[#16579b]"
                        >
                            <PencilLine className="h-3.5 w-3.5" />
                            Edit
                        </Link>
                        <button
                            type="button"
                            onClick={destroy}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#C0433D] px-3.5 py-1.5 text-[12.5px] font-bold text-white transition hover:bg-[#a83833]"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Hapus
                        </button>
                    </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-[0.65fr_1.35fr]">
                    {/* Kartu Profil Peserta */}
                    <div className="rounded-[18px] border border-[#E4E9F0] bg-white p-5 shadow-[0_10px_24px_rgba(8,27,48,0.05)]">
                        <div className="flex flex-col items-center text-center">
                            {photoUrl(peserta.foto_url) ? (
                                <img src={photoUrl(peserta.foto_url)} alt={peserta.nama} className="h-24 w-24 rounded-full object-cover ring-4 ring-[#E8F1FB]" />
                            ) : (
                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#E8F1FB] text-[32px] font-extrabold text-[#1B63B0] ring-4 ring-[#E8F1FB]">
                                    {peserta.nama.charAt(0)}
                                </div>
                            )}
                            <h1 className="font-display mt-3.5 text-[19px] font-extrabold text-[#0E2A47]">{peserta.nama}</h1>
                            <span className={`mt-2 rounded-full px-3 py-0.5 text-[10.5px] font-semibold ${statusClass(peserta.status)}`}>
                                {peserta.status}
                            </span>
                        </div>
                    </div>

                    {/* Kartu Detail Rincian */}
                    <div className="rounded-[18px] border border-[#E4E9F0] bg-white p-5 shadow-[0_10px_24px_rgba(8,27,48,0.05)]">
                        <p className="font-display text-[15px] font-extrabold text-[#0E2A47]">Data Peserta</p>
                        
                        <div className="mt-3 grid gap-3 md:grid-cols-2">
                            {[
                                ['NIS / NIM', peserta.nis_nim],
                                ['Asal Sekolah / Kampus', peserta.asal_institusi],
                                ['Jurusan', peserta.jurusan],
                                ['Jenis Kelamin', peserta.jenis_kelamin],
                                ['Tempat Lahir', peserta.tempat_lahir],
                                ['Tanggal Lahir', peserta.tanggal_lahir],
                                ['No. HP', peserta.no_hp],
                                ['Email', peserta.email],
                                ['Pembimbing Sekolah', peserta.pembimbing_sekolah],
                                ['Pembimbing Lapangan', peserta.pembimbing_lapangan],
                                ['Tanggal Mulai', peserta.tanggal_mulai],
                                ['Tanggal Selesai', peserta.tanggal_selesai],
                            ].map(([label, value]) => (
                                <div key={label} className="rounded-xl bg-[#F7F9FC] p-3">
                                    <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#94A0B3]">{label}</div>
                                    <div className="mt-0.5 text-[12.5px] font-semibold text-[#1B2733]">{value ?? '-'}</div>
                                </div>
                            ))}
                        </div>

                        {/* Keterangan */}
                        <div className="mt-4 rounded-xl border border-[#E4E9F0] p-4">
                            <p className="font-display text-[14px] font-extrabold text-[#0E2A47]">Keterangan</p>
                            <p className="mt-1.5 text-[12.5px] leading-5 text-[#657085]">{peserta.keterangan ?? '-'}</p>
                        </div>

                        {/* Sertifikat */}
                        <div className="mt-4 rounded-xl border border-[#E4E9F0] p-4">
                            <p className="font-display text-[14px] font-extrabold text-[#0E2A47]">Sertifikat</p>
                            <div className="mt-3 space-y-2.5">
                                {peserta.sertifikats.length ? peserta.sertifikats.map((sertifikat) => (
                                    <div key={sertifikat.id} className="rounded-xl bg-[#F7F9FC] p-3">
                                        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                                            <div>
                                                <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#94A0B3]">Nomor Sertifikat</div>
                                                <div className="mt-0.5 text-[12.5px] font-semibold text-[#1B2733]">{sertifikat.nomor_sertifikat}</div>
                                                <div className="mt-1 text-[11.5px] text-[#657085]">Tanggal: {sertifikat.tanggal_sertifikat}</div>
                                            </div>
                                            <a
                                                href={route('sertifikat.download', sertifikat.id)}
                                                className="inline-flex items-center gap-1.5 rounded-xl bg-[#1B63B0] px-3.5 py-1.5 text-[12px] font-bold text-white transition hover:bg-[#16579b]"
                                            >
                                                <Download className="h-3.5 w-3.5" />
                                                Unduh
                                            </a>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-[12.5px] text-[#657085]">Belum ada sertifikat yang dibuat.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}