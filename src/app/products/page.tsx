'use client';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import Link from 'next/link';

import AdminLayout from '@/components/admin/AdminLayout';

import {
  deleteProduct,
  getCategories,
  getProducts,
} from '@/lib/api';

import type {
  Category,
  Product,
} from '@/lib/api';

type StatusFilter =
  | 'ALL'
  | 'ACTIVE'
  | 'PASSIVE'
  | 'FEATURED'
  | 'LOW_STOCK';

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <circle
        cx="11"
        cy="11"
        r="7"
      />

      <path d="m20 20-4-4" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
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
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
      <path d="m4 7.5 8 4.5 8-4.5" />
      <path d="M12 12v9" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <path d="M12 20h9" />

      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 15H6L5 6" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </svg>
  );
}

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

function getStartingPrice(
  product: Product,
) {
  const activeSizes =
    product.sizes.filter(
      (size) => size.isActive,
    );

  if (
    activeSizes.length === 0
  ) {
    return null;
  }

  return Math.min(
    ...activeSizes.map(
      (size) => size.price,
    ),
  );
}

function getStockStatus(
  product: Product,
) {
  if (!product.stockEnabled) {
    return {
      label: 'Takip edilmiyor',
      className:
        'bg-[#f4f1f1] text-[#8d8386]',
    };
  }

  if (
    product.stockQuantity === 0
  ) {
    return {
      label: 'Tükendi',
      className:
        'bg-[#fff0f0] text-[#b45e5e]',
    };
  }

  if (
    product.stockQuantity <= 10
  ) {
    return {
      label: `${product.stockQuantity} adet`,
      className:
        'bg-[#fff5e9] text-[#b3794e]',
    };
  }

  return {
    label: `${product.stockQuantity} adet`,
    className:
      'bg-[#eef8f1] text-[#51815e]',
  };
}

