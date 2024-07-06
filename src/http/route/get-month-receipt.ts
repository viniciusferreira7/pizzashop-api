import dayjs from 'dayjs'
import { and, eq, gte, sql, sum } from 'drizzle-orm'
import { Elysia } from 'elysia'

import { db } from '../../db/connection'
import { orders } from '../../db/schema'
import { auth } from '../auth'
import { UnauthorizedError } from '../error/unauthorized-error'

export const getMonthReceipt = new Elysia()
  .use(auth)
  .get('/metrics/month-receipt', async ({ getCurrentProfile }) => {
    const { restaurantId } = await getCurrentProfile()

    if (!restaurantId) {
      throw new UnauthorizedError()
    }

    const today = dayjs()
    const lastMonth = today.subtract(1, 'month')
    const startOfLastMonth = lastMonth.startOf('month')

    const monthsReceipt = await db
      .select({
        monthWithYear: sql<string>`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`,
        receipt: sum(orders.totalInCents).mapWith(Number),
      })
      .from(orders)
      .where(
        and(
          eq(orders.restaurantId, restaurantId),
          gte(orders.createdAt, startOfLastMonth.toDate()),
        ),
      )
      .groupBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`)

    const currentMonthWithYear = today.format('YYYY-MM')
    const lastMonthWithYear = startOfLastMonth.format('YYYY-MM')

    const currentMonthReceipt = monthsReceipt.find((month) => {
      return month.monthWithYear === currentMonthWithYear
    })

    const lastMonthReceipt = monthsReceipt.find((month) => {
      return month.monthWithYear === lastMonthWithYear
    })

    const diffFromLastMonth =
      currentMonthReceipt && lastMonthReceipt
        ? (currentMonthReceipt.receipt * 100) / lastMonthReceipt.receipt
        : null

    return {
      receipt: currentMonthReceipt?.receipt,
      diffFromLastMonth: diffFromLastMonth
        ? (diffFromLastMonth - 100).toFixed(2)
        : 0,
    }
  })
