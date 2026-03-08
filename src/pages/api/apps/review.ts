import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

    const token = await getToken({ req: req as any, secret: process.env.AUTH_SECRET });
    if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { appId, rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    try {
        const review = await prisma.review.upsert({
            where: {
                // We'd need a unique constraint for one review per user per app
                // For now, let's just create a new one or find existing
                id: (await prisma.review.findFirst({ where: { userId: token.id as string, appId } }))?.id || 'new-review',
            },
            update: { rating, comment },
            create: {
                rating,
                comment,
                userId: token.id as string,
                appId,
            },
        });
        res.status(200).json({ success: true, review });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}
