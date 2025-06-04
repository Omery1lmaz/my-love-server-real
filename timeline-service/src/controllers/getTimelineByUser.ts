import { NextFunction, Request, Response } from "express";
import { NotAuthorizedError } from "@heaven-nsoft/common";
import jwt from "jsonwebtoken";
import { Timeline } from "../models/timeline";

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

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.SECRET_KEY!) as {
        id: string;
      };
    } catch (err) {
      console.log("err", err);
      next(new NotAuthorizedError());
      return;
    }

    if (!decodedToken?.id) {
      console.log("no id");
      next(new NotAuthorizedError());
      return;
    }

    const timelines = await Timeline.find({
      $or: [{ userId: decodedToken.id }, { partnerId: decodedToken.id }],
    });

    res.status(201).json({
      message: "Timelines get succesfully",
      status: "success",
      statusCode: 201,
      data: timelines,
    });
  } catch (error) {
    console.error("Error fetching timeline event:", error);
    res.status(500).json({ message: "Error fetching timeline event" });
  }
};

export default createTimelineController;
