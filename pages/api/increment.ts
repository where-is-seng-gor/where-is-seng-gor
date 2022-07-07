import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const arr = req.body || [];

  if (arr.length) {
    for (let i = 0; i < arr.length; i++) {
      const input = arr[i];
      if (input.increment < 40) {
        await prisma.attribute.update({
          where: {
            id: input.id,
          },
          data: {
            count: {
              increment: input.increment || 0,
            },
          },
          select: {
            id: true,
          },
        });
      }
    }
  }

  res.status(200).json({ data: null });
}
