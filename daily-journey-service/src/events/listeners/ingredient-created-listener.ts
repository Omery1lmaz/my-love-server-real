import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  OrderCreatedEvent,
  IngredientCreatedEvent as IngredientCreatedEventHeaven,
} from "@heaven-nsoft/common";
import { queueGroupName } from "./queue-group-name";
import mongoose from "mongoose";
import { Ingredient } from "../../models/ingredient";

export class IngredientCreatedEvent extends Listener<IngredientCreatedEventHeaven> {
  queueGroupName = queueGroupName;
  subject: Subjects.IngredientCreated = Subjects.IngredientCreated;

  async onMessage(data: IngredientCreatedEventHeaven["data"], msg: Message) {
    const { id } = data;
    try {
      const existingIngredient = await Ingredient.findById(id);

      if (existingIngredient) {
        console.log("Ingredient already exists, skipping event");
        return msg.ack();
      }

      const newIngredient = await Ingredient.create({ _id: id, ...data });
      console.log(newIngredient, "new ingredient created");
      const ingredients = await Ingredient.find();
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
