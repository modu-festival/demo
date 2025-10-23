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

// ✅ 중앙 기준 IntersectionObserver
const OBSERVER_OPTIONS = {
  root: null,
  rootMargin: "-50% 0px -50% 0px", // 화면 중앙 기준
  threshold: 0,
};

const SCROLL_OFFSET = -70; // 탭 높이만큼 보정
const SCROLL_TIMEOUT = 700; // smooth scroll 종료 대기

export default function Festival() {
  const [location, setLocation] = useLocation();
  const [language, setLanguage] = useState<Language>("ko");
  const [activeTab, setActiveTab] = useState<string>("gallery");
  const [isUserInteraction, setIsUserInteraction] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (location.startsWith("/en")) setLanguage("en");
    else if (location.startsWith("/ja")) setLanguage("ja");
    else if (location.startsWith("/zh")) setLanguage("zh");
    else setLanguage("ko");
  }, [location]);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    if (newLang === "ko") setLocation("/ko");
    else setLocation(`/${newLang}`);
  };

  const sectionRefs = {
    gallery: useRef<HTMLDivElement>(null),
    food: useRef<HTMLDivElement>(null),
    location: useRef<HTMLDivElement>(null),
    program: useRef<HTMLDivElement>(null),
    goods: useRef<HTMLDivElement>(null),
  };

  // ✅ IntersectionObserver (스크롤 시 활성 탭 감지)
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (isUserInteraction) return; // 클릭 중이면 무시

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
    setActiveTab(tabId); // 클릭 시 바로 활성화

    const y =
      targetRef.current.getBoundingClientRect().top +
      window.scrollY +
      SCROLL_OFFSET;

    window.scrollTo({ top: y, behavior: "smooth" });

    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsUserInteraction(false);
    }, SCROLL_TIMEOUT);
  }, []);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
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
