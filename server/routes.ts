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

      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // 축제 데이터 로딩
      const filePath = path.join(process.cwd(), "server", "festival-info.json");
      const festival = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      // ----------------------------
      // 1) 본문 답변 생성
      // ----------------------------
      const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are the official chatbot of the Siheung Gaetgol Festival.

=== Language Rules ===
- Detect the user's language automatically (any language).
- ALWAYS respond in the same language.

=== Information Rules ===
- Use the festival information below as the primary and most accurate source of truth.
- For questions covered in the data, answer strictly based on the official festival facts.
- For questions NOT explicitly covered in the data:
    • Use general festival knowledge, common-sense reasoning, and typical event operations to provide a helpful answer.
    • NEVER fabricate specific facts (times, locations, prices, etc.) that are not listed in the festival data.
    • If exact details cannot be confirmed, respond with a helpful general explanation AND a gentle note that the precise information is not provided in the official data.

=== Style Rules ===
- Be friendly, concise, and helpful.
- Offer additional helpful context when appropriate.
- Suggest related topics the user may want to ask.

Festival information (authoritative data):
${JSON.stringify(festival, null, 2)}
            `,
            },
            { role: "user", content: message },
          ],
        }),
      });

      const data = await apiRes.json();
      if (!apiRes.ok) {
        console.error("Chat error:", data);
        return res.status(apiRes.status).json(data);
      }

      const reply = data.choices?.[0]?.message?.content ?? "";

      // ----------------------------
      // 2) 📌 Follow-up questions 생성
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
            messages: [
              {
                role: "system",
                content: `
You generate 3 short follow-up questions relevant to the user's message.
Detect the user's language automatically (support any language) and respond ONLY in that language.
Return ONLY a JSON array of strings.

Example:
["행사장 입장 시간은?","우천 시 대피장소는?","가족 프로그램도 있어?"]
            `.trim(),
              },
              { role: "user", content: message },
              { role: "assistant", content: reply },
            ],
          }),
        }
      );

      let followUp = [];
      try {
        const followJson = await followRes.json();
        const text = followJson?.choices?.[0]?.message?.content ?? "[]";
        followUp = JSON.parse(text);
        if (!Array.isArray(followUp)) followUp = [];
      } catch (e) {
        followUp = [];
      }

      // ----------------------------
      // 3) 클라이언트로 전달
      // ----------------------------
      res.json({
        reply,
        followUp, // 📌 추가됨!
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
