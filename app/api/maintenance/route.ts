import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { maintenanceSchema } from "@/lib/validations"
import { calculateNextMaintenanceDate } from "@/lib/utils"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")

    let whereClause = {}
    if (query) {
      whereClause = {
        OR: [
          { serviceTitle: { contains: query, mode: 'insensitive' } },
          { equipment: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { client: { name: { contains: query, mode: 'insensitive' } } },
        ],
      }
    }

    const maintenances = await prisma.maintenanceOS.findMany({
      where: whereClause,
      orderBy: {
        startDate: 'desc',
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(maintenances)
  } catch (error) {
    console.error("Error fetching maintenances:", error)
    return NextResponse.json({ error: "Erro ao buscar manutenções" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = maintenanceSchema.parse(body)

    const now = new Date()
    const startDate = validatedData.startDate ? new Date(validatedData.startDate) : now
    const deliveryDate = validatedData.deliveryDate ? new Date(validatedData.deliveryDate) : null

    let nextMaintenanceDate = null
    if (deliveryDate) {
      nextMaintenanceDate = validatedData.nextMaintenanceDate
        ? new Date(validatedData.nextMaintenanceDate)
        : (validatedData.deliveryDate ? calculateNextMaintenanceDate(validatedData.deliveryDate) : null)
    }

    const nextReminderAt = new Date(startDate)
    nextReminderAt.setMonth(nextReminderAt.getMonth() + 4)

    const maintenance = await prisma.maintenanceOS.create({
      data: {
        clientId: validatedData.clientId,
        equipment: validatedData.equipment || '',
        serviceTitle: validatedData.serviceTitle || '',
        description: validatedData.description || '',
        value: validatedData.value,
        costs: validatedData.costs || [],
        status: validatedData.status || "ABERTA",
        startDate: startDate,
        deliveryDate: deliveryDate,
        nextMaintenanceDate: nextMaintenanceDate,
        openedAt: startDate,
        nextReminderAt: nextReminderAt,
        nextReminderStep: 'M4',
      },
    })

    return NextResponse.json({ success: true, id: maintenance.id })
  } catch (error) {
    console.error("Error creating maintenance:", error)
    return NextResponse.json({ 
      error: "Erro ao criar manutenção",
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}
