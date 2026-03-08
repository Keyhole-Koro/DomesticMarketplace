import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { detectAppType } from '@/lib/detector';
import { v4 as uuidv4 } from 'uuid';
import { getToken } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = await getToken({ req: req as any, secret: process.env.AUTH_SECRET });
    if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' });

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { files, name, description, category, icon, color } = req.body;

    if (!files || !Array.isArray(files) || files.length === 0) {
        return res.status(400).json({ success: false, message: 'Files are required' });
    }

    try {
        const appId = uuidv4();
        const appDir = path.join(process.cwd(), 'apps', appId);
        fs.mkdirSync(appDir, { recursive: true });

        // Write files
        for (const file of files) {
            const filePath = path.join(appDir, file.path);
            const fileDir = path.dirname(filePath);
            if (!fs.existsSync(fileDir)) {
                fs.mkdirSync(fileDir, { recursive: true });
            }
            fs.writeFileSync(filePath, file.content);
        }

        // Detect app type and write Docker files
        const { dockerfile, dockerignore, internalPort, framework } = detectAppType(appDir);
        fs.writeFileSync(path.join(appDir, 'Dockerfile'), dockerfile);
        fs.writeFileSync(path.join(appDir, '.dockerignore'), dockerignore);

        // Create Database record
        const app = await prisma.app.create({
            data: {
                id: appId,
                name: name || 'New Tool',
                description: description || `${framework} application`,
                category: category || 'General',
                icon: icon || '🚀',
                color: color || 'from-blue-500 to-indigo-500',
                localPath: `apps/${appId}`,
                dockerImage: `c0mpile/${appId}`, // This might need a real registry path if using remote Docker
                internalPort,
                authorId: token.id as string,
            },
        });

        res.status(200).json({ success: true, app });
    } catch (error: any) {
        console.error("Save Vibe Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}
