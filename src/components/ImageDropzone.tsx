"use client";

import { useState, useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { UploadCloud, X } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

interface ImageDropzoneProps {
  onFileChange: (file: File | null) => void;
  preview: string | null;
  disabled?: boolean;
}

export function ImageDropzone({ onFileChange, preview, disabled }: ImageDropzoneProps) {
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      toast({
        variant: "destructive",
        title: "File Upload Error",
        description: fileRejections[0].errors[0].message,
      });
      return;
    }

    if (acceptedFiles.length > 0) {
      onFileChange(acceptedFiles[0]);
    }
  }, [onFileChange, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/gif': [],
      'image/webp': [],
    },
    maxSize: 2 * 1024 * 1024, // 2MB
    multiple: false,
    disabled,
  });
  
  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileChange(null);
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative group flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 text-center transition-colors hover:border-primary/50 hover:bg-muted/50",
        isDragActive && "border-primary bg-primary/10",
        preview && 'border-solid border-muted-foreground/20'
      )}
    >
      <input {...getInputProps()} />

      {preview ? (
        <>
            <Image src={preview} alt="Preview" fill className="object-cover rounded-md" />
            {!disabled && (
                <Button 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={removeImage}
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </>
      ) : (
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <UploadCloud className={cn("h-10 w-10", isDragActive && 'text-primary animate-bounce')} />
          {isDragActive ? (
            <p className="font-semibold text-primary">Drop the image here!</p>
          ) : (
            <>
                <p className="font-semibold">Drag & drop an image, or click to select</p>
                <p className="text-xs">PNG, JPG, GIF, or WEBP. Max 2MB.</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
