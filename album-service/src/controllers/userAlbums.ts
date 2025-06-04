import { Publish } from "./../../node_modules/aws-sdk/clients/stepfunctions.d";
import { NextFunction, Request, Response } from "express";
import { Album } from "../models/album";
import {
  BadRequestError,
  NotAuthorizedError,
  AlbumCreatedEvent,
} from "@heaven-nsoft/my-love-common";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { natsWrapper } from "../nats-wrapper";
import { AlbumCreatedEventPublisher } from "../events/publishers/album-created-publisher";

export const userAlbums = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("test");
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log("authHeader", authHeader);
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
      console.log("err", err);
      next(new NotAuthorizedError());
      return;
    }

    if (!decodedToken?.id) {
      console.log("no id");
      next(new NotAuthorizedError());
      return;
    }

    const albums = await Album.find({ user: decodedToken.id }).populate(
      "photos coverPhoto"
    );
    console.log("albums", albums);
    res.status(201).json({
      message: "Album created successfully",
      data: albums,
    });
  } catch (error) {
    console.error("Error creating album:", error);
    next(new BadRequestError((error as Error).message));
  }
};
