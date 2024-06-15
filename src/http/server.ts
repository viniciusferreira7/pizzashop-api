import { Elysia } from 'elysia'

import { authenticateFromLink } from './route/authenticate-from-link'
import { registerRestaurant } from './route/register-restaurant'
import { sendAuthLink } from './route/send-auth-link'
import { signOut } from './route/sign-out'

const app = new Elysia()
  .use(registerRestaurant)
  .use(sendAuthLink)
  .use(authenticateFromLink)
  .use(signOut)

app.listen(3333, () => {
  console.log('🔥 HTTP server running!')
})
