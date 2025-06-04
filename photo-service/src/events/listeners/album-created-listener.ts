import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  AlbumCreatedEvent as AlbumCreatedEventHeaven,
} from "@heaven-nsoft/my-love-common";
import { queueGroupName } from "./queue-group-name";
import { User } from "../../models/user";
import { Album } from "../../models/album";

export class AlbumCreatedEvent extends Listener<AlbumCreatedEventHeaven> {
  subject: Subjects.AlbumCreated = Subjects.AlbumCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: AlbumCreatedEventHeaven["data"], msg: Message) {
    try {
      const newAlbum = new Album({
        _id: data.id,
        ...data,
      });
      await newAlbum.save();
      console.log("album created: ", JSON.stringify(newAlbum));
      msg.ack();
    } catch (error) {
      console.error("Error processing event:", error);
    }
  }
}
