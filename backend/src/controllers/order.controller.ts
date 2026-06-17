import type { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import { Product } from '../models/Product.js'
import { Order } from '../models/Order.js'
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from '../validators/order.validator.js'

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { items } = createOrderSchema.parse(req.body)

    const orderItems = []
    let totalAmount = 0

    for (const item of items) {
      const product = await Product.findById(item.product).session(session)
      if (!product) {
        await session.abortTransaction()
        res.status(400).json({ message: `Product not found: ${item.product}` })
        return
      }

      if (product.quantity < item.quantity) {
        await session.abortTransaction()
        res.status(400).json({
          message: `Insufficient stock for "${product.name}". Available: ${product.quantity}, requested: ${item.quantity}`,
        })
        return
      }

      product.quantity -= item.quantity
      await product.save({ session })

      const lineTotal = product.price * item.quantity
      totalAmount += lineTotal

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        priceAtOrder: product.price,
      })
    }

    const [order] = await Order.create(
      [{ items: orderItems, totalAmount }],
      { session },
    )

    await session.commitTransaction()
    res.status(201).json(order)
  } catch (err) {
    await session.abortTransaction()
    next(err)
  } finally {
    session.endSession()
  }
}

export const getOrders = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await Order.find()
      .populate('items.product', 'name sku image')
      .sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    next(err)
  }
}

export const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name sku image price')
    if (!order) {
      res.status(404).json({ message: 'Order not found' })
      return
    }
    res.json(order)
  } catch (err) {
    next(err)
  }
}

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { status } = updateOrderStatusSchema.parse(req.body)

    const order = await Order.findById(req.params.id).session(session)
    if (!order) {
      await session.abortTransaction()
      res.status(404).json({ message: 'Order not found' })
      return
    }

    if (order.status !== 'pending') {
      await session.abortTransaction()
      res.status(400).json({
        message: `Cannot change status from "${order.status}" to "${status}"`,
      })
      return
    }

    if (status === 'cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { quantity: item.quantity } },
          { session },
        )
      }
    }

    order.status = status
    await order.save({ session })

    await session.commitTransaction()
    res.json(order)
  } catch (err) {
    await session.abortTransaction()
    next(err)
  } finally {
    session.endSession()
  }
}
