"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// SVG Imports
import LogoCoworkers from "@/assets/landing/logo_coworkers.svg";
import LandingSec1Pc from "@/assets/landing/sec1_pc.svg";
import LandingSec1Tab from "@/assets/landing/sec1_tablet.svg";
import LandingSec1Mo from "@/assets/landing/sec1_mobile.svg";
import FolderFill from "@/assets/landing/Folder_fill.svg";
import LandingSec2Pc from "@/assets/landing/sec2_pc.svg";
import LandingSec2Tab from "@/assets/landing/sec2_tablet.svg";
import LandingSec2Mo from "@/assets/landing/sec2_mobile.svg";
import LandingSec3Pc from "@/assets/landing/sec3_pc.svg";
import LandingSec3Tab from "@/assets/landing/sec3_tablet.svg";
import LandingSec3Mo from "@/assets/landing/sec3_mobile.svg";
import FolderFill2 from "@/assets/landing/Folder_fill2.svg";
import LandingSec4Pc from "@/assets/landing/sec4_pc.svg";
import LandingSec4Tab from "@/assets/landing/sec4_tablet.svg";
import LandingSec4Mo from "@/assets/landing/sec4_mobile.svg";
import FolderFill3 from "@/assets/landing/Folder_fill3.svg";

// Components
import Gnb from "@/components/gnb/Gnb";
import { ThreeButton } from "./ThreeButton";

