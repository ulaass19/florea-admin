'use client';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import Link from 'next/link';

import AdminLayout from '@/components/admin/AdminLayout';

import {
  getCategories,
  getProducts,
} from '@/lib/api';

import type {
  Category,
  Product,
} from '@/lib/api';

function formatPrice(
  value: number,
) {
  return new Intl.NumberFormat(
    'tr-TR',
    {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0,
    },
  ).format(value);
}

function StatCard({
  title,
  value,
  description,
  icon,
  accent = false,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={[
        'relative overflow-hidden rounded-[26px] border p-6',
        accent
          ? 'border-[#351f28] bg-[#351f28] text-white'
          : 'border-[#ebe4e1] bg-white',
      ].join(' ')}
    >
      {accent && (
        <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-white/[0.06]" />
      )}

      <div className="relative flex items-start justify-between">
        <div>
          <p
            className={[
              'text-sm font-medium',
              accent
                ? 'text-white/55'
                : 'text-[#93898c]',
            ].join(' ')}
          >
            {title}
          </p>

          <p
            className={[
              'mt-3 text-[34px] font-semibold tracking-[-0.05em]',
              accent
                ? 'text-white'
                : 'text-[#33292d]',
            ].join(' ')}
          >
            {value}
          </p>
        </div>

        <div
          className={[
            'flex h-12 w-12 items-center justify-center rounded-2xl',
            accent
              ? 'bg-white/10 text-[#e4c0ad]'
              : 'bg-[#f7f1ee] text-[#9b6e5d]',
          ].join(' ')}
        >
          {icon}
        </div>
      </div>

      <p
        className={[
          'relative mt-4 text-xs',
          accent
            ? 'text-white/40'
            : 'text-[#aaa1a4]',
        ].join(' ')}
      >
        {description}
      </p>
    </div>
  );
}

function CubeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
      <path d="m4 7.5 8 4.5 8-4.5" />
      <path d="M12 12v9" />
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
      <rect
        x="3"
        y="3"
        width="7"
        height="7"
        rx="2"
      />

      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="2"
      />

      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="2"
      />

      <rect
        x="14"
        y="14"
        width="7"
        height="7"
        rx="2"
      />
    </svg>
  );
}

function StockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M10.3 4.3 2.7 18a2 2 0 0 0 1.75 3h15.1a2 2 0 0 0 1.75-3L13.7 4.3a2 2 0 0 0-3.4 0Z" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
      <circle
        cx="12"
        cy="12"
        r="2.5"
      />
    </svg>
  );
}

