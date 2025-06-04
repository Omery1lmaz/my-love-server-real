import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  ModifierGroupCreatedEvent as ModifierGroupCreatedEventHeaven,
} from "@heaven-nsoft/common";
import { queueGroupName } from "./queue-group-name";
import { ModifierGroup } from "../../models/modifierGroup";

export class ModifierGroupCreatedEvent extends Listener<ModifierGroupCreatedEventHeaven> {
  queueGroupName = queueGroupName;
  subject: Subjects.ModifierGroupCreated = Subjects.ModifierGroupCreated;

  async onMessage(data: ModifierGroupCreatedEventHeaven["data"], msg: Message) {
    const { id } = data;
    try {
      console.log("data", data);
      const existingModifierGroup = await ModifierGroup.findById(id);

      if (existingModifierGroup) {
        console.log("Ingredient already exists, skipping event");
        return msg.ack();
      }
      const newModifierGroup = await ModifierGroup.create({ _id: id, ...data });
      console.log(newModifierGroup, "new ingredient created");
      const modifierGroups = await ModifierGroup.find();
      console.log(
        "all modifierGroups after creating new one",
        JSON.stringify(modifierGroups)
      );
      msg.ack();
    } catch (error) {
      console.error("Error processing event:", error);
    }
  }
}
