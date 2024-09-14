import express from "express";
import appRouter from "./routes";
import { PORT } from "./utils/constants";

const app = express();

app.use(express.json());

app.use(appRouter);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`App started on ${PORT}`);
});
