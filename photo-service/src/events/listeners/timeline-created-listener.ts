import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  TimelineCreatedEvent as TimelineCreatedEventHeaven,
} from "@heaven-nsoft/my-love-common";
import { queueGroupName } from "./queue-group-name";
import { User } from "../../models/user";
import { Album } from "../../models/album";
import { Timeline } from "../../models/timeline";

export class TimelineCreatedEvent extends Listener<TimelineCreatedEventHeaven> {
  subject: Subjects.TimelineCreated = Subjects.TimelineCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TimelineCreatedEventHeaven["data"], msg: Message) {
    try {
      const newTimeline = new Timeline({
        _id: data.id,
        ...data,
      });
      await newTimeline.save();
      console.log("timeline created: ", JSON.stringify(newTimeline));
      msg.ack();
    } catch (error) {
      console.error("Error processing event:", error);
    }
  }
}
