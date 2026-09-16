'use client';

import Link from 'next/link';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import type {
  FormEvent,
} from 'react';

import {
  useRouter,
} from 'next/navigation';

import AdminLayout from '@/components/admin/AdminLayout';
import ImageUploader from '@/components/admin/ImageUploader';

import {
  createCollection,
  getProducts,
} from '@/lib/api';

import type {
  Product,
} from '@/lib/api';

type SelectedProduct = {
  product: Product;
};

function slugify(
  value: string,
) {
  return value
    .toLocaleLowerCase(
      'tr-TR',
    )
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      '',
    )
    .replace(
      /[^a-z0-9]+/g,
      '-',
    )
    .replace(
      /^-+|-+$/g,
      '',
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
        r="7"
      />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function ArrowUpIcon() {
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
      <path d="m6 15 6-6 6 6" />
    </svg>
  );
}

function ArrowDownIcon() {
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
      <path d="m6 9 6 6 6-6" />
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

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      className="h-4 w-4"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (
    value: boolean,
  ) => void;
}) {
  return (
    <button
      type="button"
      onClick={() =>
        onChange(!checked)
      }
      className={[
        'relative h-7 w-12 rounded-full transition-all',
        checked
          ? 'bg-[#351f28]'
          : 'bg-[#ddd3d6]',
      ].join(' ')}
    >
      <span
        className={[
          'absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all',
          checked
            ? 'left-6'
            : 'left-1',
        ].join(' ')}
      />
    </button>
  );
}

