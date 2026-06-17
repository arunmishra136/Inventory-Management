import { z } from 'zod'

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        product: z.string().min(1),
        quantity: z.number().int().min(1),
      }),
    )
    .min(1),
})

export const updateOrderStatusSchema = z.object({
  status: z.enum(['confirmed', 'cancelled']),
})
