import mongoose from "mongoose";
import { natsWrapper } from "./nats-wrapper";
import { app } from "./app";
import { IngredientCreatedEvent } from "./events/listeners/ingredient-created-listener";
import { ExtraIngredientCreatedEvent } from "./events/listeners/extra-ingredient-created-listener";
import { ModifierGroupCreatedEvent } from "./events/listeners/modifier-group-created-listener";
import { SellerCreatedEvent } from "./events/listeners/seller-created-listener";
import { CategoryCreatedEvent } from "./events/listeners/category-created-listener";
import { AlbumPhotoCreatedEvent } from "./events/listeners/album-photo-created-listener";
const uri =
  "mongodb+srv://omery020040:ULpV2k5v6HFVzAmz@cluster0.rdyoi6l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
      new IngredientCreatedEvent(natsWrapper.client).listen();
      new ExtraIngredientCreatedEvent(natsWrapper.client).listen();
      new ModifierGroupCreatedEvent(natsWrapper.client).listen();
      new SellerCreatedEvent(natsWrapper.client).listen();
      new CategoryCreatedEvent(natsWrapper.client).listen();
      new AlbumPhotoCreatedEvent(natsWrapper.client).listen();
      process.on("SIGINT", () => natsWrapper.client.close());
      process.on("SIGTERM", () => natsWrapper.client.close());
    } catch (err) {
      console.error(err);
    }
    try {
      await mongoose.connect(uri, {
        ssl: true,
        tls: true,
        tlsAllowInvalidCertificates: true,
        tlsAllowInvalidHostnames: true,
        retryWrites: true,
        w: "majority",
      });
      console.log("Connected to database !!!");
    } catch (error) {
      console.error("Error connecting to database: ", error);
    }
    app.use((req, res, next) => {
      console.log("Album service");
      next();
    });
    const listen = app.listen(4007, () => {
      console.log("Album service listening on port 4007!");
    });
    listen.on("error", (err) => {
      console.error("Server error: ", err);
    });
  } catch (error) {
    console.log("Something went wrong", error);
  }
};
start();
