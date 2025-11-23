import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(clients)
  } catch (error) {
    console.error("Error fetching recent clients:", error)
    return NextResponse.json({ error: "Erro ao buscar clientes recentes" }, { status: 500 })
  }
}
