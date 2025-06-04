import mongoose from "mongoose";
import { natsWrapper } from "./nats-wrapper";
import { app } from "./app";
import listenNatsEvents from "./utils/nats/listener/natsListeners";
import { UserCreatedEvent } from "./events/listeners/user-created-listener";
import { UserPartnerUpdatedEvent } from "./events/listeners/user-partner-updated-listener";
import { UserAccountDeletedEvent } from "./events/listeners/user-account-deleted";
import { UserActivatedEvent } from "./events/listeners/user-activated-event";
import { EventPhotoCreatedEvent } from "./events/listeners/event-photo-created-listener";
import "./models"; // Import models to ensure they are registered

const uri =
  "mongodb+srv://omery020040:LXLaateDIwXjkK6L@cluster0.xg3g6o1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const start = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI must be provided event-service");
    }
    if (!process.env.NATS_CLIENT_ID) {
      throw new Error("NATS_CLIENT_ID must be defined event-service");
    }
    if (!process.env.NATS_URL) {
      throw new Error("NATS_URL must be defined event-service");
    }
    if (!process.env.NATS_CLUSTER_ID) {
      throw new Error("NATS_CLUSTER_ID must be defined event-service");
    }
    try {
      await natsWrapper.connect(
        process.env.NATS_CLUSTER_ID,
        process.env.NATS_CLIENT_ID,
        process.env.NATS_URL
      );
      natsWrapper.client.on("close", () => {
        console.log("NATS connection closed! event-service");
        process.exit();
      });
      new UserActivatedEvent(natsWrapper.client).listen();
      new UserAccountDeletedEvent(natsWrapper.client).listen();
      new UserCreatedEvent(natsWrapper.client).listen();
      new UserPartnerUpdatedEvent(natsWrapper.client).listen();
      new EventPhotoCreatedEvent(natsWrapper.client).listen();
      process.on("SIGINT", () => natsWrapper.client.close());
      process.on("SIGTERM", () => natsWrapper.client.close());
    } catch (err) {
      console.error(err);
    }
    try {
      await mongoose.connect(uri);
      console.log("Connected to database event-service !!!");
    } catch (error) {
      console.error("Error connecting to database: event-service ", error);
    }

    app.listen(4000, (err) => {
      if (!err) console.log("Event service listening on port 4000 !!!");
    });
  } catch (error) {
    console.log("Something went wrong", error);
  }
};
start();
