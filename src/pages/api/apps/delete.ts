import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { deleteAppResources } from '@/lib/docker';
import fs from 'fs';
import path from 'path';
import { getToken } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

    const token = await getToken({ req: req as any, secret: process.env.AUTH_SECRET });
    if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { appId } = req.body;
    try {
        const app = await prisma.app.findUnique({ where: { id: appId } });
        if (!app) return res.status(404).json({ message: 'App not found' });

        // Only author or admin can delete
        if (app.authorId !== token.id && token.role !== 'ADMIN') {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }

        await deleteAppResources(appId, app.dockerImage);
        const appDir = path.join(process.cwd(), app.localPath);
        if (fs.existsSync(appDir)) fs.rmSync(appDir, { recursive: true, force: true });
        await prisma.app.delete({ where: { id: appId } });

        res.status(200).json({ success: true, message: 'App deleted' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}
