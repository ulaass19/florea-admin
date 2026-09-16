import {
  API_URL,
} from './api';

import {
  getToken,
} from './auth';

export interface UploadResponse {
  filename: string;
  url: string;
}

export type UploadType =
  | 'product'
  | 'balloon'
  | 'collection';

async function uploadFile(
  file: File,
  type: UploadType,
): Promise<UploadResponse> {
  const token =
    getToken();

  if (!token) {
    throw new Error(
      'Oturum bulunamadı.',
    );
  }

  const formData =
    new FormData();

  formData.append(
    'file',
    file,
  );

  let endpoint =
    '/uploads/image';

  if (
    type === 'balloon'
  ) {
    endpoint =
      '/uploads/balloon-image';
  }

  if (
    type === 'collection'
  ) {
    endpoint =
      '/uploads/collection-image';
  }

  const response =
    await fetch(
      `${API_URL}${endpoint}`,
      {
        method: 'POST',

        headers: {
          Authorization:
            `Bearer ${token}`,
        },

        body: formData,
      },
    );

  const data =
    await response
      .json()
      .catch(() => null);

  if (!response.ok) {
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
      Array.isArray(
        data?.message,
      )
        ? data.message.join(
            ', ',
          )
        : data?.message ??
            'Görsel yüklenemedi.',
    );
  }

  return data;
}

export async function uploadImage(
  file: File,
): Promise<UploadResponse> {
  return uploadFile(
    file,
    'product',
  );
}

export async function uploadBalloonImage(
  file: File,
): Promise<UploadResponse> {
  return uploadFile(
    file,
    'balloon',
  );
}

export async function uploadCollectionImage(
  file: File,
): Promise<UploadResponse> {
  return uploadFile(
    file,
    'collection',
  );
}