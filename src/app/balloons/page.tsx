'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import Link from 'next/link';

import AdminLayout from '@/components/admin/AdminLayout';

import {
  Balloon,
  deleteBalloon,
  getBalloons,
  updateBalloon,
} from '@/lib/api';

/* =========================================================
   TYPES
========================================================= */

type FilterType =
  | 'ALL'
  | 'ACTIVE'
  | 'PASSIVE'
  | 'FEATURED'
  | 'LOW_STOCK';

/* =========================================================
   ICONS
========================================================= */

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      className="h-5 w-5"
    >
      <path d="M12 5v14M5 12h14" />
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

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      className="h-5 w-5"
    >
      <circle
        cx="11"
        cy="11"
        r="6.5"
      />

      <path d="m16 16 4 4" />
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
      <path d="M4 20h4l11-11-4-4L4 16v4Z" />
      <path d="m13.5 6.5 4 4" />
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
      className="h-4 w-4"
    >
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="M7 7l1 13h8l1-13" />
      <path d="M10 11v5M14 11v5" />
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
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
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
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M4 8 12 4l8 4-8 4-8-4Z" />
      <path d="M4 8v8l8 4 8-4V8" />
      <path d="M12 12v8" />
    </svg>
  );
}

function VariantsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      className="h-5 w-5"
    >
      <circle
        cx="7"
        cy="7"
        r="3"
      />

      <circle
        cx="17"
        cy="7"
        r="3"
      />

      <circle
        cx="12"
        cy="17"
        r="3"
      />
    </svg>
  );
}

