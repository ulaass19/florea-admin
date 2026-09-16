'use client';

import {
  FormEvent,
  useState,
} from 'react';

import { useRouter } from 'next/navigation';

import {
  loginAdmin,
} from '@/lib/api';

import {
  saveAuth,
} from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError('');
    setLoading(true);

    try {
      const result =
        await loginAdmin(
          email,
          password,
        );

      saveAuth(
        result.accessToken,
        result.user,
      );

      router.replace(
        '/dashboard',
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Giriş yapılamadı.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f5f1] p-4 sm:p-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1500px] overflow-hidden rounded-[32px] bg-white shadow-[0_30px_100px_rgba(31,24,20,0.10)] sm:min-h-[calc(100vh-3rem)]">
        <section className="relative hidden w-[54%] overflow-hidden bg-[#351f28] p-14 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -left-24 top-1/3 h-80 w-80 rounded-full bg-[#b88d79]/20 blur-3xl" />

          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[#d9b8a5]/20 blur-3xl" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10">
                <span className="text-xl text-[#f0d9cd]">
                  ✦
                </span>
              </div>

              <div>
                <p className="text-lg font-semibold tracking-[0.18em] text-white">
                  FLOREA
                </p>

                <p className="text-xs tracking-[0.16em] text-white/50">
                  ADMIN
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 max-w-xl">
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.28em] text-[#d9b8a5]">
              Yönetim Merkezi
            </p>

            <h1 className="text-5xl font-medium leading-[1.08] tracking-[-0.04em] text-white xl:text-6xl">
              Her buketin
              <br />
              arkasındaki
              <br />

              <span className="font-serif italic text-[#d9b8a5]">
                zarafeti yönetin.
              </span>
            </h1>

            <p className="mt-7 max-w-md text-base leading-7 text-white/55">
              Ürünlerinizi, kategorilerinizi,
              stoklarınızı ve siparişlerinizi
              tek bir merkezden yönetin.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3 text-sm text-white/35">
            <span className="h-px w-10 bg-white/20" />

            Florea Yönetim Paneli
          </div>
        </section>

        <section className="flex flex-1 items-center justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-24">
          <div className="w-full max-w-[430px]">
            <div className="mb-10 lg:hidden">
              <p className="text-lg font-bold tracking-[0.18em] text-[#351f28]">
                FLOREA
              </p>

              <p className="mt-1 text-xs tracking-[0.18em] text-[#9c8277]">
                ADMIN
              </p>
            </div>

            <div className="mb-9">
              <p className="mb-3 text-sm font-semibold text-[#a37b69]">
                Tekrar hoş geldiniz
              </p>

              <h2 className="text-[36px] font-semibold tracking-[-0.04em] text-[#2d2528]">
                Yönetim paneline giriş
              </h2>

              <p className="mt-3 text-[15px] leading-6 text-[#8c8587]">
                Devam etmek için yönetici
                hesabınızla giriş yapın.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-[#443a3d]"
                >
                  E-posta adresi
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value,
                    )
                  }
                  placeholder="admin@florea.com"
                  required
                  className="h-14 w-full rounded-2xl border border-[#e7dfdc] bg-[#fcfaf9] px-4 text-[15px] text-[#332b2e] outline-none transition placeholder:text-[#bbb0ac] focus:border-[#a77e6d] focus:bg-white focus:ring-4 focus:ring-[#a77e6d]/10"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-[#443a3d]"
                  >
                    Şifre
                  </label>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value,
                      )
                    }
                    placeholder="••••••••••"
                    required
                    className="h-14 w-full rounded-2xl border border-[#e7dfdc] bg-[#fcfaf9] px-4 pr-20 text-[15px] text-[#332b2e] outline-none transition placeholder:text-[#bbb0ac] focus:border-[#a77e6d] focus:bg-white focus:ring-4 focus:ring-[#a77e6d]/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (value) =>
                          !value,
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[#9a786a] transition hover:text-[#5b3b46]"
                  >
                    {showPassword
                      ? 'Gizle'
                      : 'Göster'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex h-14 w-full items-center justify-center rounded-2xl bg-[#351f28] text-[15px] font-semibold text-white shadow-[0_12px_30px_rgba(53,31,40,0.18)] transition hover:bg-[#482a36] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? 'Giriş yapılıyor...'
                  : 'Giriş Yap'}
              </button>
            </form>

            <div className="mt-9 border-t border-[#eee8e5] pt-6">
              <div className="flex items-center gap-2 text-xs text-[#a0999b]">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f4efec] text-[#8d6b5e]">
                  ✓
                </span>

                Güvenli yönetici erişimi
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}