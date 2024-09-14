import { Router, Request, Response } from "express";

const appRouter = Router();

appRouter.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ message: "Running", success: true });
});

export default appRouter;
