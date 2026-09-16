'use client';

import {
  FormEvent,
  useState,
} from 'react';

import Link from 'next/link';

import {
  useRouter,
} from 'next/navigation';

import AdminLayout from '@/components/admin/AdminLayout';
import ImageUploader from '@/components/admin/ImageUploader';

import {
  createCategory,
} from '@/lib/api';

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

const inputClass =
  'h-12 w-full rounded-2xl border border-[#e7dfdc] bg-[#fcfaf9] px-4 text-sm text-[#3f3438] outline-none transition placeholder:text-[#b2a9ac] focus:border-[#b99d90] focus:bg-white focus:ring-4 focus:ring-[#b99d90]/10';

const textareaClass =
  'w-full resize-none rounded-2xl border border-[#e7dfdc] bg-[#fcfaf9] px-4 py-3.5 text-sm leading-6 text-[#3f3438] outline-none transition placeholder:text-[#b2a9ac] focus:border-[#b99d90] focus:bg-white focus:ring-4 focus:ring-[#b99d90]/10';

export default function NewCategoryPage() {
  const router =
    useRouter();

  const [
    name,
    setName,
  ] = useState('');

  const [
    slug,
    setSlug,
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
  ] = useState('0');

  const [
    isActive,
    setIsActive,
  ] = useState(true);

  const [
    slugEdited,
    setSlugEdited,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState('');

  function handleName(
    value: string,
  ) {
    setName(value);

    if (!slugEdited) {
      setSlug(
        slugify(value),
      );
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError('');

    if (!name.trim()) {
      setError(
        'Kategori adı zorunludur.',
      );

      return;
    }

    if (!slug.trim()) {
      setError(
        'Slug zorunludur.',
      );

      return;
    }

    const order =
      Number(sortOrder);

    if (
      !Number.isInteger(order) ||
      order < 0
    ) {
      setError(
        'Sıralama değeri geçersiz.',
      );

      return;
    }

    try {
      setSaving(true);

      await createCategory({
        name: name.trim(),

        slug: slugify(
          slug,
        ),

        description:
          description.trim() ||
          undefined,

        image:
          image ||
          undefined,

        isActive,

        sortOrder: order,
      });

      router.push(
        '/categories',
      );

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Kategori oluşturulamadı.',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout>
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-[1200px]"
      >
        <div className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="flex gap-2 text-xs text-[#9d9497]">
              <Link
                href="/categories"
                className="hover:text-[#351f28]"
              >
                Kategoriler
              </Link>

              <span>/</span>

              <span>
                Yeni Kategori
              </span>
            </div>

            <h2 className="mt-3 text-[32px] font-semibold tracking-[-0.045em] text-[#33292d]">
              Yeni Kategori
            </h2>

            <p className="mt-2 text-sm text-[#958c8f]">
              Mağaza için yeni bir
              ürün kategorisi
              oluşturun.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/categories"
              className="flex h-12 items-center rounded-2xl border border-[#e6ddda] bg-white px-5 text-sm font-semibold text-[#62555a]"
            >
              Vazgeç
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="h-12 min-w-[160px] rounded-2xl bg-[#351f28] px-6 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving
                ? 'Kaydediliyor...'
                : 'Kategori Oluştur'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-[26px] border border-[#ebe4e1] bg-white p-6">
            <h3 className="text-lg font-semibold text-[#3a3034]">
              Kategori Bilgileri
            </h3>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#4c4044]">
                  Kategori Adı *
                </label>

                <input
                  value={name}
                  onChange={(event) =>
                    handleName(
                      event.target.value,
                    )
                  }
                  placeholder="Örn. Güller"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#4c4044]">
                  Slug *
                </label>

                <input
                  value={slug}
                  onChange={(event) => {
                    setSlugEdited(
                      true,
                    );

                    setSlug(
                      slugify(
                        event.target.value,
                      ),
                    );
                  }}
                  placeholder="guller"
                  className={inputClass}
                />

                <p className="mt-2 text-xs text-[#aaa1a4]">
                  /kategori/
                  {slug ||
                    'kategori-adi'}
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#4c4044]">
                  Açıklama
                </label>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value,
                    )
                  }
                  rows={6}
                  placeholder="Kategori açıklaması..."
                  className={textareaClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#4c4044]">
                  Sıralama
                </label>

                <input
                  type="number"
                  min="0"
                  step="1"
                  value={sortOrder}
                  onChange={(event) =>
                    setSortOrder(
                      event.target.value,
                    )
                  }
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[26px] border border-[#ebe4e1] bg-white p-6">
              <h3 className="mb-5 text-lg font-semibold text-[#3a3034]">
                Kategori Görseli
              </h3>

              <ImageUploader
                value={image}
                onChange={setImage}
                title="Kategori görselini yükle"
                description="JPG, PNG veya WEBP • Maksimum 5 MB"
              />
            </section>

            <section className="rounded-[26px] border border-[#ebe4e1] bg-white p-6">
              <h3 className="text-lg font-semibold text-[#3a3034]">
                Yayın Durumu
              </h3>

              <button
                type="button"
                onClick={() =>
                  setIsActive(
                    !isActive,
                  )
                }
                className="mt-5 flex w-full items-center justify-between rounded-2xl border border-[#eee7e4] px-4 py-4 text-left"
              >
                <div>
                  <p className="text-sm font-semibold text-[#493d41]">
                    Kategori Aktif
                  </p>

                  <p className="mt-1 text-[11px] text-[#9c9396]">
                    Mağazada
                    kullanılabilir.
                  </p>
                </div>

                <span
                  className={`relative h-7 w-12 rounded-full transition ${
                    isActive
                      ? 'bg-[#597864]'
                      : 'bg-[#d9d2d4]'
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                      isActive
                        ? 'left-6'
                        : 'left-1'
                    }`}
                  />
                </span>
              </button>
            </section>
          </aside>
        </div>
      </form>
    </AdminLayout>
  );
}