import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  DailyJournalPhotoCreatedEvent as DailyJournalPhotoCreatedEventHeaven,
} from "@heaven-nsoft/my-love-common";
import { queueGroupName } from "./queue-group-name";
import { Photo } from "../../models/photo";
import mongoose from "mongoose";
import { DailyJournal } from "../../models/dailyJournal";

export class DailyJournalPhotoCreatedEvent extends Listener<DailyJournalPhotoCreatedEventHeaven> {
  queueGroupName = queueGroupName;
  subject: Subjects.DailyJournalPhotoCreated = Subjects.DailyJournalPhotoCreated;

  async onMessage(data: DailyJournalPhotoCreatedEventHeaven["data"], msg: Message) {
    try {
      const { photos, coverPhotoId } = data;

      if (!photos || photos.length === 0) {
        console.log("No photos received in event");
        msg.ack();
        return;
      }

      const dailyJourneyId = photos[0].dailyJournay;
      if (!dailyJourneyId) {
        console.log("No dailyJourney ID found in photos");
        msg.ack();
        return;
      }

      const existingDailyJourney = await DailyJournal.findById(dailyJourneyId);
      if (!existingDailyJourney) {
        console.log(`Album not found with ID: ${dailyJourneyId}`);
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
              album: null,
              dailyJournal: photo.dailyJournay,
              url: photo.url,
              description: photo.description || "",
              photoDate: photo.photoDate || new Date(),
              tags: photo.tags || [],
              title: photo.title || photo.description || "Untitled Photo",
              isPrivate: photo.isPrivate || false,
              note: photo.note || "",
              musicUrl: photo.musicUrl || "",
              musicDetails: photo.musicDetails || null,
              thumbnailUrl: photo.thumbnailUrl,
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

      existingDailyJourney.coverPhoto = coverPhotoId;
      existingDailyJourney.photos = [
        ...existingDailyJourney.photos,
        ...validPhotoIds,
      ] as mongoose.Schema.Types.ObjectId[];
      await existingDailyJourney.save();

      console.log(
        `Successfully processed ${validPhotoIds.length} photos for dailyJourney ${dailyJourneyId}`
      );
      msg.ack();
    } catch (error) {
      console.error("Error processing album photo created event:", error);
      // Don't ack the message so it can be retried
    }
  }
}
