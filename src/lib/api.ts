import type {
  AdminUser,
} from '@/types/auth';

import {
  getToken,
} from './auth';

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  'http://localhost:3001';

/* =========================================================
   AUTH
========================================================= */

export interface LoginResponse {
  accessToken: string;
  user: AdminUser;
}

/* =========================================================
   CATEGORY
========================================================= */

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  isActive: boolean;
  sortOrder: number;

  _count?: {
    products: number;
  };
}

/* =========================================================
   PRODUCT
========================================================= */

export interface ProductSize {
  id: string;
  name?: string | null;
  count: number;
  price: number;
  isActive: boolean;
  sortOrder?: number;
}

export interface ProductWrap {
  id: string;
  name: string;
  image?: string | null;
  extraPrice: number;
  isActive: boolean;
  sortOrder?: number;
}

export interface ProductCard {
  id: string;
  name: string;
  extraPrice: number;
  isActive: boolean;
  sortOrder?: number;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string | null;
  sortOrder: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle?: string | null;
  description?: string | null;
  flowerName?: string | null;
  heroImage?: string | null;

  isActive: boolean;
  isFeatured: boolean;

  stockEnabled: boolean;
  stockQuantity: number;

  seoTitle?: string | null;
  seoDescription?: string | null;

  categories: Category[];
  images: ProductImage[];
  sizes: ProductSize[];
  wraps: ProductWrap[];
  cards: ProductCard[];

  createdAt: string;
  updatedAt: string;
}

export interface CreateProductPayload {
  slug: string;
  name: string;

  subtitle?: string;
  description?: string;
  flowerName?: string;
  heroImage?: string;

  isActive?: boolean;
  isFeatured?: boolean;

  stockEnabled?: boolean;
  stockQuantity?: number;

  seoTitle?: string;
  seoDescription?: string;

  categoryIds?: string[];

  images?: {
    url: string;
    alt?: string;
    sortOrder?: number;
  }[];

  sizes?: {
    name?: string;
    count: number;
    price: number;
    isActive?: boolean;
    sortOrder?: number;
  }[];

  wraps?: {
    name: string;
    image?: string;
    extraPrice?: number;
    isActive?: boolean;
    sortOrder?: number;
  }[];

  cards?: {
    name: string;
    extraPrice?: number;
    isActive?: boolean;
    sortOrder?: number;
  }[];
}

export interface UpdateProductPayload {
  slug?: string;
  name?: string;

  subtitle?: string;
  description?: string;
  flowerName?: string;
  heroImage?: string;

  isActive?: boolean;
  isFeatured?: boolean;

  stockEnabled?: boolean;
  stockQuantity?: number;

  seoTitle?: string;
  seoDescription?: string;

  categoryIds?: string[];

  images?: {
    url: string;
    alt?: string;
    sortOrder?: number;
  }[];

  sizes?: {
    name?: string;
    count: number;
    price: number;
    isActive?: boolean;
    sortOrder?: number;
  }[];

  wraps?: {
    name: string;
    image?: string;
    extraPrice?: number;
    isActive?: boolean;
    sortOrder?: number;
  }[];

  cards?: {
    name: string;
    extraPrice?: number;
    isActive?: boolean;
    sortOrder?: number;
  }[];
}

/* =========================================================
   BALLOON
========================================================= */

export interface BalloonImage {
  id: string;
  balloonId: string;

  url: string;
  alt?: string | null;
  sortOrder: number;

  createdAt: string;
}

export interface BalloonVariant {
  id: string;
  balloonId: string;

  name?: string | null;
  color?: string | null;
  size?: string | null;

  heliumIncluded: boolean;

  price: number;

  stockEnabled: boolean;
  stockQuantity: number;

  isActive: boolean;
  sortOrder: number;

  createdAt: string;
  updatedAt: string;
}

export interface Balloon {
  id: string;
  slug: string;
  name: string;

  subtitle?: string | null;
  description?: string | null;
  heroImage?: string | null;

  isActive: boolean;
  isFeatured: boolean;

  seoTitle?: string | null;
  seoDescription?: string | null;

  images: BalloonImage[];
  variants: BalloonVariant[];

