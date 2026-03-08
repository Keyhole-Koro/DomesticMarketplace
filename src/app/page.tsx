"use client";

import { useState, useEffect } from "react";

interface App {
    id: string;
    name: string;
    description: string;
    category: string;
    icon: string;
    color: string;
    localPath: string;
}

export default function Marketplace() {
    const [apps, setApps] = useState<App[]>([]);
    const [launching, setLaunching] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);

    const fetchApps = () => {
        setLoading(true);
        fetch("/api/apps")
            .then((res) => res.json())
            .then((data) => {
                setApps(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch apps", err);
                setLoading(false);
            });
    };

    useEffect(() => { fetchApps(); }, []);

    const handleLaunch = async (appId: string) => {
        setLaunching(appId);
        try {
            const res = await fetch("/api/apps/launch", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ appId }),
            });
            const data = await res.json();
            if (data.success) {
                window.open(data.url, "_blank");
            } else {
                alert("Launch failed: " + data.message);
            }
        } catch (e) {
            alert("Error launching app");
        } finally {
            setLaunching(null);
        }
    };

    const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setUploading(true);
        const formData = new FormData(e.currentTarget);
        try {
            const res = await fetch("/api/apps/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (data.success) {
                setIsModalOpen(false);
                fetchApps();
            } else {
                alert("Upload failed: " + data.message);
            }
        } catch (e) {
            alert("Error uploading");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent, appId: string, name: string) => {
        e.stopPropagation();
        if (!confirm(`Delete "${name}"?`)) return;
        try {
            const res = await fetch("/api/apps/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ appId }),
            });
            const data = await res.json();
            if (data.success) fetchApps();
            else alert("Delete failed: " + data.message);
        } catch (e) {
            alert("Error deleting");
        }
    };

    return (
        <div className="min-h-screen p-8 bg-gradient-to-b from-[#020205] to-[#0a0a15] text-white">
            <nav className="mb-12 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">c0mpile Marketplace</h1>
                    <p className="text-gray-400 mt-2">Internal Tools & Business Apps Store</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => setIsModalOpen(true)} className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold hover:opacity-90 transition shadow-lg shadow-purple-500/20">+ Register Tool</button>
                </div>
            </nav>

            {loading ? (
                <div className="flex justify-center h-64 items-center"><div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {apps.map((app) => (
                        <div key={app.id} className="glass group relative p-6 rounded-3xl transition-all hover:scale-[1.02] hover:glow cursor-pointer">
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${app.color} opacity-10 blur-3xl -mr-16 -mt-16 group-hover:opacity-20 transition-opacity`}></div>
                            <div className="flex items-start justify-between mb-6">
                                <span className="text-5xl">{app.icon}</span>
                                <div className="flex flex-col items-end gap-2">
                                    <span className="text-xs font-mono uppercase text-gray-400 bg-white/5 px-2 py-1 rounded">{app.category}</span>
                                    <button onClick={(e) => handleDelete(e, app.id, app.name)} className="p-2 rounded-full hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </div>
                            <h2 className="text-xl font-bold mb-2">{app.name}</h2>
                            <p className="text-gray-400 text-sm mb-8 leading-relaxed">{app.description}</p>
                            <button onClick={() => handleLaunch(app.id)} disabled={launching !== null} className="w-full py-3 rounded-2xl bg-white/5 border border-white/10 font-semibold hover:bg-white/10 transition-all">
                                {launching === app.id ? "Launching..." : "Open →"}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="glass w-full max-w-lg rounded-3xl p-8">
                        <h2 className="text-2xl font-bold mb-6">Register Tool</h2>
                        <form onSubmit={handleUpload} className="space-y-4">
                            <input name="name" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none" placeholder="Tool Name" />
                            <textarea name="description" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none h-20" placeholder="Description" />
                            <div className="grid grid-cols-2 gap-4">
                                <select name="category" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none">
                                    <option value="Utility">Utility</option><option value="Data">Data</option><option value="DevTools">DevTools</option>
                                </select>
                                <input name="icon" defaultValue="🚀" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none" />
                            </div>
                            <input type="file" name="file" accept=".zip" required className="w-full text-sm text-gray-400" />
                            <div className="flex gap-4 mt-8">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 glass rounded-2xl font-semibold">Cancel</button>
                                <button type="submit" disabled={uploading} className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold disabled:opacity-50">{uploading ? "Uploading..." : "Register"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
