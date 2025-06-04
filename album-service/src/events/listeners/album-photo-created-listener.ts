import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  AlbumPhotoCreatedEvent as AlbumPhotoCreatedEventHeaven,
} from "@heaven-nsoft/my-love-common";
import { queueGroupName } from "./queue-group-name";
import { Photo } from "../../models/photo";
import { Album } from "../../models/album";
import mongoose from "mongoose";

export class AlbumPhotoCreatedEvent extends Listener<AlbumPhotoCreatedEventHeaven> {
  queueGroupName = queueGroupName;
  subject: Subjects.AlbumPhotoCreated = Subjects.AlbumPhotoCreated;

  async onMessage(data: AlbumPhotoCreatedEventHeaven["data"], msg: Message) {
    try {
      const { photos, coverPhotoId } = data;

      if (!photos || photos.length === 0) {
        console.log("No photos received in event");
        msg.ack();
        return;
      }

      const albumId = photos[0].album;
      if (!albumId) {
        console.log("No album ID found in photos");
        msg.ack();
        return;
      }

      const existingAlbum = await Album.findById(albumId);
      if (!existingAlbum) {
        console.log(`Album not found with ID: ${albumId}`);
        msg.ack();
        return;
      }

      // Save photos
      const savedPhotos = await Promise.all(
        photos.map(async (photo) => {
          try {
            const newPhoto = new Photo({
              _id: new mongoose.Types.ObjectId(photo.id.toString()),
              user: photo.user,
              album: photo.album,
              url: photo.url,
              description: photo.description || "",
              photoDate: photo.photoDate || new Date(),
              tags: photo.tags || [],
              title: photo.title || photo.description || "Untitled Photo",
              isPrivate: photo.isPrivate || false,
              note: photo.note || "",
              musicUrl: photo.musicUrl || "",
              musicDetails: photo.musicDetails || null,
              location: photo.location || null,
              filterName: photo.filterName || "",
              likes: 0,
              comments: 0,
              fileType: photo.fileType || "image/jpeg",
              isDeleted: photo.isDeleted || false,
              width: photo.width || 0,
              height: photo.height || 0,
            });
            return await newPhoto.save();
          } catch (error) {
            console.error(`Error saving photo ${photo.id}:`, error);
            return null;
          }
        })
      );

      // Update album with new photo IDs
      const validPhotoIds = savedPhotos
        .filter((photo): photo is NonNullable<typeof photo> => photo !== null)
        .map((photo) => photo._id);

      existingAlbum.coverPhoto = coverPhotoId;
      existingAlbum.photos = [
        ...existingAlbum.photos,
        ...validPhotoIds,
      ] as mongoose.Schema.Types.ObjectId[];
      await existingAlbum.save();

      console.log(
        `Successfully processed ${validPhotoIds.length} photos for album ${albumId}`
      );
      msg.ack();
    } catch (error) {
      console.error("Error processing album photo created event:", error);
      // Don't ack the message so it can be retried
    }
  }
}
