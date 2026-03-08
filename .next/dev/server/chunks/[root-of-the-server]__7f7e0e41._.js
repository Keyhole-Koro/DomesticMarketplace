module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[project]/src/lib/docker.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getRunningContainerPort",
    ()=>getRunningContainerPort,
    "launchApp",
    ()=>launchApp,
    "stopApp",
    ()=>stopApp
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$dockerode__$5b$external$5d$__$28$dockerode$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$dockerode$29$__ = __turbopack_context__.i("[externals]/dockerode [external] (dockerode, cjs, [project]/node_modules/dockerode)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$tar$2d$fs__$5b$external$5d$__$28$tar$2d$fs$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$tar$2d$fs$29$__ = __turbopack_context__.i("[externals]/tar-fs [external] (tar-fs, cjs, [project]/node_modules/tar-fs)");
;
;
;
;
;
const docker = new __TURBOPACK__imported__module__$5b$externals$5d2f$dockerode__$5b$external$5d$__$28$dockerode$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$dockerode$29$__["default"]({
    socketPath: '/var/run/docker.sock'
});
const prisma = new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]();
// Function to build an image from a local directory
async function buildImage(localPath, imageName) {
    const absolutePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].resolve(process.cwd(), localPath);
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(absolutePath)) {
        throw new Error(`Local path does not exist: ${absolutePath}`);
    }
    console.log(`Building image ${imageName} from ${absolutePath}...`);
    // Create a tar stream of the directory
    const pack = __TURBOPACK__imported__module__$5b$externals$5d2f$tar$2d$fs__$5b$external$5d$__$28$tar$2d$fs$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$tar$2d$fs$29$__["default"].pack(absolutePath);
    const stream = await docker.buildImage(pack, {
        t: imageName
    });
    await new Promise((resolve, reject)=>{
        docker.modem.followProgress(stream, (err, res)=>{
            if (err) return reject(err);
            // Check for build errors in the response
            const hasError = res && res.some((item)=>item.error);
            if (hasError) {
                const errorDetail = res.find((item)=>item.error).error;
                return reject(new Error(`Docker build failed: ${errorDetail}`));
            }
            resolve(res);
        }, (event)=>{
            if (event.stream) {
                process.stdout.write(event.stream);
            }
        });
    });
}
async function getRunningContainerPort(appId) {
    const containers = await docker.listContainers();
    const container = containers.find((c)=>c.Labels && c.Labels['app-id'] === appId);
    if (container && container.Ports[0]) {
        return container.Ports[0].PublicPort;
    }
    return null;
}
async function launchApp(appId) {
    // 1. Fetch app config from DB
    const app = await prisma.app.findUnique({
        where: {
            id: appId
        }
    });
    if (!app) throw new Error('App not found in database');
    // 2. Check if already running
    const existingPort = await getRunningContainerPort(appId);
    if (existingPort) return existingPort;
    // 3. Ensure image exists (for MVP, we build if it's missing)
    const images = await docker.listImages();
    const imageExists = images.some((img)=>img.RepoTags?.includes(app.dockerImage));
    if (!imageExists) {
        await buildImage(app.localPath, app.dockerImage);
    }
    // 4. Create and start container
    const container = await docker.createContainer({
        Image: app.dockerImage,
        Labels: {
            'app-id': appId
        },
        HostConfig: {
            PortBindings: {
                [`${app.internalPort}/tcp`]: [
                    {
                        HostPort: ''
                    }
                ]
            }
        }
    });
    await container.start();
    // 5. Get the assigned port
    const info = await container.inspect();
    const publicPort = info.NetworkSettings.Ports[`${app.internalPort}/tcp`][0].HostPort;
    return parseInt(publicPort, 10);
}
async function stopApp(appId) {
    const containers = await docker.listContainers({
        all: true
    });
    const containerInfo = containers.find((c)=>c.Labels && c.Labels['app-id'] === appId);
    if (containerInfo) {
        const container = docker.getContainer(containerInfo.Id);
        if (containerInfo.State === 'running') {
            console.log(`Stopping container for app ${appId}...`);
            await container.stop();
        }
    }
}
}),
"[project]/src/pages/api/apps/launch.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$docker$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/docker.ts [api] (ecmascript)");
;
async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            message: 'Method not allowed'
        });
    }
    const { appId } = req.body;
    if (!appId) {
        return res.status(400).json({
            message: 'Missing appId'
        });
    }
    try {
        const port = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$docker$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["launchApp"])(appId);
        return res.status(200).json({
            success: true,
            port,
            url: `/active-apps/${appId}`
        });
    } catch (error) {
        console.error('Launch error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__7f7e0e41._.js.map