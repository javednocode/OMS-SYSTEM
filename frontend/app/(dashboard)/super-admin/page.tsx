"use client";

import { useEffect, useState } from "react";

export default function SuperAdminPage() {
    const [analytics, setAnalytics] = useState<any>(null);
    const [distributors, setDistributors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newDistributor, setNewDistributor] = useState({ name: "", email: "", password: "" });
    const [editDistributorData, setEditDistributorData] = useState<any>(null);

    // Helpers to format dates for <input type="date">
    const formatDateForInput = (dateString: string | null) => {
        if (!dateString) return "";
        return new Date(dateString).toISOString().split('T')[0];
    };
    const fetchDashboard = async () => {
        try {
            const token = localStorage.getItem("oms_token");
            const headers = { "Authorization": `Bearer ${token}` };

            const [resAnalytics, resDistributors] = await Promise.all([
                fetch("http://localhost:4000/api/admin/analytics", { headers }),
                fetch("http://localhost:4000/api/admin/distributors", { headers })
            ]);

            const dataAnalytics = await resAnalytics.json();
            const dataDistributors = await resDistributors.json();

            setAnalytics(dataAnalytics);
            setDistributors(dataDistributors);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const handleCreateDistributor = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("oms_token");
            const res = await fetch("http://localhost:4000/api/admin/distributors", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newDistributor)
            });
            if (res.ok) {
                setShowModal(false);
                setNewDistributor({ name: "", email: "", password: "" });
                fetchDashboard();
            }
        } catch (e) {
            console.error(e);
        }
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            const token = localStorage.getItem("oms_token");
            await fetch(`http://localhost:4000/api/admin/distributors/${id}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ isActive: !currentStatus })
            });
            fetchDashboard();
        } catch (e) {
            console.error(e);
        }
    };

    const handleEditDistributor = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("oms_token");
            const res = await fetch(`http://localhost:4000/api/admin/distributors/${editDistributorData.id}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(editDistributorData)
            });
            if (res.ok) {
                setShowEditModal(false);
                setEditDistributorData(null);
                fetchDashboard();
            }
        } catch (e) {
            console.error(e);
        }
    };

    const openEditModal = (dist: any) => {
        setEditDistributorData({
            id: dist.id,
            name: dist.name,
            email: dist.email,
            password: "",
            isActive: dist.isActive,
            subscriptionStartDate: formatDateForInput(dist.subscriptionStartDate),
            subscriptionEndDate: formatDateForInput(dist.subscriptionEndDate)
        });
        setShowEditModal(true);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Super Admin Dashboard</h1>
                <p className="text-slate-500">Overview of system analytics and distributor management.</p>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: "Distributors", value: analytics?.distributorsCount || 0 },
                    { label: "Shopkeepers", value: analytics?.shopkeepersCount || 0 },
                    { label: "Total Orders", value: analytics?.totalOrders || 0 },
                    { label: "Total Revenue", value: `$${analytics?.totalRevenue?.toFixed(2) || "0.00"}` },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
                        <h3 className="text-sm font-medium text-slate-500 mb-1">{stat.label}</h3>
                        <p className="text-3xl font-semibold text-slate-800">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Distributors Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-800">Distributors</h2>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
                    >
                        + Add Distributor
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-sm">
                                <th className="px-6 py-4 font-medium">Name</th>
                                <th className="px-6 py-4 font-medium">Email</th>
                                <th className="px-6 py-4 font-medium">Account Status</th>
                                <th className="px-6 py-4 font-medium">Sub End Date</th>
                                <th className="px-6 py-4 font-medium">Sub Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {distributors.map(dist => {
                                const isSubExpired = dist.subscriptionEndDate ? new Date() > new Date(dist.subscriptionEndDate) : false;
                                return (
                                    <tr key={dist.id} className="hover:bg-slate-50 transition">
                                        <td className="px-6 py-4 text-sm text-slate-900 font-medium">{dist.name}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500">{dist.email}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${dist.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {dist.isActive ? 'Active' : 'Disabled'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {dist.subscriptionEndDate ? new Date(dist.subscriptionEndDate).toLocaleDateString() : '—'}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${!isSubExpired ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'}`}>
                                                {isSubExpired ? 'Expired' : 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right space-x-3">
                                            <button
                                                onClick={() => openEditModal(dist)}
                                                className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => toggleStatus(dist.id, dist.isActive)}
                                                className={`text-sm font-medium ${dist.isActive ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                                            >
                                                {dist.isActive ? 'Disable' : 'Enable'}
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                            {distributors.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500 text-sm">No distributors found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for Creating Distributor */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-800">Add New Distributor</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-xl leading-none">&times;</button>
                        </div>
                        <form onSubmit={handleCreateDistributor} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                <input required type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={newDistributor.name} onChange={e => setNewDistributor({ ...newDistributor, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input required type="email" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={newDistributor.email} onChange={e => setNewDistributor({ ...newDistributor, email: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                                <input required type="password" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={newDistributor.password} onChange={e => setNewDistributor({ ...newDistributor, password: e.target.value })} />
                            </div>
                            <div className="pt-4 flex justify-end space-x-3">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal for Editing Distributor */}
            {showEditModal && editDistributorData && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-800">Edit Distributor</h3>
                            <button onClick={() => { setShowEditModal(false); setEditDistributorData(null); }} className="text-slate-400 hover:text-slate-600 text-xl leading-none">&times;</button>
                        </div>
                        <form onSubmit={handleEditDistributor} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                    <input required type="text" className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={editDistributorData.name || ""} onChange={e => setEditDistributorData({ ...editDistributorData, name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                    <input required type="email" className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={editDistributorData.email || ""} onChange={e => setEditDistributorData({ ...editDistributorData, email: e.target.value })} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Update Password (Optional)</label>
                                <input type="password" placeholder="Leave blank to keep unchanged" className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={editDistributorData.password || ""} onChange={e => setEditDistributorData({ ...editDistributorData, password: e.target.value })} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Subscription Start Date</label>
                                    <input type="date" className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={editDistributorData.subscriptionStartDate || ""} onChange={e => setEditDistributorData({ ...editDistributorData, subscriptionStartDate: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Subscription End Date</label>
                                    <input type="date" className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={editDistributorData.subscriptionEndDate || ""} onChange={e => setEditDistributorData({ ...editDistributorData, subscriptionEndDate: e.target.value })} />
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center space-x-2">
                                    <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300"
                                        checked={editDistributorData.isActive} onChange={e => setEditDistributorData({ ...editDistributorData, isActive: e.target.checked })} />
                                    <span className="text-sm font-medium text-slate-700">Account Active</span>
                                </label>
                            </div>

                            <div className="pt-4 flex justify-end space-x-3">
                                <button type="button" onClick={() => { setShowEditModal(false); setEditDistributorData(null); }} className="px-4 py-2 text-sm text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
