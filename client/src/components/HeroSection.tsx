import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import {
  getTranslation,
  type Language,
  languageNames,
} from "@/lib/translations";
import { useRealtimeAI } from "@/hooks/use-realtime-ai";
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
  // ✅ playRing 추가
  const { startCall, endCall, isConnecting, isConnected } = useRealtimeAI();
  const languages: Language[] = ["ko", "en", "zh", "ja"];

  const handleCallClick = async () => {
    onAICall();

    try {
      // ✅ 클릭 시 즉시 재생 (Autoplay 방지 회피)
      console.log("Attempting to play ring audio...");

      // Web Audio API를 사용한 벨 소리 생성
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      const playRingTone = () => {
        // 실제 전화 벨소리는 두 개의 주파수가 동시에 울림
        const oscillator1 = audioContext.createOscillator();
        const oscillator2 = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // 전화 벨소리의 전형적인 주파수 (440Hz + 480Hz)
        oscillator1.frequency.setValueAtTime(440, audioContext.currentTime);
        oscillator2.frequency.setValueAtTime(480, audioContext.currentTime);

        oscillator1.type = "sine";
        oscillator2.type = "sine";

        // 벨소리 패턴: 1초 울리고 0.5초 쉼 (더 천천히)
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
          0.15,
          audioContext.currentTime + 0.1
        );
        gainNode.gain.setValueAtTime(0.15, audioContext.currentTime + 1.0);
        gainNode.gain.linearRampToValueAtTime(
          0,
          audioContext.currentTime + 1.1
        );

        oscillator1.start(audioContext.currentTime);
        oscillator2.start(audioContext.currentTime);
        oscillator1.stop(audioContext.currentTime + 1.1);
        oscillator2.stop(audioContext.currentTime + 1.1);
      };

      // 전화 벨소리 패턴: 1초 울리고 0.5초 쉼을 2번 반복
      playRingTone();
      setTimeout(() => playRingTone(), 1500);
    } catch (error) {
      console.warn("Failed to create ring audio:", error);
    }

    await startCall();
  };

  return (
    <div className="relative min-h-dvh h-screen w-full overflow-hidden">
      {/* Background poster image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `var(--black_grad, linear-gradient(180deg, rgba(255,255,255,0.00) 44.23%, rgba(0,0,0,0.80) 90.87%)), url(${posterImage})`,
        }}
      />

      {/* Content overlay */}
      <div className="relative z-10 flex h-full flex-col items-center justify-end pb-10">
        {/* ✅ 통화 버튼 */}
        <Button
          data-testid="button-ai-call"
          onClick={isConnected ? endCall : handleCallClick}
          size="lg"
          disabled={isConnecting}
          className={`mb-4 backdrop-blur-md border-none font-bold text-base px-10 py-3 shadow-2xl transition-all duration-300 ${
            isConnected
              ? "bg-red-500/60 hover:bg-red-500/70 text-white"
              : "bg-white/20 hover:bg-white/30 text-white"
          }`}
        >
          <Phone className="mr-2 h-5 w-5" />
          {isConnected
            ? getTranslation(lang, "aiCallEnd") ?? "통화 종료"
            : getTranslation(lang, "aiCallButton")}
        </Button>

        {/* Language Selector */}
        <div className="flex items-center justify-center text-white text-[13px] mt-2">
          {languages.map((language, index) => (
            <div key={language} className="flex items-center">
              <button
                onClick={() => onLanguageChange(language)}
                className={`px-3 py-1 hover:text-white transition-colors duration-200 ${
                  lang === language
                    ? "text-white font-semibold"
                    : "font-medium text-white/80"
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
