import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  TimelinePhotoCreatedEvent as TimelinePhotoCreatedEventHeaven,
} from "@heaven-nsoft/my-love-common";
import { queueGroupName } from "./queue-group-name";
import { Photo } from "../../models/photo";
import mongoose from "mongoose";
import { Timeline } from "../../models/timeline";

export class TimelinePhotoCreatedEvent extends Listener<TimelinePhotoCreatedEventHeaven> {
  queueGroupName = queueGroupName;
  subject: Subjects.TimelinePhotoCreated = Subjects.TimelinePhotoCreated;

  async onMessage(data: TimelinePhotoCreatedEventHeaven["data"], msg: Message) {
    console.log("🔄 Timeline Photo Created Event Started");
    console.log("📊 Event Data:", JSON.stringify(data, null, 2));

    try {
      const { photos, coverPhotoId } = data;

      if (!photos || photos.length === 0) {
        console.log("❌ No photos received in event");
        console.log("📝 Acknowledging message due to no photos");
        msg.ack();
        return;
      }

      console.log(`📸 Processing ${photos.length} photos`);
      console.log("🆔 Cover Photo ID:", coverPhotoId);

      const timelineId = photos[0].timeline;
      if (!timelineId) {
        console.log("❌ No timeline ID found in photos");
        console.log("📝 Acknowledging message due to missing timeline ID");
        msg.ack();
        return;
      }

      console.log("🔍 Looking for timeline with ID:", timelineId);

      const existingTimeline = await Timeline.findById(timelineId);
      if (!existingTimeline) {
        console.log(`❌ Timeline not found with ID: ${timelineId}`);
        console.log("📝 Acknowledging message due to timeline not found");
        msg.ack();
        return;
      }

      console.log("✅ Timeline found:", existingTimeline.title || "Untitled");

      // Save photos
      console.log("💾 Starting to save photos...");
      const savedPhotos = await Promise.all(
        photos.map(async (photo, index) => {
          try {
            console.log(`📷 Saving photo ${index + 1}/${photos.length}:`, photo.id);

            const newPhoto = new Photo({
              _id: new mongoose.Types.ObjectId((photo.id as unknown as string)),
              user: photo.user,
              timeline: photo.timeline,
              url: photo.url,
              description: photo.description || "",
              photoDate: photo.photoDate || new Date(),
              tags: photo.tags || [],
              title: photo.title || photo.description || "Untitled Photo",
              isPrivate: photo.isPrivate || false,
              note: photo.note || "",
              musicUrl: photo.musicUrl || "",
              musicDetails: photo.musicDetails || null,
              location: photo.location || null,
              filterName: photo.filterName || "",
              likes: 0,
              comments: 0,
              fileType: photo.fileType || "image/jpeg",
              isDeleted: photo.isDeleted || false,
              width: photo.width || 0,
              height: photo.height || 0,
            });

            const savedPhoto = await newPhoto.save();
            console.log(`✅ Photo ${index + 1} saved successfully:`, savedPhoto._id);
            return savedPhoto;
          } catch (error) {
            console.error(`❌ Error saving photo ${index + 1} (ID: ${photo.id}):`, error);
            console.error("📋 Photo data that failed:", JSON.stringify(photo, null, 2));
            return null;
          }
        })
      );

      // Update timeline with new photo IDs
      const validPhotoIds = savedPhotos
        .filter((photo): photo is NonNullable<typeof photo> => photo !== null)
        .map((photo) => photo._id);

      console.log(`📊 Successfully saved ${validPhotoIds.length}/${photos.length} photos`);
      console.log("🆔 Valid Photo IDs:", validPhotoIds.map(id => (id as any).toString()));

      if (coverPhotoId) {
        console.log("🖼️ Setting cover photo ID:", coverPhotoId);
        existingTimeline.coverPhotoId = new mongoose.Types.ObjectId(
          (coverPhotoId as unknown as string)
        );
      } else if (validPhotoIds.length > 0) {
        console.log("🖼️ No cover photo ID provided, using first photo");
        existingTimeline.coverPhotoId = validPhotoIds[0] as any;
      }

      console.log("📝 Updating timeline photos array...");
      if (existingTimeline.photos && Array.isArray(existingTimeline.photos)) {
        const previousCount = existingTimeline.photos.length;
        existingTimeline.photos = [
          ...existingTimeline.photos,
          ...validPhotoIds,
        ] as mongoose.Types.ObjectId[];
        console.log(`📈 Timeline photos updated: ${previousCount} → ${existingTimeline.photos.length}`);
      } else {
        existingTimeline.photos = validPhotoIds as mongoose.Types.ObjectId[];
        console.log(`📈 Timeline photos initialized: ${existingTimeline.photos.length} photos`);
      }

      await existingTimeline.save();
      console.log("✅ Timeline updated successfully");

      console.log("🎉 SUCCESS: Timeline photo created event processed successfully");
      console.log(`📊 Summary: ${validPhotoIds.length} photos added to timeline ${timelineId}`);
      console.log("📝 Acknowledging message");
      msg.ack();

    } catch (error) {
      console.error("💥 CRITICAL ERROR in timeline photo created event:");
      console.error("🔍 Error details:", error);
      console.error("📋 Event data that caused error:", JSON.stringify(data, null, 2));
      console.error("📝 NOT acknowledging message - will retry");

      // Log additional context for debugging
      if (error instanceof Error) {
        console.error("📚 Error name:", error.name);
        console.error("📚 Error message:", error.message);
        console.error("📚 Error stack:", error.stack);
      }

      // Don't ack the message so it can be retried
    }
  }
}
