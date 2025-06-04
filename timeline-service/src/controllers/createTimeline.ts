import { NextFunction, Request, Response } from "express";
import { NotAuthorizedError } from "@heaven-nsoft/common";
import jwt from "jsonwebtoken";
import { Photo } from "../models/photo";
import { User } from "../models/user";
import { Timeline } from "../models/timeline";
import mongoose from "mongoose";

export const createTimelineController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as {
      id: string;
    };
    const user = await User.findById(decoded.id);

    if (!user) {
      console.log("partner not found");
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.partnerId) {
      console.log("no parnter");
      res.status(400).json({ message: "User has no partner" });
      return;
    }

    const {
      title,
      description,
      date,
      type,
      isPrivate,
    }: {
      title: string;
      description: string;
      date: string;
      type:
        | "anniversary"
        | "first_meet"
        | "first_date"
        | "special_moment"
        | "custom";
      isPrivate: boolean;
    } = req.body;

    const timelineEvent = Timeline.build({
      userId: user.id,
      partnerId: user.partnerId as unknown as mongoose.Types.ObjectId,
      title,
      description,
      date: new Date(date),
      type,
      photos: [],
      coverPhotoId: undefined,
      isPrivate,
    });

    await timelineEvent.save();

    res.status(201).json({
      message: "Timeline event created successfully",
      status: "success",
      statusCode: 201,
      data: timelineEvent,
    });
  } catch (error) {
    console.error("Error creating timeline event:", error);
    res.status(500).json({ message: "Error creating timeline event" });
  }
};

export default createTimelineController;
