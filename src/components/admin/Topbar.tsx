'use client';

import {
  useEffect,
  useState,
} from 'react';

import {
  usePathname,
  useRouter,
} from 'next/navigation';

import type { AdminUser } from '@/types/auth';

import {
  clearAuth,
  getUser,
} from '@/lib/auth';

type TopbarProps = {
  onMenuClick: () => void;
  title?: string;
};

function getPageTitle(pathname: string) {
  if (pathname.startsWith('/products')) {
    return 'Ürünler';
  }

  if (pathname.startsWith('/categories')) {
    return 'Kategoriler';
  }

  if (pathname.startsWith('/balloons')) {
    return 'Balonlar';
  }

  if (pathname.startsWith('/collections')) {
    return 'Koleksiyonlar';
  }

  if (pathname.startsWith('/orders')) {
    return 'Siparişler';
  }

  if (pathname.startsWith('/settings')) {
    return 'Ayarlar';
  }

  return 'Dashboard';
}

export default function Topbar({
  onMenuClick,
  title,
}: TopbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] =
    useState<AdminUser | null>(null);

  const [menuOpen, setMenuOpen] =
    useState(false);

  useEffect(() => {
    setUser(getUser());
  }, []);

  function logout() {
    clearAuth();
    router.replace('/login');
  }

  const initials =
    user?.name
      ?.split(' ')
      .map((item: string) => item[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ?? 'A';

  const pageTitle =
    title ?? getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-[88px] items-center justify-between border-b border-[#eee8e5] bg-white/90 px-5 backdrop-blur-xl sm:px-8">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#ebe4e1] text-[#5b4d52] transition hover:bg-[#f8f5f1] lg:hidden"
          aria-label="Menüyü aç"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>

        <div>
          <h1 className="text-xl font-semibold tracking-[-0.03em] text-[#33292d] sm:text-[23px]">
            {pageTitle}
          </h1>

          <p className="mt-1 hidden text-xs text-[#9b9295] sm:block">
            Florea yönetim merkezine hoş geldiniz.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="relative hidden h-11 w-11 items-center justify-center rounded-xl border border-[#ebe4e1] text-[#76696d] transition hover:bg-[#f8f5f1] sm:flex"
          aria-label="Bildirimler"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
          >
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
            <path d="M10 21h4" />
          </svg>

          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#b77b69] ring-2 ring-white" />
        </button>

        <div className="mx-1 hidden h-8 w-px bg-[#eee8e5] sm:block" />

        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setMenuOpen((value) => !value)
            }
            className="flex items-center gap-3 rounded-2xl p-1.5 pr-2 transition hover:bg-[#f8f5f1]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#351f28] text-xs font-semibold text-white">
              {initials}
            </div>

            <div className="hidden text-left md:block">
              <p className="max-w-[150px] truncate text-sm font-semibold text-[#3d3337]">
                {user?.name ?? 'Admin'}
              </p>

              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#a37b69]">
                {user?.role === 'SUPER_ADMIN'
                  ? 'Super Admin'
                  : user?.role ?? 'Admin'}
              </p>
            </div>

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={[
                'hidden h-4 w-4 text-[#9b9295] transition md:block',
                menuOpen ? 'rotate-180' : '',
              ].join(' ')}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-[58px] w-64 overflow-hidden rounded-2xl border border-[#ebe4e1] bg-white p-2 shadow-[0_18px_60px_rgba(45,32,37,0.14)]">
              <div className="border-b border-[#f0ebe8] px-3 py-3">
                <p className="truncate text-sm font-semibold text-[#382e32]">
                  {user?.name ?? 'Admin'}
                </p>

                <p className="mt-1 truncate text-xs text-[#978e91]">
                  {user?.email ?? ''}
                </p>
              </div>

              <button
                type="button"
                onClick={logout}
                className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-[#9e4f4f] transition hover:bg-[#fff4f4]"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                >
                  <path d="M10 17l5-5-5-5" />
                  <path d="M15 12H3" />
                  <path d="M14 3h7v18h-7" />
                </svg>

                Çıkış Yap
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}