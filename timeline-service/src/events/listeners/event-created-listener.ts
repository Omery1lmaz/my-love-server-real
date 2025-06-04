import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  EventCreatedEvent as EventCreatedEventHeaven,
} from "@heaven-nsoft/my-love-common";
import { queueGroupName } from "./queue-group-name";
import { Event } from "../../models/event";

export class EventCreatedEvent extends Listener<EventCreatedEventHeaven> {
  subject: Subjects.EventCreated = Subjects.EventCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: EventCreatedEventHeaven["data"], msg: Message) {
    try {
      const newEvent = new Event({
        _id: data.id,
        ...data,
      });
      await newEvent.save();
      console.log("event created: ", JSON.stringify(newEvent));
      msg.ack();
    } catch (error) {
      console.error("Error processing event:", error);
    }
  }
}
