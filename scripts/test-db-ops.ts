
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Iniciando Teste de API de Manutenção ---')

  // 1. Criar um cliente de teste
  const client = await prisma.client.create({
    data: {
      name: 'Cliente Teste API',
      phone: '11999999999',
    }
  })
  console.log('1. Cliente criado:', client.id)

  // 2. Criar uma manutenção
  const maintenance = await prisma.maintenanceOS.create({
    data: {
      clientId: client.id,
      serviceTitle: 'Manutenção Teste',
      description: 'Teste de API',
      value: 100,
      status: 'ABERTA'
    }
  })
  console.log('2. Manutenção criada:', maintenance.id)

  // 3. Tentar atualizar o status (Simulando o PATCH)
  const updated = await prisma.maintenanceOS.update({
    where: { id: maintenance.id },
    data: { status: 'CONCLUIDA' }
  })
  console.log('3. Status atualizado para:', updated.status)

  if (updated.status !== 'CONCLUIDA') {
    console.error('ERRO: Status não foi atualizado!')
  }

  // 4. Tentar deletar (Simulando o DELETE)
  await prisma.maintenanceOS.delete({
    where: { id: maintenance.id }
  })
  console.log('4. Manutenção deletada com sucesso')

  // Limpeza
  await prisma.client.delete({ where: { id: client.id } })
  console.log('5. Cliente deletado (Limpeza)')

  console.log('--- Teste Concluído com Sucesso ---')
}

main()
  .catch(e => {
    console.error('ERRO NO TESTE:', e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
