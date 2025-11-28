import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

type Lang = "ko" | "en" | "ja" | "zh";

function resolveLang(input?: string): Lang {
  const l = (input || "").toLowerCase();
  if (l === "en" || l === "ja" || l === "zh") return l;
  return "ko";
}

function greetingByLang(lang: Lang) {
  switch (lang) {
    case "en":
      return `
        Hello! I'm the AI assistant for the Siheung Gaetgol Festival. I can tell you about the festival schedule, programs, transportation, restaurants, and goods. Feel free to ask me anything!
      `.trim();
    case "ja":
      return `
        こんにちは！シフン・ゲッコル祭りのAI相談員です。開催日程、プログラム、交通、グルメ、グッズ情報などをご案内できます。何でもお気軽にお尋ねください！
      `.trim();
    case "zh":
      return `
        你好！我是始兴滩涂庆典的AI咨询顾问。我可以介绍节日时间、节目、交通、美食和纪念品等信息。有什么想了解的都可以问我！
      `.trim();
    default:
      return `
        안녕하세요! 저는 시흥갯골축제의 AI 상담사예요. 축제 일정, 프로그램, 교통, 맛집, 굿즈 정보 등을 알려드릴 수 있답니다. 무엇이든 편하게 물어보세요!
      `.trim();
  }
}

