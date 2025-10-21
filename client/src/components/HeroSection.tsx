import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import {
  getTranslation,
  type Language,
  languageNames,
} from "@/lib/translations";
import posterImage from "@assets/festival-poster.png";

interface HeroSectionProps {
  lang: Language;
  onAICall: () => void;
  onLanguageChange: (lang: Language) => void;
}

export function HeroSection({
  lang,
  onAICall,
  onLanguageChange,
}: HeroSectionProps) {
  const languages: Language[] = ["ko", "en", "zh", "ja"];

  return (
    <div className="relative min-h-dvh h-screen w-full overflow-hidden">
      {/* Background poster image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `var(--black_grad, linear-gradient(180deg, rgba(255, 255, 255, 0.00) 44.23%, rgba(0, 0, 0, 0.80) 90.87%)), url(${posterImage})`,
        }}
      />

      {/* Content overlay */}
      <div className="relative z-10 flex h-full flex-col items-center justify-end pb-10">
        {/* Glassmorphism AI Call Button */}
        <Button
          data-testid="button-ai-call"
          onClick={onAICall}
          size="lg"
          className="mb-4 backdrop-blur-md bg-white/20 border-none text-white font-bold text-base px-10 py-3 shadow-2xl no-default-hover-elevate no-default-active-elevate"
        >
          <Phone className="mr-2 h-5 w-5" />
          {getTranslation(lang, "aiCallButton")}
        </Button>

        {/* Language Selector - Text style */}
        <div className="flex items-center justify-center text-white text-[13px]">
          {languages.map((language, index) => (
            <div key={language} className="flex items-center">
              <button
                onClick={() => onLanguageChange(language)}
                className={`px-3 py-1 hover:text-white transition-colors duration-200 ${
                  lang === language ? "text-white font-semibold" : "font-medium text-white/80"
                }`}
              >
                {languageNames[language]}
              </button>

              {index < languages.length - 1 && (
                <div className="h-3 w-[1px] bg-white/60 mx-0.5" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
