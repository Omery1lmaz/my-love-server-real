import mongoose from "mongoose";
import { natsWrapper } from "./nats-wrapper";
import { app } from "./app";
import { UserCreatedEvent } from "./events/listeners/user-created-listener";
import { AlbumCreatedEvent } from "./events/listeners/album-created-listener";
import { EventCreatedEvent } from "./events/listeners/event-created-listener";
import { TimelineCreatedEvent } from "./events/listeners/timeline-created-listener";
const uri =
  "mongodb+srv://omery020040:SLNNOW328yxUcyfB@cluster0.w2t78ou.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
      new UserCreatedEvent(natsWrapper.client).listen();
      new AlbumCreatedEvent(natsWrapper.client).listen();
      new EventCreatedEvent(natsWrapper.client).listen();
      new TimelineCreatedEvent(natsWrapper.client).listen();
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
    const listen = app.listen(4002, () => {
      console.log("Photo service listening on port 4002!");
    });
    listen.on("error", (err) => {
      console.error("Server error: ", err);
    });
  } catch (error) {
    console.log("Something went wrong", error);
  }
};

start();
