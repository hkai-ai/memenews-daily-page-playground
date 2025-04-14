import React, { useState, useCallback } from "react"
import Cropper from "react-easy-crop"
import type { Point, Area } from "react-easy-crop"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Button } from "../ui/button"
import { Slider } from "../ui/slider"

interface ImageCropDialogProps {
  open: boolean
  onClose: () => void
  image: string
  onCropComplete: (croppedImage: Blob) => void
  aspectRatio?: number
}

export function ImageCropDialog({
  open,
  onClose,
  image,
  onCropComplete,
  aspectRatio = 16 / 9,
}: ImageCropDialogProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const onCropChange = (location: Point) => {
    setCrop(location)
  }

  const onZoomChange = (zoom: number) => {
    setZoom(zoom)
  }

  const onCropCompleteHandler = useCallback(
    (_: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels)
    },
    [],
  )

  const createCroppedImage = async () => {
    if (!croppedAreaPixels) return

    const canvas = document.createElement("canvas")
    const img = new Image()
    img.src = image

    await new Promise((resolve) => {
      img.onload = resolve
    })

    canvas.width = croppedAreaPixels.width
    canvas.height = croppedAreaPixels.height
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    ctx.drawImage(
      img,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
    )

    canvas.toBlob((blob) => {
      if (blob) {
        onCropComplete(blob)
      }
    }, "image/jpeg")
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>裁剪图片</DialogTitle>
        </DialogHeader>
        <div className="relative h-[400px]">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropCompleteHandler}
            minZoom={1}
            maxZoom={3}
          />
        </div>

        <div className="mt-4 flex items-center gap-4 px-1">
          <span className="text-sm text-muted-foreground">缩放</span>
          <Slider
            value={[zoom]}
            min={1}
            max={3}
            step={0.1}
            onValueChange={([value]) => setZoom(value)}
            className="w-full flex-1"
          />
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button onClick={createCroppedImage}>确认</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
