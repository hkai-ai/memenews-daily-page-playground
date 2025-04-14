"use client"

import { useState } from "react"
import { useRequest } from "ahooks"
import { Upload } from "lucide-react"

import { FileUploader, FileInput } from "@/lib/components/common/ui/file-upload"
import { ImageCropDialog } from "@/lib/components/common/image/ImageCropDialog"
import { uploadImageAction } from "@/lib/api/common/upload-image"
import {
  showErrorToast,
  showSuccessToast,
} from "@/lib/components/common/ui/toast"
import { ImageAssets } from "@/lib/constants"
import { cn } from "@/lib/utils"

interface ImageUploaderProps {
  value?: string
  onChange?: (url: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  withCrop?: boolean
  aspectRatio?: number
  showUploadTip?: boolean
}

export function ImageUploader({
  value,
  onChange,
  disabled,
  className,
  placeholder = "上传封面",
  withCrop = false,
  aspectRatio,
  showUploadTip = true,
}: ImageUploaderProps) {
  const [files, setFiles] = useState<File[]>([])
  const [loadingUploadImage, setLoadingUploadImage] = useState(false)
  const [cropDialogOpen, setCropDialogOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string>("")

  const { run: uploadImage } = useRequest(uploadImageAction, {
    manual: true,
    onSuccess(data) {
      onChange?.(data.data.url)
      showSuccessToast(`上传成功🎉！`)
      setLoadingUploadImage(false)
    },
    onError(error: any) {
      showErrorToast(`上传失败: ${error.message.statusText}`)
      setLoadingUploadImage(false)
    },
  })

  const handleFileChange = (newFiles: File[] | null) => {
    if (newFiles && newFiles.length > 0) {
      setFiles(newFiles)
      if (withCrop) {
        const reader = new FileReader()
        reader.onload = () => {
          setSelectedImage(reader.result as string)
          setCropDialogOpen(true)
        }
        reader.readAsDataURL(newFiles[0])
      } else {
        handleUpload(newFiles[0])
      }
    }
  }

  const handleUpload = (file: File) => {
    setLoadingUploadImage(true)
    const formData = new FormData()
    formData.append("image", file)
    uploadImage({ image: formData })
    setFiles([])
  }

  const handleCropComplete = (croppedBlob: Blob) => {
    setLoadingUploadImage(true)
    const formData = new FormData()
    formData.append("image", croppedBlob)
    uploadImage({ image: formData })
    setCropDialogOpen(false)
    setFiles([])
  }

  const handleCloseDialog = () => {
    setCropDialogOpen(false)
    setFiles([])
  }

  return (
    <>
      <FileUploader
        value={files}
        onValueChange={handleFileChange}
        dropzoneOptions={{
          accept: {
            "image/*": [".png", ".jpg", ".jpeg", ".gif"],
          },
          maxFiles: 1,
          disabled,
        }}
        className={className}
      >
        <FileInput
          className={cn(
            "relative flex aspect-video w-full cursor-pointer items-center justify-center rounded-lg border border-dashed shadow-sm",
            loadingUploadImage
              ? "pointer-events-none cursor-not-allowed bg-muted"
              : "",
            disabled ? "cursor-not-allowed opacity-60" : "",
          )}
        >
          {loadingUploadImage ? (
            <div className="flex size-full animate-pulse items-center justify-center rounded-lg bg-muted" />
          ) : value ? (
            <div className="relative h-full w-full">
              <img
                src={value}
                alt="上传图片"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = ImageAssets.defaultCover
                }}
              />
            </div>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 object-cover">
              <Upload className="size-8 stroke-2" />
              {showUploadTip && (
                <div className="text-center text-xs font-light">
                  <b className="block font-medium">
                    {placeholder}
                    <span className="ml-1 text-red-500">*</span>
                  </b>

                  <span className="font-light">点击上传或拖拽图片到此处</span>
                </div>
              )}
            </div>
          )}
        </FileInput>
      </FileUploader>

      {withCrop && (
        <ImageCropDialog
          open={cropDialogOpen}
          onClose={handleCloseDialog}
          image={selectedImage}
          onCropComplete={handleCropComplete}
          aspectRatio={aspectRatio}
        />
      )}
    </>
  )
}
