"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { OurFileRouter } from "../app/api/uploadthing/core";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface ImageUploadProps {
    defaultUrl?: string | null;
    onChange?: (url: string | null) => void;
    endpoint: keyof OurFileRouter
}

export default function ImageUpload({ defaultUrl, onChange, endpoint }: ImageUploadProps) {
    const [value, setValue] = useState<string | null>(defaultUrl ?? null);
    const [showDropzone, setShowDropzone] = useState<boolean>(!defaultUrl);
    const handleChange = (url: string | null) => {
        setValue(url);
        onChange?.(url);
    };

    if (!showDropzone && value) {
        return (
            <div className="relative">
                <div className="relative w-25 h-25 shadow-lg rounded-full overflow-hidden">
                    <Image src={value ?? ""} className="object-cover" fill alt="User image" />
                </div>
                <div className="flex mt-3 gap-2">
                    <Trash className="absolute rounded-full left-40 top-0 text-rose-600" />
                </div>
            </div>
        )
    }

    return (
        <div className="relative">
            <UploadDropzone
                endpoint={endpoint}
                content={
                    {
                        label: value
                            ? 'Drop or click to replace the image'
                            : 'Drop or click to upload  an image'
                    }}

                appearance={{ container: 'rounded-xl border', button: '!bg-black' }}
                onClientUploadComplete={(res) => {
                    const url = res?.[0]?.ufsUrl;
                    if (url) {
                        setShowDropzone(false);
                        handleChange(url);
                    }
                }}
            />
        </div>
    );
}
