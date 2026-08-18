import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#0E2A47_0%,#081B30_100%)] px-4 py-6 text-[#1B2733] sm:px-6 lg:px-8">
            <Head title="Lupa Kata Sandi" />

            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-[-5rem] top-[-4rem] h-56 w-56 rounded-full bg-[#1B63B0]/22 blur-3xl lg:h-64 lg:w-64" />
                <div className="absolute right-[-3rem] top-[14%] h-56 w-56 rounded-full bg-[#2E8B4E]/18 blur-3xl lg:h-64 lg:w-64" />
                <div className="absolute bottom-[-4rem] left-[18%] h-64 w-64 rounded-full bg-[#E8A712]/18 blur-3xl lg:h-72 lg:w-72" />
            </div>

            <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl items-center justify-center">
                <div className="grid w-full items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
                    <div className="hidden max-w-[640px] text-white lg:block">
                        <div className="mb-8 flex items-center gap-3.5">
                            <img src="/images/logo-disnakertrans.png" alt="Logo Disnakertrans" className="h-11 w-auto object-contain" />
                            <div className="h-8 w-px bg-white/20" />
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">Disnakertrans Provinsi Jawa Barat</p>
                                <p className="text-[12.5px] text-white/70">UPTD Pengawasan Ketenagakerjaan Wilayah II Karawang</p>
                            </div>
                        </div>

                        <h1 className="font-display max-w-[560px] text-[32px] font-extrabold leading-[1.15] text-white">
                            Lupa kata sandi? Kode 6 digit akan dikirim ke email admin.
                        </h1>
                        <p className="mt-4 max-w-[520px] text-[14.5px] leading-6 text-white/72">
                            Masukkan email admin yang terdaftar, lalu ikuti kode yang masuk ke kotak masuk untuk mengatur ulang password SIMPATIK.
                        </p>
                    </div>

                    <div className="mx-auto w-full max-w-[400px] rounded-[24px] border border-white/55 bg-white/96 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl">
                        <div className="flex flex-col items-center text-center">
                            <div className="flex h-[3px] w-14 overflow-hidden rounded-full">
                                <span className="flex-1 bg-[#1B63B0]" />
                                <span className="flex-1 bg-[#2E8B4E]" />
                                <span className="flex-1 bg-[#E8A712]" />
                            </div>

                            <h2 className="font-display mt-4 text-[24px] font-extrabold tracking-[0.02em] text-[#FFFFFF]">
                                Kirim Kode Reset
                            </h2>
                            <p className="mt-1.5 max-w-xs text-[13px] leading-5 text-[#FFFFFF]">
                                Masukkan email admin untuk menerima kode reset 6 digit.
                            </p>
                        </div>

                        {status && (
                            <div className="mt-5 rounded-2xl border border-[#C7E8D1] bg-[#E7F5EC] px-3.5 py-2.5 text-sm font-medium text-[#2E8B4E]">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="mt-6">
                            <div>
                                <label htmlFor="email" className="mb-1.5 block text-[12px] font-bold uppercase tracking-[0.08em] text-[#1B2733]">
                                    Email Admin
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    autoComplete="email"
                                    autoFocus
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="block w-full rounded-[9px] border border-[#E4E9F0] bg-white px-3.5 py-[10px] text-[13.5px] text-[#1B2733] outline-none transition placeholder:text-[#94A0B3] focus:border-[#1B63B0] focus:ring-4 focus:ring-[#1B63B0]/12"
                                    placeholder="Masukkan email admin"
                                />
                                <div className="h-6 pt-1">
                                    {errors.email && <p className="text-[12px] font-medium text-[#C0433D]">{errors.email}</p>}
                                </div>
                            </div>

                            <button type="submit" disabled={processing} className="mt-2 inline-flex w-full items-center justify-center rounded-[10px] bg-[#1B63B0] px-4 py-[10px] text-[13.5px] font-bold text-white shadow-[0_12px_24px_rgba(27,99,176,0.22)] transition duration-150 hover:bg-[#16579b] focus:outline-none focus:ring-4 focus:ring-[#1B63B0]/20 disabled:cursor-not-allowed disabled:opacity-50">
                                Kirim Kode
                            </button>

                            <Link href={route('login')} className="mt-5 block text-center text-[12px] font-semibold text-[#1B63B0] hover:underline">
                                Kembali ke login
                            </Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}