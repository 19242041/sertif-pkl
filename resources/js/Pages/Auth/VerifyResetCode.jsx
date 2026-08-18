import { Head, Link, router, useForm } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function VerifyResetCode({ email = '', status, resendAvailableIn = 0 }) {
    const [digits, setDigits] = useState(Array(6).fill(''));
    const [cooldown, setCooldown] = useState(resendAvailableIn);
    const inputsRef = useRef([]);

    const { data, setData, post, processing, errors } = useForm({
        email,
        code: '',
    });

    useEffect(() => {
        setData('email', email);
    }, [email, setData]);

    useEffect(() => {
        setCooldown(resendAvailableIn);
    }, [resendAvailableIn]);

    useEffect(() => {
        if (cooldown <= 0) return undefined;

        const timer = window.setInterval(() => {
            setCooldown((current) => Math.max(0, current - 1));
        }, 1000);

        return () => window.clearInterval(timer);
    }, [cooldown]);

    const codeValue = useMemo(() => digits.join(''), [digits]);

    useEffect(() => {
        setData('code', codeValue);
    }, [codeValue, setData]);

    const focusInput = (index) => {
        inputsRef.current[index]?.focus();
    };

    const updateDigit = (index, value) => {
        const next = [...digits];
        next[index] = value.replace(/\D/g, '').slice(-1);
        setDigits(next);

        if (next[index] && index < 5) {
            focusInput(index + 1);
        }
    };

    const handleKeyDown = (index, event) => {
        if (event.key === 'Backspace' && !digits[index] && index > 0) {
            focusInput(index - 1);
        }
    };

    const handlePaste = (event) => {
        event.preventDefault();
        const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (!pasted) return;

        const next = Array(6).fill('');
        pasted.split('').forEach((char, index) => {
            next[index] = char;
        });
        setDigits(next);
        focusInput(Math.min(pasted.length, 6) - 1);
    };

    const submit = (event) => {
        event.preventDefault();

        post(route('password.code.check'));
    };

    const resend = () => {
        if (cooldown > 0) return;

        router.post(route('password.email.resend'), { email }, {
            preserveScroll: true,
            onSuccess: () => {
                setCooldown(30);
            },
        });
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#0E2A47_0%,#081B30_100%)] px-4 py-6 text-[#FFFFFF] sm:px-6 lg:px-8">
            <Head title="Verifikasi Kode" />

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
                            Masukkan kode 6 digit yang dikirim ke email Anda.
                        </h1>
                        <p className="mt-4 max-w-[520px] text-[14.5px] leading-6 text-white/72">
                            Kode hanya berlaku satu kali dan akan kedaluwarsa setelah 10 menit.
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
                                Verifikasi Kode
                            </h2>
                            <p className="mt-1.5 max-w-xs text-[13px] leading-5 text-[#FFFFFF]">
                                Kode dikirim ke email yang terdaftar <span className="font-semibold text-[#1B2733]">{email || '-'}</span>
                            </p>
                        </div>

                        {status && (
                            <div className="mt-5 rounded-2xl border border-[#C7E8D1] bg-[#E7F5EC] px-3.5 py-2.5 text-sm font-medium text-[#2E8B4E]">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="mt-6">
                            <input type="hidden" value={data.email} onChange={() => {}} />

                            <div className="mb-2.5 text-[12px] font-bold uppercase tracking-[0.08em] text-[#1B2733]">Masukkan 6 digit kode</div>
                            <div className="grid grid-cols-6 gap-2.5" onPaste={handlePaste}>
                                {digits.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(element) => {
                                            inputsRef.current[index] = element;
                                        }}
                                        value={digit}
                                        maxLength={1}
                                        inputMode="numeric"
                                        onChange={(e) => updateDigit(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="h-12 rounded-[10px] border border-[#E4E9F0] bg-white text-center text-[18px] font-extrabold text-[#0E2A47] outline-none transition focus:border-[#1B63B0] focus:ring-4 focus:ring-[#1B63B0]/12"
                                    />
                                ))}
                            </div>

                            {errors.code && <p className="mt-2 text-[12px] font-medium text-[#C0433D]">{errors.code}</p>}
                            {errors.email && <p className="mt-2 text-[12px] font-medium text-[#C0433D]">{errors.email}</p>}

                            <button type="submit" disabled={processing || codeValue.length !== 6} className="mt-5 inline-flex w-full items-center justify-center rounded-[10px] bg-[#1B63B0] px-4 py-[10px] text-[13.5px] font-bold text-white shadow-[0_12px_24px_rgba(27,99,176,0.22)] transition duration-150 hover:bg-[#16579b] focus:outline-none focus:ring-4 focus:ring-[#1B63B0]/20 disabled:cursor-not-allowed disabled:opacity-50">
                                Verifikasi
                            </button>

                            <button type="button" onClick={resend} disabled={cooldown > 0} className="mt-3 inline-flex w-full items-center justify-center rounded-[10px] border border-[#E4E9F0] bg-white px-4 py-[10px] text-[13.5px] font-bold text-[#1B2733] transition hover:bg-[#F7F9FC] disabled:cursor-not-allowed disabled:opacity-50">
                                {cooldown > 0 ? `Kirim ulang kode (${cooldown}s)` : 'Kirim ulang kode'}
                            </button>

                            <Link href={route('password.request', { email })} className="mt-5 block text-center text-[12px] font-semibold text-[#1B63B0] hover:underline">
                                Ganti email
                            </Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}