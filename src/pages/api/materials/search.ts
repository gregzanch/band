import { allowCors } from "@/helpers/api/cors";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

const parsePage = (param: string | string[]): number => {
  if (Array.isArray(param)) {
    param = param[0];
  }
  const parsed = parseInt(param);
  return isNaN(parsed) ? 0 : parsed;
};

const first = <T>(val: T | T[]): T => (Array.isArray(val) ? val[0] : val);

const parseIntQuery = (val: string) => {
  const parsed = parseInt(val);
  if (isNaN(parsed)) {
    throw new Error(`could not parse 'count' parameter, got ${val}`);
  }
  return parsed;
};

export default allowCors(async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const query = first(req.query.query) || "";
    const page = parsePage(req.query.page);
    const count = parseIntQuery(first(req.query.count));

    if (!query) {
      return res.status(200).json([]);
    }
    const materials = await prisma.material.findMany({
      take: count,
      skip: count * page,
      where: {
        material: {
          contains: query,
          mode: "insensitive",
        },
      },
    });
    res.status(200).json(materials);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Search material failed",
      message: error.message,
    });
  }
});
