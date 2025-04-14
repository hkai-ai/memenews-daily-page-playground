"use client"

import { ShinyButton } from "../../common/ui/shiny-button"

/**
 * 首页的了解更多按钮
 * 点击后滚动到指定位置
 * @question 为什么不直接用 <a href={"#section-feature"} /> 呢?
 * @answer 主要是因为不想让url上带一个#section-feature，这样用户每次刷新主页都会跳到这个位置，很难受😣
 */
export function LearnMoreButton() {
  const handleNavClick = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    section?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  return (
    // <Button
    //   variant="outline"
    //   className="select-none"
    //   size="lg"
    //
    // >
    //   了解更多
    // </Button>
    <ShinyButton
      className="select-none"
      onClick={() => handleNavClick("section-feature")}
    >
      了解更多
    </ShinyButton>
  )
}