export default function DashboardPage() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [
          productsResult,
          categoriesResult,
        ] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);

        setProducts(productsResult);
        setCategories(
          categoriesResult,
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Dashboard verileri alınamadı.',
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const stats = useMemo(() => {
    const activeProducts =
      products.filter(
        (product) =>
          product.isActive,
      ).length;

    const lowStockProducts =
      products.filter(
        (product) =>
          product.stockEnabled &&
          product.stockQuantity <= 10,
      );

    const totalStock =
      products.reduce(
        (total, product) =>
          total +
          (product.stockEnabled
            ? product.stockQuantity
            : 0),
        0,
      );

    return {
      activeProducts,
      lowStockProducts,
      totalStock,
    };
  }, [products]);

  const latestProducts =
    products.slice(0, 5);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#dfd3ce] border-t-[#351f28]" />

            <p className="text-sm text-[#958c8f]">
              Mağaza verileri hazırlanıyor...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-8 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a37b69]">
              Genel Bakış
            </p>

            <h2 className="mt-2 text-[32px] font-semibold tracking-[-0.045em] text-[#33292d]">
              Mağazan bugün nasıl?
            </h2>

            <p className="mt-2 text-sm text-[#958c8f]">
              Ürün, stok ve mağaza
              durumunu tek ekrandan takip et.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/categories"
              className="flex h-11 items-center rounded-xl border border-[#e8dfdc] bg-white px-4 text-sm font-semibold text-[#574a4f] transition hover:bg-[#faf7f5]"
            >
              Kategorileri Yönet
            </Link>

            <Link
              href="/products/new"
              className="flex h-11 items-center gap-2 rounded-xl bg-[#351f28] px-5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(53,31,40,0.16)] transition hover:bg-[#482a36]"
            >
              <span className="text-lg font-light">
                +
              </span>

              Yeni Ürün
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Toplam Ürün"
            value={products.length}
            description={`${stats.activeProducts} ürün yayında`}
            accent
            icon={<CubeIcon />}
          />

          <StatCard
            title="Aktif Ürün"
            value={stats.activeProducts}
            description={`${products.length - stats.activeProducts} pasif ürün`}
            icon={<EyeIcon />}
          />

          <StatCard
            title="Kategoriler"
            value={categories.length}
            description="Mağaza ürün grupları"
            icon={<CategoryIcon />}
          />

          <StatCard
            title="Düşük Stok"
            value={
              stats.lowStockProducts
                .length
            }
            description={`${stats.totalStock} adet takip edilen stok`}
            icon={<StockIcon />}
          />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.65fr_1fr]">
          <section className="overflow-hidden rounded-[26px] border border-[#ebe4e1] bg-white">
            <div className="flex items-center justify-between border-b border-[#f0ebe8] px-6 py-5">
              <div>
                <h3 className="text-[17px] font-semibold text-[#3a3034]">
                  Son Eklenen Ürünler
                </h3>

                <p className="mt-1 text-xs text-[#9e9698]">
                  Mağazaya en son eklenen
                  ürünler
                </p>
              </div>

              <Link
                href="/products"
                className="text-sm font-semibold text-[#9b6e5d] transition hover:text-[#351f28]"
              >
                Tümünü Gör →
              </Link>
            </div>

            {latestProducts.length ===
            0 ? (
              <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f7f1ee] text-[#9b6e5d]">
                  <CubeIcon />
                </div>

                <p className="mt-4 font-semibold text-[#43383c]">
                  Henüz ürün yok
                </p>

                <p className="mt-2 text-sm text-[#9d9497]">
                  İlk ürününü ekleyerek
                  mağazanı oluşturmaya başla.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#f2eeec]">
                {latestProducts.map(
                  (product) => {
                    const startingPrice =
                      product.sizes.length >
                      0
                        ? Math.min(
                            ...product.sizes.map(
                              (size) =>
                                size.price,
                            ),
                          )
                        : null;

                    return (
                      <div
                        key={product.id}
                        className="flex items-center gap-4 px-6 py-4 transition hover:bg-[#fcfaf9]"
                      >
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-[#f5f0ed]">
                          {product.heroImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={
                                product.heroImage
                              }
                              alt={
                                product.name
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[#b8aaa5]">
                              <CubeIcon />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-semibold text-[#403539]">
                              {product.name}
                            </p>

                            {product.isFeatured && (
                              <span className="rounded-full bg-[#fff4e8] px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[#ad7148]">
                                Öne Çıkan
                              </span>
                            )}
                          </div>

                          <p className="mt-1 truncate text-xs text-[#9e9598]">
                            {product.categories
                              .map(
                                (category) =>
                                  category.name,
                              )
                              .join(', ') ||
                              'Kategorisiz'}
                          </p>
                        </div>

                        <div className="hidden text-right sm:block">
                          <p className="text-sm font-semibold text-[#3c3236]">
                            {startingPrice !==
                            null
                              ? formatPrice(
                                  startingPrice,
                                )
                              : '—'}
                          </p>

                          <p className="mt-1 text-[11px] text-[#a39a9d]">
                            Başlangıç
                          </p>
                        </div>

                        <div className="hidden w-24 md:block">
                          <span
                            className={[
                              'inline-flex rounded-full px-2.5 py-1.5 text-[10px] font-semibold',
                              product.isActive
                                ? 'bg-[#eef8f1] text-[#4f8560]'
                                : 'bg-[#f5f2f2] text-[#8f8588]',
                            ].join(' ')}
                          >
                            {product.isActive
                              ? 'Yayında'
                              : 'Pasif'}
                          </span>
                        </div>

                        <Link
                          href={`/products/${product.id}`}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#ece5e2] text-[#8f7f84] transition hover:border-[#cbb7ae] hover:bg-[#f8f4f2] hover:text-[#5c414b]"
                        >
                          →
                        </Link>
                      </div>
                    );
                  },
                )}
              </div>
            )}
          </section>

          <section className="rounded-[26px] border border-[#ebe4e1] bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-[17px] font-semibold text-[#3a3034]">
                  Stok Durumu
                </h3>

                <p className="mt-1 text-xs text-[#9e9698]">
                  Kritik stok seviyeleri
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff5ed] text-[#b47b56]">
                <StockIcon />
              </div>
            </div>

            <div className="mt-6">
              {stats.lowStockProducts
                .length === 0 ? (
                <div className="rounded-2xl bg-[#f5faf6] px-5 py-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#5d8d68] shadow-sm">
                    ✓
                  </div>

                  <p className="mt-4 text-sm font-semibold text-[#45654d]">
                    Stoklar iyi görünüyor
                  </p>

                  <p className="mt-2 text-xs leading-5 text-[#7f9685]">
                    Şu anda kritik seviyede
                    stok bulunmuyor.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.lowStockProducts
                    .slice(0, 5)
                    .map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between rounded-2xl bg-[#fcf8f5] px-4 py-4"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[#493d41]">
                            {product.name}
                          </p>

                          <p className="mt-1 text-[11px] text-[#a09699]">
                            Kritik stok
                          </p>
                        </div>

                        <span className="ml-3 rounded-xl bg-white px-3 py-2 text-xs font-bold text-[#b35f4e] shadow-sm">
                          {
                            product.stockQuantity
                          }{' '}
                          adet
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="mt-6 border-t border-[#f0ebe8] pt-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#8e8588]">
                  Takip edilen toplam stok
                </span>

                <strong className="text-[#3c3236]">
                  {stats.totalStock} adet
                </strong>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.65fr_1fr]">
          <section className="rounded-[26px] border border-[#ebe4e1] bg-white p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-[17px] font-semibold text-[#3a3034]">
                  Satış Performansı
                </h3>

                <p className="mt-1 text-xs text-[#9e9698]">
                  Ciro ve sipariş gelişimi
                </p>
              </div>

              <div className="flex rounded-xl bg-[#f7f3f1] p-1">
                <button className="rounded-lg bg-white px-3 py-2 text-[11px] font-semibold text-[#49383f] shadow-sm">
                  7 Gün
                </button>

                <button className="px-3 py-2 text-[11px] font-medium text-[#9b9295]">
                  30 Gün
                </button>
              </div>
            </div>

            <div className="mt-7 flex min-h-[260px] items-center justify-center rounded-[22px] border border-dashed border-[#ded4d0] bg-[#fcfaf9]">
              <div className="max-w-sm px-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#a37b69] shadow-sm">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                  >
                    <path d="M4 19V9" />
                    <path d="M10 19V5" />
                    <path d="M16 19v-7" />
                    <path d="M22 19H2" />
                  </svg>
                </div>

                <p className="mt-4 text-sm font-semibold text-[#493d41]">
                  Satış verileri yakında
                </p>

                <p className="mt-2 text-xs leading-5 text-[#9d9497]">
                  Sipariş altyapısını
                  bağladığımızda günlük ciro
                  ve satış grafiği burada
                  gerçek verilerle oluşacak.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[26px] bg-[#351f28] p-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d6ad9a]">
              Sipariş Merkezi
            </p>

            <h3 className="mt-4 text-2xl font-semibold tracking-[-0.035em]">
              Sipariş yönetimine
              hazırız.
            </h3>

            <p className="mt-3 text-sm leading-6 text-white/50">
              Müşteri, adres, teslimat,
              ödeme ve sipariş durumlarını
              bağladığımızda tüm operasyon
              buradan yönetilecek.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/[0.07] p-4">
                <p className="text-2xl font-semibold">
                  —
                </p>

                <p className="mt-2 text-xs text-white/40">
                  Bugünkü Sipariş
                </p>
              </div>

              <div className="rounded-2xl bg-white/[0.07] p-4">
                <p className="text-2xl font-semibold">
                  —
                </p>

                <p className="mt-2 text-xs text-white/40">
                  Bugünkü Ciro
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 px-4 py-4 text-xs leading-5 text-white/40">
              Sipariş modülü henüz
              backend'e eklenmediği için
              burada sahte satış verisi
              göstermiyoruz.
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}