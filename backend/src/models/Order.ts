import { Schema, model, type Types } from 'mongoose'

export interface IOrderItem {
  product: Types.ObjectId
  quantity: number
  priceAtOrder: number
}

export interface IOrder {
  items: IOrderItem[]
  status: 'pending' | 'confirmed' | 'cancelled'
  totalAmount: number
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    priceAtOrder: { type: Number, required: true, min: 0 },
  },
  { _id: false },
)

const orderSchema = new Schema<IOrder>(
  {
    items: { type: [orderItemSchema], required: true, validate: (v: IOrderItem[]) => v.length > 0 },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
    totalAmount: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
)

export const Order = model<IOrder>('Order', orderSchema)
