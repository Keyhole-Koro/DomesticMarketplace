require('ts-node').register({
    compilerOptions: {
        module: "CommonJS",
        esModuleInterop: true
    }
});
const next = require('next');
const { createServer } = require('http');
const { parse } = require('url');
const httpProxy = require('http-proxy');
const { stopApp, getRunningContainerPort } = require('./src/lib/docker');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const proxy = httpProxy.createProxyServer({ xfwd: true });

// Handle proxy errors (e.g., app still starting)
proxy.on('error', (err, req, res) => {
    console.error(`Proxy Error: ${err.message}`);
    // Prevent crash on ECONNRESET or other socket errors
    if (res.headersSent) return;
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end('The application is starting or unavailable. Please refresh in a few seconds.');
});

// Handle redirects from the proxied app
proxy.on('proxyRes', (proxyRes, req, res) => {
    const appId = req.appId;
    if (appId && proxyRes.headers.location) {
        let location = proxyRes.headers.location;
        const host = req.headers.host || 'localhost:3000';

        // 1. Handle absolute redirects back to the host (e.g., http://localhost:3000/ja)
        if (location.includes(host) && !location.includes(`/active-apps/${appId}`)) {
            const urlObj = new URL(location);
            proxyRes.headers.location = `/active-apps/${appId}${urlObj.pathname}${urlObj.search}`;
        }
        // 2. Handle relative redirects within the container (starting with /)
        else if (location.startsWith('/') && !location.startsWith(`/active-apps/${appId}`)) {
            proxyRes.headers.location = `/active-apps/${appId}${location}`;
        }
    }
});

// Prevent process exit on some network-related uncaught errors
process.on('uncaughtException', (err) => {
    if (err.code === 'ECONNRESET' || err.code === 'EPIPE') {
        console.warn('Recovered from socket error:', err.message);
        return;
    }
    console.error('Uncaught Exception:', err);
    // For other errors, we might still want to exit, but let's be cautious
});

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
            const parts = pathname.split('/'); // ['', 'active-apps', appId, ...rest]
            const appId = parts[2];
            req.appId = appId;
            let targetPort = await getRunningContainerPort(appId);

            // If no container matched, the URL may be a relative asset that lost the appId segment.
            // e.g. browser requested /active-apps/styles.css instead of /active-apps/{uuid}/styles.css
            // Fall back to the Referer header to find the real appId.
            if (!targetPort) {
                const referer = req.headers.referer;
                if (referer && referer.includes('/active-apps/')) {
                    const match = referer.match(/\/active-apps\/([^/?#]+)/);
                    if (match) {
                        const realAppId = match[1];
                        const refererPort = await getRunningContainerPort(realAppId);
                        if (refererPort) {
                            req.appId = realAppId;
                            lastActivity.set(realAppId, Date.now());
                            // The asset path is everything after /active-apps/
                            const assetPath = '/' + parts.slice(2).join('/');
                            req.url = assetPath;
                            return proxy.web(req, res, { target: `http://localhost:${refererPort}` });
                        }
                    }
                }
            }

            if (targetPort) {
                lastActivity.set(appId, Date.now());
                const targetPath = pathname.replace(`/active-apps/${appId}`, '') || '/';
                req.url = targetPath;
                return proxy.web(req, res, { target: `http://localhost:${targetPort}` });
            }
        } else {
            // Fallback for static assets requested from root but belonging to a proxied app
            const referer = req.headers.referer;
            if (referer && referer.includes('/active-apps/')) {
                const match = referer.match(/\/active-apps\/([^/?#]+)/);
                if (match) {
                    const appId = match[1];
                    req.appId = appId;
                    const targetPort = await getRunningContainerPort(appId);
                    if (targetPort) {
                        lastActivity.set(appId, Date.now());
                        return proxy.web(req, res, { target: `http://localhost:${targetPort}` });
                    }
                }
            }
        }

        handle(req, res, parsedUrl);

    }).listen(3000, (err) => {
        if (err) throw err;
        console.log('> Ready on http://localhost:3000');
    });
});

