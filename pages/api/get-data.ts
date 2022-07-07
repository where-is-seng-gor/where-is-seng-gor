import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate=59");

  const characters = await prisma.character.findMany({
    select: {
      id: true,
      name: true,
      say: true,
      updatedAt: true,
      attributes: {
        select: {
          id: true,
          name: true,
          emoji: true,
          count: true,
          updatedAt: true,
        },
      },
    },
  });
  res.status(200).json({ data: { characters } });
}
