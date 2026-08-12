import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { AlertTriangle, UploadCloud } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
const MIN_FONT = 0.1;
const MAX_FONT = 120;

const fontOptions = [
    'Luxurious Script',
    'Times New Roman',
    'DejaVu Sans',
    'Arial',
];

const defaultPositions = {
    nama_x: 50,
    nama_y: 35,
    nama_font_size: 80,
    nama_color: '#f6b833',
    nama_font_family: 'Luxurious Script',
    nama_alignment: 'center',

    nama_lebar_max: 55,
    nama_color: '#f6b833',
    asal_x: 50,
    asal_y: 45,
    asal_alignment: 'center',
    asal_lebar_max: 65,
    asal_color: '#111176',
    periode_x: 50,
    periode_y: 55,
    periode_alignment: 'center',
    periode_lebar_max: 75,
    periode_color: '#111176',

    nama_lebar_max: 70,
    periode_x: 50,
    periode_y: 52,
    periode_font_size: 19,
    periode_color: '#111176',
    periode_font_family: 'Times New Roman',
    periode_alignment: 'center',
    periode_lebar_max: 65,
    tanggal_x: 50,
    tanggal_y: 78,
    tanggal_font_size: 13,
    tanggal_color: '#111176',
    tanggal_font_family: 'Times New Roman',
    tanggal_alignment: 'center',
    tanggal_lebar_max: 55,
    tanggal_color: '#111176',
};

const fieldConfigs = [

    { key: 'nama', label: 'Nama Peserta', value: 'Nama Peserta Contoh' },
    { key: 'asal', label: 'Asal Sekolah', value: 'SMKN 1 Karawang' },
    { key: 'periode', label: 'Periode PKL', value: '01 Januari 2026 - 28 Februari 2026' },
    { key: 'tanggal', label: 'Tanggal Tanda Tangan', value: 'Karawang, 28 Februari 2026' },

    {
        key: 'nama',
        label: 'Nama Peserta',
        value: 'Nama Peserta Contoh',
        defaultFontFamily: 'Luxurious Script',
        defaultFontSize: 80,
        defaultColor: '#f6b833',
    },
    {
        key: 'periode',
        label: 'Periode PKL',
        value: '01 Januari 2026 - 28 Februari 2026',
        defaultFontFamily: 'Times New Roman',
        defaultFontSize: 19,
        defaultColor: '#111176',
    },
    {
        key: 'tanggal',
        label: 'Tanggal Tanda Tangan',
        value: 'Karawang,28 Februari 2026',
        defaultFontFamily: 'Times New Roman',
        defaultFontSize: 13,
        defaultColor: '#111176',
    },
];

const HEX_PATTERN = /^#([0-9A-Fa-f]{6})$/;

function measureText(text, fontSizePx) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = `${fontSizePx}px "DejaVu Sans", Roboto, "Helvetica Neue", Arial, sans-serif`;
    return ctx.measureText(text).width;
}

function fitFontSize(text, maxWidthPx, targetSize = MAX_FONT) {
    if (!text || maxWidthPx <= 0) {
        return { size: MIN_FONT, atMin: false };
    }

    const startSize = Math.min(Math.max(targetSize, MIN_FONT), MAX_FONT);

    for (let size = startSize; size > MIN_FONT; size -= 0.5) {
        if (measureText(text, size) <= maxWidthPx) {
            return { size, atMin: false };
        }
    }

    return { size: MIN_FONT, atMin: measureText(text, MIN_FONT) > maxWidthPx };
}

const alignmentTransform = (align) => (
    align === 'center' ? 'translate(-50%, -50%)'
        : align === 'right' ? 'translate(-100%, -50%)'
            : 'translate(0, -50%)'
);