export default function ProductsPage() {
  const [
    products,
    setProducts,
  ] = useState<Product[]>([]);

  const [
    categories,
    setCategories,
  ] = useState<Category[]>([]);

  const [
    search,
    setSearch,
  ] = useState('');

  const [
    categoryFilter,
    setCategoryFilter,
  ] = useState('ALL');

  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState<StatusFilter>(
      'ALL',
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState('');

  const [
    productToDelete,
    setProductToDelete,
  ] =
    useState<Product | null>(
      null,
    );

  const [
    deleting,
    setDeleting,
  ] = useState(false);

  async function loadData() {
    try {
      setError('');

      const [
        productsResult,
        categoriesResult,
      ] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);

      setProducts(
        productsResult,
      );

      setCategories(
        categoriesResult,
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Ürünler alınamadı.',
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredProducts =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLocaleLowerCase(
            'tr-TR',
          );

      return products.filter(
        (product) => {
          const matchesSearch =
            !normalizedSearch ||
            product.name
              .toLocaleLowerCase(
                'tr-TR',
              )
              .includes(
                normalizedSearch,
              ) ||
            product.slug
              .toLocaleLowerCase(
                'tr-TR',
              )
              .includes(
                normalizedSearch,
              ) ||
            product.flowerName
              ?.toLocaleLowerCase(
                'tr-TR',
              )
              .includes(
                normalizedSearch,
              );

          const matchesCategory =
            categoryFilter ===
              'ALL' ||
            product.categories.some(
              (category) =>
                category.id ===
                categoryFilter,
            );

          let matchesStatus =
            true;

          if (
            statusFilter ===
            'ACTIVE'
          ) {
            matchesStatus =
              product.isActive;
          }

          if (
            statusFilter ===
            'PASSIVE'
          ) {
            matchesStatus =
              !product.isActive;
          }

          if (
            statusFilter ===
            'FEATURED'
          ) {
            matchesStatus =
              product.isFeatured;
          }

          if (
            statusFilter ===
            'LOW_STOCK'
          ) {
            matchesStatus =
              product.stockEnabled &&
              product.stockQuantity <=
                10;
          }

          return (
            matchesSearch &&
            matchesCategory &&
            matchesStatus
          );
        },
      );
    }, [
      products,
      search,
      categoryFilter,
      statusFilter,
    ]);

  const stats = useMemo(
    () => ({
      total: products.length,

      active:
        products.filter(
          (product) =>
            product.isActive,
        ).length,

      passive:
        products.filter(
          (product) =>
            !product.isActive,
        ).length,

      lowStock:
        products.filter(
          (product) =>
            product.stockEnabled &&
            product.stockQuantity <=
              10,
        ).length,
    }),
    [products],
  );

  async function confirmDelete() {
    if (!productToDelete) {
      return;
    }

    try {
      setDeleting(true);
      setError('');

      await deleteProduct(
        productToDelete.id,
      );

      setProducts(
        (current) =>
          current.filter(
            (product) =>
              product.id !==
              productToDelete.id,
          ),
      );

      setProductToDelete(
        null,
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Ürün silinemedi.',
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AdminLayout>
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a37b69]">
              Katalog Yönetimi
            </p>

            <h2 className="mt-2 text-[32px] font-semibold tracking-[-0.045em] text-[#33292d]">
              Ürünler
            </h2>

            <p className="mt-2 text-sm text-[#958c8f]">
              Mağazada satışa
              sunduğunuz tüm ürünleri
              buradan yönetin.
            </p>
          </div>

          <Link
            href="/products/new"
            className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#351f28] px-5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(53,31,40,0.18)] transition hover:-translate-y-0.5 hover:bg-[#482a36]"
          >
            <span className="text-xl font-light leading-none">
              +
            </span>

            Yeni Ürün Ekle
          </Link>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <button
            type="button"
            onClick={() =>
              setStatusFilter(
                'ALL',
              )
            }
            className={[
              'rounded-[22px] border p-5 text-left transition',
              statusFilter ===
              'ALL'
                ? 'border-[#351f28] bg-[#351f28] text-white'
                : 'border-[#ebe4e1] bg-white text-[#33292d] hover:border-[#d7c8c2]',
            ].join(' ')}
          >
            <p
              className={[
                'text-xs font-medium',
                statusFilter ===
                'ALL'
                  ? 'text-white/50'
                  : 'text-[#9b9295]',
              ].join(' ')}
            >
              Toplam Ürün
            </p>

            <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
              {stats.total}
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              setStatusFilter(
                'ACTIVE',
              )
            }
            className={[
              'rounded-[22px] border p-5 text-left transition',
              statusFilter ===
              'ACTIVE'
                ? 'border-[#567760] bg-[#567760] text-white'
                : 'border-[#ebe4e1] bg-white text-[#33292d] hover:border-[#c8d8cd]',
            ].join(' ')}
          >
            <p
              className={[
                'text-xs font-medium',
                statusFilter ===
                'ACTIVE'
                  ? 'text-white/60'
                  : 'text-[#9b9295]',
              ].join(' ')}
            >
              Yayındaki Ürün
            </p>

            <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
              {stats.active}
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              setStatusFilter(
                'PASSIVE',
              )
            }
            className={[
              'rounded-[22px] border p-5 text-left transition',
              statusFilter ===
              'PASSIVE'
                ? 'border-[#786d70] bg-[#786d70] text-white'
                : 'border-[#ebe4e1] bg-white text-[#33292d] hover:border-[#d7cdcf]',
            ].join(' ')}
          >
            <p
              className={[
                'text-xs font-medium',
                statusFilter ===
                'PASSIVE'
                  ? 'text-white/60'
                  : 'text-[#9b9295]',
              ].join(' ')}
            >
              Pasif Ürün
            </p>

            <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
              {stats.passive}
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              setStatusFilter(
                'LOW_STOCK',
              )
            }
            className={[
              'rounded-[22px] border p-5 text-left transition',
              statusFilter ===
              'LOW_STOCK'
                ? 'border-[#a87351] bg-[#a87351] text-white'
                : 'border-[#ebe4e1] bg-white text-[#33292d] hover:border-[#dfc6b4]',
            ].join(' ')}
          >
            <p
              className={[
                'text-xs font-medium',
                statusFilter ===
                'LOW_STOCK'
                  ? 'text-white/60'
                  : 'text-[#9b9295]',
              ].join(' ')}
            >
              Kritik Stok
            </p>

            <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
              {stats.lowStock}
            </p>
          </button>
        </div>

        {error && (
          <div className="mt-5 flex items-center justify-between rounded-2xl border border-red-100 bg-red-50 px-5 py-4">
            <p className="text-sm text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                setError('')
              }
              className="text-red-500"
            >
              <CloseIcon />
            </button>
          </div>
        )}

        <section className="mt-6 overflow-hidden rounded-[26px] border border-[#ebe4e1] bg-white">
          <div className="flex flex-col gap-4 border-b border-[#eee8e5] p-5 xl:flex-row xl:items-center">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#a69da0]">
                <SearchIcon />
              </div>

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder="Ürün adı, çiçek veya slug ara..."
                className="h-12 w-full rounded-2xl border border-[#e9e2df] bg-[#fcfaf9] pl-12 pr-4 text-sm text-[#3f3438] outline-none transition placeholder:text-[#aaa1a4] focus:border-[#b99d90] focus:bg-white focus:ring-4 focus:ring-[#b99d90]/10"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9b9295]">
                  <FilterIcon />
                </div>

                <select
                  value={
                    categoryFilter
                  }
                  onChange={(
                    event,
                  ) =>
                    setCategoryFilter(
                      event.target
                        .value,
                    )
                  }
                  className="h-12 min-w-[190px] appearance-none rounded-2xl border border-[#e9e2df] bg-white pl-12 pr-10 text-sm font-medium text-[#574b4f] outline-none transition focus:border-[#b99d90]"
                >
                  <option value="ALL">
                    Tüm Kategoriler
                  </option>

                  {categories.map(
                    (category) => (
                      <option
                        key={
                          category.id
                        }
                        value={
                          category.id
                        }
                      >
                        {
                          category.name
                        }
                      </option>
                    ),
                  )}
                </select>

                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#a69da0]">
                  ▼
                </span>
              </div>

              <select
                value={statusFilter}
                onChange={(
                  event,
                ) =>
                  setStatusFilter(
                    event.target
                      .value as StatusFilter,
                  )
                }
                className="h-12 min-w-[170px] rounded-2xl border border-[#e9e2df] bg-white px-4 text-sm font-medium text-[#574b4f] outline-none transition focus:border-[#b99d90]"
              >
                <option value="ALL">
                  Tüm Durumlar
                </option>

                <option value="ACTIVE">
                  Yayında
                </option>

                <option value="PASSIVE">
                  Pasif
                </option>

                <option value="FEATURED">
                  Öne Çıkan
                </option>

                <option value="LOW_STOCK">
                  Kritik Stok
                </option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-[#f0ebe8] px-6 py-4">
            <p className="text-sm text-[#8f8588]">
              <strong className="font-semibold text-[#41363a]">
                {
                  filteredProducts.length
                }
              </strong>{' '}
              ürün gösteriliyor
            </p>

            {(search ||
              categoryFilter !==
                'ALL' ||
              statusFilter !==
                'ALL') && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setCategoryFilter(
                    'ALL',
                  );
                  setStatusFilter(
                    'ALL',
                  );
                }}
                className="text-xs font-semibold text-[#a06f5d] hover:text-[#351f28]"
              >
                Filtreleri Temizle
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex min-h-[380px] items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#ded2cd] border-t-[#351f28]" />

                <p className="text-sm text-[#958c8f]">
                  Ürünler
                  yükleniyor...
                </p>
              </div>
            </div>
          ) : filteredProducts.length ===
            0 ? (
            <div className="flex min-h-[380px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#f7f1ee] text-[#9b6e5d]">
                <ProductIcon />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-[#403539]">
                Ürün bulunamadı
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-[#9b9295]">
                Arama veya filtre
                kriterlerinize uygun
                ürün bulunamadı.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px]">
                <thead>
                  <tr className="bg-[#fcfaf9] text-left">
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9c9396]">
                      Ürün
                    </th>

                    <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9c9396]">
                      Kategori
                    </th>

                    <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9c9396]">
                      Fiyat
                    </th>

                    <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9c9396]">
                      Stok
                    </th>

                    <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9c9396]">
                      Durum
                    </th>

                    <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9c9396]">
                      Özellik
                    </th>

                    <th className="px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9c9396]">
                      İşlem
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#f1ecea]">
                  {filteredProducts.map(
                    (product) => {
                      const price =
                        getStartingPrice(
                          product,
                        );

                      const stock =
                        getStockStatus(
                          product,
                        );

                      return (
                        <tr
                          key={
                            product.id
                          }
                          className="group transition hover:bg-[#fdfbf9]"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="h-[62px] w-[62px] shrink-0 overflow-hidden rounded-2xl border border-[#eee7e4] bg-[#f7f2ef]">
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
                                  <div className="flex h-full w-full items-center justify-center text-[#b6aaa6]">
                                    <ProductIcon />
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="max-w-[260px] truncate text-sm font-semibold text-[#403539]">
                                  {
                                    product.name
                                  }
                                </p>

                                <p className="mt-1 max-w-[260px] truncate text-xs text-[#9d9497]">
                                  {product.flowerName ??
                                    product.slug}
                                </p>

                                <p className="mt-1 text-[10px] text-[#bbb2b4]">
                                  /
                                  {
                                    product.slug
                                  }
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex max-w-[220px] flex-wrap gap-1.5">
                              {product
                                .categories
                                .length >
                              0 ? (
                                product.categories
                                  .slice(
                                    0,
                                    2,
                                  )
                                  .map(
                                    (
                                      category,
                                    ) => (
                                      <span
                                        key={
                                          category.id
                                        }
                                        className="rounded-lg bg-[#f5efec] px-2.5 py-1.5 text-[11px] font-medium text-[#785f55]"
                                      >
                                        {
                                          category.name
                                        }
                                      </span>
                                    ),
                                  )
                              ) : (
                                <span className="text-xs text-[#aaa1a4]">
                                  Kategorisiz
                                </span>
                              )}

                              {product
                                .categories
                                .length >
                                2 && (
                                <span className="rounded-lg bg-[#f4f1f1] px-2 py-1.5 text-[10px] text-[#8d8386]">
                                  +
                                  {product
                                    .categories
                                    .length -
                                    2}
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            {price !==
                            null ? (
                              <div>
                                <p className="text-sm font-semibold text-[#403539]">
                                  {formatPrice(
                                    price,
                                  )}
                                </p>

                                <p className="mt-1 text-[10px] text-[#aaa1a4]">
                                  Başlangıç
                                </p>
                              </div>
                            ) : (
                              <span className="text-xs text-[#aaa1a4]">
                                Fiyat yok
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={[
                                'inline-flex whitespace-nowrap rounded-full px-2.5 py-1.5 text-[10px] font-semibold',
                                stock.className,
                              ].join(
                                ' ',
                              )}
                            >
                              {
                                stock.label
                              }
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={[
                                'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[10px] font-semibold',
                                product.isActive
                                  ? 'bg-[#eef8f1] text-[#4e815c]'
                                  : 'bg-[#f4f1f1] text-[#857b7e]',
                              ].join(
                                ' ',
                              )}
                            >
                              <span
                                className={[
                                  'h-1.5 w-1.5 rounded-full',
                                  product.isActive
                                    ? 'bg-[#62a174]'
                                    : 'bg-[#aaa0a3]',
                                ].join(
                                  ' ',
                                )}
                              />

                              {product.isActive
                                ? 'Yayında'
                                : 'Pasif'}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            {product.isFeatured ? (
                              <span className="inline-flex whitespace-nowrap rounded-full bg-[#fff4e8] px-2.5 py-1.5 text-[10px] font-semibold text-[#ad7148]">
                                ★ Öne Çıkan
                              </span>
                            ) : (
                              <span className="text-xs text-[#bbb2b4]">
                                —
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/products/${product.id}`}
                                title="Düzenle"
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e9e2df] bg-white text-[#817378] transition hover:border-[#cbb6ad] hover:bg-[#f8f4f2] hover:text-[#4d343e]"
                              >
                                <EditIcon />
                              </Link>

                              <button
                                type="button"
                                title="Sil"
                                onClick={() =>
                                  setProductToDelete(
                                    product,
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#f0dddd] bg-white text-[#b86d6d] transition hover:border-[#e8c5c5] hover:bg-[#fff4f4] hover:text-[#a64949]"
                              >
                                <TrashIcon />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {productToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#26191e]/40 p-5 backdrop-blur-[3px]">
          <button
            type="button"
            aria-label="Kapat"
            onClick={() => {
              if (!deleting) {
                setProductToDelete(
                  null,
                );
              }
            }}
            className="absolute inset-0"
          />

          <div className="relative z-10 w-full max-w-[470px] rounded-[28px] border border-white/50 bg-white p-7 shadow-[0_30px_100px_rgba(35,20,27,0.24)]">
            <div className="flex items-start justify-between gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fff0f0] text-[#ad5656]">
                <TrashIcon />
              </div>

              <button
                type="button"
                disabled={deleting}
                onClick={() =>
                  setProductToDelete(
                    null,
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-xl text-[#9e9497] transition hover:bg-[#f7f3f1]"
              >
                <CloseIcon />
              </button>
            </div>

            <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-[#3c3035]">
              Ürünü silmek
              istediğinize emin misiniz?
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#91878a]">
              <strong className="font-semibold text-[#514348]">
                {
                  productToDelete.name
                }
              </strong>{' '}
              ve ürüne bağlı boyut,
              ambalaj, kart ve görseller
              kalıcı olarak silinecek.
            </p>

            <div className="mt-7 flex gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() =>
                  setProductToDelete(
                    null,
                  )
                }
                className="h-12 flex-1 rounded-2xl border border-[#e7dfdc] bg-white text-sm font-semibold text-[#65575c] transition hover:bg-[#f8f5f3]"
              >
                Vazgeç
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={
                  confirmDelete
                }
                className="h-12 flex-1 rounded-2xl bg-[#a84f4f] text-sm font-semibold text-white transition hover:bg-[#943f3f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting
                  ? 'Siliniyor...'
                  : 'Ürünü Sil'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}