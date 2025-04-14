"use client"

import React from "react"

export function MockupBrowser({
  imageHref = "/placeholder.svg",
  className,
  props,
}: {
  imageHref?: string
  className?: string
  props?: React.SVGProps<SVGSVGElement>
}) {
  return (
    <svg
      focusable={false}
      aria-hidden={true}
      viewBox="0 0 1000 570"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={className}
    >
      <path
        d="M0 40H1000V562C1000 566.418 996.418 570 992 570H8.00002C3.58174 570 0 566.418 0 562V40Z"
        fill="url(#pattern0_1419_21896)"
      />
      <path
        d="M0 8C0 3.58172 3.58172 0 8 0H992C996.418 0 1000 3.58172 1000 8V40H0V8Z"
        fill="#272937"
        fill-opacity="0.12"
      />
      <rect
        x="351"
        y="11"
        width="298"
        height="18"
        rx="9"
        fill="#272937"
        fill-opacity="0.12"
      />
      <rect
        x="22"
        y="14"
        width="12"
        height="12"
        rx="6"
        fill="#272937"
        fill-opacity="0.12"
      />
      <rect
        x="46"
        y="14"
        width="12"
        height="12"
        rx="6"
        fill="#272937"
        fill-opacity="0.12"
      />
      <rect
        x="70"
        y="14"
        width="12"
        height="12"
        rx="6"
        fill="#272937"
        fill-opacity="0.12"
      />

      <image
        className="h-full w-full"
        href={imageHref}
        y="20"
        preserveAspectRatio="xMidYMid slice"
      />
    </svg>
  )
}
