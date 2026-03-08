import fs from 'fs';
import path from 'path';

export interface DetectionResult {
    dockerfile: string;
    dockerignore: string;
    internalPort: number;
    framework: string;
}

export function detectAppType(appPath: string): DetectionResult {
    const pkgPath = path.join(appPath, 'package.json');
    const hasPkg = fs.existsSync(pkgPath);

    const commonIgnore = `node_modules\n.next\ndist\n.git\n*.zip\nDockerfile\n.dockerignore`.trim();

    if (hasPkg) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };

        if (deps['next']) {
            return {
                framework: 'Next.js',
                internalPort: 3000,
                dockerignore: commonIgnore,
                dockerfile: `FROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nENV NODE_OPTIONS="--max-old-space-size=4096"\nRUN npm run build\nEXPOSE 3000\nCMD ["npm", "start"]`.trim(),
            };
        }
        return {
            framework: 'Node.js',
            internalPort: 5173,
            dockerignore: commonIgnore,
            dockerfile: `FROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nRUN npm run build\nRUN npm install -g serve\nEXPOSE 5173\nCMD ["serve", "-s", "dist", "-l", "5173"]`.trim(),
        };
    }

    return {
        framework: 'Static HTML',
        internalPort: 80,
        dockerignore: commonIgnore,
        dockerfile: `FROM nginx:alpine\nCOPY . /usr/share/nginx/html\nEXPOSE 80`.trim(),
    };
}
