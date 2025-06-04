import { Request, Response } from "express";
import { User } from "../Models/user";
import { NotFoundError } from "@heaven-nsoft/common";

export const updateFavorites = async (req: Request, res: Response) => {
  const { spotifySong, favoritePhoto, favoriteDate } = req.body;

  const user = await User.findById(req.currentUser!.id);

  if (!user) {
    throw new NotFoundError();
  }

  user.favorites = {
    spotifySong: spotifySong || user.favorites?.spotifySong,
    favoritePhoto: favoritePhoto || user.favorites?.favoritePhoto,
    favoriteDate: favoriteDate || user.favorites?.favoriteDate,
  };

  await user.save();
  res.status(200).send(user);
};
