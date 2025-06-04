import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// **Interface for required extra ingredient attributes when creating a new extra ingredient**
interface ExtraIngredientAttrs {
  name: string;
  price?: number;
  status?: boolean;
  seller: mongoose.Schema.Types.ObjectId;
}

// **Interface that describes a single extra ingredient document**
interface ExtraIngredientDoc extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  price: number;
  status: boolean;
  seller: mongoose.Schema.Types.ObjectId;
  version: number;
}

// **Interface for the extra ingredient model (with custom static methods)**
interface ExtraIngredientModel extends mongoose.Model<ExtraIngredientDoc> {
  build(attrs: ExtraIngredientAttrs): ExtraIngredientDoc;
}

// **Extra Ingredient Schema Definition**
const extraIngredientSchema = new mongoose.Schema<ExtraIngredientDoc>(
  {
    name: { type: String, required: true },
    price: { type: Number, default: 0 },
    status: { type: Boolean, required: true, default: true },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Seller",
    },
  },
  { timestamps: true }
);

extraIngredientSchema.set("versionKey", "version");
extraIngredientSchema.plugin(updateIfCurrentPlugin);

// **Static method to create an extra ingredient**
extraIngredientSchema.statics.build = (attrs: ExtraIngredientAttrs) => {
  return new ExtraIngredient(attrs);
};

const ExtraIngredient = mongoose.model<
  ExtraIngredientDoc,
  ExtraIngredientModel
>("ExtraIngredient", extraIngredientSchema);

export { ExtraIngredient };
