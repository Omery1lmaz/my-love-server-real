import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { BadRequestError, NotAuthorizedError } from "@heaven-nsoft/common";
import { Photo } from "../models/photo";
import sharp from "sharp";
import { uploadToS3 } from "../utils/multer-s3/upload";
import { UserPhoto } from "../models/userPhoto";
import { UserProfilePhotoCreatedPublisher } from "../events/publishers/user-profile-photo-created-publisher";
import { natsWrapper } from "../nats-wrapper";
import mongoose from "mongoose";

export const uploadUserPhotoController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) return next(new NotAuthorizedError());

      const token = authHeader.split(" ")[1];
      let decodedToken;
      try {
        decodedToken = jwt.verify(token, process.env.SECRET_KEY!) as {
          id: string;
          title: string;
        };
      } catch {
        next(new NotAuthorizedError());
        return
      }

      if (!decodedToken?.id || !req.file) {
        next(new BadRequestError("File upload failed"));
        return;
      }


      const file = req.file;
      // S3 için isim üret
      const fileName = `${Date.now()}-${file.originalname}`;
      const thumbnailName = `thumb-${fileName}`;

      // Orijinal ve Thumbnail oluştur
      const [originalUrl, thumbnailUrl] = await Promise.all([
        uploadToS3(file.buffer, fileName, file.mimetype),
        sharp(file.buffer).resize({ width: 300 }).toBuffer().then((thumbBuffer: any) =>
          uploadToS3(thumbBuffer, thumbnailName, file.mimetype)
        ),
      ]);
      console.log(originalUrl, thumbnailUrl, "originalUrl, thumbnailUrl");
      const newPhoto = new UserPhoto({
        user: decodedToken.id,
        url: originalUrl,
        thumbnailUrl,
      });

      const savedPhoto = await newPhoto.save();

      await new UserProfilePhotoCreatedPublisher(natsWrapper.client).publish({
        photo: {
          id: savedPhoto._id as unknown as any,
          thumbnailUrl: thumbnailUrl,
          url: originalUrl,
          user: decodedToken.id as unknown as any,
          version: savedPhoto.__v,
          height: savedPhoto.height,
          width: savedPhoto.width
        }
      })
      res.status(201).json({
        message: "User Photo created successfully",
        imageUrl: originalUrl,
        thumbnailUrl,
        photo: savedPhoto,
      });
    } catch (error) {
      console.error("Error creating photo:", error);
      next(new BadRequestError("Internal server error"));
      return;
    }
  } catch (error) {
    console.error("Error creating photo:", error);
    next(new BadRequestError("Internal server error"));
    return;

  }
};
export default uploadUserPhotoController;
