import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  SellerCreatedEvent as SellerCreatedEventHeaven,
} from "@heaven-nsoft/common";
import { queueGroupName } from "./queue-group-name";
import { Seller } from "../../models/seller";

export class SellerCreatedEvent extends Listener<SellerCreatedEventHeaven> {
  queueGroupName = queueGroupName;
  subject: Subjects.SellerCreated = Subjects.SellerCreated;

  async onMessage(data: SellerCreatedEventHeaven["data"], msg: Message) {
    const { id } = data;
    console.log(id, "id");
    try {
      const existingSeller = await Seller.findById(id);

      if (existingSeller) {
        console.log("Ingredient already exists, skipping event");
        return msg.ack();
      }
      const newSeller = await Seller.create({ _id: id, ...data });
      console.log(newSeller, "new ingredient created");
      const sellers = await Seller.find();
      console.log(
        "all sellers after creating new one",
        JSON.stringify(sellers)
      );
      msg.ack();
    } catch (error) {
      console.error("Error processing event:", error);
    }
  }
}
