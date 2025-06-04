import { Request, Response } from "express";
import { User } from "../Models/user";
import { NotFoundError } from "@heaven-nsoft/common";

export const updateInterests = async (req: Request, res: Response) => {
  const { music, movies, books, hobbies } = req.body;
  const user = await User.findById(req.currentUser!.id);

  if (!user) {
    throw new NotFoundError();
  }

  user.interests = {
    music: music || user.interests?.music,
    movies: movies || user.interests?.movies,
    books: books || user.interests?.books,
    hobbies: hobbies || user.interests?.hobbies,
  };

  await user.save();
  res.status(200).send(user);
};
