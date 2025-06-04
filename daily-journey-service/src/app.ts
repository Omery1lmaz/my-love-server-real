import { json } from "body-parser";
import express, { NextFunction } from "express";
import { errorHandler, NotFoundError } from "@heaven-nsoft/common";
import { createJournalRouter } from "./routes/createJournal";
import { getUserJournalsRouter } from "./routes/getUserJournals";
import { getPartnerJournalsRouter } from "./routes/getPartnerJournals";
import { getJournalDetailRouter } from "./routes/getJournalDetail";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.all("*", async (req, res, next) => {
  console.log(req.url, req.baseUrl, req.originalUrl);
  next();
});

app.use(createJournalRouter);
app.use(getUserJournalsRouter);
app.use(getPartnerJournalsRouter);
app.use(getJournalDetailRouter);

app.all("*", async (req, res, next: NextFunction) => {
  next(new NotFoundError());
});
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) => {
    errorHandler(err, req, res, next);
  }
);
export { app };
