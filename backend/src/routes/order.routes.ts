import { Router, type Router as RouterType } from 'express'
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
} from '../controllers/order.controller.js'

const router: RouterType = Router()

router.post('/', createOrder)
router.get('/', getOrders)
router.get('/:id', getOrder)
router.patch('/:id/status', updateOrderStatus)

export default router
