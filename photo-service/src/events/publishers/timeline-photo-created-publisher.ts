import {
  Publisher,
  Subjects,
  TimelinePhotoCreatedEvent,
} from "@heaven-nsoft/my-love-common";

export class TimelinePhotoCreatedPublisher extends Publisher<TimelinePhotoCreatedEvent> {
  readonly subject = Subjects.TimelinePhotoCreated;
}
