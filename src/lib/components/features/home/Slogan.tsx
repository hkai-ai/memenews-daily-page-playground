"use client"

import { TypeAnimation } from "react-type-animation"

/**
 * 首页的 slogan，带有打字机效果
 */
export const Slogan = () => {
  return (
    <TypeAnimation
      className="h-20 text-base tracking-widest md:text-xl"
      sequence={[
        1000,
        "你的信息源，本该由你定义。",
        2000,
        "DIY YOUR OWN SOURCE OF INFORMATION.",
        3000,
      ]}
      speed={10}
      repeat={Infinity}
    />
  )
}
