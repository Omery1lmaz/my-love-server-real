import { json } from "body-parser";
import express, { NextFunction } from "express";
import { errorHandler, NotFoundError } from "@heaven-nsoft/common";
import { uploadPhotoRouter } from "./routes/uploadPhoto";
import { uploadMultiPhotoRouter } from "./routes/uploadMultiPhoto";
import { getUserPhotosRouter } from "./routes/getUserPhotos";
import { getPhotoByIdRouter } from "./routes/getPhotoById";
import { uploadMultiPhotoEventRouter } from "./routes/uploadMultiPhotoEvent";
import { updateUserPhotoMomentRouter } from "./routes/updateUserPhotoMoment";
import { uploadUserProfilePhotoRouter } from "./routes/uploadUserProfilePhoto";
import { uploadMultiPhotoTimeLineRouter } from "./routes/uploadMultiPhotoTimeLine";
import { uploadMultiPhotoDailyJourneyRouter } from "./routes/uploadMultiPhotoDailyJourney";

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
app.use(uploadMultiPhotoTimeLineRouter);
app.use(getUserPhotosRouter);
app.use(getPhotoByIdRouter);
app.use(updateUserPhotoMomentRouter);
app.use(uploadUserProfilePhotoRouter);
app.use(uploadMultiPhotoDailyJourneyRouter);


// **Catch-all error handler**
app.all("*", async (req, res, next: NextFunction) => {
  console.log("catch error")
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
