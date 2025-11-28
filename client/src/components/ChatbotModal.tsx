import { useState, useEffect, useRef } from "react";
import { X, ArrowUp, RotateCcw, ChevronDown, Copy, Check } from "lucide-react";

type MessageRole = "user" | "assistant";
type MessageType = "text" | "image" | "map";

type CardType = "parking" | "program" | "food" | "goods" | "keyvalue" | "list" | "text";

interface DetailCard {
  title: string;
  type: CardType;
  data: any;
}

interface Message {
  id: number;
  role: MessageRole;
  type: MessageType;
  content: string;
  url?: string; // image/map 같은 경우 사용
  cards?: DetailCard[]; // 상세 정보 카드들
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

// 주차장 카드 컴포넌트
function ParkingCard({ title, data }: { title: string; data: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white/80 backdrop-blur-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50/50 transition-colors"
      >
        <span className="font-semibold text-sm text-gray-900">{title}</span>
        <ChevronDown
          className={`h-4 w-4 text-gray-600 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/30">
          <div className="space-y-3">
            {data.overview && (
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">운영 기간</span>
                  <span className="font-medium text-gray-900">{data.overview.period}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-700">총 주차 가능</span>
                  <span className="font-semibold text-blue-700">{data.overview.totalCapacity}대</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {data.lots?.map((lot: any, idx: number) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-sm text-gray-900">{lot.name}</h4>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                      {lot.type}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">수용:</span>
                      <span className="font-semibold text-gray-900">{lot.capacity}대</span>
                    </div>
                    {lot.address && (
                      <div className="flex items-start gap-2">
                        <span className="font-medium">위치:</span>
                        <span>{lot.address}</span>
                      </div>
                    )}
                    {lot.notes && (
                      <div className="flex items-start gap-2">
                        <span className="font-medium">비고:</span>
                        <span className="text-blue-600">{lot.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 먹거리 카드 컴포넌트
function FoodCard({ title, data }: { title: string; data: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white/80 backdrop-blur-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50/50 transition-colors"
      >
        <span className="font-semibold text-sm text-gray-900">{title}</span>
        <ChevronDown
          className={`h-4 w-4 text-gray-600 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/30">
          <div className="grid gap-3 sm:grid-cols-2">
            {data.restaurants?.map((restaurant: any, idx: number) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-sm text-gray-900">{restaurant.name}</h4>
                  <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">
                    {restaurant.type}
                  </span>
                </div>
                <div className="text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">위치:</span>
                    <span>{restaurant.address}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// 텍스트 카드 컴포넌트 (기본 아코디언)
function TextCard({ title, data }: { title: string; data: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const content = data.content || data;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white/80 backdrop-blur-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50/50 transition-colors"
      >
        <span className="font-semibold text-sm text-gray-900">{title}</span>
        <ChevronDown
          className={`h-4 w-4 text-gray-600 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/30">
          <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {content}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ChatbotModal({ isOpen, onClose }: ChatbotModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typedText, setTypedText] = useState("");
  const [mounted, setMounted] = useState(false);
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>(() =>
    ALL_SUGGESTED_PROMPTS.slice(0, 3)
  );
  const [isThinking, setIsThinking] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const fullMessage = "반가워요, AI 챗봇이에요.";

  // 스트리밍용
  const streamingIntervalRef = useRef<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

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

  // textarea 자동 높이 조절
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // 메시지 추가 시 자동 스크롤
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 추천 질문 랜덤 갱신
  const refreshSuggestedPrompts = () => {
    const shuffled = [...ALL_SUGGESTED_PROMPTS].sort(() => Math.random() - 0.5);
    setSuggestedPrompts(shuffled.slice(0, 3));
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

    const updatedMessages = [...messages, userMessage];
    setMessages([...updatedMessages, assistantPlaceholder]);

    // 대화 히스토리를 OpenAI 형식으로 변환 (텍스트만)
    const conversationHistory = updatedMessages
      .filter(m => m.type === "text" && m.content) // 텍스트 메시지만
      .map(m => ({
        role: m.role,
        content: m.content
      }));

    try {
      const res = await fetch(CHAT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userContent,
          history: conversationHistory
        }),
      });

      const data = await res.json();

      // 📌 구조화된 응답 파싱 (summary + cards)
      const replyData = data?.reply ?? {
        summary: "죄송해요, 지금은 답변을 가져오지 못했어요. 잠시 후 다시 시도해 주세요.",
        cards: [],
      };

      const summary = replyData.summary || "";
      const cards = replyData.cards || [];

      const aiFollowUps: string[] = Array.isArray(data?.followUp)
        ? data.followUp
        : [];

      // 시각적 요소 파싱 (URL 등)
      const { mainText, extraMessages } = parseAIReply(summary);

      // cards를 assistantPlaceholder에 추가
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                cards: cards, // 상세 카드 추가
              }
            : m
        )
      );

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
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
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
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setTypedText("");
    setIsThinking(false);
    refreshSuggestedPrompts();
  };

  // 메시지 복사
  const handleCopy = async (messageId: number, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-white">
      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <header className="flex items-center justify-between px-2 py-2 backdrop-blur-md">
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
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition-colors"
            aria-label="Close chatbot"
          >
            <X className="h-6 w-6" />
          </button>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-start justify-center px-2 pb-24">
              {/* AI Image */}
              <img
                src="/img-ai.webp"
                alt="AI"
                className="w-10 h-10 object-contain float-animation"
              />

              {/* Typing Effect Text */}
              <div className="text-left">
                <h3 className="text-[20px] font-semibold text-gray-800 -tracking-[0.02em] mb-0.5">
                  {fullMessage}
                </h3>
                <p className="text-[14px] font-medium text-gray-600 -tracking-[0.02em]">
                  20주년 시흥갯골축제에 대해 모든 것을 물어보세요.
                </p>
              </div>

              {/* Suggested Prompts */}
              <div className="mt-10 w-full max-w-md space-y-3">
                <p className="text-[13px] font-semibold text-gray-700 -tracking-[0.02em]">
                  가장 많이 묻는 질문 Top3
                </p>
                <div className="grid gap-2">
                  {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handlePromptClick(prompt)}
                    className="rounded-tr-2xl rounded-br-2xl rounded-bl-2xl border border-gray-100 px-4 py-3.5 text-left text-sm text-gray-800 font-medium transition-colors bg-gray-200 backdrop-blur-sm hover:bg-gray-200/90"
                  >
                    {prompt}
                  </button>
                ))}
                </div>
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

                // assistant 메시지인데 content가 비어있으면 렌더링하지 않음
                if (message.role === "assistant" && !message.content) {
                  return null;
                }

                // 기본 텍스트 버블
                return (
                  <div key={message.id}>
                    <div
                      className={`flex ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div className={`flex items-end gap-1 max-w-[90%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                        <div
                          className={`rounded-2xl -tracking-[0.01em] text-[14px] font-medium px-4 py-2 ${
                            message.role === "user"
                              ? "bg-gray-900 text-white"
                              : "bg-gray-200 text-gray-900"
                          }`}
                        >
                          {message.content}
                        </div>
                        {message.role === "assistant" && message.content && (
                          <button
                            onClick={() => handleCopy(message.id, message.content)}
                            className="flex-shrink-0 p-1.5 rounded-lg hover:bg-gray-200/50 transition-colors mb-1"
                            aria-label="Copy message"
                          >
                            {copiedId === message.id ? (
                              <Check className="h-3.5 w-3.5 text-green-600" />
                            ) : (
                              <Copy className="h-3.5 w-3.5 text-gray-500" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* 구조화된 카드 표시 (AI 응답에만) */}
                    {message.role === "assistant" && message.cards && message.cards.length > 0 && (
                      <div className="flex justify-start mt-2">
                        <div className="max-w-[95%] w-full space-y-3">
                          {message.cards.map((card, idx) => {
                            // 타입별로 다른 컴포넌트 렌더링
                            if (card.type === "parking") {
                              return <ParkingCard key={idx} title={card.title} data={card.data} />;
                            }

                            if (card.type === "food") {
                              return <FoodCard key={idx} title={card.title} data={card.data} />;
                            }

                            // 기본: 텍스트 카드 (아코디언)
                            return <TextCard key={idx} title={card.title} data={card.data} />;
                          })}
                        </div>
                      </div>
                    )}
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

              {/* 자동 스크롤용 앵커 */}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200/50 p-4 bg-white/70 backdrop-blur-md">
          <div className="mx-auto max-w-2xl">
            <div className="relative flex items-end">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="AI 챗봇에게 질문해보세요"
                rows={1}
                className="w-full rounded-3xl border border-gray-400 py-3 pl-4 pr-14 outline-none transition-colors focus:border-gray-400 font-medium text-[14px] -tracking-[0.02em] resize-none overflow-hidden max-h-32"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="absolute right-1.5 bottom-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-white transition-opacity disabled:opacity-50"
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
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .float-animation {
          animation: float 2.5s ease-in-out infinite;
        }

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
