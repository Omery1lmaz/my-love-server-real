import { json } from "body-parser";
import express, { NextFunction } from "express";
import { errorHandler, NotFoundError } from "@heaven-nsoft/common";
import { createEventRouter } from "./routes/createEvent";
// import { getEventByIdRouter } from "./routes/getEventById";
// import { getUserEventByIdRouter } from "./routes/getUserEventsById";
import { getUserEventByIdRouter } from "./routes/getUserEventById";
import { getUserEventsRouter } from "./routes/getUserEvents";
import { getUpcomingEventsRouter } from "./routes/getUpcomingEvents";

const app = express();
app.set("trust proxy", true);
app.use(json());

app.use(createEventRouter);
app.use(getUserEventsRouter);
app.use(getUserEventByIdRouter);
app.use(getUpcomingEventsRouter);

app.all("*", async (req, res, next: NextFunction) => {
  console.log(req.url, req.baseUrl, req.originalUrl);
  next(new NotFoundError());
});

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) => {
    next(errorHandler(err, req, res, next));
  }
);

export { app };
