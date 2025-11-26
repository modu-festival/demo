import { useState, useEffect, useRef } from "react";
import { X, ArrowUp, RotateCcw } from "lucide-react";

type MessageRole = "user" | "assistant";
type MessageType = "text" | "image" | "map";

interface Message {
  id: number;
  role: MessageRole;
  type: MessageType;
  content: string;
  url?: string; // image/map 같은 경우 사용
}

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 모든 추천 질문 풀
const ALL_SUGGESTED_PROMPTS = [
  "축제 일정이 어떻게 되나요?",
  "행사장 위치가 어디인가요?",
  "주차장이 있나요?",
  "먹거리는 어떤게 있나요?",
  "굿즈는 어디서 살 수 있나요?",
  "셔틀버스는 어디서 타요?",
  "비가 와도 행사가 진행되나요?",
  "아이랑 같이 가도 괜찮나요?",
];

const CHAT_API_URL = (import.meta as any).env?.VITE_CHAT_API_URL || "/api/chat";

export default function ChatbotModal({ isOpen, onClose }: ChatbotModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typedText, setTypedText] = useState("");
  const [mounted, setMounted] = useState(false);
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>(() =>
    ALL_SUGGESTED_PROMPTS.slice(0, 4)
  );
  const [isThinking, setIsThinking] = useState(false);

  const fullMessage = "안녕하세요, AI 챗봇이에요.";

  // 스트리밍용
  const streamingIntervalRef = useRef<number | null>(null);

  // 배경 애니메이션 마운트
  useEffect(() => {
    setMounted(true);
  }, []);

  // 모달 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // 모달 열릴 때 인트로 타이핑
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      let index = 0;
      setTypedText("");
      const timer = window.setInterval(() => {
        if (index <= fullMessage.length) {
          setTypedText(fullMessage.slice(0, index));
          index++;
        } else {
          window.clearInterval(timer);
        }
      }, 80);
      return () => window.clearInterval(timer);
    }
  }, [isOpen, messages.length]);

  // 언마운트 시 스트리밍 인터벌 정리
  useEffect(() => {
    return () => {
      if (streamingIntervalRef.current !== null) {
        window.clearInterval(streamingIntervalRef.current);
      }
    };
  }, []);

  // 추천 질문 랜덤 갱신
  const refreshSuggestedPrompts = () => {
    const shuffled = [...ALL_SUGGESTED_PROMPTS].sort(() => Math.random() - 0.5);
    setSuggestedPrompts(shuffled.slice(0, 4));
  };

  // AI 응답에서 이미지/지도 URL 파싱
  const parseAIReply = (
    raw: string
  ): { mainText: string; extraMessages: Message[] } => {
    const urlRegex = /(https?:\/\/[^\s)]+)/g;
    const extraMessages: Message[] = [];
    let text = raw;

    const urls = raw.match(urlRegex);
    if (urls) {
      urls.forEach((url) => {
        // 텍스트에서 URL 제거
        text = text.replace(url, "").trim();

        const lower = url.toLowerCase();
        if (lower.match(/\.(png|jpg|jpeg|webp|gif)$/)) {
          extraMessages.push({
            id: Date.now() + Math.random(),
            role: "assistant",
            type: "image",
            content: "",
            url,
          });
        } else if (
          lower.includes("maps.google.com") ||
          lower.includes("map.naver.com")
        ) {
          extraMessages.push({
            id: Date.now() + Math.random(),
            role: "assistant",
            type: "map",
            content: "",
            url,
          });
        }
      });
    }

    return { mainText: text || raw, extraMessages };
  };

  // 한 글자씩 타닥타닥 스트리밍
  const startStreamingText = (messageId: number, fullText: string) => {
    setIsThinking(false); // 응답 시작하면 thinking bubble은 숨기고
    let index = 0;

    if (streamingIntervalRef.current !== null) {
      window.clearInterval(streamingIntervalRef.current);
    }

    streamingIntervalRef.current = window.setInterval(() => {
      index++;
      const slice = fullText.slice(0, index);

      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? {
                ...m,
                content: slice,
              }
            : m
        )
      );

      if (index >= fullText.length) {
        if (streamingIntervalRef.current !== null) {
          window.clearInterval(streamingIntervalRef.current);
          streamingIntervalRef.current = null;
        }
      }
    }, 20); // 속도 조절 가능
  };

  // 공통으로 AI 호출하는 함수
  // 공통으로 AI 호출하는 함수
  const sendToAI = async (userContent: string) => {
    setIsThinking(true);

    // 사용자 메시지 추가
    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      type: "text",
      content: userContent,
    };

    // 어시스턴트 placeholder
    const assistantId = Date.now() + 1;
    const assistantPlaceholder: Message = {
      id: assistantId,
      role: "assistant",
      type: "text",
      content: "",
    };

    setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);

    try {
      const res = await fetch(CHAT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userContent }),
      });

      const data = await res.json();

      const reply: string =
        data?.reply ??
        "죄송해요, 지금은 답변을 가져오지 못했어요. 잠시 후 다시 시도해 주세요.";

      const aiFollowUps: string[] = Array.isArray(data?.followUp)
        ? data.followUp
        : [];

      // 시각적 요소 파싱
      const { mainText, extraMessages } = parseAIReply(reply);

      // 스트리밍
      startStreamingText(assistantId, mainText);

      if (extraMessages.length > 0) {
        setMessages((prev) => [...prev, ...extraMessages]);
      }

      // ----------------------------------------
      // 📌 후속 질문이 있으면 → 우선 적용
      // ----------------------------------------
      if (aiFollowUps.length > 0) {
        setSuggestedPrompts(aiFollowUps);
      } else {
        refreshSuggestedPrompts(); // 기존 fallback
      }
    } catch (error) {
      console.error(error);

      if (streamingIntervalRef.current !== null) {
        window.clearInterval(streamingIntervalRef.current);
        streamingIntervalRef.current = null;
      }

      setIsThinking(false);

      const errorMessage: Message = {
        id: Date.now() + 2,
        role: "assistant",
        type: "text",
        content:
          "서버와 연결하는 데 문제가 발생했어요. 잠시 후 다시 시도해 주세요.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  // 입력 전송
  const handleSend = () => {
    if (!input.trim()) return;
    const content = input.trim();
    setInput("");
    sendToAI(content);
  };

  // 추천 질문 클릭
  const handlePromptClick = (prompt: string) => {
    sendToAI(prompt);
  };

  // 엔터키 전송
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 대화 초기화
  const handleReset = () => {
    if (streamingIntervalRef.current !== null) {
      window.clearInterval(streamingIntervalRef.current);
      streamingIntervalRef.current = null;
    }
    setMessages([]);
    setInput("");
    setTypedText("");
    setIsThinking(false);
    refreshSuggestedPrompts();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden">
      {/* 베이스 그라데이션 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #fdf2f8 0%, #f0fdfa 50%, #faf5ff 100%)",
        }}
      />

      {/* 움직이는 블롭 1 - 핑크 */}
      {mounted && (
        <div
          className="blob-1 absolute rounded-full"
          style={{
            width: "140%",
            height: "50%",
            top: "-10%",
            left: "-20%",
            background:
              "radial-gradient(ellipse at center, rgba(251, 207, 232, 0.6) 0%, rgba(251, 207, 232, 0) 70%)",
            filter: "blur(40px)",
          }}
        />
      )}

      {/* 움직이는 블롭 2 - 민트 */}
      {mounted && (
        <div
          className="blob-2 absolute rounded-full"
          style={{
            width: "120%",
            height: "45%",
            top: "30%",
            right: "-30%",
            background:
              "radial-gradient(ellipse at center, rgba(167, 243, 208, 0.5) 0%, rgba(167, 243, 208, 0) 70%)",
            filter: "blur(50px)",
          }}
        />
      )}

      {/* 움직이는 블롭 3 - 라벤더 */}
      {mounted && (
        <div
          className="blob-3 absolute rounded-full"
          style={{
            width: "130%",
            height: "50%",
            bottom: "-5%",
            left: "-20%",
            background:
              "radial-gradient(ellipse at center, rgba(221, 214, 254, 0.6) 0%, rgba(221, 214, 254, 0) 70%)",
            filter: "blur(45px)",
          }}
        />
      )}

      {/* 움직이는 블롭 4 - 스카이블루 */}
      {mounted && (
        <div
          className="blob-4 absolute rounded-full"
          style={{
            width: "80%",
            height: "35%",
            top: "50%",
            left: "10%",
            background:
              "radial-gradient(ellipse at center, rgba(186, 230, 253, 0.4) 0%, rgba(186, 230, 253, 0) 70%)",
            filter: "blur(50px)",
          }}
        />
      )}

      {/* 미세한 반짝임 */}
      {mounted &&
        Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="shimmer absolute rounded-full"
            style={{
              width: 3 + (i % 3),
              height: 3 + (i % 3),
              left: `${15 + i * 10}%`,
              top: `${20 + i * 8}%`,
              background: "rgba(255, 255, 255, 0.8)",
              boxShadow: "0 0 8px rgba(255, 255, 255, 0.6)",
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-gray-200/50 px-2 py-2 backdrop-blur-md">
          <div className="flex items-center gap-2 pl-1">
            <button
              onClick={handleReset}
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100"
              aria-label="Reset chat"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100"
            aria-label="Close chatbot"
          >
            <X className="h-6 w-6" />
          </button>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-start justify-start gap-8 px-2 pt-16">
              {/* Typing Effect Text */}
              <div className="text-left space-y-1">
                <h3 className="text-xl font-semibold text-gray-800">
                  {typedText}
                  {typedText.length < fullMessage.length && (
                    <span className="inline-block w-0.5 h-4 ml-1 bg-gray-400 animate-pulse" />
                  )}
                </h3>
                <p className="text-sm text-gray-700">
                  시흥갯골축제에 대해 모든 것을 물어보세요
                </p>
              </div>

              {/* Suggested Prompts */}
              <div className="grid w-full max-w-md gap-2">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handlePromptClick(prompt)}
                    className="rounded-tr-2xl rounded-br-2xl rounded-bl-2xl border border-gray-100 px-4 py-3.5 text-left text-sm text-gray-700 font-medium transition-colors bg-white/90 backdrop-blur-sm hover:bg-white/90"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-2xl space-y-3">
              {messages.map((message) => {
                if (message.type === "image" && message.url) {
                  return (
                    <div key={message.id} className="flex justify-start">
                      <div className="max-w-[80%] rounded-2xl bg-gray-100 p-2">
                        <img
                          src={message.url}
                          alt="AI 응답 이미지"
                          className="rounded-xl max-h-60 object-cover"
                        />
                      </div>
                    </div>
                  );
                }

                if (message.type === "map" && message.url) {
                  return (
                    <div key={message.id} className="flex justify-start">
                      <a
                        href={message.url}
                        target="_blank"
                        rel="noreferrer"
                        className="max-w-[80%] rounded-2xl bg-gray-100 px-4 py-3 text-sm font-medium text-blue-700 underline"
                      >
                        지도로 보기
                      </a>
                    </div>
                  );
                }

                // 기본 텍스트 버블
                return (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl text-sm font-medium px-4 py-2 ${
                        message.role === "user"
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                );
              })}

              {/* typing... indicator */}
              {isThinking && (
                <div className="flex justify-start">
                  <div className="inline-flex items-center gap-1 rounded-2xl bg-gray-100 px-3 py-2">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </div>
              )}

              {/* 후속 추천 질문 (대화 중에도 표시) */}
              {!isThinking && suggestedPrompts.length > 0 && (
                <div className="mt-4 grid w-full gap-2">
                  {suggestedPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handlePromptClick(prompt)}
                      className="rounded-tr-2xl rounded-br-2xl rounded-bl-2xl border border-gray-100 px-4 py-3 text-left text-sm text-gray-700 font-medium transition-colors bg-white/90 backdrop-blur-sm hover:bg-white/95"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200/50 p-4 bg-white/70 backdrop-blur-md">
          <div className="mx-auto max-w-2xl">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="메시지를 입력하세요..."
                className="w-full rounded-full border border-gray-300 py-3 pl-4 pr-14 text-sm outline-none transition-colors focus:border-gray-900"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-gray-900 text-white transition-opacity disabled:opacity-50"
                aria-label="Send message"
              >
                <ArrowUp className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes blobMove1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(5%, 3%) scale(1.02); }
          66% { transform: translate(-3%, -2%) scale(0.98); }
        }
        @keyframes blobMove2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-4%, 4%) scale(0.98); }
          66% { transform: translate(3%, -3%) scale(1.03); }
        }
        @keyframes blobMove3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(4%, -2%) scale(1.01); }
          66% { transform: translate(-5%, 3%) scale(0.99); }
        }
        @keyframes blobMove4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-3%, 5%) scale(1.02); }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }
        .blob-1 { animation: blobMove1 20s ease-in-out infinite; }
        .blob-2 { animation: blobMove2 25s ease-in-out infinite; }
        .blob-3 { animation: blobMove3 22s ease-in-out infinite; }
        .blob-4 { animation: blobMove4 18s ease-in-out infinite; }
        .shimmer { animation: shimmer 3s ease-in-out infinite; }

        @keyframes typing {
          0% { transform: translateY(0); opacity: 0.3; }
          50% { transform: translateY(-2px); opacity: 1; }
          100% { transform: translateY(0); opacity: 0.3; }
        }
        .typing-dot {
          width: 6px;
          height: 6px;
          border-radius: 9999px;
          background-color: #9ca3af;
          animation: typing 1s infinite ease-in-out;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.15s; }
        .typing-dot:nth-child(3) { animation-delay: 0.3s; }
      `}</style>
    </div>
  );
}
