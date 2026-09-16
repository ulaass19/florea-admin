'use client';

import Link from 'next/link';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import AdminLayout from '@/components/admin/AdminLayout';

import {
  deleteCollection,
  getCollections,
  updateCollection,
  type Collection,
} from '@/lib/api';

type FilterType =
  | 'ALL'
  | 'ACTIVE'
  | 'PASSIVE'
  | 'FEATURED'
  | 'EMPTY';

function SearchIcon() {
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
      <circle
        cx="11"
        cy="11"
        r="7"
      />

      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function PlusIcon() {
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
      <path d="M12 5v14" />
      <path d="M5 12h14" />
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
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M12 20h9" />

      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
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
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M6 7l1 14h10l1-14" />
      <path d="M9 7V4h6v3" />
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

function ProductIcon() {
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
      <path d="M6 8.5 12 5l6 3.5v7L12 19l-6-3.5v-7Z" />
      <path d="m6.5 8.5 5.5 3 5.5-3" />
      <path d="M12 11.5V19" />
    </svg>
  );
}

function StarIcon() {
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
      <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z" />
    </svg>
  );
}

function EmptyIcon() {
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
      <path d="M4 7h16" />
      <path d="M5 7l1 13h12l1-13" />
      <path d="M9 11h6" />
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
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#351f28]/20 border-t-[#351f28]" />
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-[24px] border border-[#eadfd9] bg-white p-5 shadow-[0_8px_30px_rgba(53,31,40,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#9c8b91]">
            {title}
          </p>

          <p className="mt-3 text-3xl font-semibold tracking-tight text-[#351f28]">
            {value}
          </p>

          <p className="mt-2 text-xs text-[#a19398]">
            {description}
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f6eeea] text-[#8e6253]">
          {icon}
        </div>
      </div>
    </div>
  );
}

function Toggle({
  checked,
  disabled,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onChange}
      className={[
        'relative h-7 w-12 rounded-full transition-all duration-200',
        checked
          ? 'bg-[#351f28]'
          : 'bg-[#ded4d7]',
        disabled
          ? 'cursor-not-allowed opacity-50'
          : 'cursor-pointer',
      ].join(' ')}
    >
      <span
        className={[
          'absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200',
          checked
            ? 'left-6'
            : 'left-1',
        ].join(' ')}
      />
    </button>
  );
}

