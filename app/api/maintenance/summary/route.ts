import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get("month")

    if (!month) {
      return NextResponse.json({ error: "Mês não informado" }, { status: 400 })
    }

    const [year, monthNum] = month.split("-")
    const startDate = new Date(Number(year), Number(monthNum) - 1, 1)
    const endDate = new Date(Number(year), Number(monthNum), 0, 23, 59, 59)

    // Calculate total revenue from completed maintenances
    const completedMaintenances = await prisma.maintenanceOS.findMany({
      where: {
        OR: [
          { startDate: { gte: startDate, lte: endDate } },
          { createdAt: { gte: startDate, lte: endDate } },
        ],
        status: { in: ['COMPLETED', 'CONCLUIDA', 'Concluída'] },
      },
      select: {
        value: true,
        costs: true,
      },
    })

    const totalRevenue = completedMaintenances.reduce((acc, curr) => acc + Number(curr.value), 0)

    // Calculate total costs from completed maintenances
    const totalCosts = completedMaintenances.reduce((acc, curr) => {
      const costs = curr.costs as any[] || []
      const maintenanceCost = costs.reduce((cAcc, cCurr) => cAcc + (Number(cCurr.value) || 0), 0)
      return acc + maintenanceCost
    }, 0)

    const orderCount = completedMaintenances.length

    // Get total records count for the period (regardless of status)
    const totalRecords = await prisma.maintenanceOS.count({
      where: {
        OR: [
          { startDate: { gte: startDate, lte: endDate } },
          { createdAt: { gte: startDate, lte: endDate } },
        ],
      },
    })

    const summary = {
      totalRevenue,
      totalCosts,
      netGain: totalRevenue - totalCosts,
      orderCount, // Or use totalRecords if that's what the UI expects for "Total de Ordens"
    }

    return NextResponse.json(summary)
  } catch (error) {
    console.error("Error fetching summary:", error)
    return NextResponse.json(
      {
        totalRevenue: 0,
        totalCosts: 0,
        netGain: 0,
        orderCount: 0,
        error: "Erro ao buscar resumo",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 200 },
    )
  }
}
