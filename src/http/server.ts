import { cors } from '@elysiajs/cors'
import swagger from '@elysiajs/swagger'
import { Elysia } from 'elysia'

import { env } from '../env'
import { approveOrder } from './route/approve-order'
import { authenticateFromLink } from './route/authenticate-from-link'
import { cancelOrder } from './route/cancel-order'
import { deliverOrder } from './route/deliver-order'
import { dispatchOrder } from './route/dispatch-order'
import { getDailyReceiptInPeriod } from './route/get-daily-receipt-in-period'
import { getDayOrdersAmount } from './route/get-day-orders-amount'
import { getManagedRestaurant } from './route/get-managed-restaurant'
import { getMonthCanceledOrdersAmount } from './route/get-month-canceled-orders-amount'
import { getMonthOrdersAmount } from './route/get-month-orders-amount'
import { getMonthReceipt } from './route/get-month-receipt'
import { getOrderDetails } from './route/get-order-details'
import { getOrders } from './route/get-orders'
import { getPopularProducts } from './route/get-popular-products'
import { getProfile } from './route/get-profile'
import { registerRestaurant } from './route/register-restaurant'
import { sendAuthLink } from './route/send-auth-link'
import { signOut } from './route/sign-out'
import { updateRestaurant } from './route/update-restaurant'

const app = new Elysia()
  .use(swagger())
  .use(
    cors({
      origin: env.AUTH_REDIRECT_URL,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  )
  .use(registerRestaurant)
  .use(sendAuthLink)
  .use(authenticateFromLink)
  .use(signOut)
  .use(getProfile)
  .use(getManagedRestaurant)
  .use(getOrderDetails)
  .use(approveOrder)
  .use(cancelOrder)
  .use(deliverOrder)
  .use(dispatchOrder)
  .use(getOrders)
  .use(getMonthReceipt)
  .use(getDayOrdersAmount)
  .use(getMonthOrdersAmount)
  .use(getMonthCanceledOrdersAmount)
  .use(getPopularProducts)
  .use(getDailyReceiptInPeriod)
  .use(updateRestaurant)
  .onError(({ error, code, set }) => {
    switch (code) {
      case 'VALIDATION':
        set.status = error.status
        return {
          code,
          message: 'Validation failed.',
          error: error.toResponse(),
        }
      case 'NOT_FOUND':
        return new Response(null, { status: 404 })
      default:
        console.log(error)

        return new Response(null, { status: 500 })
    }
  })

app.listen(3333, () => {
  console.log('🔥 HTTP server running!')
})
