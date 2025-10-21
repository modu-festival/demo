import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

export async function registerRoutes(app: Express): Promise<Server> {
  // 축제 정보 제공
  app.get("/festival", (req: Request, res: Response) => {
    const filePath = path.join(process.cwd(), "server", "festival-info.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    res.json(data);
  });

  // OpenAI Realtime API용 세션 발급
  app.get("/session", async (req: Request, res: Response) => {
    try {
      const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
      const filePath = path.join(process.cwd(), "server", "festival-info.json");
      const festival = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      const r = await fetch("https://api.openai.com/v1/realtime/sessions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-realtime-preview-2024-12-17",
          instructions: `
            당신은 '${festival.name}'의 공식 AI 상담사입니다.
밝고 자연스러운 목소리로 사용자의 질문에 따라 축제 정보를 명확하고 친근하게 안내하세요.

이 축제는 ${festival.period} 동안 ${festival.location}에서 열립니다.
주최: ${festival.organizers}, 문의: ${festival.contact}, 입장: ${
            festival.price
          }.
주요 프로그램: ${(festival.programs || []).join(", ")}.

교통 안내: ${festival.transport}.
분실물 문의: ${festival.lostAndFound}.
맛집 정보: ${(festival.restaurants || [])
            .map((r: any) => `${r.name} (${r.type}) — ${r.address}`)
            .join("; ")}.

navigateSection({ section: "..." })를 호출해 해당 섹션(info, announcements, gallery, food, location, program, goods)으로 이동할 수 있습니다.

통화가 연결되면 사용자의 질문을 기다리세요.
          `.trim(),
        }),
      });

      const data = await r.json();
      if (!r.ok) {
        console.error("OpenAI session error:", data);
        return res.status(r.status).json(data);
      }

      res.json(data);
    } catch (err) {
      console.error("Session route error:", err);
      res.status(500).json({ error: "Failed to create session" });
    }
  });

  app.get("/api/download-pamphlet", (req: Request, res: Response) => {
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

  app.get("/api/programs/pamphlet", (req: Request, res: Response) => {
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
