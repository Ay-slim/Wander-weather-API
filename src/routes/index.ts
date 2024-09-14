import { Router, Request, Response } from "express";
import weather_controller from "../controllers";

const appRouter = Router();

appRouter.get("/test", (_req: Request, res: Response) => {
  res.status(200).json({ message: "Running", success: true });
});

appRouter.get("/", weather_controller);

export default appRouter;
