module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/src/lib/detector.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "detectAppType",
    ()=>detectAppType
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
function detectAppType(appPath) {
    const pkgPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(appPath, 'package.json');
    const hasPkg = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(pkgPath);
    const commonIgnore = `
node_modules
.next
dist
.git
*.zip
Dockerfile
.dockerignore
`.trim();
    if (hasPkg) {
        const pkg = JSON.parse(__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(pkgPath, 'utf-8'));
        const deps = {
            ...pkg.dependencies,
            ...pkg.devDependencies
        };
        if (deps['next']) {
            return {
                framework: 'Next.js',
                internalPort: 3000,
                dockerignore: commonIgnore,
                dockerfile: `
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Next.js build often needs more memory
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
`.trim()
            };
        }
        // Generic Node.js / Vite / etc.
        return {
            framework: 'Node.js',
            internalPort: 5173,
            dockerignore: commonIgnore,
            dockerfile: `
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm install -g serve
EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
`.trim()
        };
    }
    // Fallback to Static HTML
    return {
        framework: 'Static HTML',
        internalPort: 80,
        dockerignore: commonIgnore,
        dockerfile: `
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
`.trim()
    };
}
}),
"[project]/src/pages/api/apps/upload.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "config",
    ()=>config,
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$busboy__$5b$external$5d$__$28$busboy$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$busboy$29$__ = __turbopack_context__.i("[externals]/busboy [external] (busboy, cjs, [project]/node_modules/busboy)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$unzipper__$5b$external$5d$__$28$unzipper$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$unzipper$29$__ = __turbopack_context__.i("[externals]/unzipper [external] (unzipper, cjs, [project]/node_modules/unzipper)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$detector$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/detector.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$uuid__$5b$external$5d$__$28$uuid$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$uuid$29$__ = __turbopack_context__.i("[externals]/uuid [external] (uuid, esm_import, [project]/node_modules/uuid)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$uuid__$5b$external$5d$__$28$uuid$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$uuid$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$uuid__$5b$external$5d$__$28$uuid$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$uuid$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
const prisma = new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]();
const config = {
    api: {
        bodyParser: false
    }
};
/**
 * Robustly find the directory containing package.json or index.html
 */ function findProjectRoot(dir, depth = 0) {
    if (depth > 5) return null; // Avoid deep recursion
    const items = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readdirSync(dir);
    // Look for package.json or index.html in the current directory
    if (items.includes('package.json')) return dir;
    if (items.includes('index.html')) return dir;
    // Search in subdirectories
    for (const item of items){
        const fullPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(dir, item);
        if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].statSync(fullPath).isDirectory() && item !== '__MACOSX' && !item.startsWith('.')) {
            const result = findProjectRoot(fullPath, depth + 1);
            if (result) return result;
        }
    }
    return null;
}
function moveContents(sourceDir, targetDir) {
    if (sourceDir === targetDir) return;
    const items = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readdirSync(sourceDir);
    items.forEach((item)=>{
        const src = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(sourceDir, item);
        const dest = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(targetDir, item);
        if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(dest)) __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].rmSync(dest, {
            recursive: true,
            force: true
        });
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].renameSync(src, dest);
    });
}
function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({
        message: 'Method not allowed'
    });
    return new Promise((resolve)=>{
        const busboy = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$busboy__$5b$external$5d$__$28$busboy$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$busboy$29$__["default"])({
            headers: req.headers
        });
        const fields = {};
        let zipPath = '';
        const appId = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$uuid__$5b$external$5d$__$28$uuid$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$uuid$29$__["v4"])();
        const tmpDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'tmp');
        if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(tmpDir)) __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].mkdirSync(tmpDir, {
            recursive: true
        });
        let fileWritePromise = Promise.resolve();
        busboy.on('field', (name, val)=>{
            fields[name] = val;
        });
        busboy.on('file', (name, file, info)=>{
            const saveTo = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(tmpDir, `upload-${appId}.zip`);
            zipPath = saveTo;
            const writeStream = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].createWriteStream(saveTo);
            file.pipe(writeStream);
            fileWritePromise = new Promise((resFile, rejFile)=>{
                writeStream.on('finish', resFile);
                writeStream.on('error', rejFile);
            });
        });
        busboy.on('finish', async ()=>{
            try {
                await fileWritePromise;
                if (!zipPath || !__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(zipPath)) throw new Error('Upload failed');
                const appDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'apps', appId);
                __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].mkdirSync(appDir, {
                    recursive: true
                });
                // 1. Extract ZIP
                await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].createReadStream(zipPath).pipe(__TURBOPACK__imported__module__$5b$externals$5d2f$unzipper__$5b$external$5d$__$28$unzipper$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$unzipper$29$__["default"].Extract({
                    path: appDir
                })).promise();
                // 2. FIND ACTUAL PROJECT ROOT
                const projectRoot = findProjectRoot(appDir);
                if (!projectRoot) throw new Error('Could not find package.json or index.html in the ZIP.');
                // 3. FLATTEN: Move everything from projectRoot to a temporary location, then back to appDir
                if (projectRoot !== appDir) {
                    const tempPlace = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(tmpDir, `final-${appId}`);
                    __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].mkdirSync(tempPlace, {
                        recursive: true
                    });
                    moveContents(projectRoot, tempPlace);
                    // Clear the messy extraction appDir completely
                    __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].rmSync(appDir, {
                        recursive: true,
                        force: true
                    });
                    __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].mkdirSync(appDir, {
                        recursive: true
                    });
                    // Move back to root appDir
                    moveContents(tempPlace, appDir);
                    __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].rmSync(tempPlace, {
                        recursive: true,
                        force: true
                    });
                }
                // 4. Detect frameworks and generate Docker files
                const { dockerfile, dockerignore, internalPort, framework } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$detector$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["detectAppType"])(appDir);
                __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(appDir, 'Dockerfile'), dockerfile);
                __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(appDir, '.dockerignore'), dockerignore);
                // 5. SECURE CLEANUP (ensure node_modules etc are gone before build)
                [
                    'node_modules',
                    '.next',
                    '.git',
                    'dist',
                    'out',
                    'build'
                ].forEach((dir)=>{
                    const fullPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(appDir, dir);
                    if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(fullPath)) __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].rmSync(fullPath, {
                        recursive: true,
                        force: true
                    });
                });
                // 6. Register in DB
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
                        internalPort
                    }
                });
                if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(zipPath)) __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].unlinkSync(zipPath);
                res.status(200).json({
                    success: true,
                    app
                });
                resolve(undefined);
            } catch (error) {
                console.error('Upload error:', error);
                res.status(500).json({
                    success: false,
                    message: error.message
                });
                resolve(undefined);
            }
        });
        req.pipe(busboy);
    });
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__cd20eeff._.js.map