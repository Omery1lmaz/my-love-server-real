import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  OrderCreatedEvent,
  ExtraIngredientCreatedEvent as ExtraIngredientCreatedEventHeaven,
} from "@heaven-nsoft/common";
import { queueGroupName } from "./queue-group-name";
import { ExtraIngredient } from "../../models/extraIngredient";

export class ExtraIngredientCreatedEvent extends Listener<ExtraIngredientCreatedEventHeaven> {
  queueGroupName = queueGroupName;
  subject: Subjects.ExtraIngredientCreated = Subjects.ExtraIngredientCreated;

  async onMessage(
    data: ExtraIngredientCreatedEventHeaven["data"],
    msg: Message
  ) {
    const { id } = data;
    try {
      console.log("data", data);
      const existingIngredient = await ExtraIngredient.findById(id);

      if (existingIngredient) {
        console.log("Ingredient already exists, skipping event");
        return msg.ack();
      }
      const newIngredient = await ExtraIngredient.create({ _id: id, ...data });
      console.log(newIngredient, "new ingredient created");
      const ingredients = await ExtraIngredient.find();
      console.log(
        "all ingredients after creating new one",
        JSON.stringify(ingredients)
      );
      msg.ack();
    } catch (error) {
      console.error("Error processing event:", error);
    }
  }
}
