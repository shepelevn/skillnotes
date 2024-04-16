import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { auth } from "../auth/auth";

const apiRouter = express.Router();

// TODO: Check if needed
apiRouter.use(bodyParser.json());

// TODO: Delete later
apiRouter.get("/test", auth, async (_req: Request, res: Response) => {
  res.json({ value: "success" });
});

// TODO: Add 404

export default apiRouter;
