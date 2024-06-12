/* eslint-disable drizzle/enforce-delete-with-where */
import { faker } from '@faker-js/faker'
import chalk from 'chalk'

import { env } from '../env'
import { db } from './connection'
import { authLinks, restaurants, users } from './schema'

// Reset database

await db.delete(users)
await db.delete(authLinks)
await db.delete(restaurants)

console.log(chalk.yellow('✔️ Database was reset!'))

// Create customer

await db.insert(users).values([
  {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: 'customer',
  },
  {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: 'customer',
  },
])

console.log(chalk.yellow('✔️ Created customers!'))

// Create manager

const [manager] = await db
  .insert(users)
  .values([
    {
      name: faker.person.fullName(),
      email: env.EMAIL_DEV,
      role: 'manager',
    },
  ])
  .returning({
    id: users.id,
  })

console.log(chalk.yellow('✔️ Created manager!'))

// Create restaurants

await db.insert(restaurants).values([
  {
    name: faker.company.name(),
    description: faker.lorem.paragraph(),
    managerId: manager.id,
  },
])

console.log(chalk.yellow('✔️ Created restaurant!'))

console.log(chalk.greenBright('Database seeded successfully.'))

process.exit()
