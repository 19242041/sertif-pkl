import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Download, FileText, FileUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const fieldLeft = (x, lebarMax, alignment) => (
    alignment === 'center' ? x - lebarMax / 2
        : alignment === 'right' ? x - lebarMax
            : x
);

/*
 * Lebar halaman PDF (pt) — harus sama dengan backend ($pageWidth di
 * SertifikatController). Font template disimpan dalam px (96 DPI); supaya
 * ukuran teks relatif terhadap gambar PERSIS sama antara preview dan PDF,
 * font diskalakan terhadap lebar container.
 */
const PDF_PAGE_WIDTH_PT = 1152;
const REFERENCE_WIDTH_PX = PDF_PAGE_WIDTH_PT * (96 / 72); // 1536

const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

function formatDateDMY(dateStr) {
    if (!dateStr) return '';

    const date = new Date(`${dateStr}T00:00:00`);
    if (Number.isNaN(date.getTime())) return '';

    const day = String(date.getDate()).padStart(2, '0');
    const month = BULAN[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
}

export default function Generate({ pesertaOptions, sertifikats, template }) {
    const form = useForm({
        peserta_pkl_id: '',
        nomor_sertifikat: '',
        tanggal_mulai_pkl: '',
        tanggal_selesai_pkl: '',
        tanggal_tanda_tangan: '',
    });

    const previewRef = useRef(null);
    const [fontScale, setFontScale] = useState(1);

    // Skalakan font preview mengikuti lebar container agar ukurannya relatif sama dengan PDF
    useEffect(() => {
        const el = previewRef.current;
        if (!el) return undefined;

        const update = () => setFontScale(el.clientWidth / REFERENCE_WIDTH_PX);
        update();

        const observer = new ResizeObserver(update);
        observer.observe(el);

        return () => observer.disconnect();
    }, [template]);

    const submit = (event) => {
        event.preventDefault();

        form.post(route('sertifikat.store'), {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    };

    const selectedPeserta = pesertaOptions.find((item) => String(item.id) === String(form.data.peserta_pkl_id));

    const handlePesertaChange = (value) => {
        form.setData((previous) => {
            const peserta = pesertaOptions.find((item) => String(item.id) === String(value));

            return {
                ...previous,
                peserta_pkl_id: value,
                tanggal_mulai_pkl: peserta?.tanggal_mulai ?? '',
                tanggal_selesai_pkl: peserta?.tanggal_selesai ?? '',
            };
        });
    };

    const periodeText = [
        formatDateDMY(form.data.tanggal_mulai_pkl),
        formatDateDMY(form.data.tanggal_selesai_pkl),
    ].filter(Boolean).join(' - ');

    const previewFields = template ? [
        {
            key: 'nomor',
            value: form.data.nomor_sertifikat,
            x: template.nomor_x, y: template.nomor_y,
            lebar: template.nomor_lebar_max,
            align: template.nomor_alignment,
            color: template.nomor_color,
            fontFamily: template.nomor_font_family,
            fontSize: template.nomor_font_size,
        },
        {
            key: 'nama',
            value: selectedPeserta?.nama ?? '',
            x: template.nama_x, y: template.nama_y,
            lebar: template.nama_lebar_max,
            align: template.nama_alignment,
            color: template.nama_color,
            fontFamily: template.nama_font_family,
            fontSize: template.nama_font_size,
        },
        {
            key: 'asal',
            value: selectedPeserta?.asal_institusi ?? '',
            x: template.asal_x, y: template.asal_y,
            lebar: template.asal_lebar_max,
            align: template.asal_alignment,
            color: template.asal_color,
            fontFamily: template.asal_font_family,
            fontSize: template.asal_font_size,
        },
        {
            key: 'periode',
            value: periodeText,
            x: template.periode_x, y: template.periode_y,
            lebar: template.periode_lebar_max,
            align: template.periode_alignment,
            color: template.periode_color,
            fontFamily: template.periode_font_family,
            fontSize: template.periode_font_size,
        },
        {
            key: 'tanggal',
            value: formatDateDMY(form.data.tanggal_tanda_tangan),
            x: template.tanggal_x, y: template.tanggal_y,
            lebar: template.tanggal_lebar_max,
            align: template.tanggal_alignment,
            color: template.tanggal_color,
            fontFamily: template.tanggal_font_family,
            fontSize: template.tanggal_font_size,
        },
    ].filter((field) => field.value) : [];

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: 'Terbitkan Sertifikat' }]}>
            <Head title="Terbitkan Sertifikat" />

            <div className="space-y-6">
                <div className="rounded-[28px] border border-[#E4E9F0] bg-white p-6 shadow-[0_18px_40px_rgba(8,27,48,0.06)]">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#94A0B3]">Terbitkan Sertifikat</p>
                    <h1 className="font-display mt-2 text-[26px] font-extrabold text-[#0E2A47]">Generate sertifikat dari template tersimpan</h1>
                    <p className="mt-2 text-[14px] text-[#657085]">Pilih peserta, isi nomor dan tanggal, lalu sistem akan menghasilkan PDF otomatis dari template yang aktif.</p>
                </div>

                <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                    <form onSubmit={submit} className="rounded-[28px] border border-[#E4E9F0] bg-white p-6 shadow-[0_18px_40px_rgba(8,27,48,0.06)]">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#94A0B3]">Form Generate</p>
                                <h2 className="font-display mt-1 text-[18px] font-extrabold text-[#0E2A47]">Isi data sertifikat</h2>
                            </div>
                            <button type="submit" disabled={form.processing} className="rounded-[10px] bg-[#1B63B0] px-4 py-2.5 text-[13.5px] font-bold text-white transition hover:bg-[#16579b] disabled:opacity-50">
                                Generate Sertifikat
                            </button>
                        </div>

                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            <label className="block md:col-span-2">
                                <span className="mb-2 block text-[12.5px] font-bold uppercase tracking-[0.08em] text-[#1B2733]">Peserta</span>
                                <select value={form.data.peserta_pkl_id} onChange={(e) => handlePesertaChange(e.target.value)} className="block w-full rounded-[10px] border border-[#E4E9F0] bg-white px-3.5 py-[10px] text-[13.5px] outline-none focus:border-[#1B63B0] focus:ring-4 focus:ring-[#1B63B0]/12">
                                    <option value="">Pilih peserta</option>
                                    {pesertaOptions.map((item) => (
                                        <option key={item.id} value={item.id}>{item.nama} - {item.asal_institusi}</option>
                                    ))}
                                </select>
                                {form.errors.peserta_pkl_id && <p className="mt-1.5 text-[12.5px] font-medium text-[#C0433D]">{form.errors.peserta_pkl_id}</p>}
                            </label>

                            <label className="block">
                                <span className="mb-2 block text-[12.5px] font-bold uppercase tracking-[0.08em] text-[#1B2733]">Nomor Sertifikat</span>
                                <input value={form.data.nomor_sertifikat} onChange={(e) => form.setData('nomor_sertifikat', e.target.value)} className="block w-full rounded-[10px] border border-[#E4E9F0] bg-white px-3.5 py-[10px] text-[13.5px] outline-none focus:border-[#1B63B0] focus:ring-4 focus:ring-[#1B63B0]/12" />
                                {form.errors.nomor_sertifikat && <p className="mt-1.5 text-[12.5px] font-medium text-[#C0433D]">{form.errors.nomor_sertifikat}</p>}
                            </label>

                            <label className="block">
                                <span className="mb-2 block text-[12.5px] font-bold uppercase tracking-[0.08em] text-[#1B2733]">Tanggal Tanda Tangan</span>
                                <input type="date" value={form.data.tanggal_tanda_tangan} onChange={(e) => form.setData('tanggal_tanda_tangan', e.target.value)} className="block w-full rounded-[10px] border border-[#E4E9F0] bg-white px-3.5 py-[10px] text-[13.5px] outline-none focus:border-[#1B63B0] focus:ring-4 focus:ring-[#1B63B0]/12" />
                                {form.errors.tanggal_tanda_tangan && <p className="mt-1.5 text-[12.5px] font-medium text-[#C0433D]">{form.errors.tanggal_tanda_tangan}</p>}
                            </label>

                            <label className="block">
                                <span className="mb-2 block text-[12.5px] font-bold uppercase tracking-[0.08em] text-[#1B2733]">Tanggal Mulai PKL</span>
                                <input type="date" value={form.data.tanggal_mulai_pkl} onChange={(e) => form.setData('tanggal_mulai_pkl', e.target.value)} className="block w-full rounded-[10px] border border-[#E4E9F0] bg-white px-3.5 py-[10px] text-[13.5px] outline-none focus:border-[#1B63B0] focus:ring-4 focus:ring-[#1B63B0]/12" />
                                {form.errors.tanggal_mulai_pkl && <p className="mt-1.5 text-[12.5px] font-medium text-[#C0433D]">{form.errors.tanggal_mulai_pkl}</p>}
                            </label>

                            <label className="block">
                                <span className="mb-2 block text-[12.5px] font-bold uppercase tracking-[0.08em] text-[#1B2733]">Tanggal Selesai PKL</span>
                                <input type="date" value={form.data.tanggal_selesai_pkl} onChange={(e) => form.setData('tanggal_selesai_pkl', e.target.value)} className="block w-full rounded-[10px] border border-[#E4E9F0] bg-white px-3.5 py-[10px] text-[13.5px] outline-none focus:border-[#1B63B0] focus:ring-4 focus:ring-[#1B63B0]/12" />
                                {form.errors.tanggal_selesai_pkl && <p className="mt-1.5 text-[12.5px] font-medium text-[#C0433D]">{form.errors.tanggal_selesai_pkl}</p>}
                            </label>
                        </div>

                        <div className="mt-6 rounded-[24px] border border-[#E4E9F0] bg-[#F7F9FC] p-4">
                            <div className="flex items-center gap-2 text-[#1B63B0]">
                                <FileText className="h-4 w-4" />
                                <p className="text-[13px] font-semibold">Preview data terpilih</p>
                            </div>
                            <div className="mt-3 text-[13px] text-[#657085]">
                                <div>Peserta: <span className="font-semibold text-[#1B2733]">{selectedPeserta?.nama ?? '-'}</span></div>
                                <div>Asal: <span className="font-semibold text-[#1B2733]">{selectedPeserta?.asal_institusi ?? '-'}</span></div>
                                <div>Periode: <span className="font-semibold text-[#1B2733]">{periodeText || '-'}</span></div>
                                <div>Template aktif: <span className="font-semibold text-[#1B2733]">{template ? 'Ada' : 'Belum ada'}</span></div>
                            </div>
                        </div>
                    </form>

                    <div className="space-y-6">
                        <div className="rounded-[28px] border border-[#E4E9F0] bg-white p-6 shadow-[0_18px_40px_rgba(8,27,48,0.06)]">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#94A0B3]">Template Aktif</p>
                                    <h2 className="font-display mt-1 text-[18px] font-extrabold text-[#0E2A47]">Pratinjau live</h2>
                                </div>
                                <Link href={route('sertifikat.template')} className="rounded-[10px] border border-[#E4E9F0] px-3.5 py-2 text-[13px] font-semibold text-[#1B2733] transition hover:bg-[#F7F9FC]">
                                    Kelola
                                </Link>
                            </div>

                            <div className="mt-4 rounded-[24px] border border-[#E4E9F0] bg-[#F7F9FC] p-4">
                                {template ? (
                                    <div ref={previewRef} className="relative w-full overflow-hidden rounded-[20px] border border-[#E4E9F0] bg-white">
                                        <img src={`/storage/${template.file_path}`} alt="Template sertifikat" className="block w-full select-none" />

                                        {previewFields.map((item) => (
                                            <div
                                                key={item.key}
                                                className="pointer-events-none absolute"
                                                style={{
                                                    left: `${fieldLeft(item.x, item.lebar, item.align)}%`,
                                                    top: `${item.y}%`,
                                                    width: `${item.lebar}%`,
                                                    marginTop: '-0.55em',
                                                    textAlign: item.align,
                                                    fontSize: `${item.fontSize * fontScale}px`,
                                                    lineHeight: 1.15,
                                                    color: item.color,
                                                    fontFamily: `"${item.fontFamily}", "DejaVu Sans", sans-serif`,
                                                    boxSizing: 'border-box',
                                                    overflowWrap: 'break-word',
                                                    wordBreak: 'break-word',
                                                    whiteSpace: 'normal',
                                                }}
                                            >
                                                <div>{item.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex min-h-[240px] flex-col items-center justify-center rounded-[20px] border border-dashed border-[#C9D3E0] bg-white text-center">
                                        <FileUp className="h-10 w-10 text-[#1B63B0]" />
                                        <p className="mt-3 text-[14px] font-semibold text-[#1B2733]">Belum ada template yang aktif</p>
                                        <p className="mt-1 text-[12.5px] text-[#657085]">Buka halaman template untuk mengunggah desain sertifikat kosong.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-[#E4E9F0] bg-white p-6 shadow-[0_18px_40px_rgba(8,27,48,0.06)]">
                            <p className="font-display text-[18px] font-extrabold text-[#0E2A47]">Riwayat Sertifikat</p>

                            <div className="mt-4 overflow-x-auto">
                                <table className="min-w-full divide-y divide-[#E4E9F0]">
                                    <thead className="bg-[#F7F9FC]">
                                        <tr>
                                            {['No', 'Nama Peserta', 'Nomor Sertifikat', 'Tanggal', 'File', 'Aksi'].map((heading) => (
                                                <th key={heading} className="px-4 py-3 text-left text-[11.5px] font-bold uppercase tracking-[0.12em] text-[#657085]">{heading}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#E4E9F0]">
                                        {sertifikats.data.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-[#FAFBFD]">
                                                <td className="px-4 py-4 text-[13px] font-semibold text-[#657085]">{sertifikats.from + index}</td>
                                                <td className="px-4 py-4">
                                                    <div className="font-semibold text-[#1B2733]">{item.peserta?.nama}</div>
                                                    <div className="text-[12px] text-[#94A0B3]">{item.peserta?.asal_institusi}</div>
                                                </td>
                                                <td className="px-4 py-4 text-[13px] text-[#1B2733]">{item.nomor_sertifikat}</td>
                                                <td className="px-4 py-4 text-[13px] text-[#1B2733]">{item.tanggal_sertifikat}</td>
                                                <td className="px-4 py-4"><FileText className="h-5 w-5 text-[#1B63B0]" /></td>
                                                <td className="px-4 py-4">
                                                    <a href={route('sertifikat.download', item.id)} className="inline-flex items-center gap-2 rounded-[10px] border border-[#E4E9F0] px-3.5 py-2 text-[13px] font-semibold text-[#1B2733] transition hover:bg-[#F7F9FC]">
                                                        <Download className="h-4 w-4" />
                                                        Unduh
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="px-1 py-4 text-[13px] text-[#657085]">
                                Menampilkan {sertifikats.from ?? 0}–{sertifikats.to ?? 0} dari {sertifikats.total} data
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
