import { Elysia } from 'elysia'

import { authenticateFromLink } from './route/authenticate-from-link'
import { getManagedRestaurant } from './route/get-managed-restaurant'
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

app.listen(3333, () => {
  console.log('🔥 HTTP server running!')
})
