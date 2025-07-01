import mongoose from "mongoose";
import { natsWrapper } from "./nats-wrapper";
import { app } from "./app";
import { UserPhotoCreatedEvent } from "./events/listeners/user-photo-created-listener";
const uri =
  "mongodb+srv://omery020040:4YHnA68V7SOwBAAm@cluster0.svjeglz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
      console.log("RESET_PASSWORD_SECRET_KEY must be defined");
      throw new Error("SECRET_KEY must be defined");
    }
    if (!process.env.GOOGLE_CLIENT_ID) {
      console.log("GOOGLE_CLIENT_ID must be defined");
      throw new Error("GOOGLE_CLIENT_ID must be defined");
    }
    if (!process.env.GOOGLE_CLIENT_SECRET) {
      console.log("GOOGLE_CLIENT_SECRET must be defined");
      throw new Error("GOOGLE_CLIENT_SECRET must be defined");
    }

    // MongoDB bağlantı seçenekleri
    const mongooseOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    try {
      await natsWrapper.connect(
        process.env.NATS_CLUSTER_ID,
        process.env.NATS_CLIENT_ID,
        process.env.NATS_URL
      );
      natsWrapper.client.on("close", () => {
        console.log("NATS connection closed!");
        console.log("");
        process.exit();
      });

      process.on("SIGINT", () => natsWrapper.client.close());
      process.on("SIGTERM", () => natsWrapper.client.close());
    } catch (err) {
      console.error(err);
    }
    new UserPhotoCreatedEvent(natsWrapper.client).listen();

    try {
      await mongoose.connect(uri, { timeoutMS: 10000 });
      console.log("Connected to MongoDB successfully!");
    } catch (error) {
      console.error("Error connecting to MongoDB: ", error);
      throw error;
    }

    app.use((req, res, next) => {
      console.log("Auth service");
      next();
    });

    const listen = app.listen(3000, () => {
      console.log("Auth service listening on port 3000!");
    });

    listen.on("error", (err) => {
      console.error("Server error: ", err);
    });
  } catch (error) {
    console.error("Something went wrong", error);
  }
};

start();
