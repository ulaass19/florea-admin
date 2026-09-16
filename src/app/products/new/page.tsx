'use client';

import {
  FormEvent,
  useEffect,
  useState,
} from 'react';

import Link from 'next/link';
import ImageUploader from '@/components/admin/ImageUploader';

import {
  useRouter,
} from 'next/navigation';

import AdminLayout from '@/components/admin/AdminLayout';

import {
  createProduct,
  getCategories,
} from '@/lib/api';

import type {
  Category,
  CreateProductPayload,
} from '@/lib/api';

type SizeRow = {
  name: string;
  count: string;
  price: string;
};

type WrapRow = {
  name: string;
  image: string;
  extraPrice: string;
};

type CardRow = {
  name: string;
  extraPrice: string;
};

type ImageRow = {
  url: string;
  alt: string;
};

function slugify(
  value: string,
) {
  return value
    .toLocaleLowerCase('tr-TR')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[26px] border border-[#ebe4e1] bg-white">
      <div className="border-b border-[#f0ebe8] px-6 py-5">
        <h3 className="text-[17px] font-semibold tracking-[-0.02em] text-[#3a3034]">
          {title}
        </h3>

        {description && (
          <p className="mt-1.5 text-xs leading-5 text-[#9c9396]">
            {description}
          </p>
        )}
      </div>

      <div className="p-6">
        {children}
      </div>
    </section>
  );
}

function FieldLabel({
  children,
  required = false,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="mb-2 block text-sm font-medium text-[#4c4044]">
      {children}

      {required && (
        <span className="ml-1 text-[#b56363]">
          *
        </span>
      )}
    </label>
  );
}

const inputClass =
  'h-12 w-full rounded-2xl border border-[#e7dfdc] bg-[#fcfaf9] px-4 text-sm text-[#3f3438] outline-none transition placeholder:text-[#b2a9ac] focus:border-[#b99d90] focus:bg-white focus:ring-4 focus:ring-[#b99d90]/10';

const textareaClass =
  'w-full resize-none rounded-2xl border border-[#e7dfdc] bg-[#fcfaf9] px-4 py-3.5 text-sm leading-6 text-[#3f3438] outline-none transition placeholder:text-[#b2a9ac] focus:border-[#b99d90] focus:bg-white focus:ring-4 focus:ring-[#b99d90]/10';

