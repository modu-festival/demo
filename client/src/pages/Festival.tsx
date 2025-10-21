import { useState, useRef, useEffect, useCallback } from "react";
import type { Language } from "@shared/schema";
import { HeroSection } from "@/components/HeroSection";
import { FestivalInfo } from "@/components/FestivalInfo";
import { AnnouncementsSection } from "@/components/AnnouncementsSection";
import { StickyTabs } from "@/components/StickyTabs";
import { GallerySection } from "@/components/GallerySection";
import { FoodSection } from "@/components/FoodSection";
import { LocationSection } from "@/components/LocationSection";
import { ProgramSection } from "@/components/ProgramSection";
import { GoodsSection } from "@/components/GoodsSection";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";

// IntersectionObserver 설정 - 정확한 섹션 감지
// rootMargin: 화면 상단 80px 아래 지점을 기준으로 감지 (sticky tab 높이 고려)
const OBSERVER_OPTIONS = {
  root: null,
  rootMargin: "-80px 0px -50% 0px",
  threshold: 0, // 단일 threshold로 깜빡임 방지
};

const SCROLL_OFFSET = -80;
const SCROLL_TIMEOUT = 600; // 1000ms -> 600ms로 단축

export default function Festival() {
  const [language, setLanguage] = useState<Language>("ko");
  const [activeTab, setActiveTab] = useState<string>("gallery");
  const [isUserInteraction, setIsUserInteraction] = useState<boolean>(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const sectionRefs = {
    gallery: useRef<HTMLDivElement>(null),
    food: useRef<HTMLDivElement>(null),
    location: useRef<HTMLDivElement>(null),
    program: useRef<HTMLDivElement>(null),
    goods: useRef<HTMLDivElement>(null),
  };

  // IntersectionObserver 초기화 - 정확한 섹션 감지
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // 사용자가 탭을 클릭 중인 경우 자동 업데이트 방지
      if (isUserInteraction) {
        return;
      }

      // 가장 위에 있는 intersecting 섹션만 선택
      const enteringEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => {
          // y좌표 기준으로 정렬 (위에서부터 가장 먼저 만나는 섹션)
          return a.boundingClientRect.top - b.boundingClientRect.top;
        });

      if (enteringEntries.length > 0) {
        // 가장 위에 있는 섹션을 활성화
        const topSection = enteringEntries[0];
        const sectionId = topSection.target.id as string;

        if (sectionId) {
          setActiveTab(sectionId);
        }
      }
    };

    const observer = new IntersectionObserver(
      observerCallback,
      OBSERVER_OPTIONS
    );

    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, [isUserInteraction]);

  const handleTabClick = useCallback((tabId: string) => {
    setIsUserInteraction(true);
    setActiveTab(tabId);

    const targetRef = sectionRefs[tabId as keyof typeof sectionRefs];
    if (targetRef.current) {
      const y =
        targetRef.current.getBoundingClientRect().top +
        window.scrollY +
        SCROLL_OFFSET;

      window.scrollTo({ top: y, behavior: "smooth" });

      // 기존 타이머 제거
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // 스크롤 완료 후 상태 초기화 (더 짧은 시간)
      scrollTimeoutRef.current = setTimeout(() => {
        setIsUserInteraction(false);
      }, SCROLL_TIMEOUT);
    }
  }, []);

  // Cleanup: 언마운트 시 타이머 제거
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const handleAICall = () => {
    toast({
      title:
        language === "ko" ? "AI 상담사 연결" : "Connecting to AI Consultant",
      description:
        language === "ko"
          ? "곧 AI 상담사와 연결됩니다."
          : "You will be connected to an AI consultant shortly.",
    });
  };

  const handleDownloadPDF = (programId?: string) => {
    const link = document.createElement("a");

    if (programId) {
      link.href = `/api/programs/${programId}/pamphlet`;
      link.download = `program-${programId}.pdf`;
    } else {
      link.href = "/api/programs/pamphlet";
      link.download = "full-timetable.pdf";
    }

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: language === "ko" ? "다운로드 시작" : "Download Started",
      description:
        language === "ko"
          ? "팜플렛 다운로드가 시작되었습니다."
          : "Pamphlet download has started.",
    });
  };

  const handleDownloadFoodPamphlet = () => {
    const link = document.createElement("a");
    link.href = "/api/download-pamphlet";
    link.download = "food-guide.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: language === "ko" ? "다운로드 시작" : "Download Started",
      description:
        language === "ko"
          ? "먹거리 팜플렛 다운로드가 시작되었습니다."
          : "Food pamphlet download has started.",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <HeroSection
        lang={language}
        onAICall={handleAICall}
        onLanguageChange={setLanguage}
      />

      <div id="info">
        <FestivalInfo lang={language} />
      </div>

      <div id="announcements">
        <AnnouncementsSection lang={language} />
      </div>

      <StickyTabs
        lang={language}
        activeTab={activeTab}
        onTabClick={handleTabClick}
        isUserInteraction={isUserInteraction}
      />

      <div id="gallery" ref={sectionRefs.gallery}>
        <GallerySection lang={language} />
      </div>

      <div id="food" ref={sectionRefs.food}>
        <FoodSection
          lang={language}
          onDownloadPamphlet={handleDownloadFoodPamphlet}
        />
      </div>

      <div id="location" ref={sectionRefs.location}>
        <LocationSection lang={language} />
      </div>

      <div id="program" ref={sectionRefs.program}>
        <ProgramSection
          lang={language}
          onDownloadPamphlet={handleDownloadPDF}
        />
      </div>

      <div id="goods" ref={sectionRefs.goods}>
        <GoodsSection lang={language} />
      </div>

      <Footer />
    </div>
  );
}
