"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CloudUploadIcon,
  Image01Icon,
  Cancel01Icon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons";

import { requestUploadUrlAction } from "@/lib/uploads/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ACCEPTED_TYPES = "image/png,image/jpeg,image/webp";
const MAX_SIZE_BYTES = 8 * 1024 * 1024;

type Props = {
  name: string;
  keyName?: string;
  scope: "banner" | "product";
  defaultValue?: string | null;
  defaultKey?: string | null;
  required?: boolean;
  label?: string;
  aspectClass?: string;
  className?: string;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function ImageUpload({
  name,
  keyName,
  scope,
  defaultValue,
  defaultKey,
  required,
  label,
  aspectClass = "aspect-[4/3]",
  className,
}: Props) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageUrl, setImageUrl] = useState<string>(defaultValue ?? "");
  const [imageKey, setImageKey] = useState<string>(defaultKey ?? "");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<{ name: string; size: number } | null>(null);

  useEffect(() => {
    setImageUrl(defaultValue ?? "");
    setImageKey(defaultKey ?? "");
  }, [defaultValue, defaultKey]);

  const upload = useCallback(async (file: File) => {
    setError(null);

    if (!ACCEPTED_TYPES.split(",").includes(file.type)) {
      setError("Formato no permitido. Usá PNG, JPG o WebP.");
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setError(`El archivo supera el máximo de ${MAX_SIZE_BYTES / (1024 * 1024)}MB.`);
      return;
    }

    setIsUploading(true);
    setProgress(0);
    setMeta({ name: file.name, size: file.size });

    try {
      const presign = await requestUploadUrlAction({
        contentType: file.type,
        contentLength: file.size,
        scope,
      });

      if (!presign.ok) {
        setError(presign.error);
        setIsUploading(false);
        return;
      }

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", presign.uploadUrl);
        xhr.setRequestHeader("Content-Type", presign.contentType);
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            setProgress(Math.round((event.loaded / event.total) * 100));
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };
        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.send(file);
      });

      setImageUrl(presign.publicUrl);
      setImageKey(presign.key);
      setProgress(100);
    } catch (err) {
      console.error(err);
      setError("Error al subir el archivo. Probá de nuevo.");
    } finally {
      setIsUploading(false);
    }
  }, [scope]);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    void upload(files[0]);
  }, [upload]);

  function handleRemove() {
    setImageUrl("");
    setImageKey("");
    setMeta(null);
    setProgress(0);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <span className="flex items-center gap-1.5 text-sm font-medium">
          <HugeiconsIcon
            icon={Image01Icon}
            size={14}
            strokeWidth={2}
            className="text-muted-foreground"
          />
          {label}
        </span>
      )}

      <input type="hidden" name={name} value={imageUrl} required={required} />
      {keyName && <input type="hidden" name={keyName} value={imageKey} />}
      <input
        ref={fileInputRef}
        id={inputId}
        type="file"
        accept={ACCEPTED_TYPES}
        className="sr-only"
        onChange={(event) => handleFiles(event.target.files)}
      />

      {imageUrl ? (
        <div
          className={cn(
            "group relative overflow-hidden rounded-lg border border-border/60 bg-muted/20",
            aspectClass,
          )}
        >
          <Image
            src={imageUrl}
            alt="Imagen subida"
            fill
            unoptimized
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <label
              htmlFor={inputId}
              className="cursor-pointer rounded-md bg-background/90 px-2 py-1 text-[11px] font-medium text-foreground shadow-sm backdrop-blur hover:bg-background"
            >
              Reemplazar
            </label>
            <Button
              type="button"
              variant="destructive"
              size="icon-xs"
              onClick={handleRemove}
              title="Quitar"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={12} strokeWidth={2} />
            </Button>
          </div>
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-1.5">
                <div className="size-6 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-foreground" />
                <p className="text-[11px] text-muted-foreground tabular-nums">{progress}%</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <label
          htmlFor={inputId}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            handleFiles(event.dataTransfer.files);
          }}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/10 px-4 py-8 text-center transition-colors hover:bg-muted/30",
            aspectClass,
            isDragging ? "border-primary bg-primary/5" : "border-border/60",
            isUploading && "pointer-events-none",
          )}
        >
          {isUploading ? (
            <>
              <div className="size-7 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-foreground" />
              <p className="text-xs text-muted-foreground tabular-nums">Subiendo… {progress}%</p>
              {meta && (
                <p className="text-[11px] text-muted-foreground/70">
                  {meta.name} &middot; {formatBytes(meta.size)}
                </p>
              )}
            </>
          ) : (
            <>
              <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <HugeiconsIcon icon={CloudUploadIcon} size={16} strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm font-medium">Subí una imagen</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  Arrastrá o hacé click · PNG, JPG, WebP · máx 8MB
                </p>
              </div>
            </>
          )}
        </label>
      )}

      {error && (
        <div className="flex items-start gap-1.5 rounded-md border border-destructive/30 bg-destructive/5 px-2.5 py-1.5 text-xs text-destructive">
          <HugeiconsIcon icon={AlertCircleIcon} size={12} strokeWidth={2} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
