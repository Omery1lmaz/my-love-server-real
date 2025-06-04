import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  EventPhotoCreatedEvent as EventPhotoCreatedEventHeaven,
} from "@heaven-nsoft/my-love-common";
import { queueGroupName } from "./queue-group-name";
import { Event, Photo } from "../../models";
import mongoose from "mongoose";

export class EventPhotoCreatedEvent extends Listener<EventPhotoCreatedEventHeaven> {
  subject: Subjects.EventPhotoCreated = Subjects.EventPhotoCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: EventPhotoCreatedEventHeaven["data"], msg: Message) {
    const { coverPhotoId, photos } = data;
    console.log(coverPhotoId, photos, "coverPhotoId, photos");
    try {
      const updatedEvent = await Event.findById(photos[0].event);
      if (!updatedEvent) {
        return msg.ack();
      }
      photos.forEach(async (photo) => {
        await Photo.create({
          ...photo,
          event: updatedEvent._id,
          _id: photo.id,
        });
      });
      updatedEvent.coverPhotoId = new mongoose.Types.ObjectId(
        coverPhotoId as unknown as string
      );
      updatedEvent.photos = photos.map(
        (photo) => photo.id as unknown as mongoose.Types.ObjectId
      );
      await updatedEvent.save();
      console.log("Event updated", JSON.stringify(updatedEvent));
      msg.ack();
    } catch (error) {
      console.error("Error processing event:", error);
    }
  }
}
