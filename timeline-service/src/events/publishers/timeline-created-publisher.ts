import {
  Publisher,
  Subjects,
  TimelineCreatedEvent,
} from "@heaven-nsoft/my-love-common";

export class TimelineCreatedPublisher extends Publisher<TimelineCreatedEvent> {
  readonly subject = Subjects.TimelineCreated;
}