export default function Template({ template }) {
    const initialData = template ? { ...defaultPositions, ...template, template: null } : { ...defaultPositions, template: null };
    const form = useForm(initialData);
    const [previewUrl, setPreviewUrl] = useState(template ? `/storage/${template.file_path}` : '');
    const [usePreviousSettings, setUsePreviousSettings] = useState(Boolean(template));
    const [draggingField, setDraggingField] = useState(null);
    const [hexErrors, setHexErrors] = useState({});
    const previewRef = useRef(null);
    const [previewWidth, setPreviewWidth] = useState(0);

    const activeTemplate = useMemo(() => previewUrl || (template ? `/storage/${template.file_path}` : ''), [previewUrl, template]);

    useEffect(() => {
        const el = previewRef.current;
        if (!el) return;

        const update = () => setPreviewWidth(el.clientWidth);

        update();
        window.addEventListener('resize', update);

        return () => window.removeEventListener('resize', update);
    }, [activeTemplate]);

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

    // Sinkronisasi color picker (swatch) <-> input teks kode hex untuk 1 field
    const handleColorPicker = (fieldKey, value) => {
        form.setData(`${fieldKey}_color`, value);
        setHexErrors((prev) => ({ ...prev, [fieldKey]: false }));
    };

    const handleHexInput = (fieldKey, rawValue) => {
        let value = rawValue.trim();
        if (value && !value.startsWith('#')) value = `#${value}`;

        form.setData(`${fieldKey}_color`, value);

        const isValid = HEX_PATTERN.test(value);
        setHexErrors((prev) => ({ ...prev, [fieldKey]: !isValid }));
    };

    const submit = (event) => {
        event.preventDefault();

        // Validasi semua kode hex sebelum submit
        const invalidField = fieldConfigs.find(
            (field) => !HEX_PATTERN.test(form.data[`${field.key}_color`] || '')
        );

        if (invalidField) {
            setHexErrors((prev) => ({ ...prev, [invalidField.key]: true }));
            return;
        }

        form.post(route('sertifikat.template.store'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: 'Kelola Template Sertifikat' }]}>
            <Head title="Kelola Template Sertifikat">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link href="https://fonts.googleapis.com/css2?family=Luxurious+Script&display=swap" rel="stylesheet" />
            </Head>

            <div className="space-y-6">
                <div className="rounded-[28px] border border-[#E4E9F0] bg-white p-6 shadow-[0_18px_40px_rgba(8,27,48,0.06)]">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#94A0B3]">Kelola Template Sertifikat</p>
                    <h1 className="font-display mt-2 text-[26px] font-extrabold text-[#0E2A47]">Upload template kosong dan atur posisi teks sekali saja</h1>
                    <p className="mt-2 text-[14px] text-[#657085]">Posisi disimpan sebagai persentase agar tetap akurat saat ukuran gambar berbeda di layar maupun saat dipakai untuk PDF. Ukuran font dihitung otomatis agar teks selalu muat di dalam lebar area maksimal yang Anda tentukan.</p>
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
                                        const positionX = Number(form.data[`${field.key}_x`]) || 50;
                                        const positionY = Number(form.data[`${field.key}_y`]) || 50;
                                        const lebarMax = Number(form.data[`${field.key}_lebar_max`]) || 0;
                                        const alignment = form.data[`${field.key}_alignment`];

                                        const color = form.data[`${field.key}_color`] || '#1B2733';

                                        const fontSize = Number(form.data[`${field.key}_font_size`]) || field.defaultFontSize;
                                        const fontColor = form.data[`${field.key}_color`] || field.defaultColor;
                                        const fontFamily = form.data[`${field.key}_font_family`] || field.defaultFontFamily;
                                        const maxWidthPx = (previewWidth * lebarMax) / 100;
                                        const { atMin } = fitFontSize(field.value, maxWidthPx, fontSize);

                                        return (
                                            <div key={field.key} className="pointer-events-none absolute" style={{ left: `${positionX}%`, top: `${positionY}%`, transform: alignmentTransform(alignment) }}>
                                                {atMin && (
                                                    <span className="absolute -top-2 right-0 inline-flex items-center gap-1 rounded-full bg-[#C0433D] px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                                                        <AlertTriangle className="h-3 w-3" />
                                                        Terlalu sempit
                                                    </span>
                                                )}
                                                <div className="rounded-full border border-[#1B63B0] bg-white px-3 py-1 text-[11px] font-bold text-[#1B63B0] shadow-lg">
                                                    {field.label}
                                                </div>
                                                <div
                                                    className="mt-1 font-semibold"
                                                    style={{
                                                        maxWidth: `${lebarMax}%`,
                                                        width: `${lebarMax}%`,
                                                        fontSize: `${fontSize}px`,
                                                        lineHeight: 1.15,
                                                        textAlign: alignment,
                                                        color,
                                                        boxSizing: 'border-box',
                                                        overflowWrap: 'break-word',
                                                        wordBreak: 'break-word',
                                                        whiteSpace: 'normal',
                                                        fontFamily,
                                                        color: fontColor,
                                                        resize: 'horizontal',
                                                        overflow: 'auto',
                                                    }}
                                                >
                                                    {field.value}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {fieldConfigs.map((field) => (
                                        <button
                                            key={`${field.key}-handle`}
                                            type="button"
                                            onPointerDown={() => setDraggingField(field.key)}
                                            className="pointer-events-auto absolute h-5 w-5 rounded-full border-2 border-white bg-[#1B63B0] shadow-[0_4px_12px_rgba(27,99,176,0.5)]"
                                            style={{ left: `${form.data[`${field.key}_x`]}%`, top: `${form.data[`${field.key}_y`]}%`, transform: 'translate(-50%, -50%)' }}
                                            aria-label={`Geser posisi ${field.label}`}
                                        />
                                    ))}
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
                            <h2 className="font-display mt-1 text-[18px] font-extrabold text-[#0E2A47]">Posisi, lebar area, warna, dan perataan</h2>
                        </div>

                        <div className="space-y-5">
                            {fieldConfigs.map((field) => {
                                const lebarMax = Number(form.data[`${field.key}_lebar_max`]) || 0;
                                const maxWidthPx = (previewWidth * lebarMax) / 100;
                                const { size, atMin } = fitFontSize(field.value, maxWidthPx);
                                const colorValue = form.data[`${field.key}_color`] || '#1B2733';
                                const isHexInvalid = hexErrors[field.key];

                                return (
                                    <div key={field.key} className="rounded-[24px] border border-[#E4E9F0] bg-[#F7F9FC] p-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="text-[13px] font-bold text-[#0E2A47]">{field.label}</p>
                                            <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-[#1B2733] shadow-sm">
                                                Auto-fit: {size}px
                                            </span>
                                        </div>

                                        {atMin && (
                                            <div className="mt-3 flex items-start gap-2 rounded-[12px] border border-[#F3D2D0] bg-[#FBEAE9] px-3 py-2.5 text-[12.5px] font-medium text-[#C0433D]">
                                                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                                                Area terlalu sempit — teks menyentuh batas minimum {MIN_FONT}px dan berisiko terpotong. Perlebar area atau pendekkan teks.
                                            </div>
                                        )}

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
                                                <span className="mb-1 block text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#657085]">Ukuran Font (px)</span>
                                                <input type="number" min="0.1" max="120" step="0.1" value={form.data[`${field.key}_font_size`]} onChange={(e) => form.setData(`${field.key}_font_size`, e.target.value)} className="block w-full rounded-[10px] border border-[#E4E9F0] bg-white px-3.5 py-[10px] text-[13px] outline-none focus:border-[#1B63B0] focus:ring-4 focus:ring-[#1B63B0]/12" />
                                            </label>
                                            <label className="block">
                                                <span className="mb-1 block text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#657085]">Font</span>
                                                <select value={form.data[`${field.key}_font_family`]} onChange={(e) => form.setData(`${field.key}_font_family`, e.target.value)} className="block w-full rounded-[10px] border border-[#E4E9F0] bg-white px-3.5 py-[10px] text-[13px] outline-none focus:border-[#1B63B0] focus:ring-4 focus:ring-[#1B63B0]/12">
                                                    {fontOptions.map((option) => (
                                                        <option key={option} value={option}>{option}</option>
                                                    ))}
                                                </select>
                                            </label>
                                            <label className="block">
                                                <span className="mb-1 block text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#657085]">Warna</span>
                                                <input type="color" value={form.data[`${field.key}_color`]} onChange={(e) => form.setData(`${field.key}_color`, e.target.value)} className="h-11 w-full rounded-[10px] border border-[#E4E9F0] bg-white px-3.5 py-[10px] text-[13px] outline-none focus:border-[#1B63B0] focus:ring-4 focus:ring-[#1B63B0]/12" />
                                            </label>
                                            <label className="block sm:col-span-2">
                                                <span className="mb-1 block text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#657085]">Lebar Area Maksimal (%)</span>
                                                <div className="flex items-center gap-3">
                                                    <input type="range" min="10" max="100" step="0.5" value={lebarMax} onChange={(e) => form.setData(`${field.key}_lebar_max`, e.target.value)} className="w-full accent-[#1B63B0]" />
                                                    <input type="number" min="1" max="100" step="0.5" value={form.data[`${field.key}_lebar_max`]} onChange={(e) => form.setData(`${field.key}_lebar_max`, e.target.value)} className="block w-24 rounded-[10px] border border-[#E4E9F0] bg-white px-3.5 py-[10px] text-[13px] outline-none focus:border-[#1B63B0] focus:ring-4 focus:ring-[#1B63B0]/12" />
                                                </div>
                                            </label>
                                            <label className="block sm:col-span-2">
                                                <span className="mb-1 block text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#657085]">Warna Teks</span>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="color"
                                                        value={HEX_PATTERN.test(colorValue) ? colorValue : '#1B2733'}
                                                        onChange={(e) => handleColorPicker(field.key, e.target.value)}
                                                        className="h-[38px] w-[44px] shrink-0 cursor-pointer rounded-[8px] border border-[#E4E9F0] bg-white p-1"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={colorValue}
                                                        onChange={(e) => handleHexInput(field.key, e.target.value)}
                                                        placeholder="#111176"
                                                        maxLength={7}
                                                        className={`block w-full rounded-[10px] border bg-white px-3.5 py-[10px] font-mono text-[13px] outline-none focus:ring-4 ${isHexInvalid ? 'border-[#C0433D] focus:border-[#C0433D] focus:ring-[#C0433D]/12' : 'border-[#E4E9F0] focus:border-[#1B63B0] focus:ring-[#1B63B0]/12'}`}
                                                    />
                                                </div>
                                                {isHexInvalid && (
                                                    <p className="mt-1.5 text-[11.5px] font-medium text-[#C0433D]">
                                                        Format kode warna harus #RRGGBB, contoh: #111176
                                                    </p>
                                                )}
                                            </label>
                                            <label className="block sm:col-span-2">
                                                <span className="mb-1 block text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#657085]">Perataan</span>
                                                <select value={form.data[`${field.key}_alignment`]} onChange={(e) => form.setData(`${field.key}_alignment`, e.target.value)} className="block w-full rounded-[10px] border border-[#E4E9F0] bg-white px-3.5 py-[10px] text-[13px] outline-none focus:border-[#1B63B0] focus:ring-4 focus:ring-[#1B63B0]/12">
                                                    <option value="left">Kiri</option>
                                                    <option value="center">Tengah</option>
                                                    <option value="right">Kanan</option>
                                                </select>
                                            </label>
                                        </div>
                                    </div>
                                );
                            })}
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