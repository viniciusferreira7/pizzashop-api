import { Elysia } from 'elysia'

import { registerRestaurant } from './route/register-restaurant'
import { sendAuthLink } from './route/send-auth-link'

const app = new Elysia().use(registerRestaurant).use(sendAuthLink)

app.listen(3333, () => {
  console.log('🔥 HTTP server running!')
})
