import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const reminders = await prisma.maintenanceOS.findMany({
      where: {
        nextReminderAt: {
          not: null,
        },
      },
      take: 10,
      orderBy: {
        nextReminderAt: 'asc',
      },
      include: {
        client: {
          select: {
            name: true,
          },
        },
      },
    })
    return NextResponse.json(reminders)
  } catch (error) {
    console.error("Error fetching upcoming reminders:", error)
    return NextResponse.json({ error: "Erro ao buscar lembretes" }, { status: 500 })
  }
}
