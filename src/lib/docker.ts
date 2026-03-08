import Docker from 'dockerode';
import path from 'path';
import fs from 'fs';
import tar from 'tar-fs';

const docker = new Docker({ socketPath: '/var/run/docker.sock' });
import { prisma } from './prisma';

async function buildImage(localPath: string, imageName: string): Promise<void> {
    const absolutePath = path.resolve(process.cwd(), localPath);
    if (!fs.existsSync(absolutePath)) throw new Error(`Path missing: ${absolutePath}`);

    console.log(`Building image ${imageName} from ${absolutePath}...`);
    const pack = tar.pack(absolutePath);
    const stream = await docker.buildImage(pack, { t: imageName });

    await new Promise((resolve, reject) => {
        docker.modem.followProgress(stream, (err, res) => {
            if (err) return reject(err);
            const hasError = res && res.some((item: any) => item.error);
            if (hasError) {
                const errorDetail = res.find((item: any) => item.error).error;
                return reject(new Error(`Docker build failed: ${errorDetail}`));
            }
            resolve(res);
        }, (event) => {
            if (event.stream) process.stdout.write(event.stream);
        });
    });
}

export async function getRunningContainerPort(appId: string): Promise<number | null> {
    const containers = await docker.listContainers();
    const container = containers.find((c: any) => c.Labels && c.Labels['app-id'] === appId);
    return (container && container.Ports[0]) ? container.Ports[0].PublicPort : null;
}

export async function launchApp(appId: string): Promise<number> {
    const app = await prisma.app.findUnique({ where: { id: appId } });
    if (!app) throw new Error('App not found');

    const existingPort = await getRunningContainerPort(appId);
    if (existingPort) return existingPort;

    const images = await docker.listImages();
    const imageExists = images.some(img => img.RepoTags?.includes(app.dockerImage) || img.RepoTags?.includes(`${app.dockerImage}:latest`));

    if (!imageExists) await buildImage(app.localPath, app.dockerImage);

    const container = await docker.createContainer({
        Image: app.dockerImage,
        Labels: { 'app-id': appId },
        HostConfig: {
            PortBindings: { [`${app.internalPort}/tcp`]: [{ HostPort: '' }] },
            Memory: 512 * 1024 * 1024, // 512MB limit
            NanoCpus: 50 * 1000000, // 0.5 CPU limit
        },
    });

    await container.start();
    const info = await container.inspect();
    const publicPort = info.NetworkSettings.Ports[`${app.internalPort}/tcp`][0].HostPort;
    return parseInt(publicPort, 10);
}

export async function stopApp(appId: string): Promise<void> {
    const containers = await docker.listContainers({ all: true });
    const containerInfo = containers.find((c: any) => c.Labels && c.Labels['app-id'] === appId);
    if (containerInfo && containerInfo.State === 'running') {
        await docker.getContainer(containerInfo.Id).stop();
    }
}

export async function deleteAppResources(appId: string, imageName: string): Promise<void> {
    const containers = await docker.listContainers({ all: true });
    const appContainers = containers.filter((c: any) => c.Labels && c.Labels['app-id'] === appId);

    for (const cInfo of appContainers) {
        const container = docker.getContainer(cInfo.Id);
        if (cInfo.State === 'running') await container.stop().catch(() => { });
        await container.remove().catch(() => { });
    }

    const images = await docker.listImages();
    const image = images.find(img => img.RepoTags?.includes(imageName) || img.RepoTags?.includes(`${imageName}:latest`));
    if (image) await docker.getImage(image.Id).remove({ force: true }).catch(() => { });
}
