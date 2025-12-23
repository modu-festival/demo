import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  getTranslation,
  type Language,
  languageNames,
} from "@/lib/translations";
import { useRealtimeAI } from "@/hooks/use-realtime-ai";
import posterVideo from "@assets/poster.mp4";

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
  const { startCall, endCall, isConnecting, isConnected } = useRealtimeAI();
  const languages: Language[] = ["ko", "en", "zh", "ja"];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [showVideo, setShowVideo] = useState(true);
  const [animationStarted, setAnimationStarted] = useState(false);

  // 폰트 로딩 체크
  useEffect(() => {
    const checkFonts = async () => {
      try {
        await Promise.all([
          document.fonts.load("900 16px Yeongdo"),
          document.fonts.load("500 16px GmarketSans"),
          document.fonts.load("700 16px GmarketSans"),
        ]);
        setFontsLoaded(true);
      } catch (error) {
        console.warn("Font loading check failed:", error);
        setFontsLoaded(true);
      }
    };
    checkFonts();
  }, []);

  // 비디오 자동 재생 처리
  useEffect(() => {
    if (!showVideo || !videoRef.current) return;
    const video = videoRef.current;
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => console.log("비디오 자동 재생 성공"))
        .catch((error) => {
          console.log("비디오 자동 재생 실패, 상호작용 대기:", error);
          const handleFirstInteraction = () => {
            video.play().catch(console.warn);
            document.removeEventListener("touchstart", handleFirstInteraction);
            document.removeEventListener("click", handleFirstInteraction);
          };
          document.addEventListener("touchstart", handleFirstInteraction, {
            once: true,
          });
          document.addEventListener("click", handleFirstInteraction, {
            once: true,
          });
        });
    }
  }, [showVideo]);

  // ✅ [수정됨] 클릭 핸들러: 링톤 에러가 AI 호출을 막지 않도록 처리
  const handleCallClick = async () => {
    onAICall();

    // 1. 링톤 재생 시도 (try-catch로 감싸서 실패해도 넘어감)
    try {
      if ("requestIdleCallback" in window) {
        (window as any).requestIdleCallback(() => {
          playRingToneAsync();
        });
      } else {
        setTimeout(() => {
          playRingToneAsync();
        }, 0);
      }
    } catch (error) {
      console.warn("Ringtone error:", error);
    }

    // 2. AI 통화 시작
    await startCall(lang);
  };

  // ✅ [수정됨] 링톤 재생 함수: 메모리 누수 방지를 위한 ctx.close() 추가
  const playRingToneAsync = () => {
    try {
      const AudioContext =
        window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();

      const playRingTone = () => {
        const oscillator1 = ctx.createOscillator();
        const oscillator2 = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator1.frequency.setValueAtTime(440, ctx.currentTime);
        oscillator2.frequency.setValueAtTime(480, ctx.currentTime);

        oscillator1.type = "sine";
        oscillator2.type = "sine";

        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.15, ctx.currentTime + 1.0);
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.1);

        oscillator1.start(ctx.currentTime);
        oscillator2.start(ctx.currentTime);
        oscillator1.stop(ctx.currentTime + 1.1);
        oscillator2.stop(ctx.currentTime + 1.1);
      };

      playRingTone();

      // 두 번째 링톤 재생 및 컨텍스트 정리
      setTimeout(() => {
        playRingTone();
        // 소리가 완전히 끝난 후(1.5초 + 1.1초 + 여유분) Context 닫기
        setTimeout(() => {
          if (ctx.state !== "closed") {
            ctx.close().catch(console.warn);
          }
        }, 1200);
      }, 1500);
    } catch (error) {
      console.warn("Failed to create ring audio:", error);
    }
  };

  // 불꽃놀이 애니메이션 (원본 유지)
  useEffect(() => {
    if (!animationStarted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let animationFrameId: number;

    const resizeHandler = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resizeHandler, { passive: true });

    class Particle {
      x: number;
      y: number;
      color: string;
      velocity: { x: number; y: number };
      alpha: number;
      decay: number;
      radius: number;
      constructor(
        x: number,
        y: number,
        color: string,
        velocity: { x: number; y: number }
      ) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.015;
        this.radius = Math.random() * 2 + 1;
      }
      update() {
        this.velocity.x *= 0.98;
        this.velocity.y *= 0.98;
        this.velocity.y += 0.15;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= this.decay;
      }
      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    class Firework {
      x: number;
      y: number;
      particles: Particle[];
      hue: number;
      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.hue = Math.random() * 60 + 250;
        this.createParticles();
      }
      createParticles() {
        const particleCount = Math.random() * 30 + 40;
        const colors = [
          `hsl(${this.hue}, 100%, 60%)`,
          `hsl(${this.hue + 20}, 100%, 70%)`,
          `hsl(${this.hue - 20}, 100%, 80%)`,
          "#ffd89b",
        ];
        for (let i = 0; i < particleCount; i++) {
          const angle = (Math.PI * 2 * i) / particleCount;
          const velocity = {
            x: Math.cos(angle) * (Math.random() * 6 + 2),
            y: Math.sin(angle) * (Math.random() * 6 + 2),
          };
          const color = colors[Math.floor(Math.random() * colors.length)];
          this.particles.push(new Particle(this.x, this.y, color, velocity));
        }
      }
      update() {
        this.particles.forEach((particle, index) => {
          particle.update();
          if (particle.alpha <= 0) this.particles.splice(index, 1);
        });
      }
      draw() {
        this.particles.forEach((particle) => particle.draw());
      }
      isDone() {
        return this.particles.length === 0;
      }
    }

    class ShootingStar {
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
      hue: number;
      constructor() {
        this.x = 0;
        this.y = 0;
        this.length = 0;
        this.speed = 0;
        this.opacity = 0;
        this.hue = 0;
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = -50;
        this.length = Math.random() * 80 + 40;
        this.speed = Math.random() * 3 + 2;
        this.opacity = Math.random() * 0.5 + 0.5;
        this.hue = Math.random() * 60 + 250;
      }
      update() {
        this.x += this.speed;
        this.y += this.speed * 1.5;
        if (this.y > height || this.x > width) this.reset();
      }
      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.strokeStyle = `hsl(${this.hue}, 100%, 70%)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.length * 0.3, this.y - this.length * 0.5);
        ctx.stroke();
        ctx.restore();
      }
    }

    class AmbientParticle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      hue: number;
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5;
        this.hue = Math.random() * 60 + 250;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > width) this.speedX *= -1;
        if (this.y < 0 || this.y > height) this.speedY *= -1;
        this.opacity += Math.random() * 0.02 - 0.01;
        this.opacity = Math.max(0.1, Math.min(0.6, this.opacity));
      }
      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${this.hue}, 100%, 70%)`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsl(${this.hue}, 100%, 70%)`;
        ctx.fill();
        ctx.restore();
      }
    }

    const fireworks: Firework[] = [];
    const shootingStars = Array.from({ length: 3 }, () => new ShootingStar());
    const ambientParticles = Array.from(
      { length: 50 },
      () => new AmbientParticle()
    );

    let lastFireworkTime = 0;
    const fireworkInterval = 2000;

    function animate(currentTime: number) {
      if (!ctx) return;
      ctx.fillStyle = "rgba(10, 1, 24, 0.1)";
      ctx.fillRect(0, 0, width, height);

      ambientParticles.forEach((p) => {
        p.update();
        p.draw();
      });
      shootingStars.forEach((s) => {
        s.update();
        s.draw();
      });

      if (currentTime - lastFireworkTime > fireworkInterval) {
        const x = Math.random() * width * 0.6 + width * 0.2;
        const y = Math.random() * height * 0.4 + height * 0.1;
        fireworks.push(new Firework(x, y));
        lastFireworkTime = currentTime;
      }

      fireworks.forEach((firework, index) => {
        firework.update();
        firework.draw();
        if (firework.isDone()) fireworks.splice(index, 1);
      });

      animationFrameId = requestAnimationFrame(animate);
    }

    const handleClick = (e: MouseEvent) =>
      fireworks.push(new Firework(e.clientX, e.clientY));
    const handleTouch = (e: TouchEvent) => {
      const touch = e.touches[0];
      fireworks.push(new Firework(touch.clientX, touch.clientY));
    };

    canvas.addEventListener("click", handleClick, { passive: true });
    canvas.addEventListener("touchstart", handleTouch, { passive: true });

    setTimeout(() => fireworks.push(new Firework(width / 2, height / 3)), 500);
    setTimeout(() => fireworks.push(new Firework(width / 3, height / 4)), 800);
    setTimeout(
      () => fireworks.push(new Firework((width * 2) / 3, height / 4)),
      1100
    );

    animate(0);

    return () => {
      window.removeEventListener("resize", resizeHandler);
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("touchstart", handleTouch);
      cancelAnimationFrame(animationFrameId);
    };
  }, [animationStarted]);

  return (
    <div className="relative min-h-dvh h-screen w-full overflow-hidden">
      {showVideo && (
        <div className="absolute inset-0 bg-[#0a0118]">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
            style={{ opacity: showVideo ? 1 : 0 }}
          >
            <source src={posterVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 pointer-events-none" />
        </div>
      )}

      {animationStarted && (
        <div className="absolute inset-0 bg-[#0a0118]">
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse at top, rgba(139, 69, 255, 0.15) 0%, transparent 50%),
                radial-gradient(ellipse at bottom, rgba(255, 107, 237, 0.1) 0%, transparent 50%),
                linear-gradient(180deg, #0a0118 0%, #1a0b2e 50%, #0a0118 100%)
              `,
            }}
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ touchAction: "none" }}
          />
        </div>
      )}

      <div className="relative z-10 flex h-full flex-col items-center justify-end pb-10">
        <div className="absolute inset-0 flex items-end justify-center pb-52 pointer-events-none">
          <div className="text-center">
            {fontsLoaded ? (
              <>
                <h1
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
                  style={{
                    fontFamily: "Yeongdo, sans-serif",
                    whiteSpace: "pre-line",
                  }}
                >
                  {getTranslation(lang, "heroTitle")}
                </h1>
                <div className="text-white space-y-2">
                  <p
                    className="text-sm md:text-xl font-medium"
                    style={{ fontFamily: "GmarketSans, sans-serif" }}
                  >
                    {getTranslation(lang, "heroDate")}
                  </p>
                  <p
                    className="text-base md:text-lg font-bold"
                    style={{ fontFamily: "GmarketSans, sans-serif" }}
                  >
                    {getTranslation(lang, "heroLocation")}
                  </p>
                </div>
              </>
            ) : (
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 opacity-0">
                {getTranslation(lang, "heroTitle")}
              </div>
            )}
          </div>
        </div>

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
          {/* 주석 처리되어 있던 아이콘을 다시 살려두었습니다. 디자인에 따라 주석 제거하시면 됩니다. */}
          <Phone className="mr-2 h-5 w-5" />
          {isConnected
            ? getTranslation(lang, "aiCallEnd") ?? "통화 종료"
            : getTranslation(lang, "aiCallButton")}
        </Button>

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
