import {
  Publisher,
  Subjects,
  AlbumCreatedEvent,
} from "@heaven-nsoft/my-love-common";

export class AlbumCreatedEventPublisher extends Publisher<AlbumCreatedEvent> {
  readonly subject = Subjects.AlbumCreated;
}
