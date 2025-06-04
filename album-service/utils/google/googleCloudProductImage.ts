import { Storage } from "@google-cloud/storage";
import { Request } from "express";
import path from "path";
import fs from "fs";

const storage = new Storage({
  keyFilename: path.join(__dirname, "../../google-cloud-key.json"),
});
export const bucket = storage.bucket("bitiklaisparis");

export const getRequestFileAndUpload = async (req: Request) => {
  let imageUrl = "";
  const localFilePath = (req as any).file.path;
  const destination = `products/${Date.now()}-${req.file!!.originalname}`;

  await bucket.upload(localFilePath, {
    destination,
    metadata: {
      contentType: req.file!!.mimetype,
    },
  });

  imageUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;
  fs.unlinkSync(localFilePath);

  return imageUrl;
};
