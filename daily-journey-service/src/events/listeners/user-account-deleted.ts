import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  UserAccountDeletedEvent as UserAccountDeletedEventHeaven,
} from "@heaven-nsoft/my-love-common";
import { queueGroupName } from "./queue-group-name";
import { User } from "../../models/user";

export class UserAccountDeletedEvent extends Listener<UserAccountDeletedEventHeaven> {
  subject: Subjects.UserAccountDeleted = Subjects.UserAccountDeleted;
  queueGroupName = queueGroupName;

  async onMessage(data: UserAccountDeletedEventHeaven["data"], msg: Message) {
    const { id } = data;
    try {
      const updatedUser = await User.findOneAndUpdate(
        {
          _id: id,
        },
        {
          isDeleted: data.deleted,
        }
      );
      console.log("user phone number updated: ", JSON.stringify(updatedUser));
      msg.ack();
    } catch (error) {
      console.error("Error processing event:", error);
    }
  }
}
