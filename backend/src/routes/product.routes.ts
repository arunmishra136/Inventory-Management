import { Router, type Router as RouterType } from 'express'
import {
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  updateStock,
  getLowStockProducts,
} from '../controllers/product.controller.js'

const router: RouterType = Router()

router.get('/', getProducts)
router.post('/', createProduct)
router.get('/low-stock', getLowStockProducts)
router.get('/:id', getProduct)
router.put('/:id', updateProduct)
router.patch('/:id/stock', updateStock)

export default router
