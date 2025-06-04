import mongoose from "mongoose";
import { natsWrapper } from "./nats-wrapper";
import { app } from "./app";
import { EventCreatedEvent } from "./events/listeners/event-created-listener";
import { TimelinePhotoCreatedEvent } from "./events/listeners/timeline-photo-created-listener";
const uri =
  "mongodb+srv://omery020040:test123.@cluster0.sje674p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const start = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI must be provided");
    }
    if (!process.env.NATS_CLIENT_ID) {
      throw new Error("NATS_CLIENT_ID must be defined");
    }
    if (!process.env.NATS_URL) {
      throw new Error("NATS_URL must be defined");
    }
    if (!process.env.NATS_CLUSTER_ID) {
      throw new Error("NATS_CLUSTER_ID must be defined");
    }
    if (!process.env.RESET_PASSWORD_SECRET_KEY) {
      throw new Error("RESET_PASSWORD_SECRET_KEY must be defined");
    }
    if (!process.env.SECRET_KEY) {
      throw new Error("SECRET_KEY must be defined");
    }
    try {
      await natsWrapper.connect(
        process.env.NATS_CLUSTER_ID,
        process.env.NATS_CLIENT_ID,
        process.env.NATS_URL
      );
      natsWrapper.client.on("close", () => {
        console.log("NATS connection closed!");
        process.exit();
      });
      console.log("test deneme");
      new EventCreatedEvent(natsWrapper.client).listen();
      new TimelinePhotoCreatedEvent(natsWrapper.client).listen();
      process.on("SIGINT", () => natsWrapper.client.close());
      process.on("SIGTERM", () => natsWrapper.client.close());
    } catch (err) {
      console.error(err);
    }
    try {
      await mongoose.connect(uri);
      console.log("Connected to database !!!");
    } catch (error) {
      console.error("Error connecting to database: ", error);
    }
    app.use((req, res, next) => {
      console.log("Photo service");
      next();
    });
    const listen = app.listen(4009, () => {
      console.log("Timeline service listening on port 4009!");
    });
    listen.on("error", (err) => {
      console.error("Server error: ", err);
    });
  } catch (error) {
    console.log("Something went wrong", error);
  }
};
start();