function getProductPrice(
  product: Product,
) {
  const prices =
    product.sizes
      ?.filter(
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
      ) ?? [];

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

export default function NewCollectionPage() {
  const router =
    useRouter();

  const [
    products,
    setProducts,
  ] = useState<Product[]>(
    [],
  );

  const [
    selectedProducts,
    setSelectedProducts,
  ] = useState<
    SelectedProduct[]
  >([]);

  const [
    productsLoading,
    setProductsLoading,
  ] = useState(true);

  const [
    search,
    setSearch,
  ] = useState('');

  const [
    name,
    setName,
  ] = useState('');

  const [
    slug,
    setSlug,
  ] = useState('');

  const [
    slugEdited,
    setSlugEdited,
  ] = useState(false);

  const [
    subtitle,
    setSubtitle,
  ] = useState('');

  const [
    description,
    setDescription,
  ] = useState('');

  const [
    image,
    setImage,
  ] = useState('');

  const [
    sortOrder,
    setSortOrder,
  ] = useState(0);

  const [
    isActive,
    setIsActive,
  ] = useState(true);

  const [
    isFeatured,
    setIsFeatured,
  ] = useState(false);

  const [
    seoTitle,
    setSeoTitle,
  ] = useState('');

  const [
    seoDescription,
    setSeoDescription,
  ] = useState('');

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState('');

  useEffect(() => {
    async function loadProducts() {
      try {
        setProductsLoading(
          true,
        );

        const data =
          await getProducts();

        setProducts(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Ürünler yüklenemedi.',
        );
      } finally {
        setProductsLoading(
          false,
        );
      }
    }

    void loadProducts();
  }, []);

  const filteredProducts =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLocaleLowerCase(
            'tr-TR',
          );

      if (!query) {
        return products;
      }

      return products.filter(
        (product) =>
          product.name
            .toLocaleLowerCase(
              'tr-TR',
            )
            .includes(query) ||
          product.slug
            .toLocaleLowerCase(
              'tr-TR',
            )
            .includes(query) ||
          product.categories?.some(
            (category) =>
              category.name
                .toLocaleLowerCase(
                  'tr-TR',
                )
                .includes(
                  query,
                ),
          ),
      );
    }, [
      products,
      search,
    ]);

  const selectedIds =
    useMemo(
      () =>
        new Set(
          selectedProducts.map(
            (item) =>
              item.product.id,
          ),
        ),
      [selectedProducts],
    );

  function handleNameChange(
    value: string,
  ) {
    setName(value);

    if (!slugEdited) {
      setSlug(
        slugify(value),
      );
    }
  }

  function toggleProduct(
    product: Product,
  ) {
    if (
      selectedIds.has(
        product.id,
      )
    ) {
      setSelectedProducts(
        (current) =>
          current.filter(
            (item) =>
              item.product.id !==
              product.id,
          ),
      );

      return;
    }

    setSelectedProducts(
      (current) => [
        ...current,
        {
          product,
        },
      ],
    );
  }

  function removeProduct(
    productId: string,
  ) {
    setSelectedProducts(
      (current) =>
        current.filter(
          (item) =>
            item.product.id !==
            productId,
        ),
    );
  }

  function moveProduct(
    index: number,
    direction:
      | 'up'
      | 'down',
  ) {
    setSelectedProducts(
      (current) => {
        const targetIndex =
          direction === 'up'
            ? index - 1
            : index + 1;

        if (
          targetIndex < 0 ||
          targetIndex >=
            current.length
        ) {
          return current;
        }

        const next = [
          ...current,
        ];

        const [
          moved,
        ] = next.splice(
          index,
          1,
        );

        next.splice(
          targetIndex,
          0,
          moved,
        );

        return next;
      },
    );
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !name.trim()
    ) {
      setError(
        'Koleksiyon adı zorunludur.',
      );

      return;
    }

    if (
      !slug.trim()
    ) {
      setError(
        'Slug zorunludur.',
      );

      return;
    }

    try {
      setSaving(true);
      setError('');

      await createCollection(
        {
          name:
            name.trim(),

          slug:
            slugify(slug),

          subtitle:
            subtitle.trim() ||
            undefined,

          description:
            description.trim() ||
            undefined,

          image:
            image ||
            undefined,

          sortOrder,

          isActive,

          isFeatured,

          seoTitle:
            seoTitle.trim() ||
            undefined,

          seoDescription:
            seoDescription.trim() ||
            undefined,

          products:
            selectedProducts.map(
              (
                item,
                index,
              ) => ({
                productId:
                  item.product.id,

                sortOrder:
                  index,
              }),
            ),
        },
      );

      router.push(
        '/collections',
      );

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Koleksiyon oluşturulamadı.',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout title="Yeni Koleksiyon">
      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-6"
      >
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <Link
              href="/collections"
              className="text-xs font-semibold text-[#9b6e5d] transition hover:text-[#351f28]"
            >
              ← Koleksiyonlara
              Dön
            </Link>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#351f28]">
              Yeni Koleksiyon
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8d7d83]">
              Özel bir ürün grubu
              oluştur, koleksiyon
              görselini belirle ve
              vitrindeki ürün
              sıralamasını yönet.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/collections"
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#e4d9d4] bg-white px-5 text-sm font-semibold text-[#6b575e] transition hover:bg-[#faf6f4]"
            >
              Vazgeç
            </Link>

            <button
              type="submit"
              disabled={
                saving
              }
              className="inline-flex h-12 min-w-[160px] items-center justify-center gap-2 rounded-2xl bg-[#351f28] px-5 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(53,31,40,0.18)] transition hover:bg-[#482b37] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Kaydediliyor
                </>
              ) : (
                <>
                  <CheckIcon />
                  Koleksiyonu Kaydet
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-6">
            <section className="rounded-[26px] border border-[#eadfd9] bg-white p-6 shadow-[0_10px_35px_rgba(53,31,40,0.04)]">
              <div className="mb-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a17b6c]">
                  Temel Bilgiler
                </p>

                <h2 className="mt-2 text-lg font-semibold text-[#351f28]">
                  Koleksiyon Bilgileri
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-[#68565d]">
                    Koleksiyon Adı *
                  </span>

                  <input
                    value={name}
                    onChange={(
                      event,
                    ) =>
                      handleNameChange(
                        event.target
                          .value,
                      )
                    }
                    placeholder="Örn. Sevgiliye Çiçekler"
                    className="h-12 w-full rounded-2xl border border-[#e5dad6] bg-[#fcfaf9] px-4 text-sm text-[#351f28] outline-none transition focus:border-[#b48a78] focus:bg-white focus:ring-4 focus:ring-[#b48a78]/10"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-[#68565d]">
                    Slug *
                  </span>

                  <input
                    value={slug}
                    onChange={(
                      event,
                    ) => {
                      setSlugEdited(
                        true,
                      );

                      setSlug(
                        slugify(
                          event.target
                            .value,
                        ),
                      );
                    }}
                    placeholder="sevgiliye-cicekler"
                    className="h-12 w-full rounded-2xl border border-[#e5dad6] bg-[#fcfaf9] px-4 text-sm text-[#351f28] outline-none transition focus:border-[#b48a78] focus:bg-white focus:ring-4 focus:ring-[#b48a78]/10"
                  />
                </label>

                <label className="block md:col-span-2">
                  <span className="mb-2 block text-xs font-semibold text-[#68565d]">
                    Alt Başlık
                  </span>

                  <input
                    value={
                      subtitle
                    }
                    onChange={(
                      event,
                    ) =>
                      setSubtitle(
                        event.target
                          .value,
                      )
                    }
                    placeholder="Aşkınızı çiçeklerle anlatın"
                    className="h-12 w-full rounded-2xl border border-[#e5dad6] bg-[#fcfaf9] px-4 text-sm text-[#351f28] outline-none transition focus:border-[#b48a78] focus:bg-white focus:ring-4 focus:ring-[#b48a78]/10"
                  />
                </label>

                <label className="block md:col-span-2">
                  <span className="mb-2 block text-xs font-semibold text-[#68565d]">
                    Açıklama
                  </span>

                  <textarea
                    value={
                      description
                    }
                    onChange={(
                      event,
                    ) =>
                      setDescription(
                        event.target
                          .value,
                      )
                    }
                    rows={5}
                    placeholder="Koleksiyon hakkında kısa bir açıklama..."
                    className="w-full resize-none rounded-2xl border border-[#e5dad6] bg-[#fcfaf9] px-4 py-3 text-sm leading-6 text-[#351f28] outline-none transition focus:border-[#b48a78] focus:bg-white focus:ring-4 focus:ring-[#b48a78]/10"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-[26px] border border-[#eadfd9] bg-white p-6 shadow-[0_10px_35px_rgba(53,31,40,0.04)]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a17b6c]">
                    Ürün Seçimi
                  </p>

                  <h2 className="mt-2 text-lg font-semibold text-[#351f28]">
                    Koleksiyon Ürünleri
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-[#95868c]">
                    Koleksiyonda
                    gösterilecek
                    ürünleri seç.
                  </p>
                </div>

                <div className="rounded-full bg-[#f6efec] px-4 py-2 text-xs font-semibold text-[#795d52]">
                  {
                    selectedProducts.length
                  }{' '}
                  ürün seçildi
                </div>
              </div>

              <div className="relative mt-6">
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
                  placeholder="Ürün veya kategori ara..."
                  className="h-12 w-full rounded-2xl border border-[#e5dad6] bg-[#fcfaf9] pl-12 pr-4 text-sm text-[#351f28] outline-none transition focus:border-[#b48a78] focus:bg-white focus:ring-4 focus:ring-[#b48a78]/10"
                />
              </div>

              {productsLoading ? (
                <div className="flex min-h-[250px] items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-[#ddd0ca] border-t-[#351f28]" />

                    <p className="mt-3 text-xs text-[#95868c]">
                      Ürünler
                      yükleniyor...
                    </p>
                  </div>
                </div>
              ) : filteredProducts.length ===
                0 ? (
                <div className="mt-6 rounded-2xl bg-[#faf7f5] px-5 py-10 text-center text-sm text-[#95868c]">
                  Eşleşen ürün
                  bulunamadı.
                </div>
              ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProducts.map(
                    (product) => {
                      const selected =
                        selectedIds.has(
                          product.id,
                        );

                      const price =
                        getProductPrice(
                          product,
                        );

                      return (
                        <button
                          key={
                            product.id
                          }
                          type="button"
                          onClick={() =>
                            toggleProduct(
                              product,
                            )
                          }
                          className={[
                            'group overflow-hidden rounded-[20px] border text-left transition-all',
                            selected
                              ? 'border-[#351f28] bg-[#fbf7f5] shadow-[0_8px_25px_rgba(53,31,40,0.08)]'
                              : 'border-[#e9dfdb] bg-white hover:-translate-y-0.5 hover:border-[#cdb6ac] hover:shadow-md',
                          ].join(' ')}
                        >
                          <div className="relative aspect-[4/3] overflow-hidden bg-[#f6efec]">
                            {product.heroImage ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={
                                  product.heroImage
                                }
                                alt={
                                  product.name
                                }
                                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs text-[#a8999f]">
                                Görsel yok
                              </div>
                            )}

                            <div
                              className={[
                                'absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border shadow-sm transition',
                                selected
                                  ? 'border-[#351f28] bg-[#351f28] text-white'
                                  : 'border-white/80 bg-white/90 text-[#806d74]',
                              ].join(' ')}
                            >
                              {selected ? (
                                <CheckIcon />
                              ) : (
                                <PlusIcon />
                              )}
                            </div>

                            {!product.isActive && (
                              <span className="absolute left-3 top-3 rounded-full bg-black/65 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-white">
                                Pasif
                              </span>
                            )}
                          </div>

                          <div className="p-4">
                            <p className="truncate text-sm font-semibold text-[#351f28]">
                              {
                                product.name
                              }
                            </p>

                            <div className="mt-2 flex items-center justify-between gap-3">
                              <span className="truncate text-[10px] text-[#9b8d92]">
                                {product.categories
                                  ?.map(
                                    (
                                      category,
                                    ) =>
                                      category.name,
                                  )
                                  .join(
                                    ', ',
                                  ) ||
                                  'Kategorisiz'}
                              </span>

                              {price !==
                                null && (
                                <span className="shrink-0 text-xs font-semibold text-[#7c5b4f]">
                                  {formatPrice(
                                    price,
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    },
                  )}
                </div>
              )}
            </section>

            {selectedProducts.length >
              0 && (
              <section className="rounded-[26px] border border-[#eadfd9] bg-white p-6 shadow-[0_10px_35px_rgba(53,31,40,0.04)]">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a17b6c]">
                    Sıralama
                  </p>

                  <h2 className="mt-2 text-lg font-semibold text-[#351f28]">
                    Koleksiyon Sırası
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-[#95868c]">
                    Ürünlerin
                    müşteriye hangi
                    sırada
                    gösterileceğini
                    belirle.
                  </p>
                </div>

                <div className="mt-6 space-y-3">
                  {selectedProducts.map(
                    (
                      item,
                      index,
                    ) => (
                      <div
                        key={
                          item.product
                            .id
                        }
                        className="flex items-center gap-4 rounded-2xl border border-[#ebe1dd] bg-[#fcfaf9] p-3"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#351f28] text-xs font-semibold text-white">
                          {index +
                            1}
                        </div>

                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#f4ece8]">
                          {item.product
                            .heroImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
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
                            <div className="flex h-full items-center justify-center text-[9px] text-[#a8999f]">
                              Görsel
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-[#4b3941]">
                            {
                              item.product
                                .name
                            }
                          </p>

                          <p className="mt-1 truncate text-[10px] text-[#9e9095]">
                            /
                            {
                              item.product
                                .slug
                            }
                          </p>
                        </div>

                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            disabled={
                              index === 0
                            }
                            onClick={() =>
                              moveProduct(
                                index,
                                'up',
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e5d9d4] bg-white text-[#745d66] transition hover:bg-[#f7f1ee] disabled:cursor-not-allowed disabled:opacity-30"
                            title="Yukarı taşı"
                          >
                            <ArrowUpIcon />
                          </button>

                          <button
                            type="button"
                            disabled={
                              index ===
                              selectedProducts.length -
                                1
                            }
                            onClick={() =>
                              moveProduct(
                                index,
                                'down',
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e5d9d4] bg-white text-[#745d66] transition hover:bg-[#f7f1ee] disabled:cursor-not-allowed disabled:opacity-30"
                            title="Aşağı taşı"
                          >
                            <ArrowDownIcon />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              removeProduct(
                                item.product
                                  .id,
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-100 bg-white text-red-400 transition hover:bg-red-50 hover:text-red-600"
                            title="Koleksiyondan çıkar"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </section>
            )}

            <section className="rounded-[26px] border border-[#eadfd9] bg-white p-6 shadow-[0_10px_35px_rgba(53,31,40,0.04)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a17b6c]">
                Arama Motorları
              </p>

              <h2 className="mt-2 text-lg font-semibold text-[#351f28]">
                SEO
              </h2>

              <div className="mt-6 space-y-5">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-[#68565d]">
                    SEO Başlığı
                  </span>

                  <input
                    value={
                      seoTitle
                    }
                    onChange={(
                      event,
                    ) =>
                      setSeoTitle(
                        event.target
                          .value,
                      )
                    }
                    placeholder="Sevgiliye Çiçekler | Florea"
                    className="h-12 w-full rounded-2xl border border-[#e5dad6] bg-[#fcfaf9] px-4 text-sm text-[#351f28] outline-none focus:border-[#b48a78] focus:bg-white focus:ring-4 focus:ring-[#b48a78]/10"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-[#68565d]">
                    SEO Açıklaması
                  </span>

                  <textarea
                    value={
                      seoDescription
                    }
                    onChange={(
                      event,
                    ) =>
                      setSeoDescription(
                        event.target
                          .value,
                      )
                    }
                    rows={3}
                    placeholder="Arama sonuçlarında gösterilecek açıklama..."
                    className="w-full resize-none rounded-2xl border border-[#e5dad6] bg-[#fcfaf9] px-4 py-3 text-sm text-[#351f28] outline-none focus:border-[#b48a78] focus:bg-white focus:ring-4 focus:ring-[#b48a78]/10"
                  />
                </label>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-[26px] border border-[#eadfd9] bg-white p-5 shadow-[0_10px_35px_rgba(53,31,40,0.04)]">
              <p className="mb-4 text-xs font-semibold text-[#5f4c54]">
                Koleksiyon Kapağı
              </p>

              <ImageUploader
                value={image}
                onChange={
                  setImage
                }
                uploadType="collection"
                title="Koleksiyon görseli"
                description="JPG, PNG veya WEBP • Maksimum 5 MB"
              />
            </section>

            <section className="rounded-[26px] border border-[#eadfd9] bg-white p-5 shadow-[0_10px_35px_rgba(53,31,40,0.04)]">
              <p className="text-xs font-semibold text-[#5f4c54]">
                Yayın Ayarları
              </p>

              <div className="mt-5 space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[#49383f]">
                      Aktif
                    </p>

                    <p className="mt-1 text-[11px] leading-4 text-[#9a8c91]">
                      Koleksiyon
                      müşterilere
                      gösterilebilir.
                    </p>
                  </div>

                  <Toggle
                    checked={
                      isActive
                    }
                    onChange={
                      setIsActive
                    }
                  />
                </div>

                <div className="h-px bg-[#eee5e1]" />

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[#49383f]">
                      Öne Çıkan
                    </p>

                    <p className="mt-1 text-[11px] leading-4 text-[#9a8c91]">
                      Ana vitrinde öne
                      çıkarılabilir.
                    </p>
                  </div>

                  <Toggle
                    checked={
                      isFeatured
                    }
                    onChange={
                      setIsFeatured
                    }
                  />
                </div>

                <div className="h-px bg-[#eee5e1]" />

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-[#68565d]">
                    Koleksiyon Sırası
                  </span>

                  <input
                    type="number"
                    min={0}
                    value={
                      sortOrder
                    }
                    onChange={(
                      event,
                    ) =>
                      setSortOrder(
                        Math.max(
                          0,
                          Number(
                            event
                              .target
                              .value,
                          ) || 0,
                        ),
                      )
                    }
                    className="h-11 w-full rounded-xl border border-[#e5dad6] bg-[#fcfaf9] px-4 text-sm text-[#351f28] outline-none focus:border-[#b48a78]"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-[26px] bg-[#351f28] p-5 text-white shadow-[0_15px_35px_rgba(53,31,40,0.15)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                Özet
              </p>

              <p className="mt-3 text-lg font-semibold">
                {name ||
                  'Yeni Koleksiyon'}
              </p>

              <div className="mt-5 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-white/50">
                    Ürün
                  </span>

                  <span className="font-semibold">
                    {
                      selectedProducts.length
                    }
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white/50">
                    Durum
                  </span>

                  <span className="font-semibold">
                    {isActive
                      ? 'Aktif'
                      : 'Pasif'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white/50">
                    Öne Çıkan
                  </span>

                  <span className="font-semibold">
                    {isFeatured
                      ? 'Evet'
                      : 'Hayır'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white/50">
                    Sıra
                  </span>

                  <span className="font-semibold">
                    {sortOrder}
                  </span>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </form>
    </AdminLayout>
  );
}