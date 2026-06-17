import type { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err)

  if (err instanceof ZodError) {
    res.status(400).json({
      message: 'Validation error',
      errors: err.issues.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    })
    return
  }

  const status = err.status ?? 500
  const message = err.message ?? 'Internal Server Error'

  res.status(status).json({ message })
}
