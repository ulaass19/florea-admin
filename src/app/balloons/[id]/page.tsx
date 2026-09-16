'use client';

import {
  FormEvent,
  useEffect,
  useMemo,
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
  getBalloonById,
  updateBalloon,
} from '@/lib/api';

type BalloonVariantForm = {
  name: string;
  color: string;
  size: string;
  heliumIncluded: boolean;
  price: string;
  stockEnabled: boolean;
  stockQuantity: string;
  isActive: boolean;
};

type BalloonImageForm = {
  url: string;
  alt: string;
};

function BackIcon() {
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
      <path d="m15 18-6-6 6-6" />
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
      <path d="M12 5v14M5 12h14" />
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

function ImageIcon() {
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
        x="3"
        y="4"
        width="18"
        height="16"
        rx="3"
      />

      <circle
        cx="9"
        cy="10"
        r="2"
      />

      <path d="m5 18 5-5 3 3 2-2 4 4" />
    </svg>
  );
}

function VariantIcon() {
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

function SeoIcon() {
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
        r="6"
      />

      <path d="m16 16 4 4" />
      <path d="M8 11h6M11 8v6" />
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

function CheckIcon() {
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
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function createEmptyVariant(): BalloonVariantForm {
  return {
    name: '',
    color: '',
    size: '',
    heliumIncluded: true,
    price: '',
    stockEnabled: false,
    stockQuantity: '0',
    isActive: true,
  };
}

function createEmptyImage(): BalloonImageForm {
  return {
    url: '',
    alt: '',
  };
}

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
    .replace(
      /[^a-z0-9]+/g,
      '-',
    )
    .replace(
      /^-+|-+$/g,
      '',
    );
}

function SectionTitle({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#f7efeb] text-[#9b6e5d]">
        {icon}
      </div>

      <div>
        <h2 className="text-[16px] font-semibold text-[#351f28]">
          {title}
        </h2>

        <p className="mt-1 text-xs leading-5 text-[#9b8b91]">
          {description}
        </p>
      </div>
    </div>
  );
}

function Toggle({
  value,
  onChange,
  disabled = false,
}: {
  value: boolean;
  onChange: (
    value: boolean,
  ) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() =>
        onChange(!value)
      }
      className={[
        'relative inline-flex h-7 w-[50px] shrink-0 items-center rounded-full transition',
        value
          ? 'bg-[#351f28]'
          : 'bg-[#ddd2ce]',
        disabled
          ? 'cursor-not-allowed opacity-50'
          : '',
      ].join(' ')}
    >
      <span
        className={[
          'h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
          value
            ? 'translate-x-[26px]'
            : 'translate-x-1',
        ].join(' ')}
      />
    </button>
  );
}

export default function EditBalloonPage() {
  const params =
    useParams<{
      id: string;
    }>();

  const router =
    useRouter();

  const id =
    params.id;

  const [
    name,
    setName,
  ] = useState('');

  const [
    slug,
    setSlug,
  ] = useState('');

  const [
    subtitle,
    setSubtitle,
  ] = useState('');

  const [
    description,
    setDescription,
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
    seoTitle,
    setSeoTitle,
  ] = useState('');

  const [
    seoDescription,
    setSeoDescription,
  ] = useState('');

  const [
    images,
    setImages,
  ] = useState<
    BalloonImageForm[]
  >([]);

  const [
    variants,
    setVariants,
  ] = useState<
    BalloonVariantForm[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState('');

  const [
    success,
    setSuccess,
  ] = useState(false);

  const [
    slugEdited,
    setSlugEdited,
  ] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadBalloon() {
      try {
        setLoading(true);
        setError('');

        const balloon =
          await getBalloonById(
            id,
          );

        if (!mounted) {
          return;
        }

        setName(
          balloon.name ??
            '',
        );

        setSlug(
          balloon.slug ??
            '',
        );

        setSubtitle(
          balloon.subtitle ??
            '',
        );

        setDescription(
          balloon.description ??
            '',
        );

        setHeroImage(
          balloon.heroImage ??
            '',
        );

        setIsActive(
          balloon.isActive,
        );

        setIsFeatured(
          balloon.isFeatured,
        );

        setSeoTitle(
          balloon.seoTitle ??
            '',
        );

        setSeoDescription(
          balloon.seoDescription ??
            '',
        );

        setImages(
          balloon.images?.map(
            (image) => ({
              url:
                image.url ??
                '',

              alt:
                image.alt ??
                '',
            }),
          ) ?? [],
        );

        const mappedVariants =
          balloon.variants?.map(
            (variant) => ({
              name:
                variant.name ??
                '',

              color:
                variant.color ??
                '',

              size:
                variant.size ??
                '',

              heliumIncluded:
                variant.heliumIncluded,

              price:
                String(
                  variant.price,
                ),

              stockEnabled:
                variant.stockEnabled,

              stockQuantity:
                String(
                  variant.stockQuantity ??
                    0,
                ),

              isActive:
                variant.isActive,
            }),
          ) ?? [];

        setVariants(
          mappedVariants.length
            ? mappedVariants
            : [
                createEmptyVariant(),
              ],
        );
      } catch (err) {
        if (!mounted) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : 'Balon bilgileri alınamadı.',
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadBalloon();

    return () => {
      mounted = false;
    };
  }, [id]);

  const activeVariants =
    useMemo(
      () =>
        variants.filter(
          (variant) =>
            variant.isActive,
        ).length,
      [variants],
    );

  const minimumPrice =
    useMemo(() => {
      const prices =
        variants
          .filter(
            (variant) =>
              variant.isActive &&
              variant.price !==
                '',
          )
          .map(
            (variant) =>
              Number(
                variant.price,
              ),
          )
          .filter(
            (price) =>
              Number.isFinite(
                price,
              ),
          );

      if (
        prices.length === 0
      ) {
        return null;
      }

      return Math.min(
        ...prices,
      );
    }, [variants]);

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

  function handleSlugChange(
    value: string,
  ) {
    setSlugEdited(true);

    setSlug(
      slugify(value),
    );
  }

  function addVariant() {
    setVariants(
      (current) => [
        ...current,
        createEmptyVariant(),
      ],
    );
  }

  function removeVariant(
    index: number,
  ) {
    setVariants(
      (current) =>
        current.filter(
          (_, itemIndex) =>
            itemIndex !==
            index,
        ),
    );
  }

  function updateVariant<
    K extends keyof BalloonVariantForm,
  >(
    index: number,
    key: K,
    value: BalloonVariantForm[K],
  ) {
    setVariants(
      (current) =>
        current.map(
          (
            variant,
            itemIndex,
          ) =>
            itemIndex ===
            index
              ? {
                  ...variant,
                  [key]:
                    value,
                }
              : variant,
        ),
    );
  }

  function addImage() {
    setImages(
      (current) => [
        ...current,
        createEmptyImage(),
      ],
    );
  }

  function removeImage(
    index: number,
  ) {
    setImages(
      (current) =>
        current.filter(
          (_, itemIndex) =>
            itemIndex !==
            index,
        ),
    );
  }

  function updateImage(
    index: number,
    key: 'url' | 'alt',
    value: string,
  ) {
    setImages(
      (current) =>
        current.map(
          (
            image,
            itemIndex,
          ) =>
            itemIndex ===
            index
              ? {
                  ...image,
                  [key]:
                    value,
                }
              : image,
        ),
    );
  }

  async function handleSubmit(
    event: FormEvent,
  ) {
    event.preventDefault();

    setError('');
    setSuccess(false);

    const cleanName =
      name.trim();

    const cleanSlug =
      slug.trim();

    if (!cleanName) {
      setError(
        'Balon adı zorunludur.',
      );

      return;
    }

    if (!cleanSlug) {
      setError(
        'Balon slug alanı zorunludur.',
      );

      return;
    }

    if (
      variants.length === 0
    ) {
      setError(
        'En az bir balon varyantı bulunmalıdır.',
      );

      return;
    }

    const invalidPrice =
      variants.some(
        (variant) =>
          variant.price.trim() ===
            '' ||
          !Number.isFinite(
            Number(
              variant.price,
            ),
          ) ||
          Number(
            variant.price,
          ) < 0,
      );

    if (invalidPrice) {
      setError(
        'Tüm varyantlar için geçerli bir fiyat girmelisiniz.',
      );

      return;
    }

    const invalidStock =
      variants.some(
        (variant) =>
          variant.stockEnabled &&
          (
            variant.stockQuantity
              .trim() ===
              '' ||
            !Number.isInteger(
              Number(
                variant.stockQuantity,
              ),
            ) ||
            Number(
              variant.stockQuantity,
            ) < 0
          ),
      );

    if (invalidStock) {
      setError(
        'Stok takibi açık varyantlar için geçerli bir stok adedi girmelisiniz.',
      );

      return;
    }

    try {
      setSubmitting(true);

      await updateBalloon(
        id,
        {
          name:
            cleanName,

          slug:
            cleanSlug,

          /*
           * Edit ekranında boş değerleri de gönderiyoruz.
           * Böylece daha önce yazılmış subtitle / description /
           * heroImage / SEO alanları gerçekten temizlenebilir.
           */
          subtitle:
            subtitle.trim(),

          description:
            description.trim(),

          heroImage,

          isActive,
          isFeatured,

          seoTitle:
            seoTitle.trim(),

          seoDescription:
            seoDescription.trim(),

          images: images
            .filter(
              (image) =>
                image.url.trim(),
            )
            .map(
              (
                image,
                index,
              ) => ({
                url:
                  image.url,

                alt:
                  image.alt.trim() ||
                  undefined,

                sortOrder:
                  index,
              }),
            ),

          variants:
            variants.map(
              (
                variant,
                index,
              ) => ({
                name:
                  variant.name.trim() ||
                  undefined,

                color:
                  variant.color.trim() ||
                  undefined,

                size:
                  variant.size.trim() ||
                  undefined,

                heliumIncluded:
                  variant.heliumIncluded,

                price:
                  Number(
                    variant.price,
                  ),

                stockEnabled:
                  variant.stockEnabled,

                stockQuantity:
                  variant.stockEnabled
                    ? Number(
                        variant.stockQuantity,
                      )
                    : 0,

                isActive:
                  variant.isActive,

                sortOrder:
                  index,
              }),
            ),
        },
      );

      setSuccess(true);

      window.setTimeout(
        () => {
          setSuccess(
            false,
          );
        },
        3000,
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Balon güncellenemedi.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex min-h-[70vh] items-center justify-center bg-[#fbf8f6]">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#e3d8d3] border-t-[#351f28]" />

            <p className="mt-4 text-sm font-medium text-[#8d7d83]">
              Balon bilgileri
              yükleniyor...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#fbf8f6]">
        <form
          onSubmit={
            handleSubmit
          }
        >
          <div className="mx-auto w-full max-w-[1500px] px-5 py-7 sm:px-7 lg:px-9 lg:py-9">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <Link
                  href="/balloons"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9a858d] transition hover:text-[#351f28]"
                >
                  <BackIcon />
                  Balonlara Dön
                </Link>

                <div className="mt-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a88b7e]">
                  <BalloonIcon />
                  Katalog Yönetimi
                </div>

                <h1 className="mt-3 text-[32px] font-semibold tracking-[-0.04em] text-[#351f28] sm:text-[38px]">
                  Balonu Düzenle
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8f7f85]">
                  Balonun bilgilerini,
                  görsellerini,
                  fiyatlarını ve
                  varyant stoklarını
                  güncelleyin.
                </p>
              </div>

              <div className="flex gap-3">
                <Link
                  href="/balloons"
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#e5d9d3] bg-white px-5 text-sm font-semibold text-[#705e65] transition hover:bg-[#faf6f4]"
                >
                  Vazgeç
                </Link>

                <button
                  type="submit"
                  disabled={
                    submitting
                  }
                  className="inline-flex h-12 min-w-[165px] items-center justify-center gap-2 rounded-2xl bg-[#351f28] px-6 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(53,31,40,0.16)] transition hover:-translate-y-0.5 hover:bg-[#472b36] disabled:cursor-wait disabled:opacity-60"
                >
                  {!submitting && (
                    <CheckIcon />
                  )}

                  {submitting
                    ? 'Kaydediliyor...'
                    : 'Değişiklikleri Kaydet'}
                </button>
              </div>
            </div>

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
                >
                  <CloseIcon />
                </button>
              </div>
            )}

            {success && (
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100">
                  <CheckIcon />
                </div>

                Balon başarıyla
                güncellendi.
              </div>
            )}

            <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_350px]">
              <div className="space-y-6">
                <section className="rounded-[28px] border border-[#eadfd8] bg-white p-6 shadow-[0_12px_40px_rgba(53,31,40,0.035)] sm:p-7">
                  <SectionTitle
                    icon={
                      <BalloonIcon />
                    }
                    title="Balon Bilgileri"
                    description="Müşterinin mağazada göreceği temel bilgiler."
                  />

                  <div className="mt-7 grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-[#5f4b53]">
                        Balon Adı *
                      </label>

                      <input
                        value={
                          name
                        }
                        onChange={(
                          event,
                        ) =>
                          handleNameChange(
                            event
                              .target
                              .value,
                          )
                        }
                        placeholder="Örn. Kırmızı Kalp Folyo Balon"
                        className="h-12 w-full rounded-2xl border border-[#e8ddd8] bg-[#fcfaf9] px-4 text-sm text-[#351f28] outline-none transition placeholder:text-[#b8aaaf] focus:border-[#b99080] focus:bg-white focus:ring-4 focus:ring-[#b99080]/10"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold text-[#5f4b53]">
                        Slug *
                      </label>

                      <input
                        value={
                          slug
                        }
                        onChange={(
                          event,
                        ) =>
                          handleSlugChange(
                            event
                              .target
                              .value,
                          )
                        }
                        placeholder="kirmizi-kalp-folyo-balon"
                        className="h-12 w-full rounded-2xl border border-[#e8ddd8] bg-[#fcfaf9] px-4 text-sm text-[#351f28] outline-none transition placeholder:text-[#b8aaaf] focus:border-[#b99080] focus:bg-white focus:ring-4 focus:ring-[#b99080]/10"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-xs font-semibold text-[#5f4b53]">
                        Alt Başlık
                      </label>

                      <input
                        value={
                          subtitle
                        }
                        onChange={(
                          event,
                        ) =>
                          setSubtitle(
                            event
                              .target
                              .value,
                          )
                        }
                        placeholder="Örn. Sevdiklerinize uçan bir sürpriz"
                        className="h-12 w-full rounded-2xl border border-[#e8ddd8] bg-[#fcfaf9] px-4 text-sm text-[#351f28] outline-none transition placeholder:text-[#b8aaaf] focus:border-[#b99080] focus:bg-white focus:ring-4 focus:ring-[#b99080]/10"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-xs font-semibold text-[#5f4b53]">
                        Açıklama
                      </label>

                      <textarea
                        value={
                          description
                        }
                        onChange={(
                          event,
                        ) =>
                          setDescription(
                            event
                              .target
                              .value,
                          )
                        }
                        rows={6}
                        placeholder="Balonun detaylı açıklamasını yazın..."
                        className="w-full resize-none rounded-2xl border border-[#e8ddd8] bg-[#fcfaf9] px-4 py-3.5 text-sm leading-6 text-[#351f28] outline-none transition placeholder:text-[#b8aaaf] focus:border-[#b99080] focus:bg-white focus:ring-4 focus:ring-[#b99080]/10"
                      />
                    </div>
                  </div>
                </section>

                <section className="rounded-[28px] border border-[#eadfd8] bg-white p-6 shadow-[0_12px_40px_rgba(53,31,40,0.035)] sm:p-7">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <SectionTitle
                      icon={
                        <VariantIcon />
                      }
                      title="Balon Varyantları"
                      description="Renk, boyut, helyum, fiyat ve stok seçeneklerini yönetin."
                    />

                    <button
                      type="button"
                      onClick={
                        addVariant
                      }
                      className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#f7efeb] px-4 text-xs font-semibold text-[#76594e] transition hover:bg-[#efe2dc]"
                    >
                      <PlusIcon />
                      Varyant Ekle
                    </button>
                  </div>

                  <div className="mt-7 space-y-5">
                    {variants.map(
                      (
                        variant,
                        index,
                      ) => (
                        <div
                          key={
                            index
                          }
                          className="overflow-hidden rounded-[24px] border border-[#e9dfda] bg-[#fdfbf9]"
                        >
                          <div className="flex items-center justify-between border-b border-[#eee5e0] bg-[#faf6f4] px-5 py-4">
                            <div>
                              <p className="text-sm font-semibold text-[#4c3740]">
                                Varyant{' '}
                                {index +
                                  1}
                              </p>

                              <p className="mt-0.5 text-[10px] text-[#a39399]">
                                {[
                                  variant.name,
                                  variant.color,
                                  variant.size,
                                ]
                                  .filter(
                                    Boolean,
                                  )
                                  .join(
                                    ' • ',
                                  ) ||
                                  'Yeni varyant'}
                              </p>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-semibold text-[#94838a]">
                                  Aktif
                                </span>

                                <Toggle
                                  value={
                                    variant.isActive
                                  }
                                  onChange={(
                                    value,
                                  ) =>
                                    updateVariant(
                                      index,
                                      'isActive',
                                      value,
                                    )
                                  }
                                />
                              </div>

                              {variants.length >
                                1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeVariant(
                                      index,
                                    )
                                  }
                                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-100 bg-white text-red-400 transition hover:bg-red-50 hover:text-red-600"
                                >
                                  <TrashIcon />
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="grid gap-5 p-5 md:grid-cols-2 xl:grid-cols-3">
                            <div>
                              <label className="mb-2 block text-xs font-semibold text-[#66535b]">
                                Varyant
                                Adı
                              </label>

                              <input
                                value={
                                  variant.name
                                }
                                onChange={(
                                  event,
                                ) =>
                                  updateVariant(
                                    index,
                                    'name',
                                    event
                                      .target
                                      .value,
                                  )
                                }
                                placeholder="Örn. Standart"
                                className="h-11 w-full rounded-xl border border-[#e7dcd7] bg-white px-3.5 text-sm text-[#351f28] outline-none focus:border-[#b99080]"
                              />
                            </div>

                            <div>
                              <label className="mb-2 block text-xs font-semibold text-[#66535b]">
                                Renk
                              </label>

                              <input
                                value={
                                  variant.color
                                }
                                onChange={(
                                  event,
                                ) =>
                                  updateVariant(
                                    index,
                                    'color',
                                    event
                                      .target
                                      .value,
                                  )
                                }
                                placeholder="Örn. Kırmızı"
                                className="h-11 w-full rounded-xl border border-[#e7dcd7] bg-white px-3.5 text-sm text-[#351f28] outline-none focus:border-[#b99080]"
                              />
                            </div>

                            <div>
                              <label className="mb-2 block text-xs font-semibold text-[#66535b]">
                                Boyut
                              </label>

                              <input
                                value={
                                  variant.size
                                }
                                onChange={(
                                  event,
                                ) =>
                                  updateVariant(
                                    index,
                                    'size',
                                    event
                                      .target
                                      .value,
                                  )
                                }
                                placeholder="Örn. 45 cm"
                                className="h-11 w-full rounded-xl border border-[#e7dcd7] bg-white px-3.5 text-sm text-[#351f28] outline-none focus:border-[#b99080]"
                              />
                            </div>

                            <div>
                              <label className="mb-2 block text-xs font-semibold text-[#66535b]">
                                Fiyat *
                              </label>

                              <div className="relative">
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={
                                    variant.price
                                  }
                                  onChange={(
                                    event,
                                  ) =>
                                    updateVariant(
                                      index,
                                      'price',
                                      event
                                        .target
                                        .value,
                                    )
                                  }
                                  placeholder="399"
                                  className="h-11 w-full rounded-xl border border-[#e7dcd7] bg-white px-3.5 pr-10 text-sm text-[#351f28] outline-none focus:border-[#b99080]"
                                />

                                <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-xs font-semibold text-[#9d8d93]">
                                  ₺
                                </span>
                              </div>
                            </div>

                            <div className="rounded-2xl border border-[#e8ddd8] bg-white px-4 py-3">
                              <div className="flex items-center justify-between gap-4">
                                <div>
                                  <p className="text-xs font-semibold text-[#5f4b53]">
                                    Helyum
                                  </p>

                                  <p className="mt-1 text-[10px] text-[#a29298]">
                                    Fiyata
                                    dahil
                                  </p>
                                </div>

                                <Toggle
                                  value={
                                    variant.heliumIncluded
                                  }
                                  onChange={(
                                    value,
                                  ) =>
                                    updateVariant(
                                      index,
                                      'heliumIncluded',
                                      value,
                                    )
                                  }
                                />
                              </div>
                            </div>

                            <div className="rounded-2xl border border-[#e8ddd8] bg-white px-4 py-3">
                              <div className="flex items-center justify-between gap-4">
                                <div>
                                  <p className="text-xs font-semibold text-[#5f4b53]">
                                    Stok
                                    Takibi
                                  </p>

                                  <p className="mt-1 text-[10px] text-[#a29298]">
                                    Varyant
                                    bazında
                                  </p>
                                </div>

                                <Toggle
                                  value={
                                    variant.stockEnabled
                                  }
                                  onChange={(
                                    value,
                                  ) =>
                                    updateVariant(
                                      index,
                                      'stockEnabled',
                                      value,
                                    )
                                  }
                                />
                              </div>
                            </div>

                            {variant.stockEnabled && (
                              <div className="md:col-span-2 xl:col-span-3">
                                <label className="mb-2 block text-xs font-semibold text-[#66535b]">
                                  Stok
                                  Adedi
                                </label>

                                <input
                                  type="number"
                                  min="0"
                                  step="1"
                                  value={
                                    variant.stockQuantity
                                  }
                                  onChange={(
                                    event,
                                  ) =>
                                    updateVariant(
                                      index,
                                      'stockQuantity',
                                      event
                                        .target
                                        .value,
                                    )
                                  }
                                  className="h-11 w-full rounded-xl border border-[#e7dcd7] bg-white px-3.5 text-sm text-[#351f28] outline-none focus:border-[#b99080]"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </section>

                <section className="rounded-[28px] border border-[#eadfd8] bg-white p-6 shadow-[0_12px_40px_rgba(53,31,40,0.035)] sm:p-7">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <SectionTitle
                      icon={
                        <ImageIcon />
                      }
                      title="Galeri"
                      description="Ana görsel dışında müşteriye gösterilecek diğer balon görselleri."
                    />

                    <button
                      type="button"
                      onClick={
                        addImage
                      }
                      className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#f7efeb] px-4 text-xs font-semibold text-[#76594e] transition hover:bg-[#efe2dc]"
                    >
                      <PlusIcon />
                      Görsel Ekle
                    </button>
                  </div>

                  {images.length ===
                  0 ? (
                    <div className="mt-7 rounded-[22px] border border-dashed border-[#ded0ca] bg-[#fcfaf9] px-6 py-10 text-center">
                      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f7efeb] text-[#a67e6e]">
                        <ImageIcon />
                      </div>

                      <p className="mt-4 text-sm font-semibold text-[#5c4850]">
                        Henüz galeri
                        görseli yok
                      </p>

                      <p className="mt-1 text-xs text-[#9e8e94]">
                        Birden fazla
                        balon görseli
                        ekleyebilirsiniz.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-7 grid gap-5 md:grid-cols-2">
                      {images.map(
                        (
                          image,
                          index,
                        ) => (
                          <div
                            key={
                              index
                            }
                            className="rounded-[22px] border border-[#e9dfda] bg-[#fcfaf9] p-4"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-xs font-semibold text-[#5c4850]">
                                Galeri
                                Görseli{' '}
                                {index +
                                  1}
                              </p>

                              <button
                                type="button"
                                onClick={() =>
                                  removeImage(
                                    index,
                                  )
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 transition hover:bg-red-50 hover:text-red-600"
                              >
                                <TrashIcon />
                              </button>
                            </div>

                            <div className="mt-4">
                              <ImageUploader
                                value={
                                  image.url
                                }
                                onChange={(
                                  url,
                                ) =>
                                  updateImage(
                                    index,
                                    'url',
                                    url,
                                  )
                                }
                                uploadType="balloon"
                                title="Balon görselini yükle"
                                description="JPG, PNG veya WEBP • Maksimum 5 MB"
                              />
                            </div>

                            <div className="mt-4">
                              <label className="mb-2 block text-[11px] font-semibold text-[#66535b]">
                                Görsel
                                Açıklaması
                              </label>

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
                                placeholder="Örn. Kırmızı kalp balon önden görünüm"
                                className="h-10 w-full rounded-xl border border-[#e7dcd7] bg-white px-3.5 text-xs text-[#351f28] outline-none focus:border-[#b99080]"
                              />
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </section>

                <section className="rounded-[28px] border border-[#eadfd8] bg-white p-6 shadow-[0_12px_40px_rgba(53,31,40,0.035)] sm:p-7">
                  <SectionTitle
                    icon={
                      <SeoIcon />
                    }
                    title="SEO"
                    description="Arama motorlarında kullanılacak başlık ve açıklama."
                  />

                  <div className="mt-7 space-y-5">
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-[#5f4b53]">
                        SEO Başlığı
                      </label>

                      <input
                        value={
                          seoTitle
                        }
                        onChange={(
                          event,
                        ) =>
                          setSeoTitle(
                            event
                              .target
                              .value,
                          )
                        }
                        placeholder="Örn. Kırmızı Kalp Folyo Balon"
                        className="h-12 w-full rounded-2xl border border-[#e8ddd8] bg-[#fcfaf9] px-4 text-sm text-[#351f28] outline-none focus:border-[#b99080]"
                      />

                      <p className="mt-2 text-right text-[10px] text-[#a7979d]">
                        {
                          seoTitle.length
                        }{' '}
                        karakter
                      </p>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold text-[#5f4b53]">
                        SEO Açıklaması
                      </label>

                      <textarea
                        value={
                          seoDescription
                        }
                        onChange={(
                          event,
                        ) =>
                          setSeoDescription(
                            event
                              .target
                              .value,
                          )
                        }
                        rows={4}
                        placeholder="Arama sonuçlarında gösterilecek kısa açıklama..."
                        className="w-full resize-none rounded-2xl border border-[#e8ddd8] bg-[#fcfaf9] px-4 py-3.5 text-sm leading-6 text-[#351f28] outline-none focus:border-[#b99080]"
                      />

                      <p className="mt-2 text-right text-[10px] text-[#a7979d]">
                        {
                          seoDescription.length
                        }{' '}
                        karakter
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              <div className="space-y-6 xl:sticky xl:top-7 xl:self-start">
                <section className="rounded-[28px] border border-[#eadfd8] bg-white p-6 shadow-[0_12px_40px_rgba(53,31,40,0.035)]">
                  <SectionTitle
                    icon={
                      <ImageIcon />
                    }
                    title="Ana Görsel"
                    description="Balon kartlarında kullanılacak kapak görseli."
                  />

                  <div className="mt-6">
                    <ImageUploader
                      value={
                        heroImage
                      }
                      onChange={
                        setHeroImage
                      }
                      uploadType="balloon"
                      title="Ana görseli yükle"
                      description="JPG, PNG veya WEBP • Maksimum 5 MB"
                    />
                  </div>
                </section>

                <section className="rounded-[28px] border border-[#eadfd8] bg-white p-6 shadow-[0_12px_40px_rgba(53,31,40,0.035)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#a6949b]">
                    Yayın Durumu
                  </p>

                  <div className="mt-5 space-y-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-[#4f3a43]">
                          Aktif
                        </p>

                        <p className="mt-1 text-[10px] leading-4 text-[#9e8e94]">
                          Balon
                          mağazada
                          satışa açık
                          olsun.
                        </p>
                      </div>

                      <Toggle
                        value={
                          isActive
                        }
                        onChange={
                          setIsActive
                        }
                      />
                    </div>

                    <div className="h-px bg-[#eee5e0]" />

                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-[#4f3a43]">
                          Öne Çıkan
                        </p>

                        <p className="mt-1 text-[10px] leading-4 text-[#9e8e94]">
                          Vitrin
                          alanlarında
                          öne çıkar.
                        </p>
                      </div>

                      <Toggle
                        value={
                          isFeatured
                        }
                        onChange={
                          setIsFeatured
                        }
                      />
                    </div>
                  </div>
                </section>

                <section className="rounded-[28px] bg-[#351f28] p-6 text-white shadow-[0_18px_50px_rgba(53,31,40,0.16)]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                    Balon Özeti
                  </p>

                  <p className="mt-4 text-lg font-semibold">
                    {name ||
                      'Balon'}
                  </p>

                  <p className="mt-1 truncate text-xs text-white/40">
                    /
                    {slug ||
                      'balon-slug'}
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white/[0.07] px-4 py-4">
                      <p className="text-[10px] text-white/40">
                        Varyant
                      </p>

                      <p className="mt-1 text-xl font-semibold">
                        {
                          variants.length
                        }
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/[0.07] px-4 py-4">
                      <p className="text-[10px] text-white/40">
                        Aktif
                      </p>

                      <p className="mt-1 text-xl font-semibold">
                        {
                          activeVariants
                        }
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 rounded-2xl bg-white/[0.07] px-4 py-4">
                    <p className="text-[10px] text-white/40">
                      Başlangıç
                      Fiyatı
                    </p>

                    <p className="mt-1 text-xl font-semibold">
                      {minimumPrice !==
                      null
                        ? `${minimumPrice.toLocaleString(
                            'tr-TR',
                          )} ₺`
                        : '—'}
                    </p>
                  </div>

                  <div className="mt-3 rounded-2xl bg-white/[0.07] px-4 py-4">
                    <p className="text-[10px] text-white/40">
                      Galeri
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {
                        images.filter(
                          (
                            image,
                          ) =>
                            image.url,
                        ).length
                      }{' '}
                      görsel
                    </p>
                  </div>
                </section>
              </div>
            </div>

            <div className="mt-7 flex flex-col-reverse gap-3 rounded-[26px] border border-[#eadfd8] bg-white p-4 shadow-[0_12px_40px_rgba(53,31,40,0.035)] sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <p className="text-xs leading-5 text-[#9b8b91]">
                Yaptığınız
                değişiklikler
                kaydet butonuna
                bastığınızda
                veritabanına
                aktarılır.
              </p>

              <button
                type="submit"
                disabled={
                  submitting
                }
                className="inline-flex h-11 min-w-[190px] items-center justify-center gap-2 rounded-xl bg-[#351f28] px-5 text-sm font-semibold text-white transition hover:bg-[#472b36] disabled:cursor-wait disabled:opacity-60"
              >
                {!submitting && (
                  <CheckIcon />
                )}

                {submitting
                  ? 'Kaydediliyor...'
                  : 'Değişiklikleri Kaydet'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}