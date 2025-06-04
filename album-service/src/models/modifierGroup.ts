import mongoose, { Schema, Document, Model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// **Interface for required attributes when creating a new modifier group**
interface ModifierGroupAttrs {
  seller: mongoose.Schema.Types.ObjectId;
  name: string;
  min: number;
  max: number;
  multiSelectableModifierProduct: boolean;
  status: boolean;
  modifierProducts: {
    productId: mongoose.Schema.Types.ObjectId;
    status: boolean;
    extraPrice: number;
  }[];
}

// **Interface that describes a single modifier group document**
interface ModifierGroupDoc extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  seller: mongoose.Schema.Types.ObjectId;
  name: string;
  min: number;
  status: boolean;
  max: number;
  multiSelectableModifierProduct: boolean;
  modifierProducts: {
    productId: mongoose.Schema.Types.ObjectId;
    status: boolean;
    extraPrice: number;
  }[];
  version: number;
}

// **Interface for the modifier group model (with custom static methods)**
interface ModifierGroupModel extends Model<ModifierGroupDoc> {
  build(attrs: ModifierGroupAttrs): ModifierGroupDoc;
}

// **Modifier Group Schema Definition**
const modifierGroupSchema = new Schema<ModifierGroupDoc>(
  {
    seller: {
      type: Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
    multiSelectableModifierProduct: {
      type: Boolean,
      required: true,
    },
    modifierProducts: {
      type: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            autopopulate: true,
            required: true,
          },
          status: {
            type: Boolean,
            required: true,
            default: true,
          },
          extraPrice: {
            type: Number,
            required: true,
            default: 0,
          },
        },
      ],
      required: true,
    },
  },
  { timestamps: true }
);

modifierGroupSchema.set("versionKey", "version");
modifierGroupSchema.plugin(updateIfCurrentPlugin);

// **Static method to create a modifier group**
modifierGroupSchema.statics.build = (attrs: ModifierGroupAttrs) => {
  return new ModifierGroup(attrs);
};

const ModifierGroup = mongoose.model<ModifierGroupDoc, ModifierGroupModel>(
  "ModifierGroup",
  modifierGroupSchema
);

export { ModifierGroup };
