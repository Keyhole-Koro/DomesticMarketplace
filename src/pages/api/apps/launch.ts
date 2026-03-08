import { NextApiRequest, NextApiResponse } from 'next';
import { launchApp } from '@/lib/docker';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
    const { appId } = req.body;
    try {
        const port = await launchApp(appId);
        res.status(200).json({ success: true, url: `http://localhost:3000/active-apps/${appId}`, port });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}
