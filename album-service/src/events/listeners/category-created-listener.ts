import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  CategoryCreatedEvent as CategoryCreatedEventHeaven,
} from "@heaven-nsoft/common";
import { queueGroupName } from "./queue-group-name";
import { Category } from "../../models/category";

export class CategoryCreatedEvent extends Listener<CategoryCreatedEventHeaven> {
  queueGroupName = queueGroupName;
  subject: Subjects.CategoryCreated = Subjects.CategoryCreated;

  async onMessage(data: CategoryCreatedEventHeaven["data"], msg: Message) {
    const { id } = data;
    try {
      console.log("data", data);
      const existingCategory = await Category.findById(id);

      if (existingCategory) {
        console.log("Ingredient already exists, skipping event");
        return msg.ack();
      }
      const newCategory = await Category.create({ _id: id, ...data });
      console.log(newCategory, "new ingredient created");
      const categories = await Category.find();
      console.log(
        "all categories after creating new one",
        JSON.stringify(categories)
      );
      msg.ack();
    } catch (error) {
      console.error("Error processing event:", error);
    }
  }
}
