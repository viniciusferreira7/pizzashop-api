import { createId } from '@paralleldrive/cuid2'
import { Elysia, t } from 'elysia'

import { db } from '../../db/connection'
import { authLinks } from '../../db/schema'
import { env } from '../../env'
import { resend } from '../../lib/resend'

export const sendAuthLink = new Elysia().post(
  '/authenticate',
  async ({ body }) => {
    const { email } = body

    const userFromEmail = await db.query.users.findFirst({
      where(fields, { eq }) {
        return eq(fields.email, email)
      },
    })

    if (!userFromEmail) {
      throw new Error('User not found.')
    }

    const authLinkCode = createId()

    await db.insert(authLinks).values({
      code: authLinkCode,
      userId: userFromEmail.id,
    })

    const authLink = new URL('/auth-links/authenticate', env.API_BASE_URL)

    authLink.searchParams.set('code', authLinkCode)
    authLink.searchParams.set('redirect', env.AUTH_REDIRECT_URL)

    resend.emails.send({
      from: 'onboarding@resend.dev',
      to: env.EMAIL_DEV ?? userFromEmail.email,
      subject: 'Pizza shop',
      html: `<a href=${authLink} target="_blank" rel="noopener noreferrer">${authLink}</a>`,
    })
  },
  {
    body: t.Object({
      email: t.String({ format: 'email' }),
    }),
  },
)
