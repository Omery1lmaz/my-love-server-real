import mongoose, { Schema, Document, Model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// **Interface for required attributes when creating a new category**
interface CategoryAttrs {
  name: string;
  description?: string;
  isActive: boolean;
  user: mongoose.Schema.Types.ObjectId;
}

// **Interface that describes a single category document**
interface CategoryDoc extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  description: string;
  isActive: boolean;
  user: mongoose.Schema.Types.ObjectId;
  version: number;
}

// **Interface for the category model (with custom static methods)**
interface CategoryModel extends Model<CategoryDoc> {
  build(attrs: CategoryAttrs): CategoryDoc;
}

// **Category Schema Definition**
const categorySchema = new Schema<CategoryDoc>(
  {
    name: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    description: {
      type: String,
      default: "",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
  },
  { timestamps: true }
);

categorySchema.set("versionKey", "version");
categorySchema.plugin(updateIfCurrentPlugin);

// **Static method to create a category**
categorySchema.statics.build = (attrs: CategoryAttrs) => {
  return new Category(attrs);
};

const Category = mongoose.model<CategoryDoc, CategoryModel>(
  "Category",
  categorySchema
);

export { Category };
