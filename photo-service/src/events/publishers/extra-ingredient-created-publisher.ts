import {
  Publisher,
  Subjects,
  ExtraIngredientCreatedEvent,
} from "@heaven-nsoft/common";

export class ExtraIngredientCreatedPublisher extends Publisher<ExtraIngredientCreatedEvent> {
  readonly subject = Subjects.ExtraIngredientCreated;
}
