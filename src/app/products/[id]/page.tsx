'use client';

import {
  FormEvent,
  useEffect,
  useState,
} from 'react';

import Link from 'next/link';

import {
  useParams,
  useRouter,
} from 'next/navigation';

import AdminLayout from '@/components/admin/AdminLayout';
import ImageUploader from '@/components/admin/ImageUploader';

import {
  getCategories,
  getProductById,
  updateProduct,
} from '@/lib/api';

import type {
  Category,
  Product,
  UpdateProductPayload,
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

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const id =
    params.id as string;

  const [
    originalProduct,
    setOriginalProduct,
  ] =
    useState<Product | null>(
      null,
    );

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
  ] = useState<SizeRow[]>([]);

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
    pageLoading,
    setPageLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState('');

  const [
    success,
    setSuccess,
  ] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setError('');

        const [
          product,
          categoryResult,
        ] = await Promise.all([
          getProductById(id),
          getCategories(),
        ]);

        setOriginalProduct(
          product,
        );

        setCategories(
          categoryResult,
        );

        setName(product.name);
        setSlug(product.slug);

        setSubtitle(
          product.subtitle ?? '',
        );

        setDescription(
          product.description ?? '',
        );

        setFlowerName(
          product.flowerName ?? '',
        );

        setHeroImage(
          product.heroImage ?? '',
        );

        setIsActive(
          product.isActive,
        );

        setIsFeatured(
          product.isFeatured,
        );

        setStockEnabled(
          product.stockEnabled,
        );

        setStockQuantity(
          String(
            product.stockQuantity,
          ),
        );

        setSeoTitle(
          product.seoTitle ?? '',
        );

        setSeoDescription(
          product.seoDescription ??
            '',
        );

        setSelectedCategories(
          product.categories.map(
            (category) =>
              category.id,
          ),
        );

        setSizes(
          product.sizes.map(
            (size) => ({
              name:
                size.name ?? '',

              count: String(
                size.count,
              ),

              price: String(
                size.price,
              ),
            }),
          ),
        );

        setWraps(
          product.wraps.map(
            (wrap) => ({
              name: wrap.name,

              image:
                wrap.image ?? '',

              extraPrice: String(
                wrap.extraPrice,
              ),
            }),
          ),
        );

        setCards(
          product.cards.map(
            (card) => ({
              name: card.name,

              extraPrice: String(
                card.extraPrice,
              ),
            }),
          ),
        );

        setImages(
          product.images.map(
            (image) => ({
              url: image.url,

              alt:
                image.alt ?? '',
            }),
          ),
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Ürün alınamadı.',
        );
      } finally {
        setPageLoading(false);
      }
    }

    if (id) {
      load();
    }
  }, [id]);

  function toggleCategory(
    categoryId: string,
  ) {
    setSelectedCategories(
      (current) =>
        current.includes(
          categoryId,
        )
          ? current.filter(
              (item) =>
                item !==
                categoryId,
            )
          : [
              ...current,
              categoryId,
            ],
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
    setSuccess('');

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

    if (
      validSizes.length === 0
    ) {
      setError(
        'En az bir boyut ve fiyat seçeneği bulunmalıdır.',
      );

      return;
    }

    const counts =
      validSizes.map(
        (size) =>
          Number(size.count),
      );

    if (
      counts.some(
        (count) =>
          !Number.isInteger(
            count,
          ) ||
          count <= 0,
      )
    ) {
      setError(
        'Çiçek adetleri pozitif tam sayı olmalıdır.',
      );

      return;
    }

    if (
      new Set(counts).size !==
      counts.length
    ) {
      setError(
        'Aynı çiçek adedi birden fazla kez kullanılamaz.',
      );

      return;
    }

    if (
      validSizes.some(
        (size) =>
          Number.isNaN(
            Number(size.price),
          ) ||
          Number(size.price) <
            0,
      )
    ) {
      setError(
        'Fiyat bilgilerini kontrol edin.',
      );

      return;
    }

    const payload: UpdateProductPayload =
      {
        name: name.trim(),

        slug: slugify(
          slug,
        ),

        subtitle:
          subtitle.trim(),

        description:
          description.trim(),

        flowerName:
          flowerName.trim(),

        heroImage:
          heroImage.trim(),

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
          seoTitle.trim(),

        seoDescription:
          seoDescription.trim(),

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
      setSaving(true);

      const updated =
        await updateProduct(
          id,
          payload,
        );

      setOriginalProduct(
        updated,
      );

      setSuccess(
        'Ürün başarıyla güncellendi.',
      );

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Ürün güncellenemedi.',
      );

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } finally {
      setSaving(false);
    }
  }

  if (pageLoading) {
    return (
      <AdminLayout>
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#ddd0ca] border-t-[#351f28]" />

            <p className="text-sm text-[#958c8f]">
              Ürün hazırlanıyor...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!originalProduct) {
    return (
      <AdminLayout>
        <div className="mx-auto max-w-[700px] rounded-[28px] border border-[#ebe4e1] bg-white p-10 text-center">
          <h2 className="text-xl font-semibold text-[#3c3035]">
            Ürün bulunamadı
          </h2>

          <p className="mt-2 text-sm text-[#958c8f]">
            {error}
          </p>

          <Link
            href="/products"
            className="mt-6 inline-flex h-11 items-center rounded-xl bg-[#351f28] px-5 text-sm font-semibold text-white"
          >
            Ürünlere Dön
          </Link>
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
                className="hover:text-[#351f28]"
              >
                Ürünler
              </Link>

              <span>/</span>

              <span className="text-[#6c5d62]">
                {originalProduct.name}
              </span>
            </div>

            <h2 className="mt-3 text-[32px] font-semibold tracking-[-0.045em] text-[#33292d]">
              Ürünü Düzenle
            </h2>

            <p className="mt-2 text-sm text-[#958c8f]">
              Ürün bilgilerini,
              fiyatlarını, stok ve
              seçeneklerini yönetin.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={`http://localhost:3000/urunler/${slug}`}
              target="_blank"
              rel="noreferrer"
              className="flex h-12 items-center rounded-2xl border border-[#e6ddda] bg-white px-5 text-sm font-semibold text-[#62555a] transition hover:bg-[#f8f5f3]"
            >
              Mağazada Gör ↗
            </a>

            <Link
              href="/products"
              className="flex h-12 items-center rounded-2xl border border-[#e6ddda] bg-white px-5 text-sm font-semibold text-[#62555a]"
            >
              Vazgeç
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="h-12 min-w-[170px] rounded-2xl bg-[#351f28] px-6 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(53,31,40,0.18)] transition hover:bg-[#482a36] disabled:opacity-60"
            >
              {saving
                ? 'Kaydediliyor...'
                : 'Değişiklikleri Kaydet'}
            </button>
          </div>
        </div>

        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[#d9ebde] bg-[#f2faf4] px-5 py-4 text-sm font-medium text-[#4f795a]">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#5d8a67] text-xs text-white">
              ✓
            </span>

            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.65fr)_390px]">
          <div className="space-y-6">
            <Section
              title="Ürün Bilgileri"
              description="Müşterilerin ürün detay sayfasında göreceği bilgiler."
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <FieldLabel required>
                    Ürün Adı
                  </FieldLabel>

                  <input
                    value={name}
                    onChange={(event) =>
                      setName(
                        event.target.value,
                      )
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <FieldLabel required>
                    URL / Slug
                  </FieldLabel>

                  <input
                    value={slug}
                    onChange={(event) =>
                      setSlug(
                        slugify(
                          event.target.value,
                        ),
                      )
                    }
                    className={inputClass}
                  />

                  <p className="mt-2 text-[11px] text-[#aaa1a4]">
                    /urunler/{slug}
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
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <FieldLabel>
                    Açıklama
                  </FieldLabel>

                  <textarea
                    value={description}
                    onChange={(event) =>
                      setDescription(
                        event.target.value,
                      )
                    }
                    rows={6}
                    className={textareaClass}
                  />
                </div>
              </div>
            </Section>

            <Section
              title="Boyut & Fiyat"
              description="Ürünün adet ve fiyat varyasyonlarını düzenleyin."
            >
              <div className="space-y-3">
                {sizes.map(
                  (size, index) => (
                    <div
                      key={index}
                      className="grid gap-3 rounded-[20px] border border-[#eee7e4] bg-[#fcfaf9] p-4 md:grid-cols-[1fr_130px_170px_44px]"
                    >
                      <input
                        value={size.name}
                        onChange={(event) =>
                          updateSize(
                            index,
                            'name',
                            event.target.value,
                          )
                        }
                        placeholder="Seçenek adı"
                        className={inputClass}
                      />

                      <input
                        type="number"
                        min="1"
                        value={size.count}
                        onChange={(event) =>
                          updateSize(
                            index,
                            'count',
                            event.target.value,
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
                          value={size.price}
                          onChange={(event) =>
                            updateSize(
                              index,
                              'price',
                              event.target.value,
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
                          sizes.length === 1
                        }
                        onClick={() =>
                          setSizes(
                            (current) =>
                              current.filter(
                                (_, itemIndex) =>
                                  itemIndex !== index,
                              ),
                          )
                        }
                        className="flex h-12 items-center justify-center rounded-2xl border border-[#efdddd] text-[#b56363] hover:bg-[#fff3f3] disabled:opacity-30"
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
                className="mt-4 rounded-xl border border-dashed border-[#cdbbb3] px-4 py-3 text-sm font-semibold text-[#8d6657] hover:bg-[#faf5f2]"
              >
                + Boyut / Fiyat Ekle
              </button>
            </Section>

            <Section
              title="Ambalaj Seçenekleri"
              description="Ürün için sunulan ambalajları düzenleyin."
            >
              <div className="space-y-3">
                {wraps.map(
                  (wrap, index) => (
                    <div
                      key={index}
                      className="grid gap-3 rounded-[20px] border border-[#eee7e4] bg-[#fcfaf9] p-4 md:grid-cols-[1fr_1.3fr_150px_44px]"
                    >
                      <input
                        value={wrap.name}
                        onChange={(event) =>
                          updateWrap(
                            index,
                            'name',
                            event.target.value,
                          )
                        }
                        placeholder="Ambalaj adı"
                        className={inputClass}
                      />

                      <input
                        value={wrap.image}
                        onChange={(event) =>
                          updateWrap(
                            index,
                            'image',
                            event.target.value,
                          )
                        }
                        placeholder="Görsel URL"
                        className={inputClass}
                      />

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={wrap.extraPrice}
                        onChange={(event) =>
                          updateWrap(
                            index,
                            'extraPrice',
                            event.target.value,
                          )
                        }
                        placeholder="+ Fiyat"
                        className={inputClass}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setWraps(
                            (current) =>
                              current.filter(
                                (_, itemIndex) =>
                                  itemIndex !== index,
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

              <button
                type="button"
                onClick={() =>
                  setWraps(
                    (current) => [
                      ...current,
                      {
                        name: '',
                        image: '',
                        extraPrice: '0',
                      },
                    ],
                  )
                }
                className="mt-4 rounded-xl border border-dashed border-[#cdbbb3] px-4 py-3 text-sm font-semibold text-[#8d6657] hover:bg-[#faf5f2]"
              >
                + Ambalaj Ekle
              </button>
            </Section>

            <Section
              title="Kart Seçenekleri"
              description="Mesaj kartı seçeneklerini düzenleyin."
            >
              <div className="space-y-3">
                {cards.map(
                  (card, index) => (
                    <div
                      key={index}
                      className="grid gap-3 rounded-[20px] border border-[#eee7e4] bg-[#fcfaf9] p-4 md:grid-cols-[1fr_180px_44px]"
                    >
                      <input
                        value={card.name}
                        onChange={(event) =>
                          updateCard(
                            index,
                            'name',
                            event.target.value,
                          )
                        }
                        placeholder="Kart adı"
                        className={inputClass}
                      />

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={card.extraPrice}
                        onChange={(event) =>
                          updateCard(
                            index,
                            'extraPrice',
                            event.target.value,
                          )
                        }
                        placeholder="+ Fiyat"
                        className={inputClass}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setCards(
                            (current) =>
                              current.filter(
                                (_, itemIndex) =>
                                  itemIndex !== index,
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

              <button
                type="button"
                onClick={() =>
                  setCards(
                    (current) => [
                      ...current,
                      {
                        name: '',
                        extraPrice: '0',
                      },
                    ],
                  )
                }
                className="mt-4 rounded-xl border border-dashed border-[#cdbbb3] px-4 py-3 text-sm font-semibold text-[#8d6657] hover:bg-[#faf5f2]"
              >
                + Kart Ekle
              </button>
            </Section>

            <Section
              title="Galeri"
              description="Ürün detayında kullanılacak ek görseller."
            >
              <div className="space-y-3">
                {images.map(
                  (image, index) => (
                    <div
                      key={index}
                      className="grid gap-3 rounded-[20px] border border-[#eee7e4] bg-[#fcfaf9] p-4 md:grid-cols-[1.5fr_1fr_44px]"
                    >
                      <input
                        value={image.url}
                        onChange={(event) =>
                          updateImage(
                            index,
                            'url',
                            event.target.value,
                          )
                        }
                        placeholder="Görsel URL"
                        className={inputClass}
                      />

                      <input
                        value={image.alt}
                        onChange={(event) =>
                          updateImage(
                            index,
                            'alt',
                            event.target.value,
                          )
                        }
                        placeholder="Alt metin"
                        className={inputClass}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setImages(
                            (current) =>
                              current.filter(
                                (_, itemIndex) =>
                                  itemIndex !== index,
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
                className="mt-4 rounded-xl border border-dashed border-[#cdbbb3] px-4 py-3 text-sm font-semibold text-[#8d6657] hover:bg-[#faf5f2]"
              >
                + Galeri Görseli Ekle
              </button>
            </Section>

            <Section
              title="SEO"
              description="Google arama sonuçlarında kullanılacak bilgiler."
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
                    value={seoDescription}
                    onChange={(event) =>
                      setSeoDescription(
                        event.target.value,
                      )
                    }
                    maxLength={170}
                    rows={4}
                    className={textareaClass}
                  />

                  <p className="mt-2 text-right text-[11px] text-[#aaa1a4]">
                    {seoDescription.length}/170
                  </p>
                </div>
              </div>
            </Section>
          </div>

          <aside className="space-y-6 xl:sticky xl:top-[112px]">
            <Section
              title="Ana Görsel"
              description="Ürün kartlarında kullanılacak ana fotoğraf."
            >
              <ImageUploader
                value={heroImage}
                onChange={setHeroImage}
                title="Ana ürün görselini yükle"
              />
            </Section>

            <Section
              title="Yayın Durumu"
              description="Ürünün mağazadaki görünürlüğü."
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
                      Ana sayfada öne
                      çıkarılabilir.
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
              title="Kategoriler"
              description="Ürünün bağlı olduğu kategoriler."
            >
              <div className="space-y-2">
                {categories.map(
                  (category) => {
                    const selected =
                      selectedCategories.includes(
                        category.id,
                      );

                    return (
                      <button
                        key={category.id}
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
                          {category.name}
                        </span>
                      </button>
                    );
                  },
                )}
              </div>
            </Section>

            <Section
              title="Stok"
              description="Ürünün stok takibini yönetin."
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
                    value={stockQuantity}
                    onChange={(event) =>
                      setStockQuantity(
                        event.target.value,
                      )
                    }
                    className={inputClass}
                  />
                </div>
              )}
            </Section>

            <div className="rounded-[26px] bg-[#351f28] p-6 text-white">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d7ad9a]">
                Ürün Bilgisi
              </p>

              <p className="mt-4 text-sm font-semibold">
                {originalProduct.name}
              </p>

              <p className="mt-2 break-all text-[11px] leading-5 text-white/40">
                ID: {originalProduct.id}
              </p>

              <p className="mt-1 text-[11px] text-white/40">
                /urunler/{slug}
              </p>
            </div>
          </aside>
        </div>

        <div className="mt-6 flex justify-end rounded-[24px] border border-[#e8dfdc] bg-white p-5">
          <button
            type="submit"
            disabled={saving}
            className="h-12 min-w-[190px] rounded-2xl bg-[#351f28] px-6 text-sm font-semibold text-white transition hover:bg-[#482a36] disabled:opacity-60"
          >
            {saving
              ? 'Kaydediliyor...'
              : 'Değişiklikleri Kaydet'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}