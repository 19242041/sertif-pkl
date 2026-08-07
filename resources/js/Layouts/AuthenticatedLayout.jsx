import { Link, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const navigationItems = [
    { label: 'Dashboard', href: route('dashboard'), routeName: 'dashboard' },
    { label: 'Data Peserta PKL', href: route('peserta-pkl.index'), routeName: 'peserta-pkl.*' },
    { label: 'Terbitkan Sertifikat', href: route('sertifikat.index'), routeName: 'sertifikat.index' },
    { label: 'Kelola Sertifikat', href: route('sertifikat.template'), routeName: 'sertifikat.template' },
    { label: 'Laporan', href: route('laporan.index'), routeName: 'laporan.*' },
    { label: 'Pengaturan', href: route('pengaturan.edit'), routeName: 'pengaturan.*' },
];

export default function AuthenticatedLayout({ breadcrumbs = [], children }) {
    const user = usePage().props.auth.user;
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const activeLabel = useMemo(() => {
        if (!breadcrumbs.length) {
            return 'Dashboard';
        }

        return breadcrumbs[breadcrumbs.length - 1].label;
    }, [breadcrumbs]);

    return (
        <div className="min-h-screen bg-[#F4F6F9] text-[#1B2733]">
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-[280px] flex-col border-r border-white/10 bg-[linear-gradient(180deg,#0E2A47_0%,#081B30_100%)] text-white shadow-[10px_0_30px_rgba(8,27,48,0.18)] lg:flex">
                <div className="border-b border-white/10 px-6 py-5">
                    <Link href={route('dashboard')} className="flex items-center gap-3">
                        <img
                            src="/images/logo-disnakertrans.png"
                            alt="Logo Disnakertrans"
                            className="h-11 w-auto object-contain"
                        />
                        <div>
                            <p className="font-display text-[24px] font-extrabold tracking-[0.08em] text-white">
                                SIMPATIK
                            </p>
                            <p className="mt-1 max-w-[190px] text-[11px] leading-4 text-white/65">
                                Sistem pencatatan peserta PKL dan arsip sertifikat.
                            </p>
                        </div>
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-5">
                    <div className="space-y-2">
                        {navigationItems.map((item) => {
                            const isActive = route().current(item.routeName);

                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={[
                                        'flex items-center rounded-2xl px-4 py-3 text-[13.5px] font-semibold transition',
                                        isActive
                                            ? 'bg-[#1B63B0] text-white shadow-[0_10px_24px_rgba(27,99,176,0.28)]'
                                            : 'text-white/78 hover:bg-white/8 hover:text-white',
                                    ].join(' ')}
                                >
                                    <span className="h-2.5 w-2.5 rounded-full bg-current opacity-70" />
                                    <span className="ms-3">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                <div className="border-t border-white/10 p-4">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex w-full items-center rounded-2xl px-4 py-3 text-left text-[13.5px] font-semibold text-[#FBEAE9] transition hover:bg-white/8"
                    >
                        <span className="h-2.5 w-2.5 rounded-full bg-[#C0433D]" />
                        <span className="ms-3">Logout</span>
                    </Link>
                </div>
            </aside>

            <div className="lg:pl-[280px]">
                <header className="sticky top-0 z-30 border-b border-[#E4E9F0] bg-white/92 backdrop-blur-xl">
                    <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                        <div>
                            <div className="text-[11.5px] font-medium uppercase tracking-[0.12em] text-[#94A0B3]">
                                {breadcrumbs.length ? breadcrumbs.map((crumb) => crumb.label).join(' / ') : activeLabel}
                            </div>
                            <div className="mt-1 font-display text-[20px] font-extrabold text-[#0E2A47]">
                                SIMPATIK
                            </div>
                        </div>

                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setShowMobileMenu((current) => !current)}
                                className="flex items-center gap-3 rounded-2xl border border-[#E4E9F0] bg-white px-3.5 py-2.5 text-left shadow-sm transition hover:border-[#C9D3E0]"
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F1FB] text-[13px] font-bold text-[#1B63B0]">
                                    {user.name?.charAt(0)?.toUpperCase()}
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-[13px] font-semibold text-[#1B2733]">{user.name}</p>
                                    <p className="text-[11.5px] text-[#657085]">{user.email}</p>
                                </div>
                                <svg className="h-4 w-4 text-[#657085]" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>

                            {showMobileMenu && (
                                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-[#E4E9F0] bg-white shadow-[0_20px_50px_rgba(8,27,48,0.12)]">
                                    <div className="border-b border-[#E4E9F0] px-4 py-3">
                                        <div className="text-[13px] font-semibold text-[#1B2733]">{user.name}</div>
                                        <div className="text-[11.5px] text-[#657085]">{user.email}</div>
                                    </div>
                                    <Link
                                        href={route('pengaturan.edit')}
                                        className="block px-4 py-3 text-[13px] text-[#1B2733] transition hover:bg-[#F7F9FC]"
                                    >
                                        Pengaturan
                                    </Link>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="block w-full px-4 py-3 text-left text-[13px] text-[#C0433D] transition hover:bg-[#FBEAE9]"
                                    >
                                        Logout
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
            </div>
        </div>
    );
}