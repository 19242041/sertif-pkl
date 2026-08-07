import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { UploadCloud } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

const defaultPositions = {
    nama_x: 50,
    nama_y: 35,
    nama_font_size: 28,
    nama_alignment: 'center',
    periode_x: 50,
    periode_y: 50,
    periode_font_size: 18,
    periode_alignment: 'center',
    tanggal_x: 50,
    tanggal_y: 80,
    tanggal_font_size: 18,
    tanggal_alignment: 'center',
};

const fieldConfigs = [
    { key: 'nama', label: 'Nama Peserta', value: 'Nama Peserta Contoh' },
    { key: 'periode', label: 'Periode PKL', value: '01 Januari 2026 - 28 Februari 2026' },
    { key: 'tanggal', label: 'Tanggal Tanda Tangan', value: 'Karawang, 28 Februari 2026' },
];

export default function Template({ template }) {
    const initialData = template ? { ...defaultPositions, ...template, template: null } : { ...defaultPositions, template: null };
    const form = useForm(initialData);
    const [previewUrl, setPreviewUrl] = useState(template ? `/storage/${template.file_path}` : '');
    const [usePreviousSettings, setUsePreviousSettings] = useState(Boolean(template));
    const [draggingField, setDraggingField] = useState(null);
    const previewRef = useRef(null);

    const activeTemplate = useMemo(() => previewUrl || (template ? `/storage/${template.file_path}` : ''), [previewUrl, template]);

    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    useEffect(() => {
        const handleMove = (event) => {
            if (!draggingField || !previewRef.current) return;

            const rect = previewRef.current.getBoundingClientRect();
            const x = Math.min(100, Math.max(0, ((event.clientX - rect.left) / rect.width) * 100));
            const y = Math.min(100, Math.max(0, ((event.clientY - rect.top) / rect.height) * 100));

            form.setData(`${draggingField}_x`, Number(x.toFixed(2)));
            form.setData(`${draggingField}_y`, Number(y.toFixed(2)));
        };

        const handleUp = () => setDraggingField(null);

        window.addEventListener('pointermove', handleMove);
        window.addEventListener('pointerup', handleUp);

        return () => {
            window.removeEventListener('pointermove', handleMove);
            window.removeEventListener('pointerup', handleUp);
        };
    }, [draggingField]);

    const handleFile = (file) => {
        if (!file) return;

        const nextUrl = URL.createObjectURL(file);

        if (previewUrl && previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
        }

        setPreviewUrl(nextUrl);
        form.setData('template', file);

        if (!usePreviousSettings) {
            Object.entries(defaultPositions).forEach(([key, value]) => form.setData(key, value));
        }
    };

    const submit = (event) => {
        event.preventDefault();

        form.post(route('sertifikat.template.store'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: 'Kelola Template Sertifikat' }]}>
            <Head title="Kelola Template Sertifikat" />

            <div className="space-y-6">
                <div className="rounded-[28px] border border-[#E4E9F0] bg-white p-6 shadow-[0_18px_40px_rgba(8,27,48,0.06)]">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#94A0B3]">Kelola Template Sertifikat</p>
                    <h1 className="font-display mt-2 text-[26px] font-extrabold text-[#0E2A47]">Upload template kosong dan atur posisi teks sekali saja</h1>
                    <p className="mt-2 text-[14px] text-[#657085]">Posisi disimpan sebagai persentase agar tetap akurat saat ukuran gambar berbeda di layar maupun saat dipakai untuk PDF.</p>
                </div>

                <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-[28px] border border-[#E4E9F0] bg-white p-6 shadow-[0_18px_40px_rgba(8,27,48,0.06)]">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#94A0B3]">Editor Visual</p>
                                <h2 className="font-display mt-1 text-[18px] font-extrabold text-[#0E2A47]">Geser marker di atas template</h2>
                            </div>
                            <label className="inline-flex cursor-pointer items-center gap-2 rounded-[10px] border border-[#E4E9F0] px-3.5 py-2 text-[13px] font-semibold text-[#1B2733] transition hover:bg-[#F7F9FC]">
                                <UploadCloud className="h-4 w-4 text-[#1B63B0]" />
                                <span>Upload Template</span>
                                <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
                            </label>
                        </div>

                        <div className="mt-5 rounded-[24px] border border-dashed border-[#C9D3E0] bg-[#F7F9FC] p-4">
                            {activeTemplate ? (
                                <div ref={previewRef} className="relative overflow-hidden rounded-[20px] border border-[#E4E9F0] bg-white">
                                    <img src={activeTemplate} alt="Template sertifikat" className="block w-full select-none object-cover" />
                                    {fieldConfigs.map((field) => {
                                        const positionX = form.data[`${field.key}_x`];
                                        const positionY = form.data[`${field.key}_y`];

                                        return (
                                            <button
                                                key={field.key}
                                                type="button"
                                                onPointerDown={() => setDraggingField(field.key)}
                                                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#1B63B0] bg-white px-3 py-1 text-[11px] font-bold text-[#1B63B0] shadow-lg"
                                                style={{ left: `${positionX}%`, top: `${positionY}%` }}
                                            >
                                                {field.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[20px] border border-dashed border-[#C9D3E0] bg-white text-center">
                                    <UploadCloud className="h-10 w-10 text-[#1B63B0]" />
                                    <p className="mt-3 text-[14px] font-semibold text-[#1B2733]">Belum ada template dipilih</p>
                                    <p className="mt-1 max-w-md text-[12.5px] text-[#657085]">Unggah gambar JPG atau PNG template kosong untuk memulai pengaturan posisi teks.</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-3 text-[13px] text-[#657085]">
                            <label className="inline-flex items-center gap-2">
                                <input type="checkbox" checked={usePreviousSettings} onChange={(event) => setUsePreviousSettings(event.target.checked)} className="h-4 w-4 rounded border-[#C9D3E0] text-[#1B63B0] focus:ring-[#1B63B0]" />
                                Pakai posisi lama saat ganti template
                            </label>
                        </div>
                    </div>

                    <div className="space-y-6 rounded-[28px] border border-[#E4E9F0] bg-white p-6 shadow-[0_18px_40px_rgba(8,27,48,0.06)]">
                        <div>
                            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#94A0B3]">Pengaturan Field</p>
                            <h2 className="font-display mt-1 text-[18px] font-extrabold text-[#0E2A47]">Posisi, ukuran, dan perataan</h2>
                        </div>

                        <div className="space-y-5">
                            {fieldConfigs.map((field) => (
                                <div key={field.key} className="rounded-[24px] border border-[#E4E9F0] bg-[#F7F9FC] p-4">
                                    <p className="text-[13px] font-bold text-[#0E2A47]">{field.label}</p>
                                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                        <label className="block">
                                            <span className="mb-1 block text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#657085]">X %</span>
                                            <input type="number" min="0" max="100" step="0.1" value={form.data[`${field.key}_x`]} onChange={(e) => form.setData(`${field.key}_x`, e.target.value)} className="block w-full rounded-[10px] border border-[#E4E9F0] bg-white px-3.5 py-[10px] text-[13px] outline-none focus:border-[#1B63B0] focus:ring-4 focus:ring-[#1B63B0]/12" />
                                        </label>
                                        <label className="block">
                                            <span className="mb-1 block text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#657085]">Y %</span>
                                            <input type="number" min="0" max="100" step="0.1" value={form.data[`${field.key}_y`]} onChange={(e) => form.setData(`${field.key}_y`, e.target.value)} className="block w-full rounded-[10px] border border-[#E4E9F0] bg-white px-3.5 py-[10px] text-[13px] outline-none focus:border-[#1B63B0] focus:ring-4 focus:ring-[#1B63B0]/12" />
                                        </label>
                                        <label className="block">
                                            <span className="mb-1 block text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#657085]">Ukuran Font</span>
                                            <input type="number" min="8" max="80" value={form.data[`${field.key}_font_size`]} onChange={(e) => form.setData(`${field.key}_font_size`, e.target.value)} className="block w-full rounded-[10px] border border-[#E4E9F0] bg-white px-3.5 py-[10px] text-[13px] outline-none focus:border-[#1B63B0] focus:ring-4 focus:ring-[#1B63B0]/12" />
                                        </label>
                                        <label className="block">
                                            <span className="mb-1 block text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#657085]">Perataan</span>
                                            <select value={form.data[`${field.key}_alignment`]} onChange={(e) => form.setData(`${field.key}_alignment`, e.target.value)} className="block w-full rounded-[10px] border border-[#E4E9F0] bg-white px-3.5 py-[10px] text-[13px] outline-none focus:border-[#1B63B0] focus:ring-4 focus:ring-[#1B63B0]/12">
                                                <option value="left">Kiri</option>
                                                <option value="center">Tengah</option>
                                                <option value="right">Kanan</option>
                                            </select>
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button type="submit" disabled={form.processing} className="rounded-[10px] bg-[#1B63B0] px-4 py-2.5 text-[13.5px] font-bold text-white transition hover:bg-[#16579b] disabled:opacity-50">
                            Simpan Template
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}