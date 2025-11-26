import { useState } from "react";
import { BotMessageSquare } from "lucide-react";
import ChatbotModal from "./ChatbotModal";

export default function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gray-900 shadow-lg transition-transform hover:scale-105 active:scale-95"
        aria-label="Open chatbot"
      >
        <BotMessageSquare className="h-6 w-6 text-white" />
      </button>

      <ChatbotModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
