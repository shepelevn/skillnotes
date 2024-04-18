import { Request, Response } from "express";

export async function authorize(req: Request, res: Response, next: () => void) {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
}
