import { allowCors } from "@/helpers/api/cors";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default allowCors(async function handle(req: NextApiRequest, res: NextApiResponse) {
  const materials = await prisma.material.findMany();
  res.json(materials);
});
