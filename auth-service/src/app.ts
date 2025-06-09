import express from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError } from "@heaven-nsoft/common";
import { signinRouter } from "./routes/signin";
import { signupRouter } from "./routes/signup";
import { verifyRegisterRouter } from "./routes/verifyRegister";
import { googleSigninRouter } from "./routes/googleSignin";
import { registerResendOTPRouter } from "./routes/registerResendOTP";
import { forgetPasswordResendOTPRouter } from "./routes/forgetPasswordResendOTP";
import { resetPasswordVerifyOTPRouter } from "./routes/resetPasswordVerifyOTP";
import { profileRouter } from "./routes/profile";
import { deleteProfileRouter } from "./routes/deleteProfile";
import { checkRegisterEmailRouter } from "./routes/checkRegisterEmail";
import { resetPasswordRouter } from "./routes/resetPassword";
import { resetPasswordSendEmailRouter } from "./routes/resetPasswordSendEmail";
import { updatePasswordRouter } from "./routes/updatePassword";
import { detailRouter } from "./routes/details";
import { updateUserNameRouter } from "./routes/updateUserName";
import { verifyRegisterPartnerCodeRouter } from "./routes/verifyRegisterPartnerCode";
import { updateSpotifyTokensRouter } from "./routes/updateSpotifyTokens";
import { favoritesRouter } from "./routes/favorites";
import { interestsRouter } from "./routes/interests";
import { moodRouter } from "./routes/mood";
import { partnerRouter } from "./routes/partner";
import { quizRouter } from "./routes/quiz";
import { reminderRouter } from "./routes/reminder";
import { statsRouter } from "./routes/stats";
import { updateUserProfileDetailsRouter } from "./routes/updateUserProfileDetails";
import { updateUserQuestionsRouter } from "./routes/updateUserQuestions";
import { updateUserFavoriteMovieRouter } from "./routes/updateUserFavoriteMovie";
import { updateUserFavoriteBookRouter } from "./routes/updateUserFavoriteBook";
import { updateUserHobbiesRouter } from "./routes/updateUserHobbies";
import { getUserHobbiesRouter } from "./routes/getUserHobbies";
import { updateUserRelationshipDateRouter } from "./routes/updateUserRelationshipDate";
import { getUserRelationshipDateRouter } from "./routes/getUserRelationshipDate";
import { updateMoodRouter } from "./routes/updateMood";
import { getTodayMoodRouter } from "./routes/getTodayMood";
import { refreshSpotifyTokenRouter } from "./routes/refreshSpotifyToken";
import { refreshPartnerSpotifyTokenRouter } from "./routes/refreshPartnerSpotifyToken";
import { updateSharedSpotifyAlbumRouter } from "./routes/updateSharedSpotifyAlbum";
import { getSharedSpotifyAlbumRouter } from "./routes/getSharedSpotifyAlbum";
import { createTodaySongRouter } from "./routes/createTodaySong";
import { getTodaySongRouter } from "./routes/getTodaySong";
import { updateSharedPlaylistCoverImageRouter } from "./routes/updateSharedPlaylistCoverImage";
import { updateSharedSpotifyAlbumDetailRouter } from "./routes/updateSharedSpotifyAlbumDetail";
import { getSharedSpotifyAlbumDetailRouter } from "./routes/getSharedSpotifyAlbumDetail";
import { sendSongRouter } from "./routes/sendSong";
import { getSendSongRouter } from "./routes/getSendSong";
import { createHobbyRouter } from "./routes/createHobby";
import { getHobbiesRouter } from "./routes/getHobbies";
import { updateHobbyRouter } from "./routes/updateHobby";
import { getHobbyDetailsRouter } from "./routes/getHobbyDetails";
import { deleteHobbyRouter } from "./routes/deleteHobby";
import { createBookRouter } from "./routes/createBook";
import { deleteBookRouter } from "./routes/deleteBook";
import { getBooksRouter } from "./routes/getBooks";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.all("", async (req, res, next) => {
  console.log("test", req.url);
  next();
});
// Spotify

app.use(getSharedSpotifyAlbumRouter);
app.use(getSharedSpotifyAlbumDetailRouter);
app.use(updateSharedSpotifyAlbumRouter);
app.use(refreshPartnerSpotifyTokenRouter);
app.use(updateSharedPlaylistCoverImageRouter);
app.use(updateSpotifyTokensRouter);
app.use(refreshSpotifyTokenRouter);
app.use(createTodaySongRouter);
app.use(updateSharedSpotifyAlbumDetailRouter);
app.use(getTodaySongRouter);
app.use(sendSongRouter);
app.use(getSendSongRouter);

// Login or Signup

app.use(signinRouter);
app.use(signupRouter);
app.use(verifyRegisterRouter);
app.use(googleSigninRouter);
app.use(checkRegisterEmailRouter);
app.use(verifyRegisterPartnerCodeRouter);

// Password Management
app.use(forgetPasswordResendOTPRouter);
app.use(resetPasswordVerifyOTPRouter);
app.use(resetPasswordRouter);
app.use(resetPasswordSendEmailRouter);
app.use(updatePasswordRouter);

// User Profile Management
app.use(profileRouter);
app.use(deleteProfileRouter);
app.use(detailRouter);
app.use(updateUserNameRouter);
app.use(statsRouter);
app.use(updateUserProfileDetailsRouter);

// Partner's Profile Management
app.use(partnerRouter);

// User's favorites
app.use(favoritesRouter);
// User's Interests
app.use(interestsRouter);
// User's Questions
app.use(updateUserQuestionsRouter);
app.use(quizRouter);
// User's Mood
app.use(moodRouter);
app.use(updateMoodRouter);
app.use(getTodayMoodRouter);

// User's Reminders
app.use(reminderRouter);

// User's Favorite Books
app.use(createBookRouter);
app.use(deleteBookRouter);
app.use(getBooksRouter);
app.use(updateUserFavoriteBookRouter);

// User's Favorite Movies
app.use(updateUserFavoriteMovieRouter);

// User's Hobbies
app.use(createHobbyRouter);
app.use(updateHobbyRouter);
app.use(getHobbyDetailsRouter);
app.use(deleteHobbyRouter);
app.use(getHobbiesRouter);
app.use(updateUserHobbiesRouter);
app.use(getUserHobbiesRouter);

// User Relationship Stats
app.use(updateUserRelationshipDateRouter);
app.use(getUserRelationshipDateRouter);

app.all("*", async (req, res, next) => {
  next(new NotFoundError());
});

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    errorHandler(err, req, res, next);
  }
);

export { app };
