'use client';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import Link from 'next/link';

import AdminLayout from '@/components/admin/AdminLayout';

import {
  deleteCategory,
  getCategories,
  updateCategory,
} from '@/lib/api';

import type {
  Category,
} from '@/lib/api';

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

function CategoryIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-6 w-6"
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

const inputClass =
  'h-12 w-full rounded-2xl border border-[#e7dfdc] bg-[#fcfaf9] px-4 text-sm text-[#3f3438] outline-none transition placeholder:text-[#b2a9ac] focus:border-[#b99d90] focus:bg-white focus:ring-4 focus:ring-[#b99d90]/10';

export default function CategoriesPage() {
  const [
    categories,
    setCategories,
  ] = useState<Category[]>([]);

  const [
    search,
    setSearch,
  ] = useState('');

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
    categoryToDelete,
    setCategoryToDelete,
  ] =
    useState<Category | null>(
      null,
    );

  const [
    deleting,
    setDeleting,
  ] = useState(false);

  async function loadCategories() {
    try {
      setError('');

      const result =
        await getCategories();

      setCategories(
        [...result].sort(
          (a, b) =>
            a.sortOrder -
            b.sortOrder,
        ),
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Kategoriler alınamadı.',
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const filteredCategories =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLocaleLowerCase(
            'tr-TR',
          );

      if (!query) {
        return categories;
      }

      return categories.filter(
        (category) =>
          category.name
            .toLocaleLowerCase(
              'tr-TR',
            )
            .includes(query) ||
          category.slug
            .toLocaleLowerCase(
              'tr-TR',
            )
            .includes(query) ||
          category.description
            ?.toLocaleLowerCase(
              'tr-TR',
            )
            .includes(query),
      );
    }, [
      categories,
      search,
    ]);

  const stats =
    useMemo(
      () => ({
        total:
          categories.length,

        active:
          categories.filter(
            (item) =>
              item.isActive,
          ).length,

        passive:
          categories.filter(
            (item) =>
              !item.isActive,
          ).length,

        productLinks:
          categories.reduce(
            (total, item) =>
              total +
              (item._count
                ?.products ?? 0),
            0,
          ),
      }),
      [categories],
    );

  async function toggleActive(
    category: Category,
  ) {
    try {
      setError('');
      setSuccess('');

      await updateCategory(
        category.id,
        {
          isActive:
            !category.isActive,
        },
      );

      setCategories(
        (current) =>
          current.map(
            (item) =>
              item.id ===
              category.id
                ? {
                    ...item,
                    isActive:
                      !item.isActive,
                  }
                : item,
          ),
      );

      setSuccess(
        category.isActive
          ? `${category.name} pasife alındı.`
          : `${category.name} yayına alındı.`,
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Kategori güncellenemedi.',
      );
    }
  }

  async function confirmDelete() {
    if (!categoryToDelete) {
      return;
    }

    try {
      setDeleting(true);
      setError('');
      setSuccess('');

      await deleteCategory(
        categoryToDelete.id,
      );

      setCategories(
        (current) =>
          current.filter(
            (item) =>
              item.id !==
              categoryToDelete.id,
          ),
      );

      setCategoryToDelete(
        null,
      );

      setSuccess(
        'Kategori başarıyla silindi.',
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Kategori silinemedi.',
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
              Kategoriler
            </h2>

            <p className="mt-2 text-sm text-[#958c8f]">
              Mağazada kullanılan
              ürün kategorilerini
              yönetin.
            </p>
          </div>

          <Link
            href="/categories/new"
            className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#351f28] px-5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(53,31,40,0.18)] transition hover:-translate-y-0.5 hover:bg-[#482a36]"
          >
            <span className="text-xl font-light">
              +
            </span>

            Yeni Kategori
          </Link>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[22px] border border-[#ebe4e1] bg-white p-5">
            <p className="text-xs text-[#9b9295]">
              Toplam Kategori
            </p>

            <p className="mt-2 text-3xl font-semibold text-[#33292d]">
              {stats.total}
            </p>
          </div>

          <div className="rounded-[22px] border border-[#dce9df] bg-[#f7fbf8] p-5">
            <p className="text-xs text-[#718477]">
              Aktif Kategori
            </p>

            <p className="mt-2 text-3xl font-semibold text-[#496654]">
              {stats.active}
            </p>
          </div>

          <div className="rounded-[22px] border border-[#e7e1e2] bg-[#faf8f8] p-5">
            <p className="text-xs text-[#91878a]">
              Pasif Kategori
            </p>

            <p className="mt-2 text-3xl font-semibold text-[#6e6266]">
              {stats.passive}
            </p>
          </div>

          <div className="rounded-[22px] border border-[#eee1d9] bg-[#fdf9f6] p-5">
            <p className="text-xs text-[#a07c69]">
              Ürün Bağlantıları
            </p>

            <p className="mt-2 text-3xl font-semibold text-[#7d5949]">
              {stats.productLinks}
            </p>
          </div>
        </div>

        {success && (
          <div className="mt-5 rounded-2xl border border-[#d8eadc] bg-[#f3faf5] px-5 py-4 text-sm font-medium text-[#50735a]">
            ✓ {success}
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <section className="mt-6 overflow-hidden rounded-[26px] border border-[#ebe4e1] bg-white">
          <div className="border-b border-[#eee8e5] p-5">
            <div className="relative max-w-[520px]">
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
                placeholder="Kategori ara..."
                className={`${inputClass} pl-12`}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[380px] items-center justify-center">
              <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#ded2cd] border-t-[#351f28]" />
            </div>
          ) : filteredCategories.length ===
            0 ? (
            <div className="flex min-h-[380px] flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#f7f1ee] text-[#9b6e5d]">
                <CategoryIcon />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-[#403539]">
                Kategori bulunamadı
              </h3>

              <Link
                href="/categories/new"
                className="mt-5 rounded-xl bg-[#351f28] px-5 py-3 text-sm font-semibold text-white"
              >
                Yeni Kategori Oluştur
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="bg-[#fcfaf9] text-left">
                    <th className="px-6 py-4 text-[11px] uppercase tracking-[0.12em] text-[#9c9396]">
                      Kategori
                    </th>

                    <th className="px-5 py-4 text-[11px] uppercase tracking-[0.12em] text-[#9c9396]">
                      Ürün
                    </th>

                    <th className="px-5 py-4 text-[11px] uppercase tracking-[0.12em] text-[#9c9396]">
                      Sıra
                    </th>

                    <th className="px-5 py-4 text-[11px] uppercase tracking-[0.12em] text-[#9c9396]">
                      Durum
                    </th>

                    <th className="px-6 py-4 text-right text-[11px] uppercase tracking-[0.12em] text-[#9c9396]">
                      İşlem
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#f1ecea]">
                  {filteredCategories.map(
                    (category) => (
                      <tr
                        key={category.id}
                        className="transition hover:bg-[#fdfbf9]"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="flex h-[62px] w-[62px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#eee7e4] bg-[#f7f2ef] text-[#aa8b7d]">
                              {category.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={
                                    category.image
                                  }
                                  alt={
                                    category.name
                                  }
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <CategoryIcon />
                              )}
                            </div>

                            <div>
                              <p className="font-semibold text-[#403539]">
                                {
                                  category.name
                                }
                              </p>

                              <p className="mt-1 text-xs text-[#9d9497]">
                                /
                                {
                                  category.slug
                                }
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold text-[#493d41]">
                          {category
                            ._count
                            ?.products ??
                            0}
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-lg bg-[#f5f1ef] px-3 py-2 text-xs font-semibold text-[#77696e]">
                            {
                              category.sortOrder
                            }
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() =>
                              toggleActive(
                                category,
                              )
                            }
                            className={[
                              'rounded-full px-3 py-2 text-[10px] font-semibold',
                              category.isActive
                                ? 'bg-[#eef8f1] text-[#4e815c]'
                                : 'bg-[#f4f1f1] text-[#857b7e]',
                            ].join(
                              ' ',
                            )}
                          >
                            {category.isActive
                              ? 'Aktif'
                              : 'Pasif'}
                          </button>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/categories/${category.id}`}
                              title="Düzenle"
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e9e2df] text-[#817378] transition hover:bg-[#f8f4f2]"
                            >
                              <EditIcon />
                            </Link>

                            <button
                              type="button"
                              title="Sil"
                              onClick={() =>
                                setCategoryToDelete(
                                  category,
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#f0dddd] text-[#b86d6d] transition hover:bg-[#fff4f4]"
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {categoryToDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#26191e]/45 p-5 backdrop-blur-[3px]">
          <button
            type="button"
            aria-label="Kapat"
            onClick={() =>
              !deleting &&
              setCategoryToDelete(
                null,
              )
            }
            className="absolute inset-0"
          />

          <div className="relative z-10 w-full max-w-[480px] rounded-[28px] bg-white p-7 shadow-[0_30px_100px_rgba(35,20,27,0.25)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0f0] text-[#ad5656]">
              <TrashIcon />
            </div>

            <h3 className="mt-5 text-xl font-semibold text-[#3c3035]">
              Kategoriyi sil?
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#91878a]">
              <strong className="text-[#514348]">
                {
                  categoryToDelete.name
                }
              </strong>{' '}
              kategorisi silinecek.
              Ürünlerin kendisi
              silinmeyecek.
            </p>

            <div className="mt-7 flex gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() =>
                  setCategoryToDelete(
                    null,
                  )
                }
                className="h-12 flex-1 rounded-2xl border border-[#e7dfdc] text-sm font-semibold text-[#65575c]"
              >
                Vazgeç
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={
                  confirmDelete
                }
                className="h-12 flex-1 rounded-2xl bg-[#a84f4f] text-sm font-semibold text-white disabled:opacity-60"
              >
                {deleting
                  ? 'Siliniyor...'
                  : 'Kategoriyi Sil'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}