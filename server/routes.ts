import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // PDF download endpoints
  app.get("/api/download-pamphlet", (req: Request, res: Response) => {
    const filePath = path.join(process.cwd(), "public", "downloads", "festival-pamphlet.pdf");
    res.download(filePath, "festival-pamphlet.pdf", (err: Error | null) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).json({ error: "Failed to download file" });
      }
    });
  });

  // Full timetable download
  app.get("/api/programs/pamphlet", (req: Request, res: Response) => {
    const filePath = path.join(process.cwd(), "public", "downloads", "festival-pamphlet.pdf");
    res.download(filePath, "full-timetable.pdf", (err: Error | null) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).json({ error: "Failed to download file" });
      }
    });
  });

  // Individual program pamphlet download
  app.get("/api/programs/:id/pamphlet", (req: Request, res: Response) => {
    const filePath = path.join(process.cwd(), "public", "downloads", "festival-pamphlet.pdf");
    res.download(filePath, `program-${req.params.id}.pdf`, (err: Error | null) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).json({ error: "Failed to download file" });
      }
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