function langMeta(lang: Lang) {
  switch (lang) {
    case "en":
      return { name: "English", code: "en" };
    case "ja":
      return { name: "Japanese", code: "ja" };
    case "zh":
      return { name: "Chinese", code: "zh" };
    default:
      return { name: "Korean", code: "ko" };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // =========================
  // 📌 축제 정보 제공
  // =========================
  app.get("/festival", (_req: Request, res: Response) => {
    const filePath = path.join(process.cwd(), "server", "festival-info.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    res.json(data);
  });

  // =========================
  // 📌 음성 안내용 세션 발급
  // =========================
  app.get("/session/:lang?", async (req: Request, res: Response) => {
    try {
      const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
      if (!OPENAI_API_KEY) {
        return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
      }

      const lang = resolveLang(req.params.lang);
      const greet = greetingByLang(lang);
      const { name: langName } = langMeta(lang);

      const filePath = path.join(process.cwd(), "server", "festival-info.json");
      const festival = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      const resp = await fetch("https://api.openai.com/v1/realtime/sessions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-realtime-preview-2025-06-03",
          instructions: `
You are the official voice assistant for '${festival.name}'.

1) On the very first response after the call starts, say exactly one short greeting in ${langName}:
"${greet}"
Then stop and wait for the user's question.

2) For every user utterance afterward:
   - Detect the user's language automatically.
   - Answer in that same language.

3) When a question clearly maps to a UI section, call:
   navigateSection({ section: "info|announcements|gallery|food|location|program|goods" })
   Then speak the answer.

Festival facts:
${JSON.stringify(festival, null, 2)}

Keep answers concise and friendly.
          `.trim(),
        }),
      });

      const data = await resp.json();
      if (!resp.ok) {
        console.error("OpenAI session error:", data);
        return res.status(resp.status).json(data);
      }

      res.json(data);
    } catch (err) {
      console.error("Session route error:", err);
      res.status(500).json({ error: "Failed to create session" });
    }
  });

  // =========================
  // 🟦 Chatbot: Chat Completions
  // =========================
  // =========================
  // 🟦 Chatbot: Chat Completions (+ 후속 질문 생성)
  // =========================
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
      if (!OPENAI_API_KEY) {
        return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
      }

      const { message, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // 축제 데이터 로딩
      const filePath = path.join(process.cwd(), "server", "festival-info.json");
      const festival = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      // 대화 히스토리 구성 (최근 10개만 사용)
      const conversationHistory = Array.isArray(history) ? history.slice(-10) : [];

      // ----------------------------
      // 1) 본문 답변 생성
      // ----------------------------
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

      const systemMessage = {
        role: "system",
        content: `You are the official chatbot of the Siheung Gaetgol Festival.

=== Current Information ===
Today's date: ${today}
Use this date to calculate relative times (e.g., "tomorrow", "in 3 days") and to determine if events are past, current, or upcoming.

=== Response Format ===
CRITICAL: Return ONLY valid JSON. DO NOT wrap in markdown code blocks (no triple backticks).
Return EXACTLY this structure with NO additional text before or after:

{
  "summary": "A brief, friendly 1-2 sentence answer",
  "cards": [
    {
      "title": "Card title",
      "type": "parking | program | food | goods | keyvalue | list | text",
      "data": { /* structure depends on type */ }
    }
  ]
}

CARD TYPES AND STRUCTURES:

1. type: "parking" - For parking information
IMPORTANT: Translate ALL text fields to the user's language!
Example in Korean:
{
  "title": "주차장 정보",
  "type": "parking",
  "data": {
    "overview": {
      "period": "2024.10.11~10.13",
      "totalCapacity": 2297
    },
    "lots": [
      {
        "name": "시흥시청 주차장",
        "type": "공영",
        "capacity": 500,
        "address": "경기도 시흥시...",
        "notes": "무료 운영"
      }
    ]
  }
}

Example in English (same data, translated):
{
  "title": "Parking Information",
  "type": "parking",
  "data": {
    "overview": {
      "period": "October 11-13, 2024",
      "totalCapacity": 2297
    },
    "lots": [
      {
        "name": "Siheung City Hall Parking Lot",
        "type": "Public",
        "capacity": 500,
        "address": "Siheung-si, Gyeonggi-do...",
        "notes": "Free parking"
      }
    ]
  }
}

2. type: "food" - For restaurant/food information
IMPORTANT: Translate ALL text fields to the user's language!
Example in Korean:
{
  "title": "먹거리 정보",
  "type": "food",
  "data": {
    "restaurants": [
      {
        "name": "갯골식당",
        "type": "한식",
        "address": "축제장 인근"
      }
    ]
  }
}

Example in English (same data, translated):
{
  "title": "Food & Restaurants",
  "type": "food",
  "data": {
    "restaurants": [
      {
        "name": "Gaetgol Restaurant",
        "type": "Korean Food",
        "address": "Near festival venue"
      }
    ]
  }
}

3. type: "text" - For general text content (fallback)
IMPORTANT: Translate ALL text fields to the user's language!
Example in Korean:
{
  "title": "프로그램 안내",
  "type": "text",
  "data": {
    "content": "10월 11일(금)\n• 개막식: 19:00\n• 불꽃놀이: 20:30"
  }
}

Example in English (same data, translated):
{
  "title": "Program Guide",
  "type": "text",
  "data": {
    "content": "Friday, October 11\n• Opening Ceremony: 7:00 PM\n• Fireworks: 8:30 PM"
  }
}

IMPORTANT:
- Return ONLY the JSON object, no markdown formatting
- "summary" should be a quick, conversational answer (1-2 sentences max)
  • If you're including cards, ALWAYS end the summary with a natural reference to the detailed info below
  • Example phrases in Korean: "자세한 내용은 아래에서 확인하실 수 있어요", "더 많은 정보는 아래를 펼쳐보세요"
  • Example phrases in English: "You can find detailed information below", "Check out the details in the cards below"
  • Make it sound friendly and natural in the user's language
- "cards" should contain detailed information broken into logical sections
  • CRITICAL: ALL text in cards (titles, names, types, addresses, notes, content) MUST be in the user's language
  • Numbers and proper nouns can remain as is
- Each card should focus on one aspect/category
- Format the "content" field for maximum readability (use \\n for line breaks, bullets, sections)
- Keep card titles short and clear

WHEN TO USE CARDS AND WHICH TYPE:
CRITICAL: Use cards ONLY when the user is asking for COMPREHENSIVE or DETAILED information.
DO NOT use cards for specific, narrow questions that can be answered simply.

Question Scope Analysis:
- BROAD questions (전체 정보, 목록, 상세 안내) → USE CARDS
- SPECIFIC questions (특정 항목, 단순 사실) → NO CARDS, just summary

Choose the appropriate card type based on the question content:
  • Parking questions asking for FULL INFO → type: "parking"
  • Food/restaurant questions asking for FULL INFO → type: "food"
  • Program/schedule questions asking for FULL INFO → type: "program" (not implemented yet, use "text" as fallback)
  • Goods/merchandise questions asking for FULL INFO → type: "goods" (not implemented yet, use "text" as fallback)
  • General detailed info → type: "text"

Examples:
✅ USE CARDS:
- "주차장이 있나요?" / "주차장 정보 알려줘" → summary + cards: [{ type: "parking" }]
- "먹을 거 뭐 있어요?" / "음식점 알려줘" → summary + cards: [{ type: "food" }]
- "프로그램 뭐 있어요?" → summary + cards: [{ type: "text" }]

❌ NO CARDS (summary only):
- "주차 요금이 얼마예요?" → "무료입니다"
- "주차장 몇 개 있어요?" → "총 8개 주차장이 운영됩니다"
- "주차장 운영시간은?" → "09:00~22:00에 운영됩니다"
- "안녕하세요" → "안녕하세요!"
- "몇 시까지 해요?" → "22:00까지 운영됩니다"

=== Language Rules ===
- Detect the user's language automatically (any language).
- ALWAYS respond in the same language in both summary and cards.
- CRITICAL: ALL text fields in cards MUST be translated to the user's language, including:
  • Card titles
  • All data fields (names, addresses, types, notes, content, etc.)
  • Every single text string within the card structure
- Example: If user asks in English, translate "주차장 이름" → "Parking Lot Name", "주소" → "Address", etc.
- Example: If user asks in Japanese, translate all Korean text to Japanese
- The only exception is proper nouns (specific place names) which can remain in Korean if culturally appropriate

=== Information Rules ===
- Use the festival information below as the primary and most accurate source of truth.
- For questions covered in the data, answer strictly based on the official festival facts.
- For questions NOT explicitly covered in the data:
    • Use general festival knowledge, common-sense reasoning, and typical event operations to provide a helpful answer.
    • NEVER fabricate specific facts (times, locations, prices, etc.) that are not listed in the festival data.
    • If exact details cannot be confirmed, respond with a helpful general explanation AND a gentle note that the precise information is not provided in the official data.

=== Style Rules ===
- Speak in a warm, friendly, and enthusiastic tone like a cheerful festival guide.
- Use casual but polite honorifics (예: ~요, ~해요, ~있어요, ~드릴게요) consistently.
- Use exclamation marks (!) naturally to convey friendliness and energy.
- Examples of friendly expressions:
  • "네, 알려드릴게요!"
  • "도움이 되셨으면 좋겠어요!"
  • "더 궁금한 점 있으시면 언제든 물어보세요!"
- Be personable and show genuine interest in helping visitors.
- Keep answers clear and easy to understand while maintaining a warm, conversational tone.
- Add helpful context naturally, like talking to a friend.

Festival information (authoritative data):
${JSON.stringify(festival, null, 2)}
        `,
      };

      const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          response_format: { type: "json_object" },
          messages: [systemMessage, ...conversationHistory],
        }),
      });

      const data = await apiRes.json();
      if (!apiRes.ok) {
        console.error("Chat error:", data);
        return res.status(apiRes.status).json(data);
      }

      const replyText = data.choices?.[0]?.message?.content ?? "";

      // Parse JSON response from AI
      let parsedReply;
      try {
        // Remove markdown code blocks if present (```json ... ``` or ``` ... ```)
        let cleanedText = replyText.trim();
        const codeBlockMatch = cleanedText.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
        if (codeBlockMatch) {
          cleanedText = codeBlockMatch[1].trim();
        }

        // Try to extract JSON object from text (in case AI adds extra text)
        const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          cleanedText = jsonMatch[0];
        }

        console.log("Parsing AI response:", cleanedText.substring(0, 200));
        parsedReply = JSON.parse(cleanedText);

        // Validate structure
        if (!parsedReply.summary) {
          throw new Error("Invalid response structure: missing summary");
        }

        // Ensure cards is always an array (default to empty if missing)
        if (!parsedReply.cards) {
          parsedReply.cards = [];
        }

        if (!Array.isArray(parsedReply.cards)) {
          console.warn("Cards is not an array, converting to empty array");
          parsedReply.cards = [];
        }

        // Validate each card has type and data
        parsedReply.cards = parsedReply.cards.map((card: any) => {
          if (!card.type) {
            card.type = "text"; // default type
          }
          if (!card.data) {
            // Convert old format to new format if needed
            card.data = card.content ? { content: card.content } : {};
          }
          return card;
        });
      } catch (e) {
        console.error("❌ Failed to parse AI response as JSON:", e);
        console.error("📝 Original AI text:", replyText);

        // Try to extract summary if it's a JSON-like string
        let extractedSummary = replyText;
        try {
          // If AI sent something like '{ "summary": "..." }' but parse failed
          // try to extract the summary value
          const summaryMatch = replyText.match(/"summary"\s*:\s*"([^"]+)"/);
          if (summaryMatch) {
            extractedSummary = summaryMatch[1];
            console.log("✅ Extracted summary from malformed JSON:", extractedSummary);
          }
        } catch (extractError) {
          console.error("Failed to extract summary:", extractError);
        }

        // Fallback to plain text
        parsedReply = {
          summary: extractedSummary || "죄송해요, 지금은 답변을 가져오지 못했어요.",
          cards: []
        };
      }

      // ----------------------------
      // 2) 📌 Follow-up questions + Label 생성 (대화 맥락 포함)
      // ----------------------------
      const followRes = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            response_format: { type: "json_object" },
            messages: [
              {
                role: "system",
                content: `
You generate 3 short follow-up questions AND a label text based on the ENTIRE conversation context.

CRITICAL: Detect the user's language by analyzing their most recent message.
- Look at the script/characters used (Korean, English, Japanese, Chinese, Hindi, etc.)
- Respond in EXACTLY THE SAME language as the user's last message
- Match the language PRECISELY - do not confuse similar scripts

Return ONLY valid JSON in this exact format:

{
  "label": "Translated label for 'AI Suggested Questions'",
  "questions": ["question 1", "question 2", "question 3"]
}

Label translations (translate to user's language):
- Korean: "AI 추천 질문"
- English: "AI Suggested Questions"
- Japanese: "AIおすすめ質問"
- Chinese (Simplified): "AI推荐问题"
- Chinese (Traditional): "AI推薦問題"
- Hindi: "AI सुझाए गए प्रश्न"
- Spanish: "Preguntas sugeridas por IA"
- French: "Questions suggérées par l'IA"
- German: "Von KI vorgeschlagene Fragen"
- Arabic: "الأسئلة المقترحة بالذكاء الاصطناعي"
- For any other language: translate "AI Suggested Questions" to that language

IMPORTANT: The follow-up questions should be contextually relevant to the CURRENT topic being discussed.
For example:
- If discussing food/restaurants, suggest questions about specific restaurants, prices, opening hours
- If discussing parking, suggest questions about fees, capacity, specific locations
- If discussing programs, suggest questions about times, target audience, locations

Example (Korean):
{
  "label": "AI 추천 질문",
  "questions": ["행사장 입장 시간은?","우천 시 대피장소는?","가족 프로그램도 있어?"]
}

Example (English):
{
  "label": "AI Suggested Questions",
  "questions": ["What are the opening hours?","Where is the rain shelter?","Are there family programs?"]
}
            `.trim(),
              },
              ...conversationHistory,
              { role: "assistant", content: parsedReply.summary },
            ],
          }),
        }
      );

      let followUp = [];
      let followUpLabel = "AI 추천 질문"; // default Korean
      try {
        const followJson = await followRes.json();
        const text = followJson?.choices?.[0]?.message?.content ?? "{}";
        const parsed = JSON.parse(text);

        if (parsed.label && typeof parsed.label === 'string') {
          followUpLabel = parsed.label;
        }

        if (Array.isArray(parsed.questions)) {
          followUp = parsed.questions;
        } else {
          followUp = [];
        }
      } catch (e) {
        console.error("Follow-up parsing error:", e);
        followUp = [];
      }

      // ----------------------------
      // 3) 클라이언트로 전달
      // ----------------------------
      res.json({
        reply: parsedReply, // { summary: string, cards: Array<{title, content}> }
        followUp, // 📌 추천 질문들
        followUpLabel, // 📌 추천 질문 레이블 (다국어)
      });
    } catch (err) {
      console.error("Chat API error:", err);
      res.status(500).json({ error: "Failed to process chat request" });
    }
  });

  // =========================
  // 📄 다운로드 라우트들 (그대로)
  // =========================
  app.get("/api/download-pamphlet", (_req: Request, res: Response) => {
    const filePath = path.join(
      process.cwd(),
      "public",
      "downloads",
      "festival-pamphlet.pdf"
    );
    res.download(filePath, "festival-pamphlet.pdf", (err: Error | null) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).json({ error: "Failed to download file" });
      }
    });
  });

  app.get("/api/programs/pamphlet", (_req: Request, res: Response) => {
    const filePath = path.join(
      process.cwd(),
      "public",
      "downloads",
      "festival-pamphlet.pdf"
    );
    res.download(filePath, "full-timetable.pdf", (err: Error | null) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).json({ error: "Failed to download file" });
      }
    });
  });

  app.get("/api/programs/:id/pamphlet", (req: Request, res: Response) => {
    const filePath = path.join(
      process.cwd(),
      "public",
      "downloads",
      "festival-pamphlet.pdf"
    );
    res.download(
      filePath,
      `program-${req.params.id}.pdf`,
      (err: Error | null) => {
        if (err) {
          console.error("Error downloading file:", err);
          res.status(500).json({ error: "Failed to download file" });
        }
      }
    );
  });

  const httpServer = createServer(app);
  return httpServer;
}
