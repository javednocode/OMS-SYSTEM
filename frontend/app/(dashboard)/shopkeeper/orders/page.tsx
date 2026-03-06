"use client";

import { useEffect, useState } from "react";
import { Package } from "lucide-react";

export default function OrderHistoryPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("oms_token");
                const res = await fetch("http://localhost:4000/api/shopkeeper/orders", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                setOrders(await res.json());
            } catch (e) {
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Order History</h1>
                <p className="text-slate-500">Track your past and current orders.</p>
            </div>

            <div className="space-y-6">
                {orders.map(order => (
                    <div key={order.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                            <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Order Placed</p>
                                <p className="text-slate-900 font-medium">{new Date(order.createdAt).toLocaleString()}</p>
                                <p className="text-xs text-slate-400 mt-1">ID: {order.id}</p>
                            </div>
                            <div className="text-right">
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                        order.status === 'OUT_FOR_DELIVERY' ? 'bg-blue-100 text-blue-800' :
                                            order.status === 'PACKED' ? 'bg-purple-100 text-purple-800' :
                                                'bg-orange-100 text-orange-800' // PENDING
                                    }`}>
                                    {order.status.replace("_", " ")}
                                </span>
                                <p className="font-bold text-lg text-slate-900 mt-2">Total: ${order.totalAmount.toFixed(2)}</p>
                            </div>
                        </div>

                        <div className="p-5">
                            <h4 className="font-semibold text-slate-700 flex items-center gap-2 mb-4">
                                <Package className="w-4 h-4" /> Ordered Items
                            </h4>
                            <div className="space-y-3">
                                {order.items.map((item: any) => (
                                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0 last:pb-0">
                                        <div className="flex-1">
                                            <p className="font-medium text-slate-800">{item.product.name}</p>
                                            <p className="text-sm text-slate-500">{item.quantity} x ${item.price.toFixed(2)}</p>
                                        </div>
                                        <div className="font-semibold text-slate-700">
                                            ${(item.quantity * item.price).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
                {orders.length === 0 && (
                    <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
                        You haven't placed any orders yet.
                    </div>
                )}
            </div>
        </div>
    );
}
