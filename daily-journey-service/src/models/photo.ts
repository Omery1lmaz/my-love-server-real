import mongoose, { Schema, Document, Model } from "mongoose";

interface Location {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  coordinates?: {
    type: "Point";
    coordinates: [number, number];
  };
}

interface PhotoAttrs {
  user: mongoose.Schema.Types.ObjectId;
  album?: mongoose.Schema.Types.ObjectId | null;
  url: string;
  description?: string;
  tags?: string[];
  isPrivate?: boolean;
  title?: string;
  musicUrl?: string;
  musicDetails?: {
    name: string;
    artist: string;
    album: string;
    albumImage: string;
    spotifyUrl: string;
  };
  note?: string;
  width?: number;
  height?: number;
  location?: Location;
  filterName?: string;
  likes?: number;
  comments?: number;
  fileType?: string;
  photoDate: Date;
  isDeleted?: boolean;
}

interface PhotoDoc extends Document {
  user: mongoose.Schema.Types.ObjectId;
  album: mongoose.Schema.Types.ObjectId | null;
  url: string;
  description: string;
  photoDate: Date;
  tags: string[];
  isPrivate: boolean;
  title: string;
  musicUrl: string;
  musicDetails: {
    name: string;
    artist: string;
    album: string;
    albumImage: string;
    spotifyUrl: string;
  };
  note: string;
  width?: number;
  height?: number;
  location?: Location;
  filterName?: string;
  likes: number;
  comments: number;
  fileType: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface PhotoModel extends Model<PhotoDoc> {
  build(attrs: PhotoAttrs): PhotoDoc;
}

const LocationSchema = new Schema<Location>(
  {
    address: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    postalCode: { type: String },
    coordinates: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
    },
  },
  { _id: false }
);

// ** Fotoğraf Şeması Tanımlama **
const photoSchema = new Schema<PhotoDoc>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    album: { type: Schema.Types.ObjectId, ref: "Album", default: null },
    photoDate: { type: Date, default: new Date(Date.now()) },
    url: { type: String, required: true },
    description: { type: String, default: "" },
    tags: [{ type: String }],
    title: { type: String, default: "", required: true },
    isPrivate: { type: Boolean, default: false },
    musicUrl: { type: String, default: "" },
    musicDetails: {
      name: { type: String, default: "" },
      artist: { type: String, default: "" },
      album: { type: String, default: "" },
      albumImage: { type: String, default: "" },
      spotifyUrl: { type: String, default: "" },
    },
    note: { type: String, default: "" },
    width: { type: Number },
    height: { type: Number },
    location: { type: LocationSchema, default: null }, // **Konum Eklendi**
    filterName: { type: String, default: "" },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    fileType: { type: String, default: "image/jpeg" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ** Fotoğraf Oluşturma Metodu **
photoSchema.statics.build = (attrs: PhotoAttrs) => {
  return new Photo(attrs);
};

// ** Fotoğraf Modelini Oluşturma **
const Photo = mongoose.model<PhotoDoc, PhotoModel>("Photo", photoSchema);

export { Photo };
