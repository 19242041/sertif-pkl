import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, PencilLine, Plus, Search, Trash2 } from 'lucide-react';

function statusClass(status) {
    if (status === 'Aktif') return 'bg-[#E8F1FB] text-[#1B63B0]';
    if (status === 'Selesai') return 'bg-[#E7F5EC] text-[#2E8B4E]';
    return 'bg-[#FDF3DD] text-[#E8A712]';
}

function certificateClass(certificate) {
    return certificate ? 'bg-[#E7F5EC] text-[#2E8B4E]' : 'bg-[#FBEAE9] text-[#C0433D]';
}

function Pagination({ links }) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            {links.map((link, index) => (
                <Link
                    key={`${link.label}-${index}`}
                    href={link.url ?? '#'}
                    className={[
                        'rounded-xl border px-3.5 py-2 text-[12.5px] font-semibold transition',
                        link.active
                            ? 'border-[#1B63B0] bg-[#1B63B0] text-white'
                            : 'border-[#E4E9F0] bg-white text-[#1B2733] hover:bg-[#F7F9FC]',
                        !link.url && 'pointer-events-none opacity-40',
                    ].join(' ')}
                    preserveScroll
                >
                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                </Link>
            ))}
        </div>
    );
}

export default function Index({ peserta, filters }) {
    const destroy = (id, nama) => {
        if (!window.confirm(`Hapus data peserta ${nama}?`)) {
            return;
        }

        router.delete(route('peserta-pkl.destroy', id), {
            preserveScroll: true,
        });
    };

    const submitFilter = (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        router.get(route('peserta-pkl.index'), Object.fromEntries(form.entries()), {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: 'Data Peserta PKL' }]}>
            <Head title="Data Peserta PKL" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 rounded-[28px] border border-[#E4E9F0] bg-white p-6 shadow-[0_18px_40px_rgba(8,27,48,0.06)] lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="font-display text-[26px] font-extrabold text-[#0E2A47]">Data Peserta PKL</h1>
                        <p className="mt-1 text-[14px] text-[#657085]">Cari, filter, dan kelola data peserta secara cepat.</p>
                    </div>

                    <Link href={route('peserta-pkl.create')} className="inline-flex items-center gap-2 rounded-[10px] bg-[#1B63B0] px-4 py-2.5 text-[13.5px] font-bold text-white transition hover:bg-[#16579b]">
                        <Plus className="h-4 w-4" />
                        Tambah Peserta
                    </Link>
                </div>

                <form onSubmit={submitFilter} className="grid gap-4 rounded-[28px] border border-[#E4E9F0] bg-white p-5 shadow-[0_18px_40px_rgba(8,27,48,0.06)] lg:grid-cols-[1.4fr_0.6fr_auto]">
                    <label className="relative block">
                        <span className="sr-only">Search</span>
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A0B3]" />
                        <input
                            name="search"
                            defaultValue={filters.search}
                            placeholder="Cari nama, NIS/NIM, atau asal sekolah/kampus"
                            className="block w-full rounded-[10px] border border-[#E4E9F0] bg-white py-[10px] pl-10 pr-3.5 text-[13.5px] outline-none focus:border-[#1B63B0] focus:ring-4 focus:ring-[#1B63B0]/12"
                        />
                    </label>

                    <select name="status" defaultValue={filters.status ?? 'semua'} className="rounded-[10px] border border-[#E4E9F0] bg-white px-3.5 py-[10px] text-[13.5px] outline-none focus:border-[#1B63B0] focus:ring-4 focus:ring-[#1B63B0]/12">
                        <option value="semua">Semua Status</option>
                        <option value="Aktif">Aktif</option>
                        <option value="Selesai">Selesai</option>
                        <option value="Berhenti">Berhenti</option>
                    </select>

                    <button type="submit" className="rounded-[10px] border border-[#E4E9F0] bg-[#F7F9FC] px-4 py-[10px] text-[13.5px] font-semibold text-[#1B2733] transition hover:bg-white">
                        Filter
                    </button>
                </form>

                <div className="overflow-hidden rounded-[28px] border border-[#E4E9F0] bg-white shadow-[0_18px_40px_rgba(8,27,48,0.06)]">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-[#E4E9F0]">
                            <thead className="bg-[#F7F9FC]">
                                <tr>
                                    {['No', 'Nama', 'Asal Sekolah/Kampus', 'Jurusan', 'Periode PKL', 'Status', 'Sertifikat', 'Aksi'].map((heading) => (
                                        <th key={heading} className="px-4 py-3 text-left text-[11.5px] font-bold uppercase tracking-[0.12em] text-[#657085]">{heading}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E4E9F0]">
                                {peserta.data.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-[#FAFBFD]">
                                        <td className="px-4 py-4 text-[13px] font-semibold text-[#657085]">{peserta.from + index}</td>
                                        <td className="px-4 py-4">
                                            <div className="font-semibold text-[#1B2733]">{item.nama}</div>
                                            <div className="text-[12px] text-[#94A0B3]">{item.nis_nim ?? '-'}</div>
                                        </td>
                                        <td className="px-4 py-4 text-[13px] text-[#1B2733]">{item.asal_institusi}</td>
                                        <td className="px-4 py-4 text-[13px] text-[#1B2733]">{item.jurusan ?? '-'}</td>
                                        <td className="px-4 py-4 text-[13px] text-[#1B2733]">{item.tanggal_mulai ?? '-'} - {item.tanggal_selesai ?? '-'}</td>
                                        <td className="px-4 py-4">
                                            <span className={`rounded-full px-3 py-1 text-[12px] font-semibold ${statusClass(item.status)}`}>{item.status}</span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`rounded-full px-3 py-1 text-[12px] font-semibold ${certificateClass(item.sertifikat)}`}>
                                                {item.sertifikat ? 'Sudah Upload' : 'Belum Upload'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <Link href={route('peserta-pkl.show', item.id)} className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#E4E9F0] text-[#1B63B0] transition hover:bg-[#E8F1FB]">
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <Link href={route('peserta-pkl.edit', item.id)} className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#E4E9F0] text-[#1B63B0] transition hover:bg-[#E8F1FB]">
                                                    <PencilLine className="h-4 w-4" />
                                                </Link>
                                                <button type="button" onClick={() => destroy(item.id, item.nama)} className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#FBEAE9] text-[#C0433D] transition hover:bg-[#FBEAE9]">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col gap-4 border-t border-[#E4E9F0] px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
                        <p className="text-[13px] text-[#657085]">
                            Menampilkan {peserta.from ?? 0}–{peserta.to ?? 0} dari {peserta.total} data
                        </p>
                        <Pagination links={peserta.links} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}