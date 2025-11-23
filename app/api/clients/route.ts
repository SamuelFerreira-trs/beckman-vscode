import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { clientSchema } from "@/lib/validations"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")

    let whereClause = {}
    if (query) {
      whereClause = {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { phone: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      }
    }

    const clients = await prisma.client.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(clients)
  } catch (error) {
    console.error("Error fetching clients:", error)
    return NextResponse.json({ error: "Erro ao buscar clientes" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = clientSchema.parse(body)

    const client = await prisma.client.create({
      data: {
        name: validatedData.name,
        phone: validatedData.phone,
        email: validatedData.email,
      },
    })

    return NextResponse.json({ success: true, id: client.id })
  } catch (error) {
    console.error("Error creating client:", error)
    return NextResponse.json({ error: "Erro ao criar cliente" }, { status: 500 })
  }
}
