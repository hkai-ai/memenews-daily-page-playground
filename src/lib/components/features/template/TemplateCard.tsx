"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"

export function TemplateCard({
  className,
  title = "人工",
}: {
  className?: string
  title?: string
}) {
  const [cTitle, setTitle] = useState(title)

  return (
    <div
      id="main"
      style={{ fontFamily: "AbyssinicaSIL, serif" }}
      className={cn(
        "relative mx-auto w-[750px] overflow-hidden bg-[url(https://loosand-picture.oss-cn-hangzhou.aliyuncs.com/blog/bg.png)] font-sans tracking-[0.09em] bg-blend-multiply",
        className,
      )}
    >
      <section className="relative w-full">
        <img
          src="https://loosand-picture.oss-cn-hangzhou.aliyuncs.com/blog/Lx3JgO.png"
          alt=""
          className="absolute z-[-1] opacity-30 mix-blend-plus-darker"
        />
        <div className="absolute -left-14 top-6 flex h-[40px] w-[224px] rotate-[-32deg] items-center justify-center bg-lime-50 bg-gradient-to-r from-[#62BDC4] via-[#C2EbED] to-[#61CBD4] text-[24px] tracking-[0.09em]">
          <span>AI 金融</span>
        </div>

        <div className="p-6">
          <header className="mt-[4rem]">
            <div className="mb-4 flex items-center justify-between">
              {/* <h1
                className="text-[118px] font-normal leading-none tracking-[0.06em]"
                style={{ fontFamily: "HouZunSongTi" }}
              >
                {cTitle}
              </h1> */}
              <input
                type="text"
                value={cTitle}
                style={{
                  fontFamily: "HouZunSongTi",
                  fontSize: "118px",
                  lineHeight: "1",
                  background: "transparent",
                  letterSpacing: "0.06em",
                }}
                // className="font-normal leading-none tracking-[0.06em]"
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="relative h-[140px] w-[120px]">
                <span className="clip-data-top absolute left-4 top-1 text-[80px] font-light leading-none tracking-[0.15em]">
                  11
                </span>
                <span className="absolute inset-x-0 top-1/2 w-full -rotate-[25deg] border border-t border-black"></span>
                <span className="clip-data-bottom absolute -right-0 bottom-1.5 text-[80px] font-light leading-none tracking-[0.15em]">
                  21
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <hr className="h-0.5 bg-black" />
              <hr className="h-0.5 bg-black" />
            </div>

            <div className="flex items-center justify-center gap-2 py-3 text-center text-[24px] text-gray-800">
              <img
                src="https://loosand-picture.oss-cn-hangzhou.aliyuncs.com/blog/image.svg"
                alt=""
              />
              <a href="www.memenews.cn"> www.memenews.cn</a>

              <img
                src="https://loosand-picture.oss-cn-hangzhou.aliyuncs.com/blog/image.svg"
                alt=""
              />
            </div>
          </header>

          <img
            src="https://loosand-picture.oss-cn-hangzhou.aliyuncs.com/blog/%E8%BE%BE%E8%BE%BE%E7%9A%84%E5%85%AC%E4%BC%97%E5%8F%B7%E9%95%BF%E5%9B%BE-3%202.png"
            alt=""
            className="mx-auto h-[585px]"
          />

          <footer className="mt-4 flex flex-col gap-2">
            <div className="flex items-center justify-between py-4">
              <span className="text-[35px] leading-[44px] tracking-[0.09em]">
                「由memene生成」
              </span>

              <div className="flex items-center gap-2">
                <span className="text-[16px]text-gray-900 text-end font-sans">
                  二〇二四年
                  <br />
                  十一月十一
                </span>
                <span className="h-full px-4 py-1 font-sans text-[24px] outline outline-1">
                  初八
                </span>
              </div>
            </div>

            <div className="border-t border-gray-500" />

            <div className="flex items-center justify-between">
              <div className="mb-2 mt-2 text-sm text-gray-900">
                <p className="font-sans text-[16px] leading-snug">
                  本篇作者：
                  <br />
                  Loosand
                </p>
              </div>
              <div className="mt-2 text-right font-sans text-[24px] text-gray-900">
                洞悉<span className="font-serif">AI·</span>未来触手可及
              </div>
            </div>
          </footer>
        </div>
      </section>

      <section className="relative bg-[#C4E1DE] bg-opacity-70 pb-[300px] bg-blend-multiply">
        <div className="px-10">
          <div className="flex justify-between pt-11">
            <div>
              <h1
                className="flex h-[63px] w-[300px] items-center bg-gradient-to-r from-[#FBEBB4] indent-5 font-sans text-[44px] tracking-[0.038em]"
                style={{ fontFamily: "HouZunSongTi" }}
              >
                <span className="scale-x-[1.4] transform">今</span>
                <span className="scale-x-[1.4] transform">日</span>
                <span className="scale-x-[1.4] transform">热</span>
                <span className="scale-x-[1.4] transform">榜</span>
              </h1>
              <span className="mt-2 block indent-5 text-[32px] font-bold leading-[40px] tracking-[0.03em] text-[#AD9F70]">
                Hot Trends
              </span>
            </div>

            <img
              width="165"
              height="150"
              src="https://loosand-picture.oss-cn-hangzhou.aliyuncs.com/blog/part1.png"
              alt=""
              className=""
            />
          </div>

          <p className="mb-8 mt-10 px-2 text-[24px] leading-[44px] tracking-[0.03em] text-[#00433E]">
            今天是科技进步与人文关怀交织的一天。从AI技术的开源与创新，到人类科学家的历史性贡献，科技与社会在这一刻开始相互碰撞。
          </p>

          <ul className="mx-auto mt-10 space-y-5 tracking-[0.15em] [&>li]:flex [&>li]:items-center [&>li]:gap-5 [&>li]:rounded-full [&>li]:bg-gradient-to-r [&>li]:from-white [&>li]:py-1 [&>li]:pl-4 [&>li]:text-[26px]">
            <li>
              <svg
                width="24"
                height="27"
                viewBox="0 0 24 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.59344 26.9075C4.81094 23.1575 5.74844 21 7.15594 19.0325C8.65594 16.7825 9.03094 14.625 9.03094 14.625C9.03094 14.625 10.2484 16.125 9.78094 18.5625C11.8434 16.22 12.2184 12.47 11.9359 11.0625C16.6234 14.345 18.6859 21.5625 15.9684 26.8125C30.4059 18.5625 19.5309 6.2825 17.6559 4.97C18.3109 6.375 18.4059 8.72 17.0934 9.845C14.9359 1.595 9.59344 0 9.59344 0C10.2484 4.22 7.34344 8.8125 4.53094 12.2825C4.43594 10.595 4.34344 9.47 3.40594 7.7825C3.21844 10.875 0.873438 13.3125 0.218438 16.4075C-0.626562 20.625 0.873439 23.6275 6.59344 26.9075Z"
                  fill="#FF3C11"
                />
              </svg>
              <p>OpenAI 开源模型引发热潮，重塑AI未来！</p>
            </li>
            <li>
              <svg
                width="24"
                height="27"
                viewBox="0 0 24 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.59344 26.9075C4.81094 23.1575 5.74844 21 7.15594 19.0325C8.65594 16.7825 9.03094 14.625 9.03094 14.625C9.03094 14.625 10.2484 16.125 9.78094 18.5625C11.8434 16.22 12.2184 12.47 11.9359 11.0625C16.6234 14.345 18.6859 21.5625 15.9684 26.8125C30.4059 18.5625 19.5309 6.2825 17.6559 4.97C18.3109 6.375 18.4059 8.72 17.0934 9.845C14.9359 1.595 9.59344 0 9.59344 0C10.2484 4.22 7.34344 8.8125 4.53094 12.2825C4.43594 10.595 4.34344 9.47 3.40594 7.7825C3.21844 10.875 0.873438 13.3125 0.218438 16.4075C-0.626562 20.625 0.873439 23.6275 6.59344 26.9075Z"
                  fill="#FF3C11"
                />
              </svg>
              <p>Google教育硬件全景报告：洞察行业的发展潜力</p>
            </li>
            <li>
              <span className="flex size-[28px] items-center justify-center rounded-full bg-green-800 font-sans text-[22px] font-bold leading-none tracking-[0] text-white">
                1
              </span>
              <p className="w-fit">文心快码，编程自动化的未来已来！</p>
            </li>
            <li>
              <span className="flex size-[28px] items-center justify-center rounded-full bg-green-800 font-sans text-[22px] font-bold leading-none tracking-[0] text-white">
                2
              </span>
              <p className="w-fit">科技界大咖动态爆料合集</p>
            </li>
            <li>
              <span className="flex size-[28px] items-center justify-center rounded-full bg-green-800 font-sans text-[22px] font-bold leading-none tracking-[0] text-white">
                3
              </span>
              <p className="w-fit">OpenAI重组与高管离职潮中的新生机遇</p>
            </li>
            <li>
              <span className="flex size-[28px] items-center justify-center rounded-full bg-green-800 font-sans text-[22px] font-bold leading-none tracking-[0] text-white">
                4
              </span>
              <p className="w-fit">Paradot：AI陪伴应用的崛起与未来展望</p>
            </li>
            <li>
              <span className="flex size-[28px] items-center justify-center rounded-full bg-green-800 font-sans text-[22px] font-bold leading-none tracking-[0] text-white">
                5
              </span>
              <p className="w-fit">解锁 AI 与云计算的无限可能</p>
            </li>
          </ul>
        </div>
        <img
          src="https://loosand-picture.oss-cn-hangzhou.aliyuncs.com/blog/cloud2.png"
          alt=""
          className="absolute -bottom-40 left-0 right-0"
        />

        <img
          src="https://loosand-picture.oss-cn-hangzhou.aliyuncs.com/blog/mount.png"
          alt=""
          className="absolute -right-12 bottom-[350px]"
        />
      </section>

      <section className="relative">
        <div className="px-10 pt-24">
          <div className="flex justify-between pt-11">
            <div>
              <div className="flex h-[63px] w-[270px] items-center bg-gradient-to-r from-[#C6E4E1] indent-6 text-[39px] font-normal">
                <h1
                  className="flex h-[63px] w-[300px] items-center indent-5 font-sans text-[44px] font-normal tracking-[0.038em]"
                  style={{ fontFamily: "HouZunSongTi" }}
                >
                  <span className="scale-x-[1.3] transform">AI</span>
                  <span className="scale-x-[1.3] transform">三</span>
                  <span className="scale-x-[1.3] transform">幻</span>
                  <span className="scale-x-[1.3] transform">神</span>
                </h1>
              </div>

              <span className="mt-4 block indent-5 text-[32px] font-bold leading-[40px] tracking-[0.03em] text-[#BBD1DA]">
                Three Major
              </span>
            </div>

            <img
              width="165"
              height="150"
              src="https://loosand-picture.oss-cn-hangzhou.aliyuncs.com/blog/part2.png"
              alt=""
              className=""
            />
          </div>

          <div className="mt-4 space-y-10">
            <div className="space-y-5">
              <h2 className="flex items-center gap-6">
                <div className="flex size-[32px] items-center justify-center rounded-full bg-[#FF3C11]">
                  <svg
                    width="20"
                    height="23"
                    viewBox="0 0 20 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.64843 23C4.12141 19.7946 4.92454 17.9504 6.13031 16.2686C7.41533 14.3454 7.73658 12.5012 7.73658 12.5012C7.73658 12.5012 8.77958 13.7833 8.37908 15.8669C10.146 13.8645 10.4672 10.6591 10.2252 9.45601C14.2409 12.2618 16.0078 18.4312 13.6798 22.9188C26.048 15.8669 16.7317 5.37016 15.1254 4.24826C15.6865 5.44922 15.7679 7.45368 14.6435 8.41531C12.7952 1.36337 8.21846 0 8.21846 0C8.77958 3.60717 6.29094 7.53275 3.88154 10.4988C3.80016 9.0564 3.72091 8.09477 2.91778 6.65233C2.75716 9.29574 0.748253 11.3793 0.187131 14.0248C-0.53676 17.6298 0.748253 20.1963 5.64843 23Z"
                      fill="white"
                    />
                  </svg>
                </div>

                <p className="text-[26px] font-medium tracking-widest">
                  Google拓展AI功能至六国
                </p>
              </h2>

              <p className="pl-[57px] text-[24px] font-normal leading-[33px] tracking-[0.15em]">
                Google将其AI生成摘要功能“AI
                Overviews”扩展到巴西、印度等六个国家。这项技术通过AI提供多语言搜索结果摘要，显著提升了用户搜索体验。
              </p>
            </div>

            <div className="border border-dashed border-[#005953]"></div>

            <div className="space-y-5">
              <h2 className="flex items-center gap-6">
                <div className="flex size-[32px] items-center justify-center rounded-full bg-[#FF3C11]">
                  <svg
                    width="20"
                    height="23"
                    viewBox="0 0 20 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.64843 23C4.12141 19.7946 4.92454 17.9504 6.13031 16.2686C7.41533 14.3454 7.73658 12.5012 7.73658 12.5012C7.73658 12.5012 8.77958 13.7833 8.37908 15.8669C10.146 13.8645 10.4672 10.6591 10.2252 9.45601C14.2409 12.2618 16.0078 18.4312 13.6798 22.9188C26.048 15.8669 16.7317 5.37016 15.1254 4.24826C15.6865 5.44922 15.7679 7.45368 14.6435 8.41531C12.7952 1.36337 8.21846 0 8.21846 0C8.77958 3.60717 6.29094 7.53275 3.88154 10.4988C3.80016 9.0564 3.72091 8.09477 2.91778 6.65233C2.75716 9.29574 0.748253 11.3793 0.187131 14.0248C-0.53676 17.6298 0.748253 20.1963 5.64843 23Z"
                      fill="white"
                    />
                  </svg>
                </div>

                <p className="text-[26px] font-medium tracking-widest">
                  OpenAI与美政府签AI协议
                </p>
              </h2>

              <p className="pl-[57px] text-[24px] font-normal leading-[33px] tracking-[0.15em]">
                OpenAI和Anthropic与美国政府达成协议，合作进行AI模型的风险与能力评估。这项合作表明AI在政府监管和创新中的核心地位。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="px-10 pt-16">
          <div className="flex justify-between pt-11">
            <div>
              <div className="flex h-[63px] w-[270px] items-center bg-gradient-to-r from-[#C6E4E1] indent-6 text-[39px] font-normal">
                <h1
                  className="flex h-[63px] w-[300px] items-center indent-5 font-sans text-[44px] font-normal tracking-[0.038em]"
                  style={{ fontFamily: "HouZunSongTi" }}
                >
                  <span className="scale-x-[1.3] transform">今</span>
                  <span className="scale-x-[1.3] transform">日</span>
                  <span className="scale-x-[1.3] transform">快</span>
                  <span className="scale-x-[1.3] transform">报</span>
                </h1>
              </div>
              <span className="mt-4 block indent-5 text-[32px] font-bold leading-[40px] tracking-[0.03em] text-[#BBD1DA]">
                Daily News
              </span>
            </div>

            <img
              width="165"
              height="150"
              src="https://loosand-picture.oss-cn-hangzhou.aliyuncs.com/blog/part3.png"
              alt=""
              className=""
            />
          </div>

          <div className="space-y-10 pb-10 pt-20 tracking-[0.15em]">
            <div className="space-y-5">
              <h2 className="flex items-center gap-6">
                <span className="flex size-[32px] items-center justify-center rounded-full bg-green-800 text-center font-sans text-[22px] font-bold leading-none tracking-[0] text-white">
                  1
                </span>

                <p className="w-fit text-[26px] font-semibold tracking-[0.15em]">
                  Llama 3.2开源模型引发热潮，重塑AI未来！
                </p>
              </h2>

              <p className="pl-[57px] text-[24px] font-normal tracking-[0.15em]">
                在Meta开发者大会上，Llama
                3.2重磅发布，具备多模态能力并与Arm合作推出轻量级手机优化版本，展现超越闭源模型的性能，潜在引发行业变革。
              </p>
            </div>

            <div className="border border-dashed border-[#005953]"></div>

            <div className="space-y-5">
              <h2 className="flex items-center gap-6">
                <span className="flex size-[32px] items-center justify-center rounded-full bg-green-800 text-center font-sans text-[22px] font-bold leading-none tracking-[0] text-white">
                  2
                </span>

                <p className="w-fit text-[26px] font-semibold tracking-[0.15em]">
                  AI教育硬件全景报告：洞察行业未来的发展潜力
                </p>
              </h2>

              <p className="pl-[57px] text-[24px] font-normal tracking-[0.15em]">
                量子位智库的《AI教育硬件全景报告》深入探讨了AI教育硬件的定义、市场动态及未来趋势，展现出其快速增长的潜力。
              </p>
            </div>
            <div className="border border-dashed border-[#005953]"></div>

            <div className="space-y-5">
              <h2 className="flex items-center gap-6">
                <span className="flex size-[32px] items-center justify-center rounded-full bg-green-800 text-center font-sans text-[22px] font-bold leading-none tracking-[0] text-white">
                  3
                </span>

                <p className="w-fit text-[26px] font-semibold tracking-[0.15em]">
                  文心快码，编程自动化的未来已来！
                </p>
              </h2>

              <p className="pl-[57px] text-[24px] font-normal tracking-[0.15em]">
                本文通过对话百度智能云技术委员会主席孙珂，探讨了编程自动化的未来及文心快码的最新进展。文心快码作为一款智能编码工具，已被80%以上的工程师广泛应用。文章强调了编程自动化对企业开发者角色的影响，并呼吁读者参与即将举行的直播，带来互动感。
              </p>
            </div>

            <div className="border border-dashed border-[#005953]"></div>

            <div className="space-y-5">
              <h2 className="flex items-center gap-6">
                <span className="flex size-[32px] items-center justify-center rounded-full bg-green-800 text-center font-sans text-[22px] font-bold leading-none tracking-[0] text-white">
                  4
                </span>

                <p className="w-fit text-[26px] font-semibold tracking-[0.15em]">
                  科技界大咖动态爆料合集
                </p>
              </h2>

              <p className="pl-[57px] text-[24px] font-normal tracking-[0.15em]">
                本文汇总了科技行业近期的重大新闻，重点关注高管离职、Meta新品发布与X平台内容治理措施，反映出行业动态与技术创新的重要性。
              </p>
            </div>

            <div className="border border-dashed border-[#005953]"></div>

            <div className="space-y-5">
              <h2 className="flex items-center gap-6">
                <span className="flex size-[32px] items-center justify-center rounded-full bg-green-800 text-center font-sans text-[22px] font-bold leading-none tracking-[0] text-white">
                  5
                </span>

                <p className="w-fit text-[26px] font-semibold tracking-[0.15em]">
                  OpenAI重组与高管离职潮中的新生机遇
                </p>
              </h2>

              <p className="pl-[57px] text-[24px] font-normal tracking-[0.15em]">
                OpenAI重组为营利性共益公司，高管离职潮引发担忧，但也可能带来行业活力和创新。新版本视频模型Sora虽面临挑战，期待在改进中突破。
              </p>
            </div>
          </div>

          <div
            className="overflow-hidden rounded-3xl tracking-[0.15em]"
            style={{
              background:
                "linear-gradient(270deg, rgba(230, 246, 231, 0) 0%, rgba(198, 228, 225, 0.5) 100%)",
            }}
          >
            <h2
              className="w-[203px] py-1 indent-[40px] text-[30px] font-semibold tracking-[0.09em]"
              style={{
                background:
                  "linear-gradient(90deg, #cbe6e3 4.19%, rgba(0, 89, 83, 0) 100%)",
              }}
            >
              日推
            </h2>

            <div className="space-y-4 px-14 py-7">
              <h3 className="text-[26px] font-semibold tracking-[0.15em]">
                localsend(Star 45.8k)
              </h3>
              <p className="text-[24px] leading-[33px] tracking-[0.15em]">
                无需网络链接，与附近的设备安全地共享文件和消息。LocalSend
                是一款免费的开源应用程序，可让您通过本地网络与附近的设备安全地共享文件和消息，而无需互联网连接。
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer relative h-[460px]">
        <div className="absolute inset-x-0 top-10 mx-auto flex w-fit flex-col items-center space-y-2 text-[20px] tracking-[0.15em]">
          <div className="relative">
            <img
              className="mb-2 outline outline-1"
              width="230"
              height="230"
              src="https://loosand-picture.oss-cn-hangzhou.aliyuncs.com/blog/%E6%88%AA%E5%B1%8F2024-10-16%2011.57.07%201.png"
              alt="QR Code"
            />
            <img
              className="absolute -left-16 -top-2"
              src="https://loosand-picture.oss-cn-hangzhou.aliyuncs.com/blog/Vector.svg"
              alt=""
            />
          </div>
          <p className="leading-none">姥爷们打开看看哦</p>
          <p className="leading-none">更多订阅详情全在这里</p>
        </div>

        <img
          src="https://loosand-picture.oss-cn-hangzhou.aliyuncs.com/blog/%E6%9C%AA%E5%91%BD%E5%90%8D.png"
          alt=""
          className="absolute bottom-0"
        />
      </footer>
    </div>
  )
}
