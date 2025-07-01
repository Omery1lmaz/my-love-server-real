import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { BadRequestError, NotAuthorizedError } from "@heaven-nsoft/common";
import mongoose from "mongoose";
import { Photo } from "../models/photo";
import { TimelinePhotoCreatedPublisher } from "../events/publishers/timeline-photo-created-publisher";
import { natsWrapper } from "../nats-wrapper";
import sharp from "sharp";
import { uploadToS3 } from "../utils/multer-s3/upload";

const uploadMultiPhotoTimelineController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("uploadMultiPhotoTimelineController");
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      next(new NotAuthorizedError());
      return;
    }
    const token = authHeader.split(" ")[1];
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.SECRET_KEY!) as {
        id: string;
      };
    } catch (err) {
      next(new NotAuthorizedError());
      return;
    }

    if (!decodedToken?.id) {
      next(new NotAuthorizedError());
      return;
    }

    if (!req.files || !Array.isArray(req.files)) {
      next(new BadRequestError("File upload failed"));
      return;
    }

    const {
      description = "",
      tags = [],
      musicUrl = "",
      note = "",
      location,
      coverPhotoFileName,
      timelineId,
    } = req.body;

    const uploadedPhotos = [];
    let coverPhotoId = null;
    for (const file of req.files) {
      console.log("file", file);

      const fileName = `${Date.now()}-${file.originalname}`;
      const thumbnailName = `thumb-${fileName}`;

      // Upload original and thumbnail to S3
      const [originalUrl, thumbnailUrl] = await Promise.all([
        uploadToS3(file.buffer, fileName, file.mimetype),
        sharp(file.buffer).resize({ width: 300 }).toBuffer().then((thumbBuffer: any) =>
          uploadToS3(thumbBuffer, thumbnailName, file.mimetype)
        ),
      ]);

      let locationData = null;
      if (location) {
        locationData = JSON.parse(location);
      }

      const newPhoto = new Photo({
        user: new mongoose.Types.ObjectId(),
        timeline: timelineId,
        url: originalUrl,
        thumbnailUrl,
        tags,
        musicUrl,
        note,
        location: locationData,
        isPrivate: false,
      });

      const savedPhoto = await newPhoto.save();
      uploadedPhotos.push(savedPhoto);
      if (coverPhotoFileName === file.originalname) {
        console.log(
          "coverPhotoFileName",
          coverPhotoFileName,
          file.originalname
        );
        coverPhotoId = savedPhoto._id;
      }
    }
    await new TimelinePhotoCreatedPublisher(natsWrapper.client).publish({
      photos: uploadedPhotos.map((photo) => ({
        id: (photo._id as any).toString(),
        user: photo.user,
        timeline: photo.timeline || null,
        url: photo.url,
        thumbnailUrl: photo.thumbnailUrl,
        description: photo.description,
        photoDate: new Date(),
        tags: photo.tags || [],
        title: photo.title || "",
        isPrivate: photo.isPrivate,
        version: photo.__v,
        note: photo.note || "",
        musicUrl: photo.musicUrl || "",
        musicDetails: photo.musicDetails || {
          name: "",
          artist: "",
          album: "",
          albumImage: "",
          spotifyUrl: "",
        },
        location: photo.location || undefined,
        filterName: photo.filterName || "",
        likes: photo.likes || 0,
        comments: photo.comments || 0,
        fileType: photo.fileType || "image/jpeg",
        isDeleted: photo.isDeleted || false,
        width: photo.width || 0,
        height: photo.height || 0,
      })),
      coverPhotoId: coverPhotoId
        ? (coverPhotoId as any).toString()
        : (uploadedPhotos[0]._id as any).toString(),
    });
    console.log("cover photo id", coverPhotoId);
    res.status(201).json({
      message: "Photos uploaded successfully",
      uploadedPhotos: uploadedPhotos || [],
      coverPhotoId: coverPhotoId || null,
    });
  } catch (error) {
    console.error("Error creating photo:", error);
    next(new BadRequestError("Internal server error"));
    return;
  }
};

export default uploadMultiPhotoTimelineController;
