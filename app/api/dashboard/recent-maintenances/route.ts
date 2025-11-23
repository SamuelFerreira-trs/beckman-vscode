import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const maintenances = await prisma.maintenanceOS.findMany({
      take: 5,
      orderBy: {
        openedAt: 'desc',
      },
      include: {
        client: {
          select: {
            name: true,
          },
        },
      },
    })
    return NextResponse.json(maintenances)
  } catch (error) {
    console.error("Error fetching recent maintenances:", error)
    return NextResponse.json({ error: "Erro ao buscar manutenções recentes" }, { status: 500 })
  }
}
