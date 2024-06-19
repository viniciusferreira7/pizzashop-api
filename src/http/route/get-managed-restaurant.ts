import Elysia from 'elysia'

import { db } from '../../db/connection'
import { auth } from '../auth'

export const getManagedRestaurant = new Elysia()
  .use(auth)
  .get('/managed-restaurant', async ({ getCurrentProfile }) => {
    const { restaurantId } = await getCurrentProfile()

    if (!restaurantId) {
      throw new Error('User is not manager.')
    }

    const managedRestaurant = await db.query.restaurants.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, restaurantId)
      },
    })

    return { managedRestaurant }
  })
