import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const initialState = (peserta) => ({
    nama: peserta?.nama ?? '',
    nis_nim: peserta?.nis_nim ?? '',
    asal_institusi: peserta?.asal_institusi ?? '',
    jurusan: peserta?.jurusan ?? '',
    jenis_kelamin: peserta?.jenis_kelamin ?? '',
    tempat_lahir: peserta?.tempat_lahir ?? '',
    tanggal_lahir: peserta?.tanggal_lahir ?? '',
    no_hp: peserta?.no_hp ?? '',
    email: peserta?.email ?? '',
    pembimbing_sekolah: peserta?.pembimbing_sekolah ?? '',
    pembimbing_lapangan: peserta?.pembimbing_lapangan ?? '',
    tanggal_mulai: peserta?.tanggal_mulai ?? '',
    tanggal_selesai: peserta?.tanggal_selesai ?? '',
    status: peserta?.status ?? 'Aktif',
    keterangan: peserta?.keterangan ?? '',
    foto: null,
});

function FieldError({ message }) {
    if (!message) return null;

    return <p className="mt-1.5 text-[12.5px] font-medium text-[#C0433D]">{message}</p>;
}

function Input({ label, error, ...props }) {
    return (
        <label className="block">
            <span className="mb-2 block text-[12.5px] font-bold uppercase tracking-[0.08em] text-[#1B2733]">{label}</span>
            <input
                {...props}
                className="block w-full rounded-[10px] border border-[#E4E9F0] bg-white px-3.5 py-[10px] text-[13.5px] text-[#1B2733] outline-none transition placeholder:text-[#94A0B3] focus:border-[#1B63B0] focus:ring-4 focus:ring-[#1B63B0]/12"
            />
            <FieldError message={error} />
        </label>
    );
}

function Select({ label, error, children, ...props }) {
    return (
        <label className="block">
            <span className="mb-2 block text-[12.5px] font-bold uppercase tracking-[0.08em] text-[#1B2733]">{label}</span>
            <select
                {...props}
                className="block w-full rounded-[10px] border border-[#E4E9F0] bg-white px-3.5 py-[10px] text-[13.5px] text-[#1B2733] outline-none transition focus:border-[#1B63B0] focus:ring-4 focus:ring-[#1B63B0]/12"
            >
                {children}
            </select>
            <FieldError message={error} />
        </label>
    );
}

function Textarea({ label, error, ...props }) {
    return (
        <label className="block md:col-span-2">
            <span className="mb-2 block text-[12.5px] font-bold uppercase tracking-[0.08em] text-[#1B2733]">{label}</span>
            <textarea
                {...props}
                rows="4"
                className="block w-full rounded-[10px] border border-[#E4E9F0] bg-white px-3.5 py-[10px] text-[13.5px] text-[#1B2733] outline-none transition placeholder:text-[#94A0B3] focus:border-[#1B63B0] focus:ring-4 focus:ring-[#1B63B0]/12"
            />
            <FieldError message={error} />
        </label>
    );
}

function PhotoPreview({ fotoUrl }) {
    if (!fotoUrl) {
        return <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#E8F1FB] text-[24px] font-bold text-[#1B63B0]">PP</div>;
    }

    return <img src={`/storage/${fotoUrl}`} alt="Foto peserta" className="h-20 w-20 rounded-full object-cover ring-4 ring-white" />;
}

