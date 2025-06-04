import { json } from "body-parser";
import express, { NextFunction } from "express";
import { errorHandler, NotFoundError } from "@heaven-nsoft/common";
import { uploadPhotoRouter } from "./routes/uploadPhoto";
import { uploadMultiPhotoRouter } from "./routes/uploadMultiPhoto";
import { getUserPhotosRouter } from "./routes/getUserPhotos";
import { getPhotoByIdRouter } from "./routes/getPhotoById";
import { uploadMultiPhotoEventRouter } from "./routes/uploadMultiPhotoEvent";
import updateUserPhotoMoment from "./controllers/updateUserPhotoMoment";
import { updateUserPhotoMomentRouter } from "./routes/updateUserPhotoMoment";

// **Configuration
const app = express();
app.set("trust proxy", true);
app.use(json());

app.all("*", async (req, res, next) => {
  console.log(req.url, req.baseUrl, req.originalUrl);
  next();
});
// ** Routes
app.use(uploadPhotoRouter);
app.use(uploadMultiPhotoEventRouter);
app.use(uploadMultiPhotoRouter);
app.use(getUserPhotosRouter);
app.use(getPhotoByIdRouter);
app.use(updateUserPhotoMomentRouter);

// **Catch-all error handler**
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
