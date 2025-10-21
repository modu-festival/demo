import { useState, useRef, useEffect } from "react";
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

export default function Festival() {
  const [language, setLanguage] = useState<Language>("ko");
  const [activeTab, setActiveTab] = useState<string>("gallery");
  const [isUserInteraction, setIsUserInteraction] = useState<boolean>(false);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const { toast } = useToast();

  const sectionRefs = {
    gallery: useRef<HTMLDivElement>(null),
    food: useRef<HTMLDivElement>(null),
    location: useRef<HTMLDivElement>(null),
    program: useRef<HTMLDivElement>(null),
    goods: useRef<HTMLDivElement>(null),
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-120px 0px -40% 0px",
      threshold: [0, 0.25, 0.5, 0.75, 1],
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // 스크롤 중일 때는 observer 비활성화
      if (isScrolling) return;

      const visibleEntries = entries.filter((entry) => entry.isIntersecting);

      if (visibleEntries.length > 0) {
        const mostVisible = visibleEntries.reduce((prev, current) => {
          return current.intersectionRatio > prev.intersectionRatio
            ? current
            : prev;
        });

        const sectionId = mostVisible.target.id as string;
        if (sectionId) {
          setActiveTab(sectionId);
        }
      }
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, [isScrolling]);

  const handleTabClick = (tabId: string) => {
    setIsUserInteraction(true);
    setIsScrolling(true);
    setActiveTab(tabId); // 즉시 탭 상태 업데이트

    const targetRef = sectionRefs[tabId as keyof typeof sectionRefs];
    if (targetRef.current) {
      const yOffset = -80;
      const y =
        targetRef.current.getBoundingClientRect().top +
        window.scrollY +
        yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });

      // 스크롤 완료 후 observer 다시 활성화
      setTimeout(() => {
        setIsScrolling(false);
      }, 1000); // 스크롤 애니메이션 시간 고려
    }
  };

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
