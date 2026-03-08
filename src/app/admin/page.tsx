"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function AdminDashboard() {
    const { data: session } = useSession();
    const [apps, setApps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAllApps = () => {
        setLoading(true);
        fetch("/api/apps")
            .then(res => res.json())
            .then(data => {
                setApps(data);
                setLoading(false);
            });
    };

    useEffect(() => { fetchAllApps(); }, []);

    const handleStatusUpdate = async (appId: string, status: string) => {
        const res = await fetch("/api/admin/approve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ appId, status }),
        });
        const data = await res.json();
        if (data.success) fetchAllApps();
        else alert(data.message);
    };

    if (!session || (session.user as any).role !== 'ADMIN') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#020205] text-white">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">403</h1>
                    <p className="text-gray-400 mb-8">Unauthorized: Admin access required</p>
                    <Link href="/" className="px-6 py-2 glass rounded-full font-bold">Back to Marketplace</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8 bg-[#020205] text-white">
            <header className="mb-12 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Admin Console</h1>
                    <p className="text-gray-400">Approval Queue & Governance</p>
                </div>
                <Link href="/" className="px-6 py-2 glass rounded-full font-bold">← Marketplace</Link>
            </header>

            <div className="glass rounded-3xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/10 text-xs uppercase tracking-widest text-gray-500">
                        <tr>
                            <th className="p-6">Tool</th>
                            <th className="p-6">Author</th>
                            <th className="p-6">Status</th>
                            <th className="p-6">Submitted</th>
                            <th className="p-6">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {apps.map(app => (
                            <tr key={app.id} className="hover:bg-white/[0.02] transition">
                                <td className="p-6">
                                    <div className="flex items-center gap-4">
                                        <span className="text-3xl">{app.icon}</span>
                                        <div>
                                            <p className="font-bold">{app.name}</p>
                                            <p className="text-xs text-gray-500">{app.category}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6 text-sm text-gray-300">{app.author?.name || 'Unknown'}</td>
                                <td className="p-6">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${app.status === 'PUBLISHED' ? 'bg-green-500/20 text-green-400' :
                                            app.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-400'
                                        }`}>
                                        {app.status}
                                    </span>
                                </td>
                                <td className="p-6 text-sm text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                                <td className="p-6">
                                    <div className="flex gap-2">
                                        {app.status !== 'PUBLISHED' && (
                                            <button onClick={() => handleStatusUpdate(app.id, 'PUBLISHED')} className="px-3 py-1 bg-green-600 rounded-lg text-xs font-bold hover:bg-green-500">Approve</button>
                                        )}
                                        {app.status !== 'REJECTED' && (
                                            <button onClick={() => handleStatusUpdate(app.id, 'REJECTED')} className="px-3 py-1 bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold hover:bg-red-500/30">Reject</button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
