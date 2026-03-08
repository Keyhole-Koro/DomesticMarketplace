import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { deleteAppResources } from '@/lib/docker';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
    const { appId } = req.body;
    try {
        const app = await prisma.app.findUnique({ where: { id: appId } });
        if (!app) return res.status(404).json({ message: 'App not found' });

        await deleteAppResources(appId, app.dockerImage);
        const appDir = path.join(process.cwd(), app.localPath);
        if (fs.existsSync(appDir)) fs.rmSync(appDir, { recursive: true, force: true });
        await prisma.app.delete({ where: { id: appId } });

        res.status(200).json({ success: true, message: 'App deleted' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}