function getMinimumPrice(
  collection: Collection,
) {
  const prices =
    collection.products
      .flatMap(
        (item) =>
          item.product.sizes ?? [],
      )
      .filter(
        (size) =>
          size.isActive,
      )
      .map(
        (size) =>
          Number(size.price),
      )
      .filter(
        (price) =>
          Number.isFinite(price),
      );

  if (
    prices.length === 0
  ) {
    return null;
  }

  return Math.min(
    ...prices,
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

export default function CollectionsPage() {
  const [
    collections,
    setCollections,
  ] = useState<Collection[]>(
    [],
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
    search,
    setSearch,
  ] = useState('');

  const [
    filter,
    setFilter,
  ] = useState<FilterType>(
    'ALL',
  );

  const [
    updatingId,
    setUpdatingId,
  ] = useState<string | null>(
    null,
  );

  const [
    deleteTarget,
    setDeleteTarget,
  ] = useState<Collection | null>(
    null,
  );

  const [
    deleting,
    setDeleting,
  ] = useState(false);

  async function loadCollections() {
    try {
      setLoading(true);
      setError('');

      const data =
        await getCollections();

      setCollections(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Koleksiyonlar yüklenemedi.',
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCollections();
  }, []);

  const stats =
    useMemo(() => {
      const total =
        collections.length;

      const active =
        collections.filter(
          (item) =>
            item.isActive,
        ).length;

      const featured =
        collections.filter(
          (item) =>
            item.isFeatured,
        ).length;

      const products =
        collections.reduce(
          (
            totalCount,
            item,
          ) =>
            totalCount +
            item.products.length,
          0,
        );

      return {
        total,
        active,
        featured,
        products,
      };
    }, [collections]);

  const filteredCollections =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLocaleLowerCase(
            'tr-TR',
          );

      return collections.filter(
        (collection) => {
          const matchesSearch =
            !normalizedSearch ||
            [
              collection.name,
              collection.slug,
              collection.subtitle ??
                '',
              collection.description ??
                '',
            ].some((value) =>
              value
                .toLocaleLowerCase(
                  'tr-TR',
                )
                .includes(
                  normalizedSearch,
                ),
            ) ||
            collection.products.some(
              (item) =>
                item.product.name
                  .toLocaleLowerCase(
                    'tr-TR',
                  )
                  .includes(
                    normalizedSearch,
                  ),
            );

          if (
            !matchesSearch
          ) {
            return false;
          }

          if (
            filter === 'ACTIVE'
          ) {
            return collection.isActive;
          }

          if (
            filter === 'PASSIVE'
          ) {
            return !collection.isActive;
          }

          if (
            filter === 'FEATURED'
          ) {
            return collection.isFeatured;
          }

          if (
            filter === 'EMPTY'
          ) {
            return (
              collection.products
                .length === 0
            );
          }

          return true;
        },
      );
    }, [
      collections,
      search,
      filter,
    ]);

  async function handleToggleActive(
    collection: Collection,
  ) {
    try {
      setUpdatingId(
        collection.id,
      );

      setError('');

      const updated =
        await updateCollection(
          collection.id,
          {
            isActive:
              !collection.isActive,
          },
        );

      setCollections(
        (current) =>
          current.map(
            (item) =>
              item.id ===
              collection.id
                ? updated
                : item,
          ),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Koleksiyon güncellenemedi.',
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleToggleFeatured(
    collection: Collection,
  ) {
    try {
      setUpdatingId(
        collection.id,
      );

      setError('');

      const updated =
        await updateCollection(
          collection.id,
          {
            isFeatured:
              !collection.isFeatured,
          },
        );

      setCollections(
        (current) =>
          current.map(
            (item) =>
              item.id ===
              collection.id
                ? updated
                : item,
          ),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Koleksiyon güncellenemedi.',
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) {
      return;
    }

    try {
      setDeleting(true);
      setError('');

      await deleteCollection(
        deleteTarget.id,
      );

      setCollections(
        (current) =>
          current.filter(
            (item) =>
              item.id !==
              deleteTarget.id,
          ),
      );

      setDeleteTarget(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Koleksiyon silinemedi.',
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AdminLayout title="Koleksiyonlar">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a17b6c]">
              Vitrin Yönetimi
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#351f28]">
              Koleksiyonlar
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8d7d83]">
              Ürünleri özel temalar
              altında bir araya getir,
              vitrindeki sıralarını
              yönet ve öne çıkan
              koleksiyonları belirle.
            </p>
          </div>

          <Link
            href="/collections/new"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#351f28] px-5 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(53,31,40,0.18)] transition hover:-translate-y-0.5 hover:bg-[#482b37]"
          >
            <PlusIcon />
            Yeni Koleksiyon
          </Link>
        </div>

        {error && (
          <div className="flex items-start justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            <span>
              {error}
            </span>

            <button
              type="button"
              onClick={() =>
                setError('')
              }
              className="shrink-0 text-red-500 transition hover:text-red-800"
            >
              <CloseIcon />
            </button>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Toplam Koleksiyon"
            value={stats.total}
            description="Sistemdeki tüm koleksiyonlar"
            icon={
              <CollectionIcon />
            }
          />

          <StatCard
            title="Aktif"
            value={stats.active}
            description="Müşteriye açık koleksiyonlar"
            icon={
              <CollectionIcon />
            }
          />

          <StatCard
            title="Öne Çıkan"
            value={stats.featured}
            description="Vitrinde öne çıkarılanlar"
            icon={<StarIcon />}
          />

          <StatCard
            title="Ürün Bağlantısı"
            value={stats.products}
            description="Koleksiyonlardaki toplam ürün"
            icon={<ProductIcon />}
          />
        </div>

        <div className="rounded-[26px] border border-[#eadfd9] bg-white shadow-[0_10px_35px_rgba(53,31,40,0.04)]">
          <div className="border-b border-[#eee5e1] p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="relative w-full xl:max-w-md">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#a8999f]">
                  <SearchIcon />
                </span>

                <input
                  value={search}
                  onChange={(
                    event,
                  ) =>
                    setSearch(
                      event.target
                        .value,
                    )
                  }
                  placeholder="Koleksiyon veya ürün ara..."
                  className="h-12 w-full rounded-2xl border border-[#e8ded9] bg-[#fcfaf9] pl-12 pr-4 text-sm text-[#351f28] outline-none transition placeholder:text-[#b6a8ad] focus:border-[#b58b79] focus:bg-white focus:ring-4 focus:ring-[#b58b79]/10"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  {
                    value:
                      'ALL' as const,
                    label: 'Tümü',
                  },
                  {
                    value:
                      'ACTIVE' as const,
                    label: 'Aktif',
                  },
                  {
                    value:
                      'PASSIVE' as const,
                    label: 'Pasif',
                  },
                  {
                    value:
                      'FEATURED' as const,
                    label:
                      'Öne Çıkan',
                  },
                  {
                    value:
                      'EMPTY' as const,
                    label: 'Ürünsüz',
                  },
                ].map(
                  (item) => (
                    <button
                      key={
                        item.value
                      }
                      type="button"
                      onClick={() =>
                        setFilter(
                          item.value,
                        )
                      }
                      className={[
                        'h-10 rounded-xl px-4 text-xs font-semibold transition',
                        filter ===
                        item.value
                          ? 'bg-[#351f28] text-white shadow-sm'
                          : 'border border-[#e9dfda] bg-white text-[#87767d] hover:bg-[#f8f3f1]',
                      ].join(' ')}
                    >
                      {item.label}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[360px] items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <LoadingSpinner />

                <p className="text-sm text-[#95868c]">
                  Koleksiyonlar
                  yükleniyor...
                </p>
              </div>
            </div>
          ) : filteredCollections.length ===
            0 ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#f6eeea] text-[#956b5b]">
                <EmptyIcon />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-[#351f28]">
                Koleksiyon
                bulunamadı
              </h2>

              <p className="mt-2 max-w-sm text-sm leading-6 text-[#95868c]">
                Arama veya filtre
                kriterlerini değiştir
                ya da yeni bir
                koleksiyon oluştur.
              </p>

              {collections.length ===
                0 && (
                <Link
                  href="/collections/new"
                  className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-[#351f28] px-4 text-sm font-semibold text-white"
                >
                  <PlusIcon />
                  İlk Koleksiyonu
                  Oluştur
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[1050px]">
                  <thead>
                    <tr className="border-b border-[#eee5e1] bg-[#fcfaf9]">
                      <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9c8d92]">
                        Koleksiyon
                      </th>

                      <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9c8d92]">
                        Ürünler
                      </th>

                      <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9c8d92]">
                        Başlangıç Fiyatı
                      </th>

                      <th className="px-5 py-4 text-center text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9c8d92]">
                        Sıra
                      </th>

                      <th className="px-5 py-4 text-center text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9c8d92]">
                        Aktif
                      </th>

                      <th className="px-5 py-4 text-center text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9c8d92]">
                        Öne Çıkan
                      </th>

                      <th className="px-6 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9c8d92]">
                        İşlemler
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredCollections.map(
                      (
                        collection,
                      ) => {
                        const minimumPrice =
                          getMinimumPrice(
                            collection,
                          );

                        const busy =
                          updatingId ===
                          collection.id;

                        return (
                          <tr
                            key={
                              collection.id
                            }
                            className="border-b border-[#f0e8e4] transition last:border-b-0 hover:bg-[#fdfbf9]"
                          >
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-4">
                                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-[#eadfd9] bg-[#f7f0ed]">
                                  {collection.image ? (
                                    <img
                                      src={
                                        collection.image
                                      }
                                      alt={
                                        collection.name
                                      }
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center text-[#a87966]">
                                      <CollectionIcon />
                                    </div>
                                  )}
                                </div>

                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <p className="max-w-[260px] truncate text-sm font-semibold text-[#351f28]">
                                      {
                                        collection.name
                                      }
                                    </p>

                                    {!collection.isActive && (
                                      <span className="rounded-full bg-[#f2eeee] px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-[#8e7d83]">
                                        Pasif
                                      </span>
                                    )}
                                  </div>

                                  <p className="mt-1 max-w-[280px] truncate text-xs text-[#9a8b90]">
                                    /
                                    {
                                      collection.slug
                                    }
                                  </p>

                                  {collection.subtitle && (
                                    <p className="mt-1 max-w-[280px] truncate text-xs text-[#b0a2a7]">
                                      {
                                        collection.subtitle
                                      }
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-5">
                              <div className="flex items-center">
                                {collection.products
                                  .slice(
                                    0,
                                    4,
                                  )
                                  .map(
                                    (
                                      item,
                                      index,
                                    ) => (
                                      <div
                                        key={
                                          item
                                            .product
                                            .id
                                        }
                                        title={
                                          item
                                            .product
                                            .name
                                        }
                                        className={[
                                          'relative h-9 w-9 overflow-hidden rounded-full border-2 border-white bg-[#f5ece8]',
                                          index >
                                          0
                                            ? '-ml-2'
                                            : '',
                                        ].join(
                                          ' ',
                                        )}
                                      >
                                        {item
                                          .product
                                          .heroImage ? (
                                          <img
                                            src={
                                              item
                                                .product
                                                .heroImage
                                            }
                                            alt={
                                              item
                                                .product
                                                .name
                                            }
                                            className="h-full w-full object-cover"
                                          />
                                        ) : (
                                          <div className="flex h-full w-full items-center justify-center text-[#9f7462]">
                                            <ProductIcon />
                                          </div>
                                        )}
                                      </div>
                                    ),
                                  )}

                                <div className="ml-3">
                                  <p className="text-sm font-semibold text-[#4d3740]">
                                    {
                                      collection
                                        .products
                                        .length
                                    }{' '}
                                    ürün
                                  </p>

                                  {collection
                                    .products
                                    .length >
                                    0 && (
                                    <p className="mt-0.5 max-w-[190px] truncate text-[11px] text-[#9d8e93]">
                                      {collection.products
                                        .slice(
                                          0,
                                          2,
                                        )
                                        .map(
                                          (
                                            item,
                                          ) =>
                                            item
                                              .product
                                              .name,
                                        )
                                        .join(
                                          ', ',
                                        )}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-5">
                              {minimumPrice !==
                              null ? (
                                <span className="text-sm font-semibold text-[#351f28]">
                                  {formatPrice(
                                    minimumPrice,
                                  )}
                                </span>
                              ) : (
                                <span className="text-xs text-[#b0a3a7]">
                                  Fiyat yok
                                </span>
                              )}
                            </td>

                            <td className="px-5 py-5 text-center">
                              <span className="inline-flex min-w-9 justify-center rounded-xl bg-[#f6f0ed] px-3 py-2 text-xs font-semibold text-[#795c51]">
                                {
                                  collection.sortOrder
                                }
                              </span>
                            </td>

                            <td className="px-5 py-5 text-center">
                              <div className="flex justify-center">
                                <Toggle
                                  checked={
                                    collection.isActive
                                  }
                                  disabled={
                                    busy
                                  }
                                  onChange={() =>
                                    handleToggleActive(
                                      collection,
                                    )
                                  }
                                />
                              </div>
                            </td>

                            <td className="px-5 py-5 text-center">
                              <div className="flex justify-center">
                                <Toggle
                                  checked={
                                    collection.isFeatured
                                  }
                                  disabled={
                                    busy
                                  }
                                  onChange={() =>
                                    handleToggleFeatured(
                                      collection,
                                    )
                                  }
                                />
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              <div className="flex items-center justify-end gap-2">
                                <Link
                                  href={`/collections/${collection.id}`}
                                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e7dcd7] bg-white text-[#795e53] transition hover:border-[#c9a898] hover:bg-[#faf5f2]"
                                  title="Düzenle"
                                >
                                  <EditIcon />
                                </Link>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setDeleteTarget(
                                      collection,
                                    )
                                  }
                                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-100 bg-white text-red-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                                  title="Sil"
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

              <div className="divide-y divide-[#eee5e1] lg:hidden">
                {filteredCollections.map(
                  (collection) => {
                    const minimumPrice =
                      getMinimumPrice(
                        collection,
                      );

                    const busy =
                      updatingId ===
                      collection.id;

                    return (
                      <div
                        key={
                          collection.id
                        }
                        className="p-5"
                      >
                        <div className="flex gap-4">
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-[#eadfd9] bg-[#f7f0ed]">
                            {collection.image ? (
                              <img
                                src={
                                  collection.image
                                }
                                alt={
                                  collection.name
                                }
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[#a87966]">
                                <CollectionIcon />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-[#351f28]">
                                  {
                                    collection.name
                                  }
                                </p>

                                <p className="mt-1 truncate text-xs text-[#9c8c92]">
                                  /
                                  {
                                    collection.slug
                                  }
                                </p>
                              </div>

                              <span className="rounded-xl bg-[#f6f0ed] px-2.5 py-1.5 text-[10px] font-semibold text-[#795c51]">
                                Sıra{' '}
                                {
                                  collection.sortOrder
                                }
                              </span>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2">
                              <span className="rounded-full bg-[#f8f3f1] px-3 py-1.5 text-[10px] font-medium text-[#796a70]">
                                {
                                  collection
                                    .products
                                    .length
                                }{' '}
                                ürün
                              </span>

                              {minimumPrice !==
                                null && (
                                <span className="rounded-full bg-[#f8f3f1] px-3 py-1.5 text-[10px] font-medium text-[#796a70]">
                                  {formatPrice(
                                    minimumPrice,
                                  )}
                                  'den
                                </span>
                              )}

                              {collection.isFeatured && (
                                <span className="rounded-full bg-[#f6ece5] px-3 py-1.5 text-[10px] font-semibold text-[#96634e]">
                                  Öne Çıkan
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-[#fbf8f6] p-4">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-xs font-medium text-[#85767c]">
                              Aktif
                            </span>

                            <Toggle
                              checked={
                                collection.isActive
                              }
                              disabled={
                                busy
                              }
                              onChange={() =>
                                handleToggleActive(
                                  collection,
                                )
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between gap-3">
                            <span className="text-xs font-medium text-[#85767c]">
                              Öne Çıkan
                            </span>

                            <Toggle
                              checked={
                                collection.isFeatured
                              }
                              disabled={
                                busy
                              }
                              onChange={() =>
                                handleToggleFeatured(
                                  collection,
                                )
                              }
                            />
                          </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                          <Link
                            href={`/collections/${collection.id}`}
                            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-[#e5d9d4] text-xs font-semibold text-[#624b54] transition hover:bg-[#faf5f2]"
                          >
                            <EditIcon />
                            Düzenle
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              setDeleteTarget(
                                collection,
                              )
                            }
                            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-red-100 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                          >
                            <TrashIcon />
                            Sil
                          </button>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>

              <div className="flex flex-col gap-2 border-t border-[#eee5e1] px-6 py-4 text-xs text-[#998a90] sm:flex-row sm:items-center sm:justify-between">
                <span>
                  {
                    filteredCollections.length
                  }{' '}
                  koleksiyon
                  gösteriliyor
                </span>

                <span>
                  Toplam{' '}
                  {
                    collections.length
                  }{' '}
                  koleksiyon
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/35 p-4 backdrop-blur-[3px]">
          <button
            type="button"
            aria-label="Pencereyi kapat"
            onClick={() => {
              if (!deleting) {
                setDeleteTarget(
                  null,
                );
              }
            }}
            className="absolute inset-0"
          />

          <div className="relative z-10 w-full max-w-md rounded-[28px] border border-white/50 bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <TrashIcon />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-[#351f28]">
              Koleksiyonu sil?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#8e7e84]">
              <strong className="font-semibold text-[#5b444d]">
                {
                  deleteTarget.name
                }
              </strong>{' '}
              koleksiyonu
              silinecek. Ürünlerin
              kendileri silinmez;
              yalnızca koleksiyon
              bağlantıları kaldırılır.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() =>
                  setDeleteTarget(
                    null,
                  )
                }
                className="h-11 flex-1 rounded-xl border border-[#e4d9d4] text-sm font-semibold text-[#68555c] transition hover:bg-[#faf6f4] disabled:opacity-50"
              >
                Vazgeç
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={
                  handleDelete
                }
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Siliniyor
                  </>
                ) : (
                  <>
                    <TrashIcon />
                    Koleksiyonu Sil
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}