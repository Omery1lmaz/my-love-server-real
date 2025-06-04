import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  UserPartnerUpdatedEvent as UserPartnerUpdatedEventHeaven,
} from "@heaven-nsoft/my-love-common";
import { queueGroupName } from "./queue-group-name";
import { User } from "../../models/user";

export class UserPartnerUpdatedEvent extends Listener<UserPartnerUpdatedEventHeaven> {
  subject: Subjects.UserPartnerUpdated = Subjects.UserPartnerUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: UserPartnerUpdatedEventHeaven["data"], msg: Message) {
    const { userId, partnerId } = data;
    console.log(userId, partnerId, "id");
    try {
      const existingUser = await User.findByIdAndUpdate(userId, {
        partnerId,
      });
      console.log(existingUser, "existingUser");
      msg.ack();
    } catch (error) {
      console.error("Error processing event:", error);
    }
  }
}
