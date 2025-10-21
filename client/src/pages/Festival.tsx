import { useState, useRef, useEffect } from "react";
import type { Language } from "@shared/schema";
import { HeroSection } from "@/components/HeroSection";
import { LanguageSelector } from "@/components/LanguageSelector";
import { FestivalInfo } from "@/components/FestivalInfo";
import { AnnouncementsSection } from "@/components/AnnouncementsSection";
import { StickyTabs } from "@/components/StickyTabs";
import { GallerySection } from "@/components/GallerySection";
import { FoodSection } from "@/components/FoodSection";
import { LocationSection } from "@/components/LocationSection";
import { ProgramSection } from "@/components/ProgramSection";
import { GoodsSection } from "@/components/GoodsSection";
import { useToast } from "@/hooks/use-toast";

export default function Festival() {
  const [language, setLanguage] = useState<Language>("ko");
  const [activeTab, setActiveTab] = useState<string>("gallery");
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
      rootMargin: "-100px 0px -50% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id as string;
          setActiveTab(sectionId);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, []);

  const handleTabClick = (tabId: string) => {
    const targetRef = sectionRefs[tabId as keyof typeof sectionRefs];
    if (targetRef.current) {
      const yOffset = -80;
      const y = targetRef.current.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleAICall = () => {
    toast({
      title: language === "ko" ? "AI 상담사 연결" : "Connecting to AI Consultant",
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
        language === "ko" ? "팜플렛 다운로드가 시작되었습니다." : "Pamphlet download has started.",
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
        language === "ko" ? "먹거리 팜플렛 다운로드가 시작되었습니다." : "Food pamphlet download has started.",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <HeroSection lang={language} onAICall={handleAICall} />
      <LanguageSelector currentLang={language} onLanguageChange={setLanguage} />
      <FestivalInfo lang={language} />
      <AnnouncementsSection lang={language} />
      <StickyTabs lang={language} activeTab={activeTab} onTabClick={handleTabClick} />
      
      <div id="gallery" ref={sectionRefs.gallery}>
        <GallerySection lang={language} />
      </div>
      
      <div id="food" ref={sectionRefs.food}>
        <FoodSection lang={language} onDownloadPamphlet={handleDownloadFoodPamphlet} />
      </div>
      
      <div id="location" ref={sectionRefs.location}>
        <LocationSection lang={language} />
      </div>
      
      <div id="program" ref={sectionRefs.program}>
        <ProgramSection lang={language} onDownloadPamphlet={handleDownloadPDF} />
      </div>
      
      <div id="goods" ref={sectionRefs.goods}>
        <GoodsSection lang={language} />
      </div>
      
      <footer className="bg-gray-900 text-white text-center py-8 px-6">
        <p className="text-sm">© 2025 모두의 축제. All rights reserved.</p>
      </footer>
    </div>
  );
}
