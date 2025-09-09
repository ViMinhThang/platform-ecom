"use client";
import * as React from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  useDeleteAssetMutation,
  useUploadAssetMutation,
} from "@/slice/assetApiSlice";
import { IMAGE_UPLOAD_PATH } from "@/constant/constant";
import { capitalizeWords, getProductNameFromPath } from "@/util/util";
import type { ProductFormValues, Asset } from "@/types/Product";
import { ToastContainer, toast } from "react-toastify";
const VITE_BACK_END_URL = import.meta.env.VITE_BACK_END_URL;

interface DragDropInputProps {
  index: number;
}

export const DragDropInput = ({ index }: DragDropInputProps) => {
  const { watch, setValue } = useFormContext<ProductFormValues>();
  const assets = watch("assets");
  const asset = assets[index]; // Asset | null
  console.log("asset", asset);
  const [file, setFile] = React.useState<File | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);

  const [deleteAsset] = useDeleteAssetMutation();
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

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("productName", productName);

    try {
      const uploaded: Asset = await uploadAsset(formData).unwrap();
      const newAssets = [...assets];
      newAssets[index] = uploaded; // update đúng index
      setValue("assets", newAssets);
      setFile(null);
      toast.success("Upload successful!");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!asset) return;
    try {
      await deleteAsset({ assetId: asset.assetId }).unwrap();
      const newAssets = [...assets];
      newAssets[index] = null; // clear đúng index
      setValue("assets", newAssets);
      toast.success("Delete successful!");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  const previewUrl = file
    ? URL.createObjectURL(file)
    : asset?.url
    ? VITE_BACK_END_URL + IMAGE_UPLOAD_PATH + asset.url
    : "";

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
        onClick={() => document.getElementById(`fileInput-${index}`)?.click()}
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
        id={`fileInput-${index}`}
        className="hidden"
        onChange={(e) => e.target.files && setFile(e.target.files[0])}
      />

      <div className="flex gap-2 mt-2">
        {file && <Button onClick={() => setFile(null)}>Clear</Button>}
        {file && (
          <Button onClick={handleUpload} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        )}
        {!file && asset && <Button onClick={handleDelete}>Delete</Button>}
      </div>
    </div>
  );
};
