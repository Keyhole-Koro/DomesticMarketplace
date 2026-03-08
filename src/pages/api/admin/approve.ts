import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

    const token = await getToken({ req: req as any, secret: process.env.AUTH_SECRET });
    if (token?.role !== 'ADMIN') {
        return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
    }

    const { appId, status } = req.body;
    if (!['PUBLISHED', 'REJECTED', 'PENDING'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    try {
        const app = await prisma.app.update({
            where: { id: appId },
            data: { status },
        });
        res.status(200).json({ success: true, app });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}
