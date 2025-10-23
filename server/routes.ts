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
      return "Hello! What would you like to know about the Siheung Gaetgol Festival?";
    case "ja":
      return "こんにちは！シフワ干潟（シフン・ゲッコル）フェスティバルについて何か知りたいことはありますか？";
    case "zh":
      return "你好！关于始华（市兴）滩涂庆典，你想了解些什么？";
    default:
      return "안녕하세요! 시흥갯골축제에 대해 무엇이 궁금하신가요?";
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
  // 축제 정보 제공
  app.get("/festival", (_req: Request, res: Response) => {
    const filePath = path.join(process.cwd(), "server", "festival-info.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    res.json(data);
  });

  // ✅ 언어별 세션 발급 (예: /session/en, /session/ko ...)
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
          // ⚠️ 인스트럭션은 “초기 인사 1회만” + “언어 자동 전환”
          instructions: `
You are the official voice assistant for '${festival.name}'.

1) On the very first response after the call starts, say **exactly one** short greeting in ${langName}:
"${greet}"
Then **stop and wait** for the user's question. Do not continue with a long introduction unless asked.

2) For every user utterance afterward:
   - Detect the user's language automatically.
   - Answer in that same language.
   - If the user asks to switch languages (e.g., "answer in Russian"), switch immediately.

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
          // (필요하면 목소리/속도 등 server에서 고정할 수도 있음)
          // voice: "marin", // 예시
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

  // 다운로드 라우트들 (기존 그대로)
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