  createdAt: string;
  updatedAt: string;
}

export interface CreateBalloonPayload {
  slug: string;
  name: string;

  subtitle?: string;
  description?: string;
  heroImage?: string;

  isActive?: boolean;
  isFeatured?: boolean;

  seoTitle?: string;
  seoDescription?: string;

  images?: {
    url: string;
    alt?: string;
    sortOrder?: number;
  }[];

  variants?: {
    name?: string;
    color?: string;
    size?: string;

    heliumIncluded?: boolean;

    price: number;

    stockEnabled?: boolean;
    stockQuantity?: number;

    isActive?: boolean;
    sortOrder?: number;
  }[];
}

export interface UpdateBalloonPayload {
  slug?: string;
  name?: string;

  subtitle?: string;
  description?: string;
  heroImage?: string;

  isActive?: boolean;
  isFeatured?: boolean;

  seoTitle?: string;
  seoDescription?: string;

  images?: {
    url: string;
    alt?: string;
    sortOrder?: number;
  }[];

  variants?: {
    name?: string;
    color?: string;
    size?: string;

    heliumIncluded?: boolean;

    price: number;

    stockEnabled?: boolean;
    stockQuantity?: number;

    isActive?: boolean;
    sortOrder?: number;
  }[];
}

/* =========================================================
   COLLECTION
========================================================= */

export interface CollectionProduct {
  sortOrder: number;
  product: Product;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;

  subtitle?: string | null;
  description?: string | null;
  image?: string | null;

  isActive: boolean;
  isFeatured: boolean;

  sortOrder: number;

  seoTitle?: string | null;
  seoDescription?: string | null;

  products: CollectionProduct[];

  createdAt: string;
  updatedAt: string;
}

export interface CreateCollectionPayload {
  name: string;
  slug: string;

  subtitle?: string;
  description?: string;
  image?: string;

  isActive?: boolean;
  isFeatured?: boolean;

  sortOrder?: number;

  seoTitle?: string;
  seoDescription?: string;

  products?: {
    productId: string;
    sortOrder?: number;
  }[];
}

export interface UpdateCollectionPayload {
  name?: string;
  slug?: string;

  subtitle?: string;
  description?: string;
  image?: string;

  isActive?: boolean;
  isFeatured?: boolean;

  sortOrder?: number;

  seoTitle?: string;
  seoDescription?: string;

  products?: {
    productId: string;
    sortOrder?: number;
  }[];
}

/* =========================================================
   CATEGORY PAYLOADS
========================================================= */

export interface CreateCategoryPayload {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export type UpdateCategoryPayload =
  Partial<CreateCategoryPayload>;

/* =========================================================
   AUTH API
========================================================= */

export async function loginAdmin(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: 'POST',

      headers: {
        'Content-Type':
          'application/json',
      },

      body: JSON.stringify({
        email,
        password,
      }),
    },
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message ??
        'Giriş yapılırken bir hata oluştu.',
    );
  }

  return data;
}

