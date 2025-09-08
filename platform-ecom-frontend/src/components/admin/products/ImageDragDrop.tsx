"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { capitalizeWords, getProductNameFromPath } from "@/util/util";
import { useUploadAssetMutation } from "@/slice/assetApiSlice";
import { IMAGE_UPLOAD_PATH } from "@/constant/constant";
const VITE_BACK_END_URL = import.meta.env.VITE_BACK_END_URL;

interface DragDropInputProps {
  url?: string;
}

export const DragDropInput = ({ url }: DragDropInputProps) => {
  const [file, setFile] = React.useState<File | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadAsset] = useUploadAssetMutation();

  const productName = capitalizeWords(
    getProductNameFromPath(window.location.pathname) ?? ""
  );

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("productName", productName);

    try {
      await uploadAsset(formData).unwrap();
      alert("Upload successful!");
      setFile(null);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!url) return;
    try {
      const response = await fetch(`${VITE_BACK_END_URL}/assets/${url}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Image deleted successfully!");
      } else {
        alert("Failed to delete image");
      }
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const previewUrl = file ? URL.createObjectURL(file) : url ? VITE_BACK_END_URL + IMAGE_UPLOAD_PATH + url : "";

  return (
    <div className="p-2">
      <div
        className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById("fileInput")?.click()}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            className="mx-auto max-h-48 object-contain"
          />
        ) : (
          "Upload to see image"
        )}
      </div>

      <input
        type="file"
        id="fileInput"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex gap-2 mt-2">
        {file && <Button onClick={() => setFile(null)}>Clear</Button>}
        {file && (
          <Button onClick={handleUpload} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        )}
        {!file && url && (
          <Button className="bg-white border-1 border-black text-black rounded-sm hover:text-white cursor-pointer" onClick={handleDelete}>
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};
