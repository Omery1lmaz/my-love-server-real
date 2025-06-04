import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { User } from "../Models/user";
import mongoose from "mongoose";

const clientId = "bee83f2e9bd54f76ac500edf670599f3";
const clientSecret = "062ee3fc313441c1972172287d724fe5";
const refreshSpotifyTokenController = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader, "authHeade test stesr");
  if (!authHeader) {
    console.log("no authHeader");
    res.status(401).json({ message: "Lütfen giriş yapın" });
    return;
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    console.log("no token");
    res.status(400).json({ message: "Token bulunamadı" });
    return;
  }
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY!) as {
      id: string;
    };
    console.log(decodedToken, "decoded token");
    const user = await User.findById(
      new mongoose.Types.ObjectId(decodedToken.id)
    );
    if (!user) {
      console.log("Kullanıcı bulunamadı", decodedToken.id);
      res.status(404).json({ message: "Kullanıcı bulunamadı" });
      return;
    }
    console.log(user.spotifyRefreshToken, "user");
    const refreshToken = user.spotifyRefreshToken;
    const refreshTokenExpires = user.spotifyAccessTokenExpires;
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${clientId}:${clientSecret}`
        ).toString("base64")}`,
      },
      body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
    });
    const data = await response.json();
    console.log(data.access_token, "data");
    if (data.error) {
      console.log(data, "data error test Spotify token yenileme hatası ");
      res.status(400).json({ message: "Spotify token yenileme hatası" });
      return;
    }
    user.spotifyAccessToken = data.access_token;
    user.spotifyAccessTokenExpires = new Date(
      Date.now() + data.expires_in * 1000
    );
    await user.save();
    res.status(200).json({
      message: "Spotify token yenildi",
      status: "success",
      statusCode: 200,
      data: {
        spotifyAccessToken: user.spotifyAccessToken,
        spotifyAccessTokenExpires: user.spotifyAccessTokenExpires,
      },
    });
  } catch (error) {
    console.log("catch error", error);
    res.status(400).json({ message: "Kimlik doğrulama başarısız" });
  }
};

export default refreshSpotifyTokenController;