/* =========================================================
   GENERIC API REQUEST
========================================================= */

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();

  const headers =
    new Headers(
      options.headers,
    );

  headers.set(
    'Content-Type',
    'application/json',
  );

  if (token) {
    headers.set(
      'Authorization',
      `Bearer ${token}`,
    );
  }

  const response =
    await fetch(
      `${API_URL}${path}`,
      {
        ...options,
        headers,
      },
    );

  if (!response.ok) {
    const data =
      await response
        .json()
        .catch(() => null);

    if (
      response.status === 401 &&
      typeof window !==
        'undefined'
    ) {
      localStorage.removeItem(
        'florea_admin_token',
      );

      localStorage.removeItem(
        'florea_admin_user',
      );

      window.location.href =
        '/login';
    }

    throw new Error(
      Array.isArray(data?.message)
        ? data.message.join(', ')
        : data?.message ??
            'API isteği başarısız oldu.',
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

/* =========================================================
   PRODUCT API
========================================================= */

export function getProducts() {
  return apiRequest<Product[]>(
    '/products',
  );
}

export function createProduct(
  payload: CreateProductPayload,
) {
  return apiRequest<Product>(
    '/products',
    {
      method: 'POST',

      body: JSON.stringify(
        payload,
      ),
    },
  );
}

export function deleteProduct(
  id: string,
) {
  return apiRequest<Product>(
    `/products/${id}`,
    {
      method: 'DELETE',
    },
  );
}

export async function getProductById(
  id: string,
) {
  const products =
    await getProducts();

  const product =
    products.find(
      (item) =>
        item.id === id,
    );

  if (!product) {
    throw new Error(
      'Ürün bulunamadı.',
    );
  }

  return product;
}

export function updateProduct(
  id: string,
  payload: UpdateProductPayload,
) {
  return apiRequest<Product>(
    `/products/${id}`,
    {
      method: 'PATCH',

      body: JSON.stringify(
        payload,
      ),
    },
  );
}

/* =========================================================
   BALLOON API
========================================================= */

export function getBalloons() {
  return apiRequest<Balloon[]>(
    '/balloons',
  );
}

export async function getBalloonById(
  id: string,
) {
  const balloons =
    await getBalloons();

  const balloon =
    balloons.find(
      (item) =>
        item.id === id,
    );

  if (!balloon) {
    throw new Error(
      'Balon bulunamadı.',
    );
  }

  return balloon;
}

export function createBalloon(
  payload: CreateBalloonPayload,
) {
  return apiRequest<Balloon>(
    '/balloons',
    {
      method: 'POST',

      body: JSON.stringify(
        payload,
      ),
    },
  );
}

export function updateBalloon(
  id: string,
  payload: UpdateBalloonPayload,
) {
  return apiRequest<Balloon>(
    `/balloons/${id}`,
    {
      method: 'PATCH',

      body: JSON.stringify(
        payload,
      ),
    },
  );
}

export function deleteBalloon(
  id: string,
) {
  return apiRequest<{
    success: boolean;
    message: string;
  }>(
    `/balloons/${id}`,
    {
      method: 'DELETE',
    },
  );
}

/* =========================================================
   COLLECTION API
========================================================= */

export function getCollections() {
  return apiRequest<
    Collection[]
  >(
    '/collections',
  );
}

export async function getCollectionById(
  id: string,
) {
  const collections =
    await getCollections();

  const collection =
    collections.find(
      (item) =>
        item.id === id,
    );

  if (!collection) {
    throw new Error(
      'Koleksiyon bulunamadı.',
    );
  }

  return collection;
}

export function createCollection(
  payload: CreateCollectionPayload,
) {
  return apiRequest<Collection>(
    '/collections',
    {
      method: 'POST',

      body: JSON.stringify(
        payload,
      ),
    },
  );
}

export function updateCollection(
  id: string,
  payload: UpdateCollectionPayload,
) {
  return apiRequest<Collection>(
    `/collections/${id}`,
    {
      method: 'PATCH',

      body: JSON.stringify(
        payload,
      ),
    },
  );
}

export function deleteCollection(
  id: string,
) {
  return apiRequest<{
    success: boolean;
    message: string;
  }>(
    `/collections/${id}`,
    {
      method: 'DELETE',
    },
  );
}

/* =========================================================
   CATEGORY API
========================================================= */

export function getCategories() {
  return apiRequest<Category[]>(
    '/categories',
  );
}

export function createCategory(
  payload: CreateCategoryPayload,
) {
  return apiRequest<Category>(
    '/categories',
    {
      method: 'POST',

      body: JSON.stringify(
        payload,
      ),
    },
  );
}

export function updateCategory(
  id: string,
  payload: UpdateCategoryPayload,
) {
  return apiRequest<Category>(
    `/categories/${id}`,
    {
      method: 'PATCH',

      body: JSON.stringify(
        payload,
      ),
    },
  );
}

export function deleteCategory(
  id: string,
) {
  return apiRequest<Category>(
    `/categories/${id}`,
    {
      method: 'DELETE',
    },
  );
}

export async function getCategoryById(
  id: string,
) {
  const categories =
    await getCategories();

  const category =
    categories.find(
      (item) =>
        item.id === id,
    );

  if (!category) {
    throw new Error(
      'Kategori bulunamadı.',
    );
  }

  return category;
}