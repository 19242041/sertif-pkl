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

            <div className="space-y-6">
                <div className="flex items-center justify-between rounded-[28px] border border-[#E4E9F0] bg-white p-5 shadow-[0_18px_40px_rgba(8,27,48,0.06)]">
                    <Link href={route('peserta-pkl.index')} className="rounded-[10px] border border-[#E4E9F0] px-4 py-2.5 text-[13.5px] font-semibold text-[#1B2733]">
                        Kembali
                    </Link>
                    <div className="flex gap-2">
                        <Link href={route('peserta-pkl.edit', peserta.id)} className="inline-flex items-center gap-2 rounded-[10px] bg-[#1B63B0] px-4 py-2.5 text-[13.5px] font-bold text-white">
                            <PencilLine className="h-4 w-4" />
                            Edit
                        </Link>
                        <button type="button" onClick={destroy} className="inline-flex items-center gap-2 rounded-[10px] bg-[#C0433D] px-4 py-2.5 text-[13.5px] font-bold text-white">
                            <Trash2 className="h-4 w-4" />
                            Hapus
                        </button>
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
                    <div className="rounded-[28px] border border-[#E4E9F0] bg-white p-6 shadow-[0_18px_40px_rgba(8,27,48,0.06)]">
                        <div className="flex flex-col items-center text-center">
                            {photoUrl(peserta.foto_url) ? (
                                <img src={photoUrl(peserta.foto_url)} alt={peserta.nama} className="h-32 w-32 rounded-full object-cover ring-8 ring-[#E8F1FB]" />
                            ) : (
                                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-[#E8F1FB] text-[42px] font-extrabold text-[#1B63B0] ring-8 ring-[#E8F1FB]">
                                    {peserta.nama.charAt(0)}
                                </div>
                            )}
                            <h1 className="font-display mt-5 text-[26px] font-extrabold text-[#0E2A47]">{peserta.nama}</h1>
                            <span className={`mt-3 rounded-full px-4 py-1.5 text-[12px] font-semibold ${statusClass(peserta.status)}`}>{peserta.status}</span>
                        </div>
                    </div>

                    <div className="rounded-[28px] border border-[#E4E9F0] bg-white p-6 shadow-[0_18px_40px_rgba(8,27,48,0.06)]">
                        <p className="font-display text-[18px] font-extrabold text-[#0E2A47]">Data Peserta</p>
                        <div className="mt-5 grid gap-4 md:grid-cols-2">
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
                                <div key={label} className="rounded-2xl bg-[#F7F9FC] p-4">
                                    <div className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-[#94A0B3]">{label}</div>
                                    <div className="mt-1 text-[13.5px] font-semibold text-[#1B2733]">{value ?? '-'}</div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 rounded-[24px] border border-[#E4E9F0] p-5">
                            <p className="font-display text-[18px] font-extrabold text-[#0E2A47]">Keterangan</p>
                            <p className="mt-3 text-[13.5px] leading-6 text-[#657085]">{peserta.keterangan ?? '-'}</p>
                        </div>

                        <div className="mt-6 rounded-[24px] border border-[#E4E9F0] p-5">
                            <p className="font-display text-[18px] font-extrabold text-[#0E2A47]">Sertifikat</p>
                            <div className="mt-4 space-y-3">
                                {peserta.sertifikats.length ? peserta.sertifikats.map((sertifikat) => (
                                    <div key={sertifikat.id} className="rounded-2xl bg-[#F7F9FC] p-4">
                                        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                                            <div>
                                                <div className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-[#94A0B3]">Nomor Sertifikat</div>
                                                <div className="mt-1 text-[13.5px] font-semibold text-[#1B2733]">{sertifikat.nomor_sertifikat}</div>
                                                <div className="mt-2 text-[12.5px] text-[#657085]">Tanggal: {sertifikat.tanggal_sertifikat}</div>
                                            </div>
                                            <a href={route('sertifikat.download', sertifikat.id)} className="inline-flex items-center gap-2 rounded-[10px] bg-[#1B63B0] px-4 py-2.5 text-[13px] font-bold text-white">
                                                <Download className="h-4 w-4" />
                                                Unduh
                                            </a>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-[13.5px] text-[#657085]">Belum ada sertifikat yang diunggah.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}