import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// **Interface for required ingredient attributes when creating a new ingredient**
interface IngredientAttrs {
  name: string;
  price?: number;
  status?: boolean;
  seller: mongoose.Schema.Types.ObjectId;
}

// **Interface that describes a single ingredient document**
interface IngredientDoc extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  price: number;
  status: boolean;
  seller: mongoose.Schema.Types.ObjectId;
  version: number;
}

// **Interface for the ingredient model (with custom static methods)**
interface IngredientModel extends mongoose.Model<IngredientDoc> {
  build(attrs: IngredientAttrs): IngredientDoc;
}

// **Ingredient Schema Definition**
const ingredientSchema = new mongoose.Schema<IngredientDoc>(
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

ingredientSchema.set("versionKey", "version");
ingredientSchema.plugin(updateIfCurrentPlugin);
// **Static method to create an ingredient**
ingredientSchema.statics.build = (attrs: IngredientAttrs) => {
  return new Ingredient(attrs);
};

const Ingredient = mongoose.model<IngredientDoc, IngredientModel>(
  "Ingredient",
  ingredientSchema
);

export { Ingredient };
