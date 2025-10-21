import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { getTranslation, type Language } from "@/lib/translations";
import posterImage from "@assets/festival-poster.png";

interface HeroSectionProps {
  lang: Language;
  onAICall: () => void;
}

export function HeroSection({ lang, onAICall }: HeroSectionProps) {
  return (
    <div className="relative min-h-dvh h-screen w-full overflow-hidden">
      {/* Background poster image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.64) 0%, rgba(0, 0, 0, 0.8) 100%), url(${posterImage})`,
        }}
      />
      
      {/* Content overlay */}
      <div className="relative z-10 flex h-full flex-col items-center justify-end pb-24">
        {/* Glassmorphism AI Call Button */}
        <Button
          data-testid="button-ai-call"
          onClick={onAICall}
          size="lg"
          className="mb-8 backdrop-blur-md bg-white/20 border-2 border-white/40 text-white font-bold text-base px-8 shadow-2xl no-default-hover-elevate no-default-active-elevate"
        >
          <Phone className="mr-2 h-5 w-5" />
          {getTranslation(lang, "aiCallButton")}
        </Button>
      </div>
    </div>
  );
}
