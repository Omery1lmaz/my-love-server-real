import { Request, Response } from "express";
import { User } from "../Models/user";
import { NotFoundError } from "@heaven-nsoft/common";

export const updatePartnerInfo = async (req: Request, res: Response) => {
  const { nickname, notes } = req.body;
  const user = await User.findById(req.currentUser!.id);

  if (!user) {
    throw new NotFoundError();
  }

  user.partnerNickname = nickname || user.partnerNickname;
  user.partnerNotes = notes || user.partnerNotes;

  await user.save();
  res.status(200).send(user);
};
