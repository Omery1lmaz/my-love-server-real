import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// **Interface for required seller attributes when creating a new seller**
interface SellerAttrs {
  isTakeAway?: boolean;
  name: string;
  storeName?: string;
  mersisNumber?: string;
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  commissionPercentage?: number;
  bankAccountNumber?: string;
  bankAccountOwnerName?: string;
  taxOffice?: string;
  companyTitle?: string;
  taxNumber?: string;
  companyType?: string;
  email: string;
  number: string;
  address?: {
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  isAdmin?: boolean;
  isWorking?: boolean;
  isSeller?: boolean;
  isActive?: boolean;
  isDeleted?: boolean;
  imageUrl?: string;
  orderCompletedDate?: Date;
  waiter?: mongoose.Schema.Types.ObjectId;
  kitchenCategory?: mongoose.Schema.Types.ObjectId[];
}

// **Interface that describes a single seller document**
interface SellerDoc extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  isTakeAway: boolean;
  name: string;
  storeName?: string;
  mersisNumber?: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  commissionPercentage: number;
  bankAccountNumber?: string;
  bankAccountOwnerName?: string;
  taxOffice?: string;
  companyTitle?: string;
  taxNumber?: string;
  companyType?: string;
  email: string;
  number: string;
  address?: {
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  isAdmin: boolean;
  isWorking: boolean;
  isSeller: boolean;
  isActive: boolean;
  isDeleted: boolean;
  imageUrl: string;
  orderCompletedDate?: Date;
  waiter?: mongoose.Schema.Types.ObjectId;
  kitchenCategory?: mongoose.Schema.Types.ObjectId[];
  version: number;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

// **Interface for the seller model (with custom static methods)**
interface SellerModel extends mongoose.Model<SellerDoc> {
  build(attrs: SellerAttrs): SellerDoc;
}

// **Seller Schema Definition**
const sellerSchema = new mongoose.Schema<SellerDoc>(
  {
    isTakeAway: { type: Boolean, required: true, default: false },
    name: { type: String, required: true },
    storeName: { type: String },
    mersisNumber: { type: String },
    location: {
      type: { type: String, enum: ["Point"], default: "Point", required: true },
      coordinates: { type: [Number], required: true },
    },
    commissionPercentage: { type: Number, required: true, default: 6 },
    bankAccountNumber: { type: String },
    bankAccountOwnerName: { type: String },
    taxOffice: { type: String },
    companyTitle: { type: String },
    taxNumber: { type: String },
    companyType: { type: String },
    email: { type: String, required: true, unique: true },
    number: { type: String, required: true, unique: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    isAdmin: { type: Boolean, required: true, default: false },
    isWorking: { type: Boolean, required: true, default: false },
    isSeller: { type: Boolean, required: true, default: true },
    isActive: { type: Boolean, required: true, default: false },
    isDeleted: { type: Boolean, required: true, default: false },
    imageUrl: {
      type: String,
      required: true,
      default:
        "https://image.shutterstock.com/image-vector/male-buyer-seller-store-payment-260nw-1385890529.jpg",
    },
    orderCompletedDate: { type: Date },
    waiter: { type: mongoose.Schema.Types.ObjectId, ref: "Waiter" },
    kitchenCategory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Kitchen" }],
  },
  { timestamps: true, autoIndex: true }
);

sellerSchema.index({ location: "2dsphere" });
sellerSchema.set("versionKey", "version");
sellerSchema.plugin(updateIfCurrentPlugin);

sellerSchema.statics.build = (attrs: SellerAttrs) => {
  return new Seller(attrs);
};

const Seller = mongoose.model<SellerDoc, SellerModel>("Seller", sellerSchema);

export { Seller };
