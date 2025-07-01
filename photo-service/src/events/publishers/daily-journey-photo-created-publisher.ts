import {
  Publisher,
  Subjects,
  DailyJournalPhotoCreatedEvent
} from "@heaven-nsoft/my-love-common";

export class DailyJourneyPhotoCreatedPublisher extends Publisher<DailyJournalPhotoCreatedEvent> {
  readonly subject = Subjects.DailyJournalPhotoCreated;
}
