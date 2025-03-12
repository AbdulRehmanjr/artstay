"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import {
  UploadCloud,
  X,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Image from "next/image";

type FileUploadProps = {
  onFileUpload: (fileUrl: string) => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  description?: string;
  showPreview?: boolean;
  previewType?: "image" | "document";
  value?: string;
};

export const FileUpload = ({
  onFileUpload,
  accept = "image/*",
  maxSizeMB = 5,
  label = "Upload File",
  description = "Drag and drop a file here, or click to browse",
  showPreview = true,
  previewType = "image",
  value,
}: FileUploadProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Use effect to handle initial value
  useEffect(() => {
    if (value) {
      setFilePreview(value);
      setUploadSuccess(true);
    }
  }, [value]);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

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

  const validateFile = (file: File): boolean => {
    // Size validation
    if (file.size > maxSizeBytes) {
      setUploadError(`File size exceeds ${maxSizeMB}MB limit`);
      toast({
        variant: "destructive",
        title: "File too large",
        description: `Maximum file size is ${maxSizeMB}MB`,
      });
      return false;
    }

    // Type validation
    if (accept !== "*" && !accept.includes("*")) {
      const fileType = file.type;
      const validTypes = accept.split(",").map((type) => type.trim());
      const isValidType = validTypes.some((type) => {
        if (type.includes("*")) {
          const mainType = type.split("/")[0];
          return fileType.startsWith(`${mainType}/`);
        }
        return type === fileType;
      });

      if (!isValidType) {
        setUploadError("Invalid file type");
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: `Please upload a ${accept.replace("*", "")} file`,
        });
        return false;
      }
    }

    return true;
  };

  const simulateUpload = (file: File) => {
    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);
    setUploadProgress(0);

    // Create a file reader for preview
    if (file && showPreview) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
    }

    // Simulate upload progress - in a real app, replace with actual upload logic
    const intervalId = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(intervalId);
          setIsUploading(false);
          setUploadSuccess(true);
          // This would be the URL returned from your actual upload service
          const mockFileUrl = `https://yourdomain.com/uploads/${file.name}`;
          onFileUpload(mockFileUrl);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file) {
        setFileName(file.name);

        if (validateFile(file)) {
          simulateUpload(file);
        }
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file) {
        setFileName(file.name);

        if (validateFile(file)) {
          simulateUpload(file);
        }
      }
    }
  };

  const handleClearFile = () => {
    setFilePreview(null);
    setFileName("");
    setUploadProgress(0);
    setUploadSuccess(false);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onFileUpload(""); // Clear the value in the parent form
  };

  return (
    <div className="w-full space-y-2">
      {label && <p className="text-sm font-medium">{label}</p>}

      <div
        className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-all ${
          isDragging
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
            : uploadError
              ? "border-red-300 bg-red-50 dark:bg-red-950/30"
              : uploadSuccess
                ? "border-green-300 bg-green-50 dark:bg-green-950/30"
                : "border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/50 dark:hover:bg-gray-900/80"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          title="file-input"
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept={accept}
        />

        {/* Preview Section */}
        {filePreview && showPreview ? (
          <div className="relative mb-4 w-full max-w-xs">
            {previewType === "image" ? (
              <div className="relative h-40 w-full overflow-hidden rounded-md border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                <Image
                  src={filePreview}
                  alt="File preview"
                  fill
                  style={{ objectFit: "contain" }}
                  className="p-2"
                />
              </div>
            ) : (
              <div className="flex h-20 items-center rounded-md border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <FileText className="mr-2 h-8 w-8 text-blue-500" />
                <span className="truncate text-sm text-gray-600 dark:text-gray-300">
                  {fileName || "Document"}
                </span>
              </div>
            )}
            <button
              title="clear-file"
              type="button"
              onClick={handleClearFile}
              className="absolute -right-2 -top-2 rounded-full bg-gray-800 p-1 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <UploadCloud
              className={`mx-auto h-12 w-12 ${
                uploadError
                  ? "text-red-500"
                  : uploadSuccess
                    ? "text-green-500"
                    : "text-gray-400"
              }`}
            />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              {uploadError
                ? "Upload Failed"
                : uploadSuccess
                  ? "Upload Complete"
                  : "Upload a file"}
            </h3>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {uploadError ?? description}
            </p>
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <div className="mt-4 w-full max-w-xs">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                Uploading...
              </span>
              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                {uploadProgress}%
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className={`h-1.5 rounded-full bg-blue-600 w-[${uploadProgress}%]`}
              />
            </div>
          </div>
        )}

        {/* Status Indicators */}
        {!isUploading && fileName && (
          <div className="mt-2 flex items-center">
            {uploadSuccess ? (
              <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
            ) : uploadError ? (
              <AlertCircle className="mr-1 h-4 w-4 text-red-500" />
            ) : (
              <Loader2 className="mr-1 h-4 w-4 animate-spin text-blue-500" />
            )}
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {fileName}
            </span>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-4">
          <Button
            type="button"
            variant={uploadSuccess ? "outline" : "default"}
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className={
              uploadSuccess
                ? "border-green-500 text-green-600 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-950/30"
                : ""
            }
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : uploadSuccess ? (
              "Change File"
            ) : (
              "Select File"
            )}
          </Button>
        </div>
      </div>

      {/* Help Text */}
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {`Supported formats: ${accept.replace(/\*/g, "all")} (Max: ${maxSizeMB}MB)`}
      </p>
    </div>
  );
};
