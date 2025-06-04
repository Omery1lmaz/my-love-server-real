import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  TimelinePhotoCreatedEvent as TimelinePhotoCreatedEventHeaven,
} from "@heaven-nsoft/my-love-common";
import { queueGroupName } from "./queue-group-name";
import { Photo } from "../../models/photo";
import mongoose from "mongoose";
import { Timeline } from "../../models/timeline";

export class TimelinePhotoCreatedEvent extends Listener<TimelinePhotoCreatedEventHeaven> {
  queueGroupName = queueGroupName;
  subject: Subjects.TimelinePhotoCreated = Subjects.TimelinePhotoCreated;

  async onMessage(data: TimelinePhotoCreatedEventHeaven["data"], msg: Message) {
    try {
      const { photos, coverPhotoId } = data;

      if (!photos || photos.length === 0) {
        console.log("No photos received in event");
        msg.ack();
        return;
      }

      const timelineId = photos[0].timeline;
      if (!timelineId) {
        console.log("No timeline ID found in photos");
        msg.ack();
        return;
      }

      const existingTimeline = await Timeline.findById(timelineId);
      if (!existingTimeline) {
        console.log(`Timeline not found with ID: ${timelineId}`);
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
              timeline: photo.timeline,
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

      // Update timeline with new photo IDs
      const validPhotoIds = savedPhotos
        .filter((photo): photo is NonNullable<typeof photo> => photo !== null)
        .map((photo) => photo._id);

      if (coverPhotoId) {
        existingTimeline.coverPhotoId = new mongoose.Types.ObjectId(
          coverPhotoId.toString()
        );
      } else {
        existingTimeline.coverPhotoId = undefined;
      }

      if (existingTimeline.photos) {
        existingTimeline.photos = [
          ...existingTimeline.photos,
          ...validPhotoIds,
        ] as mongoose.Types.ObjectId[];
      } else {
        existingTimeline.photos = validPhotoIds as mongoose.Types.ObjectId[];
      }

      await existingTimeline.save();

      console.log(
        `Successfully processed ${validPhotoIds.length} photos for timeline ${timelineId}`
      );
      msg.ack();
    } catch (error) {
      console.error("Error processing timeline photo created event:", error);
      // Don't ack the message so it can be retried
    }
  }
}