export default function Form({ peserta, mode }) {
    const form = useForm(initialState(peserta));

    const submit = (e) => {
        e.preventDefault();

        const options = { forceFormData: true };

        if (mode === 'edit') {
            form.put(route('peserta-pkl.update', peserta.id), options);
            return;
        }

        form.post(route('peserta-pkl.store'), options);
    };

    return (
        <AuthenticatedLayout breadcrumbs={[
            { label: 'Data Peserta PKL', href: route('peserta-pkl.index') },
            { label: mode === 'edit' ? 'Ubah Peserta' : 'Tambah Peserta' },
        ]}>
            <Head title={mode === 'edit' ? 'Ubah Peserta' : 'Tambah Peserta'} />

            <div className="space-y-6">
                <div className="flex items-center justify-between gap-4 rounded-[28px] border border-[#E4E9F0] bg-white p-5 shadow-[0_18px_40px_rgba(8,27,48,0.06)]">
                    <Link href={route('peserta-pkl.index')} className="rounded-[10px] border border-[#E4E9F0] px-4 py-2.5 text-[13.5px] font-semibold text-[#1B2733] transition hover:bg-[#F7F9FC]">
                        Kembali
                    </Link>

                    <button type="submit" form="peserta-form" className="rounded-[10px] bg-[#1B63B0] px-4 py-2.5 text-[13.5px] font-bold text-white transition hover:bg-[#16579b] disabled:opacity-50" disabled={form.processing}>
                        Simpan
                    </button>
                </div>

                <form id="peserta-form" onSubmit={submit} className="space-y-6">
                    <div className="grid gap-6 xl:grid-cols-2">
                        <div className="rounded-[28px] border border-[#E4E9F0] bg-white p-6 shadow-[0_18px_40px_rgba(8,27,48,0.06)]">
                            <div className="flex items-center gap-4 border-b border-[#E4E9F0] pb-4">
                                <PhotoPreview fotoUrl={peserta?.foto_url} />
                                <div>
                                    <p className="font-display text-[18px] font-extrabold text-[#0E2A47]">Data Pribadi</p>
                                    <p className="text-[13px] text-[#657085]">Identitas dasar peserta PKL</p>
                                </div>
                            </div>

                            <div className="mt-5 grid gap-4 md:grid-cols-2">
                                <Input label="Nama Lengkap" value={form.data.nama} onChange={(e) => form.setData('nama', e.target.value)} error={form.errors.nama} />
                                <Input label="NIS / NIM" value={form.data.nis_nim} onChange={(e) => form.setData('nis_nim', e.target.value)} error={form.errors.nis_nim} />
                                <Select label="Jenis Kelamin" value={form.data.jenis_kelamin} onChange={(e) => form.setData('jenis_kelamin', e.target.value)} error={form.errors.jenis_kelamin}>
                                    <option value="">Pilih jenis kelamin</option>
                                    <option value="Laki-laki">Laki-laki</option>
                                    <option value="Perempuan">Perempuan</option>
                                </Select>
                                <Input label="Tempat Lahir" value={form.data.tempat_lahir} onChange={(e) => form.setData('tempat_lahir', e.target.value)} error={form.errors.tempat_lahir} />
                                <Input label="Tanggal Lahir" type="date" value={form.data.tanggal_lahir} onChange={(e) => form.setData('tanggal_lahir', e.target.value)} error={form.errors.tanggal_lahir} />
                                <Input label="No. HP" value={form.data.no_hp} onChange={(e) => form.setData('no_hp', e.target.value)} error={form.errors.no_hp} />
                                <Input label="Email" type="email" value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} error={form.errors.email} />
                                <label className="block md:col-span-2">
                                    <span className="mb-2 block text-[12.5px] font-bold uppercase tracking-[0.08em] text-[#1B2733]">Foto Peserta</span>
                                    <input type="file" accept="image/*" onChange={(e) => form.setData('foto', e.target.files?.[0] ?? null)} className="block w-full rounded-[10px] border border-dashed border-[#C9D3E0] bg-[#F7F9FC] px-3.5 py-[10px] text-[13.5px] text-[#657085]" />
                                    <FieldError message={form.errors.foto} />
                                </label>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="rounded-[28px] border border-[#E4E9F0] bg-white p-6 shadow-[0_18px_40px_rgba(8,27,48,0.06)]">
                                <p className="font-display text-[18px] font-extrabold text-[#0E2A47]">Data Institusi</p>
                                <div className="mt-5 grid gap-4 md:grid-cols-2">
                                    <Input label="Asal Sekolah / Kampus" value={form.data.asal_institusi} onChange={(e) => form.setData('asal_institusi', e.target.value)} error={form.errors.asal_institusi} />
                                    <Input label="Jurusan" value={form.data.jurusan} onChange={(e) => form.setData('jurusan', e.target.value)} error={form.errors.jurusan} />
                                    <Input label="Pembimbing Sekolah" value={form.data.pembimbing_sekolah} onChange={(e) => form.setData('pembimbing_sekolah', e.target.value)} error={form.errors.pembimbing_sekolah} />
                                    <Input label="Pembimbing Lapangan" value={form.data.pembimbing_lapangan} onChange={(e) => form.setData('pembimbing_lapangan', e.target.value)} error={form.errors.pembimbing_lapangan} />
                                </div>
                            </div>

                            <div className="rounded-[28px] border border-[#E4E9F0] bg-white p-6 shadow-[0_18px_40px_rgba(8,27,48,0.06)]">
                                <p className="font-display text-[18px] font-extrabold text-[#0E2A47]">Data PKL</p>
                                <div className="mt-5 grid gap-4 md:grid-cols-2">
                                    <Input label="Tanggal Mulai PKL" type="date" value={form.data.tanggal_mulai} onChange={(e) => form.setData('tanggal_mulai', e.target.value)} error={form.errors.tanggal_mulai} />
                                    <Input label="Tanggal Selesai PKL" type="date" value={form.data.tanggal_selesai} onChange={(e) => form.setData('tanggal_selesai', e.target.value)} error={form.errors.tanggal_selesai} />
                                    <Select label="Status" value={form.data.status} onChange={(e) => form.setData('status', e.target.value)} error={form.errors.status}>
                                        <option value="Aktif">Aktif</option>
                                        <option value="Selesai">Selesai</option>
                                        <option value="Berhenti">Berhenti</option>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[28px] border border-[#E4E9F0] bg-white p-6 shadow-[0_18px_40px_rgba(8,27,48,0.06)]">
                        <p className="font-display text-[18px] font-extrabold text-[#0E2A47]">Keterangan</p>
                        <div className="mt-5">
                            <Textarea label="Catatan / Keterangan" value={form.data.keterangan} onChange={(e) => form.setData('keterangan', e.target.value)} error={form.errors.keterangan} />
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}