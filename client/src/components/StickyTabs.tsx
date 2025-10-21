import { useEffect, useRef, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import type { Language } from "@shared/schema";
import { getTranslation } from "@/lib/translations";

// Sticky 탭 상수값 - 객체 재생성 방지
const OBSERVER_OPTIONS = { threshold: 0, rootMargin: "-1px 0px 0px 0px" };

interface Tab {
  id: string;
  label: string;
}

interface StickyTabsProps {
  lang: Language;
  activeTab: string;
  onTabClick: (tabId: string) => void;
  isUserInteraction?: boolean;
}

export function StickyTabs({
  lang,
  activeTab,
  onTabClick,
  isUserInteraction = false,
}: StickyTabsProps) {
  const [isSticky, setIsSticky] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const activeButtonRef = useRef<HTMLButtonElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // 탭 데이터를 메모이제이션 - 언어 변경 시만 재생성
  const tabs = useMemo(
    () => [
      { id: "gallery", label: getTranslation(lang, "gallery") },
      { id: "food", label: getTranslation(lang, "food") },
      { id: "location", label: getTranslation(lang, "location") },
      { id: "program", label: getTranslation(lang, "program") },
      { id: "goods", label: getTranslation(lang, "goods") },
    ],
    [lang]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      OBSERVER_OPTIONS
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // 탭 버튼을 뷰 중앙으로 스크롤 (사용자가 탭을 클릭했을 때만)
  useEffect(() => {
    if (activeButtonRef.current && isUserInteraction) {
      // 기존 애니메이션 프레임 제거
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // 다음 프레임에 스크롤 (자동 스크롤은 수행하지 않음 - 사용자가 명시적으로 클릭한 경우만)
      animationFrameRef.current = requestAnimationFrame(() => {
        activeButtonRef.current?.scrollIntoView({
          block: "nearest",
          inline: "center",
        });
      });
    }

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [activeTab, isUserInteraction]);

  return (
    <>
      <div ref={sentinelRef} className="h-0" />
      <div
        ref={tabsRef}
        className={isSticky ? "sticky top-0 z-50 bg-white" : "bg-white"}
      >
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 px-4 py-3 ml-1.5 min-w-max">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                ref={activeTab === tab.id ? activeButtonRef : null}
                data-testid={`tab-${tab.id}`}
                variant="ghost"
                size="sm"
                onClick={() => onTabClick(tab.id)}
                className={`whitespace-nowrap flex-shrink-0 rounded-full px-4 py-1.5 ${
                  activeTab === tab.id
                    ? "bg-gray-900 text-white text-[14px] font-bold border-0"
                    : "bg-gray-100 text-gray-600 text-[14px] font-medium border border-gray-300"
                }`}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