function HeliumIcon() {
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
      <path d="M12 3c-3.1 0-5.3 2.3-5.3 5.3 0 3.5 2.7 6.2 5.3 7.2 2.6-1 5.3-3.7 5.3-7.2C17.3 5.3 15.1 3 12 3Z" />
      <path d="m10.8 15.5 1.2 1.8 1.2-1.8" />
      <path d="M12 17.3V21" />
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
      className="h-5 w-5"
    >
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function formatPrice(
  price: number,
) {
  return new Intl.NumberFormat(
    'tr-TR',
    {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0,
    },
  ).format(price);
}

function getMinimumPrice(
  balloon: Balloon,
) {
  const prices =
    balloon.variants
      ?.filter(
        (variant) =>
          variant.isActive,
      )
      .map(
        (variant) =>
          Number(
            variant.price,
          ),
      ) ?? [];

  if (!prices.length) {
    return null;
  }

  return Math.min(
    ...prices,
  );
}

function getTotalStock(
  balloon: Balloon,
) {
  const stockVariants =
    balloon.variants?.filter(
      (variant) =>
        variant.stockEnabled,
    ) ?? [];

  if (
    stockVariants.length ===
    0
  ) {
    return null;
  }

  return stockVariants.reduce(
    (
      total,
      variant,
    ) =>
      total +
      Number(
        variant.stockQuantity ??
          0,
      ),
    0,
  );
}

function hasLowStock(
  balloon: Balloon,
) {
  const stockVariants =
    balloon.variants?.filter(
      (variant) =>
        variant.stockEnabled &&
        variant.isActive,
    ) ?? [];

  if (
    stockVariants.length ===
    0
  ) {
    return false;
  }

  return stockVariants.some(
    (variant) =>
      variant.stockQuantity <=
      5,
  );
}

function hasHelium(
  balloon: Balloon,
) {
  return (
    balloon.variants?.some(
      (variant) =>
        variant.isActive &&
        variant.heliumIncluded,
    ) ?? false
  );
}

/* =========================================================
   KPI CARD
========================================================= */

function KpiCard({
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
    <div className="rounded-[26px] border border-[#eadfd8] bg-white p-6 shadow-[0_12px_40px_rgba(53,31,40,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#a6949b]">
            {title}
          </p>

          <p className="mt-3 text-[30px] font-semibold tracking-[-0.04em] text-[#351f28]">
            {value}
          </p>

          <p className="mt-1 text-xs text-[#a6949b]">
            {description}
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f7efeb] text-[#9b6e5d]">
          {icon}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function BalloonsPage() {
  const [
    balloons,
    setBalloons,
  ] = useState<
    Balloon[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState('');

  const [
    success,
    setSuccess,
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
    deleteTarget,
    setDeleteTarget,
  ] = useState<
    Balloon | undefined
  >();

  const [
    deleting,
    setDeleting,
  ] = useState(false);

  const [
    updatingId,
    setUpdatingId,
  ] = useState<
    string | null
  >(null);

  /* =======================================================
     LOAD
  ======================================================= */

  const loadBalloons =
    useCallback(
      async () => {
        try {
          setLoading(true);
          setError('');

          const data =
            await getBalloons();

          setBalloons(
            data,
          );
        } catch (err) {
          setError(
            err instanceof
              Error
              ? err.message
              : 'Balonlar yüklenemedi.',
          );
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  useEffect(() => {
    void loadBalloons();
  }, [loadBalloons]);

  /* =======================================================
     KPI
  ======================================================= */

  const statistics =
    useMemo(() => {
      const total =
        balloons.length;

      const active =
        balloons.filter(
          (balloon) =>
            balloon.isActive,
        ).length;

      const featured =
        balloons.filter(
          (balloon) =>
            balloon.isFeatured,
        ).length;

      const variants =
        balloons.reduce(
          (
            totalVariants,
            balloon,
          ) =>
            totalVariants +
            (
              balloon.variants
                ?.length ?? 0
            ),
          0,
        );

      return {
        total,
        active,
        featured,
        variants,
      };
    }, [balloons]);

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredBalloons =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLocaleLowerCase(
            'tr-TR',
          );

      return balloons.filter(
        (balloon) => {
          const matchesSearch =
            !normalizedSearch ||
            balloon.name
              .toLocaleLowerCase(
                'tr-TR',
              )
              .includes(
                normalizedSearch,
              ) ||
            balloon.slug
              .toLocaleLowerCase(
                'tr-TR',
              )
              .includes(
                normalizedSearch,
              ) ||
            balloon.subtitle
              ?.toLocaleLowerCase(
                'tr-TR',
              )
              .includes(
                normalizedSearch,
              ) ||
            balloon.variants?.some(
              (variant) =>
                variant.name
                  ?.toLocaleLowerCase(
                    'tr-TR',
                  )
                  .includes(
                    normalizedSearch,
                  ) ||
                variant.color
                  ?.toLocaleLowerCase(
                    'tr-TR',
                  )
                  .includes(
                    normalizedSearch,
                  ) ||
                variant.size
                  ?.toLocaleLowerCase(
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
            filter ===
            'ACTIVE'
          ) {
            return balloon.isActive;
          }

          if (
            filter ===
            'PASSIVE'
          ) {
            return !balloon.isActive;
          }

          if (
            filter ===
            'FEATURED'
          ) {
            return balloon.isFeatured;
          }

          if (
            filter ===
            'LOW_STOCK'
          ) {
            return hasLowStock(
              balloon,
            );
          }

          return true;
        },
      );
    }, [
      balloons,
      filter,
      search,
    ]);

  /* =======================================================
     UPDATE STATUS
  ======================================================= */

  async function handleStatusToggle(
    balloon: Balloon,
  ) {
    try {
      setUpdatingId(
        balloon.id,
      );

      setError('');
      setSuccess('');

      const updated =
        await updateBalloon(
          balloon.id,
          {
            isActive:
              !balloon.isActive,
          },
        );

      setBalloons(
        (current) =>
          current.map(
            (item) =>
              item.id ===
              balloon.id
                ? updated
                : item,
          ),
      );

      setSuccess(
        updated.isActive
          ? 'Balon aktif hale getirildi.'
          : 'Balon pasif hale getirildi.',
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Balon durumu güncellenemedi.',
      );
    } finally {
      setUpdatingId(
        null,
      );
    }
  }

  async function handleFeaturedToggle(
    balloon: Balloon,
  ) {
    try {
      setUpdatingId(
        balloon.id,
      );

      setError('');
      setSuccess('');

      const updated =
        await updateBalloon(
          balloon.id,
          {
            isFeatured:
              !balloon.isFeatured,
          },
        );

      setBalloons(
        (current) =>
          current.map(
            (item) =>
              item.id ===
              balloon.id
                ? updated
                : item,
          ),
      );

      setSuccess(
        updated.isFeatured
          ? 'Balon öne çıkarıldı.'
          : 'Balon öne çıkanlardan kaldırıldı.',
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Öne çıkarma durumu güncellenemedi.',
      );
    } finally {
      setUpdatingId(
        null,
      );
    }
  }

  /* =======================================================
     DELETE
  ======================================================= */

  async function handleDelete() {
    if (!deleteTarget) {
      return;
    }

    try {
      setDeleting(true);
      setError('');
      setSuccess('');

      await deleteBalloon(
        deleteTarget.id,
      );

      setBalloons(
        (current) =>
          current.filter(
            (item) =>
              item.id !==
              deleteTarget.id,
          ),
      );

      setDeleteTarget(
        undefined,
      );

      setSuccess(
        'Balon başarıyla silindi.',
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Balon silinemedi.',
      );
    } finally {
      setDeleting(false);
    }
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#fbf8f6]">
        <div className="mx-auto w-full max-w-[1600px] px-5 py-7 sm:px-7 lg:px-9 lg:py-9">
          {/* HEADER */}

          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a88b7e]">
                <BalloonIcon />

                Katalog Yönetimi
              </div>

              <h1 className="mt-3 text-[32px] font-semibold tracking-[-0.04em] text-[#351f28] sm:text-[38px]">
                Balonlar
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8f7f85]">
                Balon ürünlerini,
                varyantlarını,
                fiyatlarını ve stok
                durumlarını tek bir
                alandan yönetin.
              </p>
            </div>

            <Link
              href="/balloons/new"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#351f28] px-5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(53,31,40,0.16)] transition hover:-translate-y-0.5 hover:bg-[#472b36]"
            >
              <PlusIcon />
              Yeni Balon
            </Link>
          </div>

          {/* ALERTS */}

          {error && (
            <div className="mt-6 flex items-start justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              <span>
                {error}
              </span>

              <button
                type="button"
                onClick={() =>
                  setError('')
                }
                className="shrink-0"
              >
                <CloseIcon />
              </button>
            </div>
          )}

          {success && (
            <div className="mt-6 flex items-start justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
              <span>
                {success}
              </span>

              <button
                type="button"
                onClick={() =>
                  setSuccess('')
                }
                className="shrink-0"
              >
                <CloseIcon />
              </button>
            </div>
          )}

          {/* KPI */}

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              title="Toplam Balon"
              value={
                statistics.total
              }
              description="Kayıtlı balon ürünü"
              icon={
                <BalloonIcon />
              }
            />

            <KpiCard
              title="Aktif"
              value={
                statistics.active
              }
              description="Satışa açık balon"
              icon={
                <StockIcon />
              }
            />

            <KpiCard
              title="Öne Çıkan"
              value={
                statistics.featured
              }
              description="Vitrinde öne çıkan"
              icon={
                <StarIcon />
              }
            />

            <KpiCard
              title="Varyant"
              value={
                statistics.variants
              }
              description="Toplam balon varyantı"
              icon={
                <VariantsIcon />
              }
            />
          </div>

          {/* FILTERS */}

          <div className="mt-7 rounded-[26px] border border-[#eadfd8] bg-white p-4 shadow-[0_12px_40px_rgba(53,31,40,0.035)] sm:p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="relative w-full xl:max-w-md">
                <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#a6949b]">
                  <SearchIcon />
                </div>

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target
                        .value,
                    )
                  }
                  placeholder="Balon, renk veya boyut ara..."
                  className="h-12 w-full rounded-2xl border border-[#eadfd8] bg-[#fcfaf9] pl-12 pr-4 text-sm text-[#351f28] outline-none transition placeholder:text-[#b8a9ae] focus:border-[#b99080] focus:bg-white focus:ring-4 focus:ring-[#b99080]/10"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {(
                  [
                    [
                      'ALL',
                      'Tümü',
                    ],
                    [
                      'ACTIVE',
                      'Aktif',
                    ],
                    [
                      'PASSIVE',
                      'Pasif',
                    ],
                    [
                      'FEATURED',
                      'Öne Çıkan',
                    ],
                    [
                      'LOW_STOCK',
                      'Düşük Stok',
                    ],
                  ] as [
                    FilterType,
                    string,
                  ][]
                ).map(
                  ([
                    value,
                    label,
                  ]) => {
                    const active =
                      filter ===
                      value;

                    return (
                      <button
                        key={
                          value
                        }
                        type="button"
                        onClick={() =>
                          setFilter(
                            value,
                          )
                        }
                        className={[
                          'h-10 rounded-xl px-4 text-xs font-semibold transition',
                          active
                            ? 'bg-[#351f28] text-white shadow-sm'
                            : 'bg-[#f8f3f0] text-[#806f75] hover:bg-[#f0e6e1]',
                        ].join(
                          ' ',
                        )}
                      >
                        {
                          label
                        }
                      </button>
                    );
                  },
                )}
              </div>
            </div>
          </div>

          {/* TABLE */}

          <div className="mt-5 overflow-hidden rounded-[28px] border border-[#eadfd8] bg-white shadow-[0_15px_50px_rgba(53,31,40,0.04)]">
            {loading ? (
              <div className="flex min-h-[420px] items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto h-9 w-9 animate-spin rounded-full border-[3px] border-[#eadfd8] border-t-[#351f28]" />

                  <p className="mt-4 text-sm text-[#8f7f85]">
                    Balonlar
                    yükleniyor...
                  </p>
                </div>
              </div>
            ) : filteredBalloons.length ===
              0 ? (
              <div className="flex min-h-[420px] items-center justify-center px-6">
                <div className="max-w-md text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#f7efeb] text-[#9b6e5d]">
                    <BalloonIcon />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-[#351f28]">
                    Balon
                    bulunamadı
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#95858b]">
                    Arama veya
                    filtre
                    kriterlerinize
                    uygun bir balon
                    bulunamadı.
                  </p>

                  {balloons.length ===
                    0 && (
                    <Link
                      href="/balloons/new"
                      className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#351f28] px-5 text-sm font-semibold text-white"
                    >
                      <PlusIcon />
                      İlk Balonu
                      Ekle
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1120px]">
                  <thead>
                    <tr className="border-b border-[#eee5e0] bg-[#fcfaf9]">
                      <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a6949b]">
                        Balon
                      </th>

                      <th className="px-4 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a6949b]">
                        Varyant
                      </th>

                      <th className="px-4 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a6949b]">
                        Başlangıç
                        Fiyatı
                      </th>

                      <th className="px-4 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a6949b]">
                        Stok
                      </th>

                      <th className="px-4 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a6949b]">
                        Helyum
                      </th>

                      <th className="px-4 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a6949b]">
                        Durum
                      </th>

                      <th className="px-4 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a6949b]">
                        Vitrin
                      </th>

                      <th className="px-6 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a6949b]">
                        İşlem
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredBalloons.map(
                      (
                        balloon,
                      ) => {
                        const minimumPrice =
                          getMinimumPrice(
                            balloon,
                          );

                        const totalStock =
                          getTotalStock(
                            balloon,
                          );

                        const lowStock =
                          hasLowStock(
                            balloon,
                          );

                        const helium =
                          hasHelium(
                            balloon,
                          );

                        const busy =
                          updatingId ===
                          balloon.id;

                        return (
                          <tr
                            key={
                              balloon.id
                            }
                            className="border-b border-[#f1e9e5] transition last:border-b-0 hover:bg-[#fdfbf9]"
                          >
                            {/* BALLOON */}

                            <td className="px-6 py-5">
                              <div className="flex min-w-[270px] items-center gap-4">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[20px] border border-[#eadfd8] bg-[#f8f2ef]">
                                  {balloon.heroImage ? (
                                    <img
                                      src={
                                        balloon.heroImage
                                      }
                                      alt={
                                        balloon.name
                                      }
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <div className="text-[#b28d7c]">
                                      <BalloonIcon />
                                    </div>
                                  )}
                                </div>

                                <div className="min-w-0">
                                  <p className="max-w-[260px] truncate text-sm font-semibold text-[#351f28]">
                                    {
                                      balloon.name
                                    }
                                  </p>

                                  {balloon.subtitle && (
                                    <p className="mt-1 max-w-[260px] truncate text-xs text-[#95858b]">
                                      {
                                        balloon.subtitle
                                      }
                                    </p>
                                  )}

                                  <p className="mt-1.5 max-w-[260px] truncate text-[10px] text-[#b1a2a7]">
                                    /
                                    {
                                      balloon.slug
                                    }
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* VARIANTS */}

                            <td className="px-4 py-5">
                              <div>
                                <p className="text-sm font-semibold text-[#4c3740]">
                                  {
                                    balloon
                                      .variants
                                      ?.length ??
                                      0
                                  }{' '}
                                  varyant
                                </p>

                                {balloon
                                  .variants
                                  ?.length >
                                  0 && (
                                  <p className="mt-1 max-w-[170px] truncate text-xs text-[#9d8d93]">
                                    {balloon.variants
                                      .slice(
                                        0,
                                        2,
                                      )
                                      .map(
                                        (
                                          variant,
                                        ) =>
                                          [
                                            variant.color,
                                            variant.size,
                                          ]
                                            .filter(
                                              Boolean,
                                            )
                                            .join(
                                              ' ',
                                            ),
                                      )
                                      .filter(
                                        Boolean,
                                      )
                                      .join(
                                        ' • ',
                                      ) ||
                                      'Varyant seçenekleri'}
                                  </p>
                                )}
                              </div>
                            </td>

                            {/* PRICE */}

                            <td className="px-4 py-5">
                              {minimumPrice !==
                              null ? (
                                <div>
                                  <p className="text-sm font-semibold text-[#351f28]">
                                    {formatPrice(
                                      minimumPrice,
                                    )}
                                  </p>

                                  <p className="mt-1 text-[10px] text-[#aa9a9f]">
                                    En düşük
                                    aktif
                                    varyant
                                  </p>
                                </div>
                              ) : (
                                <span className="text-xs text-[#b0a1a6]">
                                  Fiyat yok
                                </span>
                              )}
                            </td>

                            {/* STOCK */}

                            <td className="px-4 py-5">
                              {totalStock ===
                              null ? (
                                <span className="inline-flex rounded-full bg-[#f4f0ed] px-3 py-1.5 text-[10px] font-semibold text-[#8d7d83]">
                                  Takip
                                  edilmiyor
                                </span>
                              ) : (
                                <div>
                                  <span
                                    className={[
                                      'inline-flex rounded-full px-3 py-1.5 text-[10px] font-semibold',
                                      lowStock
                                        ? 'bg-amber-50 text-amber-700'
                                        : 'bg-emerald-50 text-emerald-700',
                                    ].join(
                                      ' ',
                                    )}
                                  >
                                    {
                                      totalStock
                                    }{' '}
                                    adet
                                  </span>

                                  {lowStock && (
                                    <p className="mt-1.5 text-[10px] font-medium text-amber-600">
                                      Düşük
                                      stok
                                      varyantı
                                      var
                                    </p>
                                  )}
                                </div>
                              )}
                            </td>

                            {/* HELIUM */}

                            <td className="px-4 py-5">
                              <span
                                className={[
                                  'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold',
                                  helium
                                    ? 'bg-[#f3edf8] text-[#76538b]'
                                    : 'bg-[#f4f0ed] text-[#8d7d83]',
                                ].join(
                                  ' ',
                                )}
                              >
                                <HeliumIcon />

                                {helium
                                  ? 'Dahil'
                                  : 'Yok'}
                              </span>
                            </td>

                            {/* STATUS */}

                            <td className="px-4 py-5">
                              <button
                                type="button"
                                disabled={
                                  busy
                                }
                                onClick={() =>
                                  void handleStatusToggle(
                                    balloon,
                                  )
                                }
                                className={[
                                  'relative inline-flex h-7 w-[50px] items-center rounded-full transition',
                                  balloon.isActive
                                    ? 'bg-emerald-500'
                                    : 'bg-[#d9ceca]',
                                  busy
                                    ? 'cursor-wait opacity-50'
                                    : '',
                                ].join(
                                  ' ',
                                )}
                                aria-label="Balon durumunu değiştir"
                              >
                                <span
                                  className={[
                                    'h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
                                    balloon.isActive
                                      ? 'translate-x-[26px]'
                                      : 'translate-x-1',
                                  ].join(
                                    ' ',
                                  )}
                                />
                              </button>

                              <p className="mt-1.5 text-[10px] font-medium text-[#9d8d93]">
                                {balloon.isActive
                                  ? 'Aktif'
                                  : 'Pasif'}
                              </p>
                            </td>

                            {/* FEATURED */}

                            <td className="px-4 py-5">
                              <button
                                type="button"
                                disabled={
                                  busy
                                }
                                onClick={() =>
                                  void handleFeaturedToggle(
                                    balloon,
                                  )
                                }
                                className={[
                                  'flex h-9 w-9 items-center justify-center rounded-xl border transition',
                                  balloon.isFeatured
                                    ? 'border-amber-200 bg-amber-50 text-amber-500'
                                    : 'border-[#eadfd8] bg-white text-[#b9aaaf] hover:bg-[#faf6f4]',
                                  busy
                                    ? 'cursor-wait opacity-50'
                                    : '',
                                ].join(
                                  ' ',
                                )}
                                aria-label="Öne çıkarma durumunu değiştir"
                                title={
                                  balloon.isFeatured
                                    ? 'Öne çıkandan kaldır'
                                    : 'Öne çıkar'
                                }
                              >
                                <StarIcon />
                              </button>
                            </td>

                            {/* ACTIONS */}

                            <td className="px-6 py-5">
                              <div className="flex justify-end gap-2">
                                <Link
                                  href={`/balloons/${balloon.id}`}
                                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#eadfd8] bg-white text-[#816e75] transition hover:border-[#cdb7ad] hover:bg-[#faf6f4] hover:text-[#351f28]"
                                  title="Düzenle"
                                >
                                  <EditIcon />
                                </Link>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setDeleteTarget(
                                      balloon,
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
            )}
          </div>

          {/* RESULT COUNT */}

          {!loading &&
            filteredBalloons.length >
              0 && (
              <div className="mt-4 flex items-center justify-between px-2">
                <p className="text-xs text-[#a29298]">
                  {
                    filteredBalloons.length
                  }{' '}
                  balon
                  gösteriliyor
                </p>

                <p className="text-xs text-[#b1a2a7]">
                  Toplam{' '}
                  {
                    balloons.length
                  }{' '}
                  kayıt
                </p>
              </div>
            )}
        </div>
      </div>

      {/* DELETE MODAL */}

      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#24171c]/45 px-4 backdrop-blur-[3px]">
          <button
            type="button"
            aria-label="Silme penceresini kapat"
            className="absolute inset-0"
            onClick={() => {
              if (
                !deleting
              ) {
                setDeleteTarget(
                  undefined,
                );
              }
            }}
          />

          <div className="relative z-10 w-full max-w-md rounded-[30px] border border-white/30 bg-white p-7 shadow-[0_30px_100px_rgba(36,23,28,0.28)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <TrashIcon />
            </div>

            <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-[#351f28]">
              Balonu silmek
              istiyor musunuz?
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#8e7d84]">
              <span className="font-semibold text-[#4e3942]">
                {
                  deleteTarget.name
                }
              </span>{' '}
              ve bu balona ait
              tüm görseller ile
              varyant kayıtları
              veritabanından
              silinecek.
            </p>

            <div className="mt-7 flex gap-3">
              <button
                type="button"
                disabled={
                  deleting
                }
                onClick={() =>
                  setDeleteTarget(
                    undefined,
                  )
                }
                className="h-11 flex-1 rounded-xl border border-[#e8ddd8] bg-white text-sm font-semibold text-[#6f5d64] transition hover:bg-[#faf7f5] disabled:opacity-50"
              >
                Vazgeç
              </button>

              <button
                type="button"
                disabled={
                  deleting
                }
                onClick={() =>
                  void handleDelete()
                }
                className="h-11 flex-1 rounded-xl bg-red-600 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-wait disabled:opacity-60"
              >
                {deleting
                  ? 'Siliniyor...'
                  : 'Balonu Sil'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}