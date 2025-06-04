import {
  Publisher,
  Subjects,
  EventPhotoCreatedEvent,
} from "@heaven-nsoft/my-love-common";

export class EventPhotoCreatedPublisher extends Publisher<EventPhotoCreatedEvent> {
  readonly subject = Subjects.EventPhotoCreated;
}
