"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Loader2, AlertCircle, CheckCircle, Upload, X, FileText } from 'lucide-react';

export function UploadPaymentProof({ orderNumber }: { orderNumber: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handler untuk drag events
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  // Handler untuk file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  // Validasi file
  const validateAndSetFile = (file: File) => {
    // Reset status
    setUploadStatus("idle");
    setErrorMessage("");

    // Validasi tipe file
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage("Tipe file tidak didukung. Silakan unggah file JPG, PNG, atau PDF.");
      return;
    }

    // Validasi ukuran file (maks 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setErrorMessage("Ukuran file terlalu besar. Maksimal 5MB.");
      return;
    }

    setFile(file);
  };

  // Handler untuk menghapus file
  const handleRemoveFile = () => {
    setFile(null);
    setUploadStatus("idle");
    setErrorMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handler untuk upload file
  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadStatus("uploading");
    setUploadProgress(0);

    try {
      // Simulasi upload dengan progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        setUploadProgress(i);
      }

      // Simulasi sukses setelah upload selesai
      await new Promise((resolve) => setTimeout(resolve, 500));
      setUploadStatus("success");
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("error");
      setErrorMessage("Terjadi kesalahan saat mengunggah file. Silakan coba lagi.");
    } finally {
      setIsUploading(false);
    }
  };

  // Render file preview
  const renderFilePreview = () => {
    if (!file) return null;

    if (file.type.startsWith("image/")) {
      return (
        <div className="relative mt-4">
          <img
            src={URL.createObjectURL(file) || "/placeholder.svg"}
            alt="Preview"
            className="max-h-48 max-w-full rounded-md object-contain"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground"
            onClick={handleRemoveFile}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      );
    } else {
      return (
        <div className="relative mt-4 flex items-center rounded-md border p-2">
          <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
          <span className="text-sm truncate">{file.name}</span>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto h-6 w-6"
            onClick={handleRemoveFile}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      );
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Unggah Bukti Pembayaran</CardTitle>
        <CardDescription>
          Unggah bukti transfer untuk pesanan #{orderNumber}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`border-2 ${
            isDragging ? "border-primary" : "border-dashed"
          } rounded-md p-6 transition-colors`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <Upload className="h-10 w-10 text-muted-foreground" />
            <div className="text-center space-y-2">
              <p className="text-sm font-medium">
                Seret dan lepas file di sini, atau{" "}
                <span
                  className="text-primary cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  pilih file
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, atau PDF (Maks. 5MB)
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".png,.jpg,.jpeg,.pdf"
            />
          </div>
        </div>

        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {renderFilePreview()}

        {uploadStatus === "uploading" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Mengunggah...</span>
              <span className="text-sm font-medium">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        {uploadStatus === "success" && (
          <Alert className="bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600">
              Bukti pembayaran berhasil diunggah. Tim kami akan memverifikasi pembayaran Anda dalam 1x24 jam kerja.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Pastikan bukti pembayaran menunjukkan informasi yang jelas.
        </p>
        {file && uploadStatus !== "success" && (
          <Button
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengunggah...
              </>
            ) : (
              "Unggah Bukti Pembayaran"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}