import { Router } from "express";
import weather_controller from "../controllers";
import validatePayload from "../middleware/validate_request";

const appRouter = Router();

appRouter.get("/", validatePayload, weather_controller);

export default appRouter;
