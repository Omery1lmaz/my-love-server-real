import { Publisher, Subjects, ProductCreatedEvent } from "@heaven-nsoft/common";

export class ProductCreatedPublisher extends Publisher<ProductCreatedEvent> {
  readonly subject = Subjects.ProductCreated;
}
