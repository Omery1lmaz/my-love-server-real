import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { BadRequestError, NotAuthorizedError } from "@heaven-nsoft/common";
import { Photo } from "../models/photo";

export const uploadPhotoController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log("File upload failed authHeader", req.headers);
      next(new NotAuthorizedError());
      return;
    }

    const token = authHeader.split(" ")[1];
    console.log("token", token);
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.SECRET_KEY!) as {
        id: string;
        title: string;
      };
    } catch (err) {
      console.log("File upload failed err");
      next(new NotAuthorizedError());
      return;
    }
    console.log("decodedToken", decodedToken);
    if (!decodedToken?.id) {
      console.log("File upload failed decodedToken?.id");
      next(new NotAuthorizedError());
      return;
    }

    if (!req.file) {
      console.log("File upload failed req.file");
      res.status(400).json({ message: "File upload failed" });
      return;
    }

    const {
      album,
      description = "",
      tags = [],
      musicUrl = "",
      title = "",
      note = "",
      location,
      musicDetails,
      photoDate = new Date(),
      isPrivate = false,
    } = req.body;
    console.log("musicDetails", musicDetails);
    const parsedTags = tags ? JSON.parse(tags) : [];
    const parsedLocation = location ? JSON.parse(location) : null;
    const parsedDate = location ? JSON.parse(photoDate) : new Date(Date.now());
    const parsedIsPrivate = location ? JSON.parse(isPrivate) : false;
    const parsedMusicDetails = musicDetails ? JSON.parse(musicDetails) : null;
    console.log("parsedMusicDetails", parsedMusicDetails);
    const newPhoto = new Photo({
      user: decodedToken.id,
      album,
      url: (req.file as any).location,
      moment: {
        me: {
          description,
        },
        partner: {
          description: "",
        },
      },
      photoDate: parsedDate,
      tags: parsedTags,
      musicUrl,
      title,
      note,
      location: parsedLocation,
      musicDetails: parsedMusicDetails,
      isPrivate: parsedIsPrivate,
    });

    const test = await newPhoto.save();

    res.status(201).json({
      message: "Photo created successfully",
      imageUrl: newPhoto.url,
      newPhoto,
      test,
    });
  } catch (error) {
    console.error("Error creating photo:", error);
    next(new BadRequestError("Internal server error"));
  }
};

export default uploadPhotoController;
