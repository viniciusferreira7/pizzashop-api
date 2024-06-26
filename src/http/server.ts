import { Elysia } from 'elysia'

import { approveOrder } from './route/approve-order'
import { authenticateFromLink } from './route/authenticate-from-link'
import { cancelOrder } from './route/cancel-order'
import { deliverOrder } from './route/deliver-order'
import { dispatchOrder } from './route/dispatch-order'
import { getManagedRestaurant } from './route/get-managed-restaurant'
import { getOrderDetails } from './route/get-order-details'
import { getOrders } from './route/get-orders'
import { getProfile } from './route/get-profile'
import { registerRestaurant } from './route/register-restaurant'
import { sendAuthLink } from './route/send-auth-link'
import { signOut } from './route/sign-out'

const app = new Elysia()
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
  .onError(({ error, code, set }) => {
    switch (code) {
      case 'VALIDATION':
        set.status = error.status
        return {
          code,
          message: 'Validation failed.',
          error: error.toResponse(),
        }
      default:
        console.log(error)

        return new Response(null, { status: 500 })
    }
  })

app.listen(3333, () => {
  console.log('🔥 HTTP server running!')
})
