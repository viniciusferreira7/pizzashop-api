import { and, eq } from 'drizzle-orm'
import { Elysia, t } from 'elysia'

import { db } from '../../db/connection'
import { restaurants } from '../../db/schema'
import { auth } from '../auth'
import { UnauthorizedError } from '../error/unauthorized-error'

export const updateRestaurant = new Elysia().use(auth).put(
  '/profile',
  async ({ body, getCurrentProfile, set }) => {
    const { restaurantId, userId } = await getCurrentProfile()

    if (!restaurantId || !userId) {
      throw new UnauthorizedError()
    }

    const { name, description } = body

    await db
      .update(restaurants)
      .set({
        name,
        description,
      })
      .where(
        and(
          eq(restaurants.id, restaurantId),
          eq(restaurants.managerId, userId),
        ),
      )

    set.status = 204
  },
  {
    body: t.Object({
      name: t.String(),
      description: t.Optional(t.String()),
    }),
  },
)
