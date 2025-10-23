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

// IntersectionObserver 설정
const OBSERVER_OPTIONS = {
  root: null,
  rootMargin: "-80px 0px -50% 0px",
  threshold: 0,
};

const SCROLL_OFFSET = -80;
const SCROLL_TIMEOUT = 600;

export default function Festival() {
  const [location, setLocation] = useLocation(); // ✅ wouter 훅으로 현재 URL 가져오기
  const [language, setLanguage] = useState<Language>("ko");
  const [activeTab, setActiveTab] = useState<string>("gallery");
  const [isUserInteraction, setIsUserInteraction] = useState<boolean>(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // ✅ URL에 따라 초기 언어 설정 (/en, /ja, /zh)
  useEffect(() => {
    if (location.startsWith("/en")) setLanguage("en");
    else if (location.startsWith("/ja")) setLanguage("ja");
    else if (location.startsWith("/zh")) setLanguage("zh");
    else setLanguage("ko");
  }, [location]);

  // ✅ 언어 셀렉터 변경 시 URL도 같이 변경
  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    // URL을 바꿔서 공유 가능한 링크로 만듦
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

  // IntersectionObserver
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (isUserInteraction) return;

      const enteringEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      if (enteringEntries.length > 0) {
        const topSection = enteringEntries[0];
        const sectionId = topSection.target.id as string;
        if (sectionId) setActiveTab(sectionId);
      }
    };

    const observer = new IntersectionObserver(
      observerCallback,
      OBSERVER_OPTIONS
    );

    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
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

      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

      scrollTimeoutRef.current = setTimeout(() => {
        setIsUserInteraction(false);
      }, SCROLL_TIMEOUT);
    }
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
        onLanguageChange={handleLanguageChange} // ✅ 변경된 핸들러 사용
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
