import {
  Publisher,
  Subjects,
  UserProfilePhotoCreatedEvent,
} from "@heaven-nsoft/my-love-common";

export class UserProfilePhotoCreatedPublisher extends Publisher<UserProfilePhotoCreatedEvent> {
  readonly subject = Subjects.UserProfilePhotoCreated;
}
