import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const username = 'admin'
  const password = 'beckman123' // The password user wants

  const hashedPassword = await bcrypt.hash(password, 10)

  // Upsert ensures we create it if missing, or UPDATE it if exists (fixing the plain text issue)
  await prisma.user.upsert({
    where: { username },
    update: {
      password: hashedPassword,
    },
    create: {
      username,
      password: hashedPassword,
    },
  })

  console.log(`User "${username}" updated/created with hashed password for "${password}"`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
