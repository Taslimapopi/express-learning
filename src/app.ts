import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import { pool } from "./db";
import { userRoute } from "./modules/users/user.route";
import { profileRouter } from "./modules/profiles/profile.route";
import { authRoute } from "./modules/auth/auth.route";
import fs from "fs";
import logger from "./middleware/logger";
import globalErrorHandler from "./middleware/globalErrorHandler";
import cookieParser from "cookie-parser";

const app: Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use(cookieParser());

// app.use((req, res, next) => {
//   // console.log(req.method, req.url, Date.now);
//   const log = `${req.method} | ${req.url} | ${Date.now()}\n`;
//   fs.appendFile("logger.txt", log, (err) => {
//     console.log(err);
//   });
//   next();
// });

app.use("/api/v1/users", userRoute);
app.use("/api/v1/profiles", profileRouter);
app.use("/api/v1/auth", authRoute);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "This is root route",
    author: "taslima",
  });
});

app.use(globalErrorHandler);

export default app;
