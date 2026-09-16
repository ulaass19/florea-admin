'use client';

import {
  ReactNode,
  useEffect,
  useState,
} from 'react';

import { useRouter } from 'next/navigation';

import {
  getToken,
  getUser,
} from '@/lib/auth';

import Sidebar from './Sidebar';
import Topbar from './Topbar';

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  const router = useRouter();

  const [ready, setReady] =
    useState(false);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  useEffect(() => {
    const token = getToken();
    const user = getUser();

    if (!token || !user) {
      router.replace('/login');
      return;
    }

    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f5f1]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#d8c7bf] border-t-[#351f28]" />

          <p className="text-sm text-[#8c8587]">
            Panel hazırlanıyor...
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5f1]">
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() =>
          setMobileOpen(false)
        }
      />

      <div className="min-h-screen lg:pl-[270px]">
        <Topbar
          onMenuClick={() =>
            setMobileOpen(true)
          }
        />

        <main className="p-5 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}