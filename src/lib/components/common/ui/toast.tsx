"use client"

import { type Message } from "react-hook-form"
import toast, { type ToastOptions, Toaster } from "react-hot-toast"
import { CircleAlert, X, CircleCheck, AlertTriangle } from "lucide-react"

import { Button } from "./button"

export const ReactHotToaster = () => {
  return (
    <Toaster
      gutter={8}
      toastOptions={{
        className:
          "z-[100] max-w-[400px] rounded-lg border border-border bg-background px-4 py-3 shadow-lg shadow-black/5",
      }}
    />
  )
}

export const showSuccessToast = (msg: Message, opts?: ToastOptions) => {
  toast(
    <div className="flex gap-2">
      <p className="grow text-sm">
        <CircleCheck
          className="-mt-0.5 me-3 inline-flex text-emerald-500"
          size={16}
          strokeWidth={2}
          aria-hidden="true"
        />
        {msg}
      </p>
      <Button
        variant="ghost"
        className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
        onClick={() => toast.dismiss(opts?.id)}
        aria-label="Close notification"
      >
        <X
          size={16}
          strokeWidth={2}
          className="opacity-60 transition-opacity group-hover:opacity-100"
          aria-hidden="true"
        />
      </Button>
    </div>,
    opts,
  )
}

export const showInfoToast = (msg: Message, opts?: ToastOptions) => {
  toast(
    <div className="flex gap-2">
      <p className="grow text-sm">
        <CircleAlert
          className="-mt-0.5 me-3 inline-flex text-blue-500"
          size={16}
          strokeWidth={2}
          aria-hidden="true"
        />
        {msg}
      </p>
      <Button
        variant="ghost"
        className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
        onClick={() => toast.dismiss(opts?.id)}
        aria-label="Close notification"
      >
        <X
          size={16}
          strokeWidth={2}
          className="opacity-60 transition-opacity group-hover:opacity-100"
          aria-hidden="true"
        />
      </Button>
    </div>,
    opts,
  )
}

export const showWarningToast = (msg: Message, opts?: ToastOptions) => {
  toast(
    <div className="flex gap-2">
      <p className="grow text-sm">
        <AlertTriangle
          className="-mt-0.5 me-3 inline-flex text-amber-500"
          size={16}
          strokeWidth={2}
          aria-hidden="true"
        />
        {msg}
      </p>
      <Button
        variant="ghost"
        className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
        onClick={() => toast.dismiss(opts?.id)}
        aria-label="Close notification"
      >
        <X
          size={16}
          strokeWidth={2}
          className="opacity-60 transition-opacity group-hover:opacity-100"
          aria-hidden="true"
        />
      </Button>
    </div>,
    opts,
  )
}

export const showErrorToast = (msg: Message, opts?: ToastOptions) => {
  toast(
    <div className="flex gap-2">
      <p className="grow text-sm">
        <CircleAlert
          className="-mt-0.5 me-3 inline-flex text-red-500"
          size={16}
          strokeWidth={2}
          aria-hidden="true"
        />
        {msg}
      </p>
      <Button
        variant="ghost"
        className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
        onClick={() => toast.dismiss(opts?.id)}
        aria-label="Close notification"
      >
        <X
          size={16}
          strokeWidth={2}
          className="opacity-60 transition-opacity group-hover:opacity-100"
          aria-hidden="true"
        />
      </Button>
    </div>,
    opts,
  )
}

export const hideToast = (id: string) => {
  toast.dismiss(id)
}
