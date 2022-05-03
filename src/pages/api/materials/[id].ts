import { allowCors } from "@/helpers/api/cors";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default allowCors(async function handle(req: NextApiRequest, res: NextApiResponse) {
  const postId = req.query.id;

  try {
    const material = await prisma.material.findUnique({
      where: { id: Number(postId) },
    });
    res.json(material);
  } catch (err) {
    res.status(500).json({
      error: "Query material failed",
    });
  }
});
