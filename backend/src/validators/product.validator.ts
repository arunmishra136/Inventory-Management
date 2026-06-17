import { z } from 'zod'

export const createProductSchema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  image: z.string().url().regex(/\.(jpg|jpeg|png|webp|svg)(\?.*)?$/i).optional(),
  expiryDate: z.coerce.date().optional(),
  quantity: z.number().int().min(0),
  price: z.number().min(0),
  lowStockThreshold: z.number().int().min(0).default(10),
})

export const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  image: z.string().url().regex(/\.(jpg|jpeg|png|webp|svg)(\?.*)?$/i).optional(),
  expiryDate: z.coerce.date().optional(),
  price: z.number().min(0).optional(),
  lowStockThreshold: z.number().int().min(0).optional(),
})

export const updateStockSchema = z.object({
  adjustment: z.number().int(),
})
