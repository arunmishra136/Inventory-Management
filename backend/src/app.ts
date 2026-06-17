import express, { type Express } from 'express'
import cors from 'cors'
import productRoutes from './routes/product.routes.js'
import orderRoutes from './routes/order.routes.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { env } from './config/env.js'

const app: Express = express()

app.use(cors({
  origin: env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}))
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)

app.use(errorHandler)

export default app
