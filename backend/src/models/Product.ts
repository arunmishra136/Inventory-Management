import { Schema, model } from 'mongoose'

export interface IProduct {
  name: string
  sku: string
  description: string
  category: string
  image?: string
  expiryDate?: Date
  quantity: number
  price: number
  lowStockThreshold: number
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String },
    expiryDate: { type: Date },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    price: { type: Number, required: true, min: 0 },
    lowStockThreshold: { type: Number, required: true, min: 0, default: 10 },
  },
  { timestamps: true },
)

export const Product = model<IProduct>('Product', productSchema)
