"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CldUploadButton, CldUploadWidgetResults } from "next-cloudinary";

import { Button } from "@/components/ui/button";
import { ImageIcon, X } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (src: string) => void;
  disabled?: boolean;
}

export const ImageUpload = ({
  value,
  onChange,
  disabled,
}: ImageUploadProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const uploadContent = (
    <div
      className={`
        p-4 
        border-4 
        border-dashed
        border-primary/10 
        rounded-lg 
        transition 
        flex 
        flex-col 
        space-y-2 
        items-center 
        justify-center
        ${!disabled && 'hover:opacity-75'}
        ${disabled && 'opacity-50 cursor-not-allowed pointer-events-none'}
      `}
    >
      <div className="relative h-40 w-40">
        <Image
          fill
          alt="Upload"
          src={value || "/placeholder.svg"}
          className="rounded-lg object-cover"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-4 w-full flex flex-col justify-center items-center">
      {isMounted ? (
        <CldUploadButton
          options={{ maxFiles: 1 }}
          onUpload={(results: CldUploadWidgetResults) => {
            const info = results.info;
            if (info && typeof info === 'object' && 'secure_url' in info) {
              const secureUrl = info.secure_url;
              if (typeof secureUrl === 'string') {
                onChange(secureUrl);
              }
            }
          }}
          uploadPreset="t4drjppf"
        >
          {uploadContent}
        </CldUploadButton>
      ) : (
        <div className="pointer-events-none">
          {uploadContent}
        </div>
      )}
    </div>
  );
};