export default function NewProductPage() {
  const router = useRouter();

  const [
    categories,
    setCategories,
  ] = useState<Category[]>([]);

  const [
    selectedCategories,
    setSelectedCategories,
  ] = useState<string[]>([]);

  const [name, setName] =
    useState('');

  const [slug, setSlug] =
    useState('');

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
    flowerName,
    setFlowerName,
  ] = useState('');

  const [
    heroImage,
    setHeroImage,
  ] = useState('');

  const [
    isActive,
    setIsActive,
  ] = useState(true);

  const [
    isFeatured,
    setIsFeatured,
  ] = useState(false);

  const [
    stockEnabled,
    setStockEnabled,
  ] = useState(false);

  const [
    stockQuantity,
    setStockQuantity,
  ] = useState('0');

  const [
    seoTitle,
    setSeoTitle,
  ] = useState('');

  const [
    seoDescription,
    setSeoDescription,
  ] = useState('');

  const [
    sizes,
    setSizes,
  ] = useState<SizeRow[]>([
    {
      name: 'Standart',
      count: '12',
      price: '',
    },
  ]);

  const [
    wraps,
    setWraps,
  ] = useState<WrapRow[]>([]);

  const [
    cards,
    setCards,
  ] = useState<CardRow[]>([]);

  const [
    images,
    setImages,
  ] = useState<ImageRow[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    pageLoading,
    setPageLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState('');

  useEffect(() => {
    async function loadCategories() {
      try {
        const result =
          await getCategories();

        setCategories(
          result.filter(
            (category) =>
              category.isActive,
          ),
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Kategoriler alınamadı.',
        );
      } finally {
        setPageLoading(false);
      }
    }

    loadCategories();
  }, []);

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

  function toggleCategory(
    id: string,
  ) {
    setSelectedCategories(
      (current) =>
        current.includes(id)
          ? current.filter(
              (item) =>
                item !== id,
            )
          : [...current, id],
    );
  }

  function updateSize(
    index: number,
    key: keyof SizeRow,
    value: string,
  ) {
    setSizes((current) =>
      current.map(
        (item, itemIndex) =>
          itemIndex === index
            ? {
                ...item,
                [key]: value,
              }
            : item,
      ),
    );
  }

  function updateWrap(
    index: number,
    key: keyof WrapRow,
    value: string,
  ) {
    setWraps((current) =>
      current.map(
        (item, itemIndex) =>
          itemIndex === index
            ? {
                ...item,
                [key]: value,
              }
            : item,
      ),
    );
  }

  function updateCard(
    index: number,
    key: keyof CardRow,
    value: string,
  ) {
    setCards((current) =>
      current.map(
        (item, itemIndex) =>
          itemIndex === index
            ? {
                ...item,
                [key]: value,
              }
            : item,
      ),
    );
  }

  function updateImage(
    index: number,
    key: keyof ImageRow,
    value: string,
  ) {
    setImages((current) =>
      current.map(
        (item, itemIndex) =>
          itemIndex === index
            ? {
                ...item,
                [key]: value,
              }
            : item,
      ),
    );
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError('');

    if (!name.trim()) {
      setError(
        'Ürün adı zorunludur.',
      );
      return;
    }

    if (!slug.trim()) {
      setError(
        'Slug zorunludur.',
      );
      return;
    }

    const validSizes =
      sizes.filter(
        (size) =>
          size.count.trim() &&
          size.price.trim(),
      );

    if (validSizes.length === 0) {
      setError(
        'En az bir boyut ve fiyat seçeneği eklemelisiniz.',
      );
      return;
    }

    const hasInvalidSize =
      validSizes.some(
        (size) =>
          Number(size.count) <= 0 ||
          Number(size.price) < 0 ||
          Number.isNaN(
            Number(size.count),
          ) ||
          Number.isNaN(
            Number(size.price),
          ),
      );

    if (hasInvalidSize) {
      setError(
        'Boyut ve fiyat bilgilerini kontrol edin.',
      );
      return;
    }

    const counts =
      validSizes.map(
        (size) =>
          Number(size.count),
      );

    if (
      new Set(counts).size !==
      counts.length
    ) {
      setError(
        'Aynı çiçek adedi birden fazla kez kullanılamaz.',
      );
      return;
    }

    const payload: CreateProductPayload =
      {
        name: name.trim(),
        slug: slugify(slug),

        subtitle:
          subtitle.trim() ||
          undefined,

        description:
          description.trim() ||
          undefined,

        flowerName:
          flowerName.trim() ||
          undefined,

        heroImage:
          heroImage.trim() ||
          undefined,

        isActive,
        isFeatured,

        stockEnabled,

        stockQuantity:
          stockEnabled
            ? Math.max(
                0,
                Number(
                  stockQuantity,
                ) || 0,
              )
            : 0,

        seoTitle:
          seoTitle.trim() ||
          undefined,

        seoDescription:
          seoDescription.trim() ||
          undefined,

        categoryIds:
          selectedCategories,

        sizes:
          validSizes.map(
            (size, index) => ({
              name:
                size.name.trim() ||
                undefined,

              count: Number(
                size.count,
              ),

              price: Number(
                size.price,
              ),

              isActive: true,
              sortOrder: index,
            }),
          ),

        wraps: wraps
          .filter((wrap) =>
            wrap.name.trim(),
          )
          .map(
            (wrap, index) => ({
              name:
                wrap.name.trim(),

              image:
                wrap.image.trim() ||
                undefined,

              extraPrice:
                Number(
                  wrap.extraPrice,
                ) || 0,

              isActive: true,
              sortOrder: index,
            }),
          ),

        cards: cards
          .filter((card) =>
            card.name.trim(),
          )
          .map(
            (card, index) => ({
              name:
                card.name.trim(),

              extraPrice:
                Number(
                  card.extraPrice,
                ) || 0,

              isActive: true,
              sortOrder: index,
            }),
          ),

        images: images
          .filter((image) =>
            image.url.trim(),
          )
          .map(
            (image, index) => ({
              url:
                image.url.trim(),

              alt:
                image.alt.trim() ||
                name.trim(),

              sortOrder: index,
            }),
          ),
      };

    try {
      setLoading(true);

      await createProduct(
        payload,
      );

      router.push('/products');
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Ürün oluşturulamadı.',
      );

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } finally {
      setLoading(false);
    }
  }

  if (pageLoading) {
    return (
      <AdminLayout>
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#ddd0ca] border-t-[#351f28]" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-[1500px]"
      >
        <div className="mb-7 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-[#9d9497]">
              <Link
                href="/products"
                className="transition hover:text-[#351f28]"
              >
                Ürünler
              </Link>

              <span>/</span>

              <span className="text-[#6c5d62]">
                Yeni Ürün
              </span>
            </div>

            <h2 className="mt-3 text-[32px] font-semibold tracking-[-0.045em] text-[#33292d]">
              Yeni Ürün Ekle
            </h2>

            <p className="mt-2 text-sm text-[#958c8f]">
              Mağazada satışa
              sunulacak yeni çiçek
              ürününü oluşturun.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/products"
              className="flex h-12 items-center justify-center rounded-2xl border border-[#e6ddda] bg-white px-5 text-sm font-semibold text-[#62555a] transition hover:bg-[#f8f5f3]"
            >
              Vazgeç
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 min-w-[150px] items-center justify-center rounded-2xl bg-[#351f28] px-6 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(53,31,40,0.18)] transition hover:bg-[#482a36] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? 'Kaydediliyor...'
                : isActive
                  ? 'Ürünü Yayınla'
                  : 'Taslak Kaydet'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.65fr)_390px]">
          <div className="space-y-6">
            <Section
              title="Ürün Bilgileri"
              description="Müşterilerin ürün sayfasında göreceği temel bilgiler."
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <FieldLabel required>
                    Ürün Adı
                  </FieldLabel>

                  <input
                    value={name}
                    onChange={(event) =>
                      handleNameChange(
                        event.target.value,
                      )
                    }
                    placeholder="Örn. Gece Yarısı"
                    className={inputClass}
                  />
                </div>

                <div>
                  <FieldLabel required>
                    URL / Slug
                  </FieldLabel>

                  <input
                    value={slug}
                    onChange={(event) => {
                      setSlugEdited(true);

                      setSlug(
                        slugify(
                          event.target.value,
                        ),
                      );
                    }}
                    placeholder="gece-yarisi"
                    className={inputClass}
                  />

                  <p className="mt-2 text-[11px] text-[#aaa1a4]">
                    /urunler/
                    {slug ||
                      'urun-adi'}
                  </p>
                </div>

                <div>
                  <FieldLabel>
                    Çiçek Türü
                  </FieldLabel>

                  <input
                    value={flowerName}
                    onChange={(event) =>
                      setFlowerName(
                        event.target.value,
                      )
                    }
                    placeholder="Örn. Kırmızı Gül"
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <FieldLabel>
                    Alt Başlık
                  </FieldLabel>

                  <input
                    value={subtitle}
                    onChange={(event) =>
                      setSubtitle(
                        event.target.value,
                      )
                    }
                    placeholder="Örn. Zarif ve etkileyici bir buket"
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <FieldLabel>
                    Ürün Açıklaması
                  </FieldLabel>

                  <textarea
                    value={description}
                    onChange={(event) =>
                      setDescription(
                        event.target.value,
                      )
                    }
                    rows={6}
                    placeholder="Ürünün hikayesini ve özelliklerini anlatın..."
                    className={textareaClass}
                  />
                </div>
              </div>
            </Section>

            <Section
              title="Boyut & Fiyat"
              description="Müşteri ürün sayfasında bu seçeneklerden birini seçebilecek."
            >
              <div className="space-y-3">
                {sizes.map(
                  (size, index) => (
                    <div
                      key={index}
                      className="grid gap-3 rounded-[20px] border border-[#eee7e4] bg-[#fcfaf9] p-4 md:grid-cols-[1fr_130px_170px_44px]"
                    >
                      <input
                        value={
                          size.name
                        }
                        onChange={(
                          event,
                        ) =>
                          updateSize(
                            index,
                            'name',
                            event.target
                              .value,
                          )
                        }
                        placeholder="Adı (Standart)"
                        className={inputClass}
                      />

                      <input
                        type="number"
                        min="1"
                        value={
                          size.count
                        }
                        onChange={(
                          event,
                        ) =>
                          updateSize(
                            index,
                            'count',
                            event.target
                              .value,
                          )
                        }
                        placeholder="Adet"
                        className={inputClass}
                      />

                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={
                            size.price
                          }
                          onChange={(
                            event,
                          ) =>
                            updateSize(
                              index,
                              'price',
                              event
                                .target
                                .value,
                            )
                          }
                          placeholder="Fiyat"
                          className={`${inputClass} pr-10`}
                        />

                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#a69da0]">
                          ₺
                        </span>
                      </div>

                      <button
                        type="button"
                        disabled={
                          sizes.length ===
                          1
                        }
                        onClick={() =>
                          setSizes(
                            (
                              current,
                            ) =>
                              current.filter(
                                (
                                  _,
                                  itemIndex,
                                ) =>
                                  itemIndex !==
                                  index,
                              ),
                          )
                        }
                        className="flex h-12 items-center justify-center rounded-2xl border border-[#efdddd] text-[#b56363] transition hover:bg-[#fff3f3] disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        ×
                      </button>
                    </div>
                  ),
                )}
              </div>

              <button
                type="button"
                onClick={() =>
                  setSizes(
                    (current) => [
                      ...current,

                      {
                        name: '',
                        count: '',
                        price: '',
                      },
                    ],
                  )
                }
                className="mt-4 rounded-xl border border-dashed border-[#cdbbb3] px-4 py-3 text-sm font-semibold text-[#8d6657] transition hover:bg-[#faf5f2]"
              >
                + Boyut / Fiyat Ekle
              </button>
            </Section>

            <Section
              title="Ambalaj Seçenekleri"
              description="Kraft, premium siyah, beyaz ambalaj gibi ürün seçenekleri."
            >
              {wraps.length ===
              0 ? (
                <div className="rounded-[20px] border border-dashed border-[#ded3cf] bg-[#fcfaf9] px-5 py-7 text-center">
                  <p className="text-sm font-medium text-[#74676b]">
                    Henüz ambalaj
                    seçeneği yok.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {wraps.map(
                    (
                      wrap,
                      index,
                    ) => (
                      <div
                        key={index}
                        className="grid gap-4 rounded-[20px] border border-[#eee7e4] bg-[#fcfaf9] p-4 md:grid-cols-[1fr_220px_150px_44px] md:items-start"
                      >
                        <input
                          value={
                            wrap.name
                          }
                          onChange={(
                            event,
                          ) =>
                            updateWrap(
                              index,
                              'name',
                              event
                                .target
                                .value,
                            )
                          }
                          placeholder="Ambalaj adı"
                          className={inputClass}
                        />

                        <div className="md:col-span-1">
                          <ImageUploader
                            value={wrap.image}
                            onChange={(url) =>
                              updateWrap(
                                index,
                                'image',
                                url,
                              )
                            }
                            title="Ambalaj görselini yükle"
                            description="JPG, PNG veya WEBP • Maksimum 5 MB"
                          />
                        </div>

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={
                            wrap.extraPrice
                          }
                          onChange={(
                            event,
                          ) =>
                            updateWrap(
                              index,
                              'extraPrice',
                              event
                                .target
                                .value,
                            )
                          }
                          placeholder="+ Fiyat"
                          className={inputClass}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setWraps(
                              (
                                current,
                              ) =>
                                current.filter(
                                  (
                                    _,
                                    itemIndex,
                                  ) =>
                                    itemIndex !==
                                    index,
                                ),
                            )
                          }
                          className="flex h-12 items-center justify-center rounded-2xl border border-[#efdddd] text-[#b56363] hover:bg-[#fff3f3]"
                        >
                          ×
                        </button>
                      </div>
                    ),
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={() =>
                  setWraps(
                    (current) => [
                      ...current,

                      {
                        name: '',
                        image: '',
                        extraPrice:
                          '0',
                      },
                    ],
                  )
                }
                className="mt-4 rounded-xl border border-dashed border-[#cdbbb3] px-4 py-3 text-sm font-semibold text-[#8d6657] transition hover:bg-[#faf5f2]"
              >
                + Ambalaj Ekle
              </button>
            </Section>

            <Section
              title="Kart Seçenekleri"
              description="Standart kart, premium kart gibi mesaj kartı seçenekleri."
            >
              {cards.length === 0 ? (
                <div className="rounded-[20px] border border-dashed border-[#ded3cf] bg-[#fcfaf9] px-5 py-7 text-center">
                  <p className="text-sm font-medium text-[#74676b]">
                    Henüz kart
                    seçeneği yok.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cards.map(
                    (
                      card,
                      index,
                    ) => (
                      <div
                        key={index}
                        className="grid gap-3 rounded-[20px] border border-[#eee7e4] bg-[#fcfaf9] p-4 md:grid-cols-[1fr_180px_44px]"
                      >
                        <input
                          value={
                            card.name
                          }
                          onChange={(
                            event,
                          ) =>
                            updateCard(
                              index,
                              'name',
                              event
                                .target
                                .value,
                            )
                          }
                          placeholder="Kart adı"
                          className={inputClass}
                        />

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={
                            card.extraPrice
                          }
                          onChange={(
                            event,
                          ) =>
                            updateCard(
                              index,
                              'extraPrice',
                              event
                                .target
                                .value,
                            )
                          }
                          placeholder="+ Fiyat"
                          className={inputClass}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setCards(
                              (
                                current,
                              ) =>
                                current.filter(
                                  (
                                    _,
                                    itemIndex,
                                  ) =>
                                    itemIndex !==
                                    index,
                                ),
                            )
                          }
                          className="flex h-12 items-center justify-center rounded-2xl border border-[#efdddd] text-[#b56363] hover:bg-[#fff3f3]"
                        >
                          ×
                        </button>
                      </div>
                    ),
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={() =>
                  setCards(
                    (current) => [
                      ...current,

                      {
                        name: '',
                        extraPrice:
                          '0',
                      },
                    ],
                  )
                }
                className="mt-4 rounded-xl border border-dashed border-[#cdbbb3] px-4 py-3 text-sm font-semibold text-[#8d6657] transition hover:bg-[#faf5f2]"
              >
                + Kart Ekle
              </button>
            </Section>

            <Section
              title="Galeri"
              description="Ürün detay sayfasında gösterilecek ek görseller."
            >
              {images.length > 0 && (
                <div className="mb-4 space-y-3">
                  {images.map(
                    (
                      image,
                      index,
                    ) => (
                      <div
                        key={index}
                        className="grid gap-4 rounded-[20px] border border-[#eee7e4] bg-[#fcfaf9] p-4 md:grid-cols-[220px_1fr_44px] md:items-start"
                      >
                        <ImageUploader
                          value={image.url}
                          onChange={(url) =>
                            updateImage(
                              index,
                              'url',
                              url,
                            )
                          }
                          title="Galeri görselini yükle"
                          description="JPG, PNG veya WEBP • Maksimum 5 MB"
                        />

                        <input
                          value={
                            image.alt
                          }
                          onChange={(
                            event,
                          ) =>
                            updateImage(
                              index,
                              'alt',
                              event
                                .target
                                .value,
                            )
                          }
                          placeholder="Alt metin"
                          className={inputClass}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setImages(
                              (
                                current,
                              ) =>
                                current.filter(
                                  (
                                    _,
                                    itemIndex,
                                  ) =>
                                    itemIndex !==
                                    index,
                                ),
                            )
                          }
                          className="flex h-12 items-center justify-center rounded-2xl border border-[#efdddd] text-[#b56363] hover:bg-[#fff3f3]"
                        >
                          ×
                        </button>
                      </div>
                    ),
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={() =>
                  setImages(
                    (current) => [
                      ...current,

                      {
                        url: '',
                        alt: '',
                      },
                    ],
                  )
                }
                className="rounded-xl border border-dashed border-[#cdbbb3] px-4 py-3 text-sm font-semibold text-[#8d6657] transition hover:bg-[#faf5f2]"
              >
                + Galeri Görseli Ekle
              </button>
            </Section>

            <Section
              title="SEO"
              description="Google arama sonuçları için ürün başlığı ve açıklaması."
            >
              <div className="space-y-5">
                <div>
                  <FieldLabel>
                    SEO Başlığı
                  </FieldLabel>

                  <input
                    value={seoTitle}
                    onChange={(event) =>
                      setSeoTitle(
                        event.target.value,
                      )
                    }
                    maxLength={70}
                    placeholder="Google'da görünecek başlık"
                    className={inputClass}
                  />

                  <p className="mt-2 text-right text-[11px] text-[#aaa1a4]">
                    {seoTitle.length}/70
                  </p>
                </div>

                <div>
                  <FieldLabel>
                    SEO Açıklaması
                  </FieldLabel>

                  <textarea
                    value={
                      seoDescription
                    }
                    onChange={(event) =>
                      setSeoDescription(
                        event.target.value,
                      )
                    }
                    maxLength={170}
                    rows={4}
                    placeholder="Google arama sonuçlarında gösterilecek açıklama..."
                    className={textareaClass}
                  />

                  <p className="mt-2 text-right text-[11px] text-[#aaa1a4]">
                    {
                      seoDescription.length
                    }
                    /170
                  </p>
                </div>
              </div>
            </Section>
          </div>

          <aside className="space-y-6 xl:sticky xl:top-[112px]">
            <Section
              title="Yayın Durumu"
              description="Ürünün mağazada görünürlüğünü belirleyin."
            >
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() =>
                    setIsActive(
                      !isActive,
                    )
                  }
                  className="flex w-full items-center justify-between rounded-2xl border border-[#eee7e4] px-4 py-4 text-left"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#493d41]">
                      Ürün Yayında
                    </p>

                    <p className="mt-1 text-[11px] text-[#9c9396]">
                      Müşteriler ürünü
                      görebilir.
                    </p>
                  </div>

                  <span
                    className={[
                      'relative h-7 w-12 rounded-full transition',
                      isActive
                        ? 'bg-[#597864]'
                        : 'bg-[#d9d2d4]',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition',
                        isActive
                          ? 'left-6'
                          : 'left-1',
                      ].join(' ')}
                    />
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setIsFeatured(
                      !isFeatured,
                    )
                  }
                  className="flex w-full items-center justify-between rounded-2xl border border-[#eee7e4] px-4 py-4 text-left"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#493d41]">
                      Öne Çıkan
                    </p>

                    <p className="mt-1 text-[11px] text-[#9c9396]">
                      Ana sayfada
                      öne çıkarılabilir.
                    </p>
                  </div>

                  <span
                    className={[
                      'relative h-7 w-12 rounded-full transition',
                      isFeatured
                        ? 'bg-[#b17b61]'
                        : 'bg-[#d9d2d4]',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition',
                        isFeatured
                          ? 'left-6'
                          : 'left-1',
                      ].join(' ')}
                    />
                  </span>
                </button>
              </div>
            </Section>

            <Section
  title="Ana Görsel"
  description="Ürün kartlarında ve detay sayfasında kullanılacak."
>
  <ImageUploader
    value={heroImage}
    onChange={setHeroImage}
    title="Ana ürün görselini yükle"
  />

  {heroImage && (
    <div className="mt-4">
      <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.1em] text-[#a09799]">
        Görsel Adresi
      </p>

      <div className="break-all rounded-xl bg-[#f8f5f3] px-3 py-3 text-[10px] leading-5 text-[#9a9093]">
        {heroImage}
      </div>
    </div>
  )}
</Section>

            <Section
              title="Kategoriler"
              description="Ürünün dahil olacağı kategorileri seçin."
            >
              {categories.length ===
              0 ? (
                <div className="rounded-2xl bg-[#fcfaf9] p-4 text-sm text-[#93898c]">
                  Henüz aktif kategori
                  bulunmuyor.
                </div>
              ) : (
                <div className="space-y-2">
                  {categories.map(
                    (category) => {
                      const selected =
                        selectedCategories.includes(
                          category.id,
                        );

                      return (
                        <button
                          key={
                            category.id
                          }
                          type="button"
                          onClick={() =>
                            toggleCategory(
                              category.id,
                            )
                          }
                          className={[
                            'flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition',
                            selected
                              ? 'border-[#cdb8ae] bg-[#faf4f1]'
                              : 'border-[#eee7e4] bg-white hover:bg-[#fcfaf9]',
                          ].join(' ')}
                        >
                          <span
                            className={[
                              'flex h-5 w-5 items-center justify-center rounded-md border text-[11px]',
                              selected
                                ? 'border-[#8e6657] bg-[#8e6657] text-white'
                                : 'border-[#d7cdca] text-transparent',
                            ].join(' ')}
                          >
                            ✓
                          </span>

                          <span className="text-sm font-medium text-[#55484d]">
                            {
                              category.name
                            }
                          </span>
                        </button>
                      );
                    },
                  )}
                </div>
              )}

              <Link
                href="/categories"
                className="mt-4 block text-xs font-semibold text-[#9a6e5d] hover:text-[#351f28]"
              >
                Kategorileri yönet →
              </Link>
            </Section>

            <Section
              title="Stok"
              description="İsterseniz ürün stok miktarını takip edin."
            >
              <button
                type="button"
                onClick={() =>
                  setStockEnabled(
                    !stockEnabled,
                  )
                }
                className="flex w-full items-center justify-between rounded-2xl border border-[#eee7e4] px-4 py-4 text-left"
              >
                <div>
                  <p className="text-sm font-semibold text-[#493d41]">
                    Stok Takibi
                  </p>

                  <p className="mt-1 text-[11px] text-[#9c9396]">
                    Stok miktarını
                    kontrol et.
                  </p>
                </div>

                <span
                  className={[
                    'relative h-7 w-12 rounded-full transition',
                    stockEnabled
                      ? 'bg-[#597864]'
                      : 'bg-[#d9d2d4]',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition',
                      stockEnabled
                        ? 'left-6'
                        : 'left-1',
                    ].join(' ')}
                  />
                </span>
              </button>

              {stockEnabled && (
                <div className="mt-4">
                  <FieldLabel>
                    Stok Adedi
                  </FieldLabel>

                  <input
                    type="number"
                    min="0"
                    value={
                      stockQuantity
                    }
                    onChange={(event) =>
                      setStockQuantity(
                        event.target
                          .value,
                      )
                    }
                    className={inputClass}
                  />
                </div>
              )}
            </Section>
          </aside>
        </div>

        <div className="mt-6 flex items-center justify-between rounded-[24px] border border-[#e8dfdc] bg-white p-5">
          <p className="hidden text-xs text-[#9c9396] sm:block">
            Kaydetmeden önce ürün
            bilgilerini kontrol edin.
          </p>

          <div className="ml-auto flex gap-3">
            <Link
              href="/products"
              className="flex h-12 items-center rounded-2xl border border-[#e6ddda] px-5 text-sm font-semibold text-[#62555a]"
            >
              Vazgeç
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="h-12 min-w-[160px] rounded-2xl bg-[#351f28] px-6 text-sm font-semibold text-white transition hover:bg-[#482a36] disabled:opacity-60"
            >
              {loading
                ? 'Kaydediliyor...'
                : isActive
                  ? 'Ürünü Yayınla'
                  : 'Taslak Kaydet'}
            </button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}