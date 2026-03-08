import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const apps = await prisma.app.findMany({ orderBy: { createdAt: 'desc' } });
    res.status(200).json(apps);
}
