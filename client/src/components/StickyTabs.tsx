import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Language } from "@shared/schema";
import { getTranslation } from "@/lib/translations";

interface Tab {
  id: string;
  label: string;
}

interface StickyTabsProps {
  lang: Language;
  activeTab: string;
  onTabClick: (tabId: string) => void;
}

export function StickyTabs({ lang, activeTab, onTabClick }: StickyTabsProps) {
  const [isSticky, setIsSticky] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const activeButtonRef = useRef<HTMLButtonElement>(null);

  const tabs: Tab[] = [
    { id: "gallery", label: getTranslation(lang, "gallery") },
    { id: "food", label: getTranslation(lang, "food") },
    { id: "location", label: getTranslation(lang, "location") },
    { id: "program", label: getTranslation(lang, "program") },
    { id: "goods", label: getTranslation(lang, "goods") },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-1px 0px 0px 0px" }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (activeButtonRef.current) {
      activeButtonRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeTab]);

  return (
    <>
      <div ref={sentinelRef} className="h-0" />
      <div
        ref={tabsRef}
        className={`bg-white transition-all duration-200 ${
          isSticky ? "sticky top-0 z-50" : ""
        }`}
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
                className={`whitespace-nowrap flex-shrink-0 rounded-full px-4 py-1.5 transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-gray-900 border-0 text-[14px] font-bold text-white"
                    : "bg-gray-100 border border-gray-300 text-[14px] font-medium text-gray-600"
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
