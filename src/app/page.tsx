"use client";

import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

import Link from "next/link";

interface App {
    id: string;
    name: string;
    description: string;
    category: string;
    icon: string;
    color: string;
    localPath: string;
    status: string;
    authorId?: string;
    author?: { name: string };
    reviews: { rating: number }[];
    _count: { launches: number };
}

export default function Marketplace() {
    const { data: session } = useSession();
    const [apps, setApps] = useState<App[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [showMyTools, setShowMyTools] = useState(false);
    const [launching, setLaunching] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);

    const categories = ["All", "Utility", "Data", "DevTools", "AI"];

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

    const filteredApps = Array.isArray(apps) ? apps.filter(app => {
        const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === "All" || app.category === activeCategory;
        const matchesUser = !showMyTools || app.authorId === session?.user?.id;
        return matchesSearch && matchesCategory && matchesUser;
    }) : [];

    const handleLaunch = async (appId: string) => {
        // ... existing handleLaunch ...
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
                fetchApps(); // Update launch count
            } else {
                alert("Launch failed: " + data.message);
            }
        } catch (e) {
            alert("Error launching app");
        } finally {
            setLaunching(null);
        }
    };

    const getAverageRating = (reviews: { rating: number }[]) => {
        if (reviews.length === 0) return 0;
        return (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);
    };

    const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!session) return alert("Please sign in to register tools");
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
                <div className="flex items-center gap-6">
                    {(session?.user as any)?.role === 'ADMIN' && (
                        <Link href="/admin" className="text-sm font-bold text-gray-400 hover:text-white transition">Admin Panel</Link>
                    )}
                    {session ? (
                        <div className="flex items-center gap-4 bg-white/5 pl-4 pr-1 py-1 rounded-full border border-white/10">
                            <div className="text-right">
                                <p className="text-sm font-bold leading-tight">{session.user?.name}</p>
                                <button onClick={() => signOut()} className="text-[10px] text-gray-500 hover:text-white uppercase tracking-widest">Sign Out</button>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg shadow-lg">
                                {session.user?.image ? <img src={session.user.image} className="w-full h-full rounded-full" /> : session.user?.name?.charAt(0)}
                            </div>
                        </div>
                    ) : (
                        <button onClick={() => signIn()} className="px-6 py-2 glass rounded-full font-bold hover:bg-white/10 transition">Sign In</button>
                    )}
                    <button onClick={() => setIsModalOpen(true)} className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold hover:opacity-90 transition shadow-lg shadow-purple-500/20">+ Register Tool</button>
                </div>
            </nav>

            <div className="mb-12 flex flex-col md:flex-row gap-6 items-center justify-between sticky top-0 z-20 py-4 bg-[#020205]/80 backdrop-blur-md">
                <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2 rounded-full text-sm font-bold transition ${activeCategory === cat ? 'bg-white text-black' : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'}`}
                        >
                            {cat}
                        </button>
                    ))}
                    {session && (
                        <button
                            onClick={() => setShowMyTools(!showMyTools)}
                            className={`px-5 py-2 rounded-full text-sm font-bold transition ml-4 whitespace-nowrap ${showMyTools ? 'bg-purple-600 text-white' : 'bg-purple-600/10 border border-purple-500/20 text-purple-400'}`}
                        >
                            {showMyTools ? 'Showing My Tools' : 'Show My Tools'}
                        </button>
                    )}
                </div>
                <div className="relative w-full md:w-80">
                    <input
                        type="text"
                        placeholder="Search tools..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 pl-12 outline-none focus:border-purple-500/50 transition"
                    />
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center h-64 items-center"><div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredApps.length === 0 ? (
                        <div className="col-span-full py-20 text-center glass rounded-3xl">
                            <p className="text-gray-500">No tools found matching your criteria</p>
                        </div>
                    ) : filteredApps.map((app) => (
                        <div key={app.id} className="glass group relative p-6 rounded-3xl transition-all hover:scale-[1.02] hover:glow cursor-pointer flex flex-col">
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${app.color} opacity-10 blur-3xl -mr-16 -mt-16 group-hover:opacity-20 transition-opacity`}></div>

                            {app.status !== 'PUBLISHED' && (
                                <div className="absolute top-4 left-4 z-10">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${app.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'}`}>
                                        {app.status}
                                    </span>
                                </div>
                            )}

                            <div className="flex items-start justify-between mb-6">
                                <span className="text-5xl">{app.icon}</span>
                                <div className="flex flex-col items-end gap-2">
                                    <span className="text-xs font-mono uppercase text-gray-400 bg-white/5 px-2 py-1 rounded">{app.category}</span>
                                    {(app.authorId === session?.user?.id || (session?.user as any)?.role === 'ADMIN') && (
                                        <button onClick={(e) => handleDelete(e, app.id, app.name)} className="p-2 rounded-full hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                            <h2 className="text-xl font-bold mb-2">{app.name}</h2>
                            <p className="text-gray-400 text-sm mb-4 leading-relaxed flex-grow">{app.description}</p>

                            <div className="flex items-center justify-between mb-8 text-xs text-gray-500 font-medium">
                                <div className="flex items-center gap-1">
                                    <span className="text-yellow-500">★</span>
                                    <span>{getAverageRating(app.reviews)} ({app.reviews.length})</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span>🚀 {app._count?.launches || 0} launches</span>
                                </div>
                                <div className="opacity-60">
                                    By {app.author?.name || 'Anonymous'}
                                </div>
                            </div>

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
