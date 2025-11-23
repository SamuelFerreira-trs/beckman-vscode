import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

    // Total clients
    const totalClients = await prisma.client.count()

    // Monthly maintenances
    const totalMaintenances = await prisma.maintenanceOS.count({
      where: {
        openedAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    })

    // Monthly revenue
    const revenueResult = await prisma.maintenanceOS.aggregate({
      _sum: {
        value: true,
      },
      where: {
        openedAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        status: 'CONCLUIDA',
      },
    })
    const monthlyRevenue = Number(revenueResult._sum.value || 0)

    // Upcoming reminders
    const upcomingReminders = await prisma.maintenanceOS.count({
      where: {
        nextReminderAt: {
          not: null,
        },
      },
    })

    return NextResponse.json({
      totalClients,
      totalMaintenances,
      monthlyRevenue,
      upcomingReminders,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Erro ao buscar estatísticas" }, { status: 500 })
  }
}
