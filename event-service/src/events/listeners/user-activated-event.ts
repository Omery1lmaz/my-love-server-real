import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  UserActivatedEvent as UserActivatedEventHeaven,
} from "@heaven-nsoft/my-love-common";
import { queueGroupName } from "./queue-group-name";
import { User } from "../../models/user";

export class UserActivatedEvent extends Listener<UserActivatedEventHeaven> {
  subject: Subjects.UserActivated = Subjects.UserActivated;
  queueGroupName = queueGroupName;

  async onMessage(data: UserActivatedEventHeaven["data"], msg: Message) {
    const { id } = data;
    try {
      const updatedUser = await User.findOneAndUpdate(
        {
          _id: id,
          email: data.email,
        },
        {
          isActive: data.isActive,
        }
      );
      console.log("user updated: ", JSON.stringify(updatedUser));
      msg.ack();
    } catch (error) {
      console.error("Error processing event:", error);
    }
  }
}
