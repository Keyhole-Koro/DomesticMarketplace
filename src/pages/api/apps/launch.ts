import { NextApiRequest, NextApiResponse } from 'next';
import { launchApp } from '@/lib/docker';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
    const { appId } = req.body;
    const token = await getToken({ req: req as any, secret: process.env.AUTH_SECRET });

    try {
        const port = await launchApp(appId);

        // Log launch
        await prisma.launchLog.create({
            data: {
                appId,
                userId: token?.id as string | undefined,
            }
        });

        res.status(200).json({ success: true, url: `http://localhost:3000/active-apps/${appId}`, port });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}
