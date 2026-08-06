import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FileUp, FileText, Download } from 'lucide-react';
import { useState } from 'react';

export default function Index({ pesertaOptions, sertifikats }) {
    const [dragActive, setDragActive] = useState(false);
    const [fileName, setFileName] = useState('');

    const form = useForm({
        peserta_pkl_id: '',
        nomor_sertifikat: '',
        tanggal_sertifikat: '',
        file: null,
    });

    const submit = (event) => {
        event.preventDefault();
        form.post(route('sertifikat.store'), { forceFormData: true, onSuccess: () => { form.reset(); setFileName(''); } });
    };

    const onFileChange = (file) => {
        form.setData('file', file);
        setFileName(file ? file.name : '');
    };

    const onDrop = (event) => {
        event.preventDefault();
        setDragActive(false);
        const file = event.dataTransfer.files?.[0];
        if (file) onFileChange(file);
    };

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: 'Upload Sertifikat' }]}>
            <Head title="Upload Sertifikat" />

            <div className="space-y-6">
                <div className="rounded-[28px] border border-[#E4E9F0] bg-white p-6 shadow-[0_18px_40px_rgba(8,27,48,0.06)]">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#94A0B3]">Upload Sertifikat</p>
                    <h1 className="font-display mt-2 text-[26px] font-extrabold text-[#0E2A47]">Unggah sertifikat peserta PKL</h1>

                    <form onSubmit={submit} className="mt-6 grid gap-4 xl:grid-cols-2">
                        <label className="block">
                            <span className="mb-2 block text-[12.5px] font-bold uppercase tracking-[0.08em] text-[#1B2733]">Peserta</span>
                            <select value={form.data.peserta_pkl_id} onChange={(e) => form.setData('peserta_pkl_id', e.target.value)} className="block w-full rounded-[10px] border border-[#E4E9F0] bg-white px-3.5 py-[10px] text-[13.5px] outline-none focus:border-[#1B63B0] focus:ring-4 focus:ring-[#1B63B0]/12">
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
                            <span className="mb-2 block text-[12.5px] font-bold uppercase tracking-[0.08em] text-[#1B2733]">Tanggal Sertifikat</span>
                            <input type="date" value={form.data.tanggal_sertifikat} onChange={(e) => form.setData('tanggal_sertifikat', e.target.value)} className="block w-full rounded-[10px] border border-[#E4E9F0] bg-white px-3.5 py-[10px] text-[13.5px] outline-none focus:border-[#1B63B0] focus:ring-4 focus:ring-[#1B63B0]/12" />
                            {form.errors.tanggal_sertifikat && <p className="mt-1.5 text-[12.5px] font-medium text-[#C0433D]">{form.errors.tanggal_sertifikat}</p>}
                        </label>

                        <div className="xl:col-span-2">
                            <span className="mb-2 block text-[12.5px] font-bold uppercase tracking-[0.08em] text-[#1B2733]">File PDF</span>
                            <label
                                onDragEnter={() => setDragActive(true)}
                                onDragLeave={() => setDragActive(false)}
                                onDragOver={(event) => event.preventDefault()}
                                onDrop={onDrop}
                                className={`flex cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed px-6 py-10 text-center transition ${dragActive ? 'border-[#1B63B0] bg-[#E8F1FB]' : 'border-[#C9D3E0] bg-[#F7F9FC]'}`}
                            >
                                <FileUp className="h-8 w-8 text-[#1B63B0]" />
                                <p className="mt-3 text-[14px] font-semibold text-[#1B2733]">Drag & drop file PDF di sini atau klik untuk memilih file</p>
                                <p className="mt-1 text-[12.5px] text-[#657085]">Maksimal 5MB</p>
                                {fileName && <p className="mt-3 text-[12.5px] font-semibold text-[#2E8B4E]">{fileName}</p>}
                                <input type="file" accept="application/pdf" className="hidden" onChange={(e) => onFileChange(e.target.files?.[0] ?? null)} />
                            </label>
                            {form.errors.file && <p className="mt-1.5 text-[12.5px] font-medium text-[#C0433D]">{form.errors.file}</p>}
                        </div>

                        <div className="xl:col-span-2 flex justify-end">
                            <button type="submit" disabled={form.processing} className="rounded-[10px] bg-[#1B63B0] px-4 py-2.5 text-[13.5px] font-bold text-white transition hover:bg-[#16579b] disabled:opacity-50">
                                Simpan Sertifikat
                            </button>
                        </div>
                    </form>
                </div>

                <div className="overflow-hidden rounded-[28px] border border-[#E4E9F0] bg-white shadow-[0_18px_40px_rgba(8,27,48,0.06)]">
                    <div className="border-b border-[#E4E9F0] px-6 py-5">
                        <p className="font-display text-[18px] font-extrabold text-[#0E2A47]">Riwayat Sertifikat</p>
                    </div>

                    <div className="overflow-x-auto">
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
                                        <td className="px-4 py-4">
                                            <FileText className="h-5 w-5 text-[#1B63B0]" />
                                        </td>
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

                    <div className="px-6 py-4 text-[13px] text-[#657085]">
                        Menampilkan {sertifikats.from ?? 0}–{sertifikats.to ?? 0} dari {sertifikats.total} data
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}