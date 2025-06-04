import {
  Publisher,
  Subjects,
  EventCreatedEvent,
} from "@heaven-nsoft/my-love-common";

export class EventCreatedEventPublisher extends Publisher<EventCreatedEvent> {
  readonly subject = Subjects.EventCreated;
}
