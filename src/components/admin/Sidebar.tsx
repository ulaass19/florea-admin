'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

type SidebarProps = {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
};

type MenuItem = {
  name: string;
  href: string;
  icon: ReactNode;
};

function DashboardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
    </svg>
  );
}

function ProductIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="M6 8.5 12 5l6 3.5v7L12 19l-6-3.5v-7Z" />
      <path d="m6.5 8.5 5.5 3 5.5-3" />
      <path d="M12 11.5V19" />
    </svg>
  );
}

function BalloonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M12 3.5c-3.5 0-6 2.7-6 6.2 0 4.1 3.1 7.2 6 8.3 2.9-1.1 6-4.2 6-8.3 0-3.5-2.5-6.2-6-6.2Z" />
      <path d="M10.5 18h3L12 20l-1.5-2Z" />
      <path d="M12 20c.2 1.1 1.3 1.3 1.3 2.2" />
    </svg>
  );
}

function CollectionIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <rect
        x="4"
        y="4"
        width="12"
        height="12"
        rx="2.5"
      />

      <path d="M8 8h4" />
      <path d="M8 12h4" />

      <path d="M8 20h9a3 3 0 0 0 3-3V8" />
    </svg>
  );
}

function CategoryIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <rect x="3" y="4" width="7" height="7" rx="2" />
      <rect x="14" y="4" width="7" height="7" rx="2" />
      <rect x="3" y="15" width="7" height="5" rx="2" />
      <rect x="14" y="15" width="7" height="5" rx="2" />
    </svg>
  );
}

function OrderIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="M6 3h12v18H6z" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21h-4v-.08A1.7 1.7 0 0 0 8.97 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.52-1H3v-4h.08A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 8.97 4.6 1.7 1.7 0 0 0 10 3.08V3h4v.08a1.7 1.7 0 0 0 1.03 1.52 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.14.6.68 1 1.52 1H21v4h-.08c-.84 0-1.38.4-1.52 1Z" />
    </svg>
  );
}

const menuItems: MenuItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: <DashboardIcon />,
  },
  {
    name: 'Ürünler',
    href: '/products',
    icon: <ProductIcon />,
  },
  {
    name: 'Balonlar',
    href: '/balloons',
    icon: <BalloonIcon />,
  },
  {
    name: 'Koleksiyonlar',
    href: '/collections',
    icon: <CollectionIcon />,
  },
  {
    name: 'Kategoriler',
    href: '/categories',
    icon: <CategoryIcon />,
  },
  {
    name: 'Siparişler',
    href: '/orders',
    icon: <OrderIcon />,
  },
];

export default function Sidebar({
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }

    return pathname.startsWith(href);
  }

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Menüyü kapat"
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <aside
        className={[
          'fixed left-0 top-0 z-50 flex h-screen w-[270px] flex-col',
          'bg-[#351f28] text-white',
          'transition-transform duration-300',
          'lg:translate-x-0',
          mobileOpen
            ? 'translate-x-0'
            : '-translate-x-full',
        ].join(' ')}
      >
        <div className="flex h-[88px] items-center border-b border-white/10 px-7">
          <Link
            href="/dashboard"
            onClick={onMobileClose}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
              <span className="text-xl text-[#e0bca9]">
                ✦
              </span>
            </div>

            <div>
              <p className="text-[17px] font-semibold tracking-[0.18em]">
                FLOREA
              </p>

              <p className="mt-0.5 text-[10px] tracking-[0.2em] text-white/40">
                ADMIN PANEL
              </p>
            </div>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-7">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/30">
            Yönetim
          </p>

          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const active =
                isActive(
                  item.href,
                );

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onMobileClose}
                  className={[
                    'group flex h-[50px] items-center gap-3 rounded-2xl px-4',
                    'text-sm font-medium transition-all duration-200',
                    active
                      ? 'bg-white text-[#351f28] shadow-lg'
                      : 'text-white/60 hover:bg-white/8 hover:text-white',
                  ].join(' ')}
                >
                  <span
                    className={
                      active
                        ? 'text-[#9b6e5d]'
                        : 'text-white/45 transition group-hover:text-white'
                    }
                  >
                    {item.icon}
                  </span>

                  {item.name}

                  {item.name ===
                    'Siparişler' && (
                    <span className="ml-auto rounded-full bg-[#e0bca9]/15 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-[#e0bca9]">
                      Yakında
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="my-7 h-px bg-white/10" />

          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/30">
            Sistem
          </p>

          <Link
            href="/settings"
            onClick={onMobileClose}
            className={[
              'flex h-[50px] items-center gap-3 rounded-2xl px-4',
              'text-sm font-medium transition-all',
              isActive('/settings')
                ? 'bg-white text-[#351f28]'
                : 'text-white/60 hover:bg-white/8 hover:text-white',
            ].join(' ')}
          >
            <SettingsIcon />
            Ayarlar
          </Link>
        </div>

        <div className="border-t border-white/10 p-5">
          <div className="rounded-2xl bg-white/[0.06] px-4 py-4">
            <p className="text-xs font-medium text-white/70">
              Florea Yönetim
            </p>

            <p className="mt-1 text-[11px] leading-5 text-white/35">
              Ürün, balon, koleksiyon, kategori ve sipariş yönetim merkezi.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}