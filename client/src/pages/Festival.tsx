import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
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

// ✅ 중앙 기준 IntersectionObserver (화면 중앙을 기준으로 탭 활성화)
const OBSERVER_OPTIONS = {
  root: null,
  rootMargin: "-50% 0px -50% 0px",
  threshold: 0,
};

const SCROLL_TIMEOUT = 1000; // smooth scroll 종료 대기 시간(ms)

export default function Festival() {
  const [location, setLocation] = useLocation();
  const [language, setLanguage] = useState<Language>("ko");
  const [activeTab, setActiveTab] = useState<string>("gallery");
  const [isUserInteraction, setIsUserInteraction] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // ✅ URL 기반 언어 설정
  useEffect(() => {
    if (location.startsWith("/en")) setLanguage("en");
    else if (location.startsWith("/ja")) setLanguage("ja");
    else if (location.startsWith("/zh")) setLanguage("zh");
    else setLanguage("ko");
  }, [location]);

  // ✅ 언어 변경 시 URL도 변경
  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    if (newLang === "ko") setLocation("/ko");
    else setLocation(`/${newLang}`);
  };

  // ✅ 섹션 참조
  const sectionRefs = {
    gallery: useRef<HTMLDivElement>(null),
    food: useRef<HTMLDivElement>(null),
    location: useRef<HTMLDivElement>(null),
    program: useRef<HTMLDivElement>(null),
    goods: useRef<HTMLDivElement>(null),
  };

  // ✅ IntersectionObserver: 스크롤 시 현재 섹션 감지 → 탭 활성화
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (isUserInteraction) return; // 클릭 중엔 무시

      const visibleEntry = entries.find((entry) => entry.isIntersecting);
      if (visibleEntry) {
        const sectionId = visibleEntry.target.id;
        if (sectionId && sectionId !== activeTab) {
          setActiveTab(sectionId);
        }
      }
    };

    const observer = new IntersectionObserver(
      observerCallback,
      OBSERVER_OPTIONS
    );
    observerRef.current = observer;

    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, [isUserInteraction, activeTab]);

  // ✅ 탭 클릭 → 해당 섹션으로 스크롤
  const handleTabClick = useCallback((tabId: string) => {
    const targetRef = sectionRefs[tabId as keyof typeof sectionRefs];
    if (!targetRef.current) return;

    setIsUserInteraction(true);
    setActiveTab(tabId); // 클릭 즉시 활성화

    // ✅ 모바일 Safari / Android Chrome 호환성을 위해 scrollIntoView 사용
    targetRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center", // 섹션 상단을 화면 위쪽에 맞춤
    });

    // ✅ 스크롤 완료 후 observer 다시 활성화
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsUserInteraction(false);
    }, SCROLL_TIMEOUT);
  }, []);

  // ✅ cleanup
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // ✅ AI 상담사 호출 (토스트 예시)
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

  // ✅ 프로그램 팜플렛 다운로드
  const handleDownloadPDF = (programId?: string) => {
    const link = document.createElement("a");
    link.href = programId
      ? `/api/programs/${programId}/pamphlet`
      : "/api/programs/pamphlet";
    link.download = programId
      ? `program-${programId}.pdf`
      : "full-timetable.pdf";
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

  // ✅ 먹거리 팜플렛 다운로드
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
        onLanguageChange={handleLanguageChange}
      />

      <FestivalInfo lang={language} />
      <AnnouncementsSection lang={language} />

      <StickyTabs
        lang={language}
        activeTab={activeTab}
        onTabClick={handleTabClick}
        isUserInteraction={isUserInteraction}
      />

      {/* ✅ scroll-margin-top으로 sticky 탭에 가리지 않게 처리 */}
      <div id="gallery" ref={sectionRefs.gallery} className="scroll-mt-[80px]">
        <GallerySection lang={language} />
      </div>

      <div id="food" ref={sectionRefs.food} className="scroll-mt-[80px]">
        <FoodSection
          lang={language}
          onDownloadPamphlet={handleDownloadFoodPamphlet}
        />
      </div>

      <div
        id="location"
        ref={sectionRefs.location}
        className="scroll-mt-[80px]"
      >
        <LocationSection lang={language} />
      </div>

      <div id="program" ref={sectionRefs.program} className="scroll-mt-[80px]">
        <ProgramSection
          lang={language}
          onDownloadPamphlet={handleDownloadPDF}
        />
      </div>

      <div id="goods" ref={sectionRefs.goods} className="scroll-mt-[80px]">
        <GoodsSection lang={language} />
      </div>

      <Footer />
    </div>
  );
}
