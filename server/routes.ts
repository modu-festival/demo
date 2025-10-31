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
  app.get("/festival", (_req: Request, res: Response) => {
    const filePath = path.join(process.cwd(), "server", "festival-info.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    res.json(data);
  });

  // ✅ 세션 생성 시 turn_detection 추가
  app.get("/session/:lang?", async (req: Request, res: Response) => {
    try {
      const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
      if (!OPENAI_API_KEY) {
        return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
      }

      const lang = resolveLang(req.params.lang);
      const greet = greetingByLang(lang);
      const { name: langName, code: langCode } = langMeta(lang);

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
          turn_detection: "none", // ✅ 인사 중엔 끊김 방지
          instructions: `
You are the official voice assistant for '${festival.name}'.

1) On the very first response after the call starts, say exactly one short greeting in ${langName}:
"${greet}"
Then stop and wait for the user's question.

2) After finishing the greeting, automatically re-enable turn detection:
{ "type": "session.update", "session": { "turn_detection": "server_vad" } }

3) When a question clearly maps to a UI section, first call:
   navigateSection({ section: "<one of: info, announcements, gallery, food, location, program, goods>" })
   Then speak your answer.

Festival facts (for reference):
- Period: ${festival.period}
- Location: ${festival.location}
- Organizer: ${festival.organizers}
- Contact: ${festival.contact}
- Admission: ${festival.price}
- Programs: ${(festival.programs || []).join(", ")}
- Transport: ${festival.transport}
- Lost & Found: ${festival.lostAndFound}
- Restaurants: ${(festival.restaurants || [])
            .map((r: any) => `${r.name} (${r.type}) — ${r.address}`)
            .join("; ")}
- Goods: ${(festival.goods || [])
            .map((g: any) => `${g.name} (${g.price}) — ${g.description}`)
            .join("; ")}

Remember: keep answers concise and friendly. Wait for the user's request before giving details beyond the greeting.
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

  // ✅ 이하 원본 그대로
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
