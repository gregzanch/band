import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../lib/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" })
  }
  try {
    const { query } = req.body
    const materials = await prisma.material.findMany({
      take: 10,
      where: {
        material: {
          contains: query,
        },
      },
    })
    res.status(200).json(materials)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: "Search material failed",
      message: error.msg,
    })
  }
}
