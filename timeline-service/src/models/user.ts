import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// ** Kullanıcı Özellikleri (Giriş Verileri) **
interface UserAttrs {
  name: string;
  email: string;
  birthDate?: Date;
  profilePic?: string;
  partnerId?: mongoose.Schema.Types.ObjectId | null;
  relationshipStartDate?: Date | null;
  status?: "single" | "in_relationship" | "married";
  provider: "email" | "google";
  googleId?: string;
  mood?: "happy" | "sad" | "neutral" | "excited";
  favoriteSongs?: mongoose.Schema.Types.ObjectId[];
  subscriptionType?: "free" | "premium";
  isActive: boolean;
  version: number;
  isDeleted: boolean;
}

// ** Kullanıcı Modeli (Veritabanı Dokümanı) **
interface UserDoc extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  email: string;
  birthDate?: Date;
  profilePic?: string;
  partnerId?: mongoose.Schema.Types.ObjectId | null;
  relationshipStartDate?: Date | null;
  status?: "single" | "in_relationship" | "married";
  provider: "email" | "google";
  googleId?: string;
  mood?: "happy" | "sad" | "neutral" | "excited";
  favoriteSongs?: mongoose.Schema.Types.ObjectId[];
  subscriptionType?: "free" | "premium";
  isActive: boolean;
  version: number;
  isDeleted: boolean;
}

// ** Kullanıcı Modeli için Static Metotlar **
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// ** Kullanıcı Şeması Tanımlama **
const userSchema = new mongoose.Schema<UserDoc>(
  {
    googleId: { type: String },
    isActive: { type: Boolean, default: false, required: true },
    provider: {
      type: String,
      required: true,
      enum: ["email", "google"],
      default: "email",
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    birthDate: { type: Date, required: false },
    profilePic: { type: String, default: "" },
    partnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    relationshipStartDate: { type: Date, default: null },
    status: {
      type: String,
      enum: ["single", "in_relationship", "married"],
      default: "single",
    },
    mood: {
      type: String,
      enum: ["happy", "sad", "neutral", "excited"],
      default: "neutral",
    },
    favoriteSongs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
    subscriptionType: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ** Kullanıcı Oluşturma Metodu **
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// ** Versiyonlama için Plugin Ekleme **
userSchema.set("versionKey", "version");
userSchema.plugin(updateIfCurrentPlugin);

// ** Kullanıcı Modelini Oluşturma **
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
