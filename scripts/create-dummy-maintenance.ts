
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const client = await prisma.client.findFirst()
  if (!client) {
    console.log('Nenhum cliente encontrado. Crie um cliente primeiro.')
    return
  }

  const maintenance = await prisma.maintenanceOS.create({
    data: {
      clientId: client.id,
      serviceTitle: 'Manutenção para Teste CURL',
      description: 'Tentar deletar via CURL',
      value: 50,
      status: 'ABERTA'
    }
  })
  console.log(maintenance.id)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
