import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = await getToken({ req: req as any, secret: process.env.AUTH_SECRET });
    const userId = token?.id as string | undefined;
    const isAdmin = token?.role === 'ADMIN';

    // Admins see everything.
    // Users see PUBLISHED apps OR their own apps (even if PENDING/REJECTED).
    const where: any = isAdmin ? {} : {
        OR: [
            { status: 'PUBLISHED' }
        ]
    };

    if (!isAdmin && userId) {
        where.OR.push({ authorId: userId });
    }

    try {
        const apps = await prisma.app.findMany({
            where,
            include: {
                author: { select: { name: true } },
                reviews: { select: { rating: true } },
                _count: { select: { launches: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(apps);
    } catch (error: any) {
        console.error("Prisma Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}
