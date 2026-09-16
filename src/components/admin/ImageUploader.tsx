'use client';

import {
  useRef,
  useState,
} from 'react';

import type {
  ChangeEvent,
  DragEvent,
} from 'react';

import {
  uploadBalloonImage,
  uploadCollectionImage,
  uploadImage,
} from '@/lib/upload';

import type {
  UploadType,
} from '@/lib/upload';

type ImageUploaderProps = {
  value: string;

  onChange: (
    url: string,
  ) => void;

  title?: string;

  description?: string;

  uploadType?: UploadType;
};

export default function ImageUploader({
  value,
  onChange,
  title = 'Ürün görseli',
  description =
    'JPG, PNG veya WEBP • Maksimum 5 MB',
  uploadType = 'product',
}: ImageUploaderProps) {
  const inputRef =
    useRef<HTMLInputElement>(
      null,
    );

  const [
    uploading,
    setUploading,
  ] = useState(false);

  const [
    dragging,
    setDragging,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState('');

  async function handleFile(
    file?: File,
  ) {
    if (!file) {
      return;
    }

    if (
      ![
        'image/jpeg',
        'image/png',
        'image/webp',
      ].includes(file.type)
    ) {
      setError(
        'Sadece JPG, PNG veya WEBP yükleyebilirsiniz.',
      );

      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setError(
        'Görsel maksimum 5 MB olabilir.',
      );

      return;
    }

    try {
      setUploading(true);
      setError('');

      let result;

      if (
        uploadType ===
        'balloon'
      ) {
        result =
          await uploadBalloonImage(
            file,
          );
      } else if (
        uploadType ===
        'collection'
      ) {
        result =
          await uploadCollectionImage(
            file,
          );
      } else {
        result =
          await uploadImage(
            file,
          );
      }

      onChange(
        result.url,
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Görsel yüklenemedi.',
      );
    } finally {
      setUploading(false);
    }
  }

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    void handleFile(
      file,
    );

    event.target.value =
      '';
  }

  function handleDrop(
    event: DragEvent<HTMLDivElement>,
  ) {
    event.preventDefault();

    setDragging(false);

    const file =
      event.dataTransfer
        .files?.[0];

    void handleFile(
      file,
    );
  }

  if (value) {
    return (
      <div>
        <div className="relative overflow-hidden rounded-[22px] border border-[#e9e1de] bg-[#f8f4f2]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Yüklenen görsel"
            className="aspect-square w-full object-cover"
          />

          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/65 to-transparent px-4 pb-4 pt-10">
            <button
              type="button"
              disabled={
                uploading
              }
              onClick={() =>
                inputRef.current?.click()
              }
              className="rounded-xl bg-white/95 px-3 py-2 text-xs font-semibold text-[#493b40] shadow-sm backdrop-blur transition hover:bg-white disabled:cursor-wait disabled:opacity-60"
            >
              {uploading
                ? 'Yükleniyor...'
                : 'Görseli Değiştir'}
            </button>

            <button
              type="button"
              disabled={
                uploading
              }
              onClick={() =>
                onChange('')
              }
              className="rounded-xl bg-[#a74e4e]/95 px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#963f3f] disabled:opacity-60"
            >
              Kaldır
            </button>
          </div>

          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
              <div className="text-center">
                <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-[#ddd0ca] border-t-[#351f28]" />

                <p className="mt-3 text-xs font-semibold text-[#54474b]">
                  Görsel yükleniyor...
                </p>
              </div>
            </div>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={
            handleInputChange
          }
          className="hidden"
        />

        {error && (
          <p className="mt-3 text-xs font-medium text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <div
        onDragEnter={(
          event,
        ) => {
          event.preventDefault();

          setDragging(
            true,
          );
        }}
        onDragOver={(
          event,
        ) => {
          event.preventDefault();

          setDragging(
            true,
          );
        }}
        onDragLeave={(
          event,
        ) => {
          event.preventDefault();

          setDragging(
            false,
          );
        }}
        onDrop={
          handleDrop
        }
        onClick={() => {
          if (
            !uploading
          ) {
            inputRef.current?.click();
          }
        }}
        className={[
          'group flex aspect-square cursor-pointer flex-col items-center justify-center rounded-[22px] border-2 border-dashed p-6 text-center transition',
          dragging
            ? 'border-[#9a6d5d] bg-[#faf2ee]'
            : 'border-[#d9ceca] bg-[#fcfaf9] hover:border-[#bca49a] hover:bg-[#faf6f4]',
          uploading
            ? 'pointer-events-none opacity-70'
            : '',
        ].join(' ')}
      >
        {uploading ? (
          <>
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#ddd0ca] border-t-[#351f28]" />

            <p className="mt-4 text-sm font-semibold text-[#54474b]">
              Görsel yükleniyor...
            </p>

            <p className="mt-2 text-xs text-[#9e9598]">
              Lütfen bekleyin.
            </p>
          </>
        ) : (
          <>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#9b6e5d] shadow-sm transition group-hover:-translate-y-1">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-6 w-6"
              >
                <path d="M12 16V4" />
                <path d="m7 9 5-5 5 5" />
                <path d="M5 14v5h14v-5" />
              </svg>
            </div>

            <p className="mt-4 text-sm font-semibold text-[#4c3f44]">
              {title}
            </p>

            <p className="mt-2 text-xs leading-5 text-[#9e9598]">
              Dosyayı buraya sürükleyin
              <br />
              veya{' '}
              <span className="font-semibold text-[#956959]">
                bilgisayardan seçin
              </span>
            </p>

            <p className="mt-4 text-[10px] uppercase tracking-[0.1em] text-[#b1a8aa]">
              {description}
            </p>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={
          handleInputChange
        }
        className="hidden"
      />

      {error && (
        <p className="mt-3 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}