export default function Index() {
  const [isAtBottom, setIsAtBottom] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsAtBottom(entry.isIntersecting);
      },
      { threshold: 0.5 },
    );

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <main className="relative flex w-full flex-col md:flex-row">
        <Gnb />

        {/* ================= 플로팅 ThreeButton ================= */}
        <div className="pointer-events-none fixed inset-0 z-50">
          <AnimatePresence>
            {!isAtBottom && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3 }}
                className="pointer-events-auto absolute right-10 bottom-10 md:right-12 md:bottom-12"
              >
                <ThreeButton />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 랜딩 페이지 컨텐츠 */}
        <section className="w-full overflow-hidden">
          {/* ================= 랜딩 섹션 1 ================= */}
          <section className="bg-background-secondary flex w-full flex-col items-start pt-[34px] 2xl:flex-row 2xl:p-0">
            <div className="mb-[19px] ml-[20px] h-auto w-fit shrink-0 md:ml-[37px] 2xl:mt-[208px] 2xl:mr-[169px] 2xl:ml-[76px] 2xl:h-auto">
              <LogoCoworkers className="h-9 w-9 shrink-0 2xl:h-12 2xl:w-12" />
              <div className="w-full pl-[19px]">
                <p className="text-md-m md:text-lg-m 2xl:text-xl-m whitespace-nowrap text-gray-400">
                  함께 만들어 가는 To do list
                </p>
                <p className="text-brand-primary text-[28px] leading-tight font-bold md:text-[36px] 2xl:text-[48px]">
                  Coworkers
                </p>
              </div>
            </div>

            <div className="w-full flex-grow">
              <LandingSec1Pc className="hidden h-full w-full 2xl:block" />
              <LandingSec1Tab className="hidden h-full w-full md:block 2xl:hidden" />
              <LandingSec1Mo className="h-full w-full md:hidden" />
            </div>
          </section>

          {/* ================= 랜딩 섹션 2 ================= */}
          <section className="bg-icon-inverse relative flex w-full flex-col pt-[73px] 2xl:flex-row 2xl:justify-between 2xl:pt-[114px]">
            <div className="mb-6 ml-[35px] flex flex-col gap-1 md:ml-[62px] 2xl:ml-[180px] 2xl:pt-[78px]">
              <FolderFill className="2xl:h-12 2xl:w-12" />
              <p className="text-lg-b text-brand-primary md:text-2xl-b 2xl:text-3xl-b mb-2 2xl:mb-3.5">
                칸반보드로 함께
                <br />할 일 목록을 관리해요
              </p>
              <p className="text-xs-r md:text-md-r 2xl:text-lg-r text-gray-400 2xl:leading-[24px]">
                팀원과 함께 실시간으로 할 일을 추가하고
                <br />
                지금 무엇을 해야 하는지 한눈에 볼 수 있어요
              </p>
            </div>
            <div className="ml-[35px] w-full pb-[44px] md:pb-[81px] 2xl:mr-[262px] 2xl:w-[1024px]">
              <LandingSec2Pc className="hidden h-full w-full 2xl:block" />
              <LandingSec2Tab className="hidden h-full w-full md:block 2xl:hidden" />
              <LandingSec2Mo className="h-full w-full md:hidden" />
            </div>
          </section>

          {/* ================= 랜딩 섹션 3 ================= */}
          <section className="bg-brand-primary relative flex w-full flex-col pt-[73px] md:pt-[49px] 2xl:flex-row-reverse 2xl:items-center 2xl:justify-end 2xl:pt-[84px]">
            <div className="mb-6 ml-[35px] flex flex-col gap-1 md:mb-[41px] md:ml-[71px] 2xl:h-auto 2xl:w-auto">
              <FolderFill2 className="2xl:h-12 2xl:w-12" />
              <p className="text-lg-b text-color-inverse md:text-2xl-b 2xl:text-3xl-b mb-3 2xl:mb-3.5">
                세부적으로 할 일들을
                <br />
                간편하게 체크해요
              </p>
              <p className="text-xs-r md:text-md-r 2xl:text-lg-r text-[#C9DAFD] 2xl:leading-[24px]">
                일정에 맞춰 해야 할 세부 항목을 정리하고,
                <br />
                하나씩 빠르게 완료해보세요.
              </p>
            </div>
            <div className="ml-[18px] w-full md:ml-[45px] 2xl:ml-[139px] 2xl:w-[1034px]">
              <LandingSec3Pc className="hidden h-full w-full 2xl:block" />
              <LandingSec3Tab className="hidden h-full w-full md:block 2xl:hidden" />
              <LandingSec3Mo className="h-full w-full md:hidden" />
            </div>
          </section>

          {/* ================= 랜딩 섹션 4 ================= */}
          <section className="bg-icon-inverse relative flex w-full flex-col pt-[43px] md:pt-[96px] 2xl:flex-row 2xl:pt-0">
            <div className="mb-[50px] ml-[35px] flex shrink-0 flex-col gap-1 md:mb-[79px] md:ml-[71px] 2xl:mr-[171px] 2xl:h-auto 2xl:w-auto 2xl:pt-[192px]">
              <FolderFill3 className="2xl:h-12 2xl:w-12" />
              <p className="text-lg-b text-brand-primary md:text-2xl-b 2xl:text-3xl-b mb-2 2xl:mb-3.5">
                할 일 공유를 넘어
                <br />
                의견을 나누고 함께 결정해요
              </p>
              <p className="text-xs-r md:text-md-r 2xl:text-lg-r text-gray-400 2xl:leading-[24px]">
                댓글로 진행상황을 기록하고 피드백을 주고받으며
                <br />
                함께 결정을 내릴 수 있어요.
              </p>
            </div>
            <div className="ml-[18px] w-full md:mx-[66px] 2xl:mr-[204px]">
              <LandingSec4Pc className="hidden h-full w-full 2xl:block" />
              <LandingSec4Tab className="hidden h-full w-full md:block 2xl:hidden" />
              <LandingSec4Mo className="h-full w-full md:hidden" />
            </div>
          </section>

          {/* ================= 랜딩 하단 시작하기 버튼 섹션 ================= */}
          <footer className="mt-[63px] pb-[93px] text-center md:mt-[76px] 2xl:mt-[97px] 2xl:pb-[123px]">
            <div className="mx-auto w-full max-w-[280px] md:max-w-[373px]">
              <div className="mb-7">
                <p className="text-2lg-b text-brand-primary md:text-2xl-b mb-2">
                  지금 바로 시작해보세요
                </p>
                <p className="text-xs-r text-color-default md:text-lg-r">
                  팀원 모두와 같은 방향, 같은 속도로 나아가는 가장 쉬운 방법
                </p>
              </div>

              <div
                ref={targetRef}
                className="flex h-[48px] w-full items-center justify-center"
              >
                <AnimatePresence>
                  {isAtBottom && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="pointer-events-auto"
                    >
                      <ThreeButton />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </footer>
        </section>
      </main>
    </>
  );
}
