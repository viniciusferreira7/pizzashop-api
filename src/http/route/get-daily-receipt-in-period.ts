import dayjs from 'dayjs'
import { and, eq, gte, lte, sql, sum } from 'drizzle-orm'
import { Elysia, t } from 'elysia'

import { db } from '../../db/connection'
import { orders } from '../../db/schema'
import { auth } from '../auth'
import { UnauthorizedError } from '../error/unauthorized-error'

export const getDailyReceiptInPeriod = new Elysia().use(auth).get(
  '/metrics/daily-receipt-in-period',
  async ({ getCurrentProfile, query, set }) => {
    const { restaurantId } = await getCurrentProfile()

    if (!restaurantId) {
      throw new UnauthorizedError()
    }

    const { from, to } = query

    const startDate = from ? dayjs(from) : dayjs().subtract(7, 'days')
    const endDate = to ? dayjs(to) : from ? startDate.add(7, 'days') : dayjs()

    if (endDate.diff(startDate, 'days') > 7) {
      set.status = 400

      return { message: 'You cannot list receipt in a larger than 7 days' }
    }

    const receiptPerDay = await db
      .select({
        date: sql<string>`TO_CHAR(${orders.createdAt}, 'DD/MM')`,
        receipt: sum(orders.totalInCents).mapWith(Number),
      })
      .from(orders)
      .where(
        and(
          eq(orders.restaurantId, restaurantId),
          gte(
            orders.createdAt,
            startDate
              .startOf('day')
              .add(startDate.utcOffset(), 'minutes')
              .toDate(),
          ),
          lte(
            orders.createdAt,
            endDate.endOf('day').add(endDate.utcOffset(), 'minutes').toDate(),
          ),
        ),
      )
      .groupBy(sql`TO_CHAR(${orders.createdAt}, 'DD/MM')`)

    const orderedReceiptPerDay = receiptPerDay.sort((a, b) => {
      const [dayA, monthA] = a.date.split('/').map(Number)
      const [dayB, monthB] = b.date.split('/').map(Number)

      if (monthA === monthB) {
        return dayA - dayB
      } else {
        const dateA = new Date(2024, monthA - 1, dayA)
        const dateB = new Date(2024, monthB - 1, dayB)

        return dateA.getTime() - dateB.getTime()
      }
    })

    return orderedReceiptPerDay
  },
  {
    query: t.Object({
      from: t.Optional(t.String()),
      to: t.Optional(t.String()),
    }),
  },
)
