"use client";

import { useRef } from "react";
import { FiUpload, FiX, FiRefreshCw } from "react-icons/fi";

type TFileUploadProps = {
  label: string;
  previewUrl: string | null;
  fileName: string | null;
  error?: string;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
};

const FileUpload = ({
  label,
  previewUrl,
  fileName,
  error,
  onFileSelect,
  onRemove,
}: TFileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = "payment-proof-upload";

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      onFileSelect(selectedFile);
    }

    // Reset so selecting the same file again still fires onChange.
    event.target.value = "";
  };

  const handleReplaceClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="sr-only"
        aria-label={label}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
      />

      {previewUrl ? (
        <div className="flex flex-col gap-4 border border-dark/15 p-4 sm:flex-row sm:items-center sm:p-5">
          <div className="relative aspect-square w-full max-w-[160px] shrink-0 overflow-hidden bg-primary-light sm:w-40">
            {/*
              eslint-disable-next-line @next/next/no-img-element --
              This is a client-side blob: URL from URL.createObjectURL(),
              which next/image cannot optimize (it can't be fetched
              server-side), so a plain <img> is the correct choice here.
            */}
            <img
              src={previewUrl}
              alt="Payment proof preview"
              className="h-full w-full object-contain"
            />
          </div>

          <div className="flex flex-1 flex-col gap-3">
            {fileName && (
              <p className="break-all text-sm text-dark/60">{fileName}</p>
            )}
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleReplaceClick}
                className="inline-flex cursor-pointer items-center gap-2 border border-dark/15 px-4 py-2 text-sm font-medium duration-300 hover:border-primary hover:text-primary"
              >
                <FiRefreshCw size={16} />
                Replace
              </button>
              <button
                type="button"
                onClick={onRemove}
                className="inline-flex cursor-pointer items-center gap-2 border border-dark/15 px-4 py-2 text-sm font-medium text-primary duration-300 hover:border-primary"
              >
                <FiX size={16} />
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className={`flex cursor-pointer flex-col items-center justify-center gap-3 border-2 border-dashed px-6 py-12 text-center duration-300 hover:border-primary ${
            error ? "border-red-500" : "border-dark/20"
          }`}
        >
          <FiUpload size={28} className="text-dark/40" />
          <span className="text-sm font-medium">
            Click to upload payment proof
          </span>
          <span className="text-xs text-dark/50">PNG or JPG, up to 5MB</span>
        </label>
      )}

      {error && (
        <span id={`${inputId}-error`} role="alert" className="text-sm text-red-500">
          {error}
        </span>
      )}
    </div>
  );
};

export default FileUpload;
