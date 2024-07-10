import { Elysia } from 'elysia'

import { db } from '../../db/connection'
import { auth } from '../auth'
import { UnauthorizedError } from '../error/unauthorized-error'

export const getProfile = new Elysia()
  .use(auth)
  .get('/me', async ({ getCurrentProfile }) => {
    const { userId } = await getCurrentProfile()

    const user = await db.query.users.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, userId)
      },
    })

    if (!user) {
      throw new UnauthorizedError()
    }

    return user
  })
