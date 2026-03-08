require('ts-node/register');
const next = require('next');
const { createServer } = require('http');
const { parse } = require('url');
const httpProxy = require('http-proxy');
const { stopApp, getRunningContainerPort } = require('./src/lib/docker');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const proxy = httpProxy.createProxyServer({});

// Activity Tracking
const lastActivity = new Map();
const IDLE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

setInterval(async () => {
    const now = Date.now();
    for (const [appId, lastTime] of lastActivity.entries()) {
        if (now - lastTime > IDLE_TIMEOUT) {
            console.log(`App ${appId} idle for 5 min. Stopping...`);
            lastActivity.delete(appId);
            try { await stopApp(appId); } catch (e) { console.error(e); }
        }
    }
}, 60000);

app.prepare().then(() => {
    createServer(async (req, res) => {
        const parsedUrl = parse(req.url, true);
        const { pathname } = parsedUrl;

        if (pathname.startsWith('/active-apps/')) {
            const appId = pathname.split('/')[2];
            const targetPort = await getRunningContainerPort(appId);

            if (targetPort) {
                lastActivity.set(appId, Date.now());
                const targetPath = pathname.replace(`/active-apps/${appId}`, '') || '/';
                req.url = targetPath;
                return proxy.web(req, res, { target: `http://localhost:${targetPort}` });
            }
        }

        handle(req, res, parsedUrl);
    }).listen(3000, (err) => {
        if (err) throw err;
        console.log('> Ready on http://localhost:3000');
    });
});
