import {
  Publisher,
  Subjects,
  AlbumPhotoCreatedEvent,
} from "@heaven-nsoft/my-love-common";

export class AlbumPhotoCreatedPublisher extends Publisher<AlbumPhotoCreatedEvent> {
  readonly subject = Subjects.AlbumPhotoCreated;
}
