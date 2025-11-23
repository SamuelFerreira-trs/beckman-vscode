import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { calculateNextMaintenanceDate } from "@/lib/utils"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const now = new Date()

    // Handle status-only update (e.g. from table action)
    if (body.status && !body.serviceTitle) {
      if (body.status === "CONCLUIDA") {
        const deliveryDate = body.deliveryDate ? new Date(body.deliveryDate) : now
        const nextMaintenanceDate = calculateNextMaintenanceDate(deliveryDate)

        await prisma.maintenanceOS.update({
          where: { id: params.id },
          data: {
            status: body.status,
            closedAt: now,
            deliveryDate: deliveryDate,
            nextMaintenanceDate: nextMaintenanceDate,
          },
        })
      } else {
        await prisma.maintenanceOS.update({
          where: { id: params.id },
          data: {
            status: body.status,
          },
        })
      }
    } else {
      // Handle full update (from edit form)
      const {
        clientId,
        equipment,
        serviceTitle,
        description,
        value,
        costs,
        startDate,
        deliveryDate,
        nextMaintenanceDate,
        status,
      } = body

      const parsedStartDate = startDate ? new Date(startDate) : undefined
      const parsedDeliveryDate = deliveryDate ? new Date(deliveryDate) : null

      let calculatedNextMaintenance = null
      if (parsedDeliveryDate) {
        calculatedNextMaintenance = nextMaintenanceDate
          ? new Date(nextMaintenanceDate)
          : calculateNextMaintenanceDate(parsedDeliveryDate)
      }

      await prisma.maintenanceOS.update({
        where: { id: params.id },
        data: {
          clientId,
          equipment: equipment || null,
          serviceTitle,
          description,
          value,
          costs: costs || [],
          startDate: parsedStartDate,
          deliveryDate: parsedDeliveryDate,
          nextMaintenanceDate: calculatedNextMaintenance,
          status: status || "ABERTA",
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating maintenance:", error)
    return NextResponse.json({ 
      error: "Erro ao atualizar manutenção",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.maintenanceOS.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting maintenance:", error)
    return NextResponse.json({ error: "Erro ao excluir manutenção" }, { status: 500 })
  }
}
