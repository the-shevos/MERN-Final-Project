import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
  product: string;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  user: string;
  items: IOrderItem[];
  totalAmount: number;
  paymentMethod: string;
  shippingAddress: string;
  status: string; 
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    user: { type: String, required: true },

    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],

    totalAmount: { type: Number, required: true },

    paymentMethod: {
      type: String,
      enum: ["cash", "card", "online"],
      required: true,
    },

    shippingAddress: { type: String, required: true },

    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>("Order", orderSchema);
