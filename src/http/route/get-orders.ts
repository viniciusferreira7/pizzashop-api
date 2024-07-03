import { and, count, eq, ilike } from 'drizzle-orm'
import { createSelectSchema } from 'drizzle-typebox'
import { Elysia, t } from 'elysia'

import { db } from '../../db/connection'
import { orders, users } from '../../db/schema'
import { auth } from '../auth'
import { UnauthorizedError } from '../error/unauthorized-error'

export const getOrders = new Elysia().use(auth).get(
  '/orders',
  async ({ getCurrentProfile, query }) => {
    const { restaurantId } = await getCurrentProfile()

    if (!restaurantId) {
      throw new UnauthorizedError()
    }

    const { customerName, orderId, status, pageIndex } = query

    const baseQuery = db
      .select({
        orderId: orders.id,
        createAt: orders.createdAt,
        status: orders.status,
        total: orders.totalInCents,
        customerName: users.name,
      })
      .from(orders)
      .innerJoin(users, eq(users.id, orders.customerId))
      .where(
        and(
          eq(orders.restaurantId, restaurantId),
          orderId ? ilike(orders.id, `%${orderId}%`) : undefined,
          status ? eq(orders.status, status) : undefined,
          customerName ? ilike(users.name, `%${customerName}%`) : undefined,
        ),
      )

    const [amountOfOrdersQuery, allOrders] = await Promise.all([
      db.select({ count: count() }).from(baseQuery.as('baseQuery')),
      db
        .select()
        .from(baseQuery.as('baseQuery'))
        .offset(pageIndex * 10)
        .limit(10),
    ])

    const amountOfOrders = amountOfOrdersQuery[0].count

    return {
      orders: allOrders,
      meta: {
        pageIndex,
        perPage: 10,
        totalCount: amountOfOrders,
      },
    }
  },
  {
    query: t.Object({
      customerName: t.Optional(t.String()),
      orderId: t.Optional(t.String()),
      status: t.Optional(createSelectSchema(orders).properties.status),
      pageIndex: t.Numeric({ minimum: 0 }),
    }),
  },
)
