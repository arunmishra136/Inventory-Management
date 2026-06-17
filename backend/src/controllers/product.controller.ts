import type { Request, Response, NextFunction } from 'express'
import { Product } from '../models/Product.js'
import {
  createProductSchema,
  updateProductSchema,
  updateStockSchema,
} from '../validators/product.validator.js'

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, search } = req.query

    const filter: Record<string, unknown> = {}
    if (category) filter.category = category
    if (search) filter.name = { $regex: search, $options: 'i' }

    const products = await Product.find(filter).sort({ createdAt: -1 })
    res.json(products)
  } catch (err) {
    next(err)
  }
}

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createProductSchema.parse(req.body)
    const product = await Product.create(data)
    res.status(201).json(product)
  } catch (err) {
    next(err)
  }
}

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      res.status(404).json({ message: 'Product not found' })
      return
    }
    res.json(product)
  } catch (err) {
    next(err)
  }
}

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = updateProductSchema.parse(req.body)
    const product = await Product.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    })
    if (!product) {
      res.status(404).json({ message: 'Product not found' })
      return
    }
    res.json(product)
  } catch (err) {
    next(err)
  }
}

export const updateStock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { adjustment } = updateStockSchema.parse(req.body)

    const product = await Product.findById(req.params.id)
    if (!product) {
      res.status(404).json({ message: 'Product not found' })
      return
    }

    const newQuantity = product.quantity + adjustment
    if (newQuantity < 0) {
      res.status(400).json({
        message: `Insufficient stock. Current: ${product.quantity}, requested adjustment: ${adjustment}`,
      })
      return
    }

    product.quantity = newQuantity
    await product.save()
    res.json(product)
  } catch (err) {
    next(err)
  }
}

export const getLowStockProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find({
      $expr: { $lte: ['$quantity', '$lowStockThreshold'] },
    }).sort({ quantity: 1 })
    res.json(products)
  } catch (err) {
    next(err)
  }
}
