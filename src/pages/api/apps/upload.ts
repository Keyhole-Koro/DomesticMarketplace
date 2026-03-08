import { NextApiRequest, NextApiResponse } from 'next';
import Busboy from 'busboy';
import fs from 'fs';
import path from 'path';
import unzipper from 'unzipper';
import { PrismaClient } from '@prisma/client';
import { detectAppType } from '@/lib/detector';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();
export const config = { api: { bodyParser: false } };

function findProjectRoot(dir: string, depth = 0): string | null {
    if (depth > 5) return null;
    const items = fs.readdirSync(dir);
    if (items.includes('package.json') || items.includes('index.html')) return dir;
    for (const item of items) {
        const fullPath = path.join(dir, item);
        if (fs.statSync(fullPath).isDirectory() && item !== '__MACOSX' && !item.startsWith('.')) {
            const result = findProjectRoot(fullPath, depth + 1);
            if (result) return result;
        }
    }
    return null;
}

function moveContents(sourceDir: string, targetDir: string) {
    if (sourceDir === targetDir) return;
    fs.readdirSync(sourceDir).forEach(item => {
        const src = path.join(sourceDir, item);
        const dest = path.join(targetDir, item);
        if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true, force: true });
        fs.renameSync(src, dest);
    });
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    return new Promise((resolve) => {
        const busboy = Busboy({ headers: req.headers });
        const fields: any = {};
        let zipPath = '';
        const appId = uuidv4();
        const tmpDir = path.join(process.cwd(), 'tmp');
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

        let fileWritePromise = Promise.resolve();
        busboy.on('field', (name, val) => { fields[name] = val; });
        busboy.on('file', (name, file, info) => {
            zipPath = path.join(tmpDir, `upload-${appId}.zip`);
            const writeStream = fs.createWriteStream(zipPath);
            file.pipe(writeStream);
            fileWritePromise = new Promise((resFile, rejFile) => {
                writeStream.on('finish', resFile);
                writeStream.on('error', rejFile);
            });
        });

        busboy.on('finish', async () => {
            try {
                await fileWritePromise;
                const appDir = path.join(process.cwd(), 'apps', appId);
                fs.mkdirSync(appDir, { recursive: true });
                await fs.createReadStream(zipPath).pipe(unzipper.Extract({ path: appDir })).promise();

                const projectRoot = findProjectRoot(appDir);
                if (!projectRoot) throw new Error('Root not found');
                if (projectRoot !== appDir) {
                    const tempPlace = path.join(tmpDir, `final-${appId}`);
                    fs.mkdirSync(tempPlace, { recursive: true });
                    moveContents(projectRoot, tempPlace);
                    fs.rmSync(appDir, { recursive: true, force: true });
                    fs.mkdirSync(appDir, { recursive: true });
                    moveContents(tempPlace, appDir);
                    fs.rmSync(tempPlace, { recursive: true, force: true });
                }

                const { dockerfile, dockerignore, internalPort, framework } = detectAppType(appDir);
                fs.writeFileSync(path.join(appDir, 'Dockerfile'), dockerfile);
                fs.writeFileSync(path.join(appDir, '.dockerignore'), dockerignore);

                ['node_modules', '.next', '.git', 'dist', 'out', 'build'].forEach(dir => {
                    const fullPath = path.join(appDir, dir);
                    if (fs.existsSync(fullPath)) fs.rmSync(fullPath, { recursive: true, force: true });
                });

                const app = await prisma.app.create({
                    data: {
                        id: appId,
                        name: fields.name || 'New Tool',
                        description: fields.description || `${framework} application`,
                        category: fields.category || 'General',
                        icon: fields.icon || '🚀',
                        color: fields.color || 'from-blue-500 to-indigo-500',
                        localPath: `apps/${appId}`,
                        dockerImage: `c0mpile/${appId}`,
                        internalPort,
                    },
                });

                if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
                res.status(200).json({ success: true, app });
                resolve(undefined);
            } catch (error: any) {
                res.status(500).json({ success: false, message: error.message });
                resolve(undefined);
            }
        });
        req.pipe(busboy);
    });
}
