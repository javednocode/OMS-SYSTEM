"use client";

import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";

export default function ShopkeeperPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [cart, setCart] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem("oms_token");
                const res = await fetch("http://localhost:4000/api/shopkeeper/products", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                setProducts(await res.json());
            } catch (e) {
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const addToCart = (product: any) => {
        setCart((prev) => {
            const existing = prev.find(item => item.productId === product.id);
            if (existing) {
                if (existing.quantity >= product.stock) return prev; // max stock reached
                return prev.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { productId: product.id, name: product.name, price: product.price, quantity: 1, stock: product.stock }];
        });
    };

    const removeFromCart = (productId: string) => {
        setCart((prev) => prev.filter(item => item.productId !== productId));
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart((prev) => prev.map(item => {
            if (item.productId === productId) {
                const newQty = item.quantity + delta;
                if (newQty > 0 && newQty <= item.stock) {
                    return { ...item, quantity: newQty };
                }
            }
            return item;
        }));
    };

    const handleCheckout = async () => {
        try {
            const token = localStorage.getItem("oms_token");
            const items = cart.map(item => ({ productId: item.productId, quantity: item.quantity }));

            const res = await fetch("http://localhost:4000/api/shopkeeper/orders", {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify({ items })
            });
            if (res.ok) {
                setCart([]);
                alert("Order placed successfully!");
                // We could refresh stock here by calling fetchProducts again
                const resProd = await fetch("http://localhost:4000/api/shopkeeper/products", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                setProducts(await resProd.json());
            } else {
                const data = await res.json();
                alert(`Failed: ${data.message}`);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const newArrivals = products.filter(p => p.isNewArrival).slice(0, 8);
    // You could decide whether to hide new arrivals from the main list or show them in both. 
    // The requirement says "Add a section at the top" and "above the normal product list", 
    // it doesn't strictly say to remove them from the normal list. We'll show them in both.

    if (loading) return <div>Loading...</div>;

    return (
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto h-full">
            {/* Product Catalog */}
            <div className="flex-1">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-800">Browse Products</h1>
                    <p className="text-slate-500">Order from your distributor's catalog.</p>
                </div>

                {newArrivals.length > 0 && (
                    <div className="mb-8">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-indigo-900">New Arrivals</h2>
                            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">Latest</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {newArrivals.map(p => (
                                <div key={p.id} className="relative group bg-indigo-50/50 rounded-xl border border-indigo-100 overflow-hidden shadow-sm flex flex-col transition-shadow hover:shadow-md">
                                    <div className="absolute top-2 left-2 z-10 rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-bold tracking-wide text-white shadow-sm ring-1 ring-inset ring-red-600/20">
                                        NEW
                                    </div>
                                    {p.imageUrl ? (
                                        <div className="relative h-48 w-full overflow-hidden bg-white">
                                            <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                        </div>
                                    ) : (
                                        <div className="flex h-36 items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-50 to-white">
                                            <ShoppingCart className="h-16 w-16 text-indigo-200" />
                                        </div>
                                    )}

                                    <div className="p-5 flex-1 flex flex-col">
                                        <span className="mb-2 self-start rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-200">
                                            {p.category?.name || 'Uncategorized'}
                                        </span>
                                        <h3 className="line-clamp-2 text-lg font-bold text-slate-900">{p.name}</h3>
                                        {p.description && (
                                            <p className="mt-1 line-clamp-2 text-xs text-gray-500">{p.description}</p>
                                        )}
                                        <div className="mt-auto pt-3 text-2xl font-semibold text-slate-800">₹{p.price.toFixed(2)}</div>
                                        <div className="mt-2 text-sm text-slate-500">
                                            <span className={`px-2 py-0.5 bg-white ring-1 ring-slate-200 rounded-full ${p.stock < 10 ? 'text-orange-600 font-semibold' : ''}`}>
                                                {p.stock} Available
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4 border-t border-indigo-100 bg-white">
                                        <button
                                            onClick={() => addToCart(p)}
                                            disabled={p.stock === 0}
                                            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium rounded-lg transition"
                                        >
                                            {p.stock === 0 ? "Out of Stock" : "Add to Cart"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mb-4">
                    <h2 className="text-xl font-bold text-slate-800">All Products</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(p => (
                        <div key={p.id} className="relative group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col transition-shadow hover:shadow-md">
                            {p.isNewArrival && (
                                <div className="absolute top-2 left-2 z-10 rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-bold tracking-wide text-white shadow-sm ring-1 ring-inset ring-red-600/20">
                                    NEW
                                </div>
                            )}
                            {p.imageUrl ? (
                                <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                                    <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                </div>
                            ) : (
                                <div className="flex h-36 items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-slate-100">
                                    <ShoppingCart className="h-16 w-16 text-indigo-200" />
                                </div>
                            )}

                            <div className="p-5 flex-1 flex flex-col">
                                <span className="mb-2 self-start rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/20">
                                    {p.category?.name || 'Uncategorized'}
                                </span>
                                <h3 className="line-clamp-2 text-lg font-bold text-slate-900">{p.name}</h3>
                                {p.description && (
                                    <p className="mt-1 line-clamp-2 text-xs text-gray-500">{p.description}</p>
                                )}
                                <div className="mt-auto pt-3 text-2xl font-semibold text-slate-800">₹{p.price.toFixed(2)}</div>
                                <div className="mt-2 text-sm text-slate-500">
                                    <span className={`px-2 py-0.5 bg-slate-100 rounded-full ${p.stock < 10 ? 'text-orange-600 font-semibold' : ''}`}>
                                        {p.stock} Available
                                    </span>
                                </div>
                            </div>
                            <div className="p-4 border-t border-slate-100 bg-slate-50">
                                <button
                                    onClick={() => addToCart(p)}
                                    disabled={p.stock === 0}
                                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg transition"
                                >
                                    {p.stock === 0 ? "Out of Stock" : "Add to Cart"}
                                </button>
                            </div>
                        </div>
                    ))}
                    {products.length === 0 && <p className="col-span-3 text-slate-500">No products available.</p>}
                </div>
            </div>

            {/* Shopping Cart Sidebar */}
            <div className="w-full lg:w-96 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm h-[calc(100vh-8rem)]">
                <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-xl">
                    <h2 className="font-bold text-lg flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        Your Cart
                    </h2>
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                        {cart.reduce((sum, item) => sum + item.quantity, 0)} items
                    </span>
                </div>

                <div className="flex-1 overflow-auto p-5 space-y-4">
                    {cart.map(item => (
                        <div key={item.productId} className="flex justify-between items-start border-b border-slate-100 pb-4">
                            <div className="flex-1 pr-4">
                                <div className="font-medium text-slate-900 truncate" title={item.name}>{item.name}</div>
                                <div className="text-sm text-slate-500">${item.price.toFixed(2)} each</div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <div className="font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
                                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                                    <button onClick={() => updateQuantity(item.productId, -1)} className="px-2 py-1 hover:bg-slate-100 text-slate-600 font-medium">-</button>
                                    <span className="px-3 text-sm font-medium">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.productId, 1)} className="px-2 py-1 hover:bg-slate-100 text-slate-600 font-medium">+</button>
                                </div>
                                <button onClick={() => removeFromCart(item.productId)} className="text-xs text-red-500 hover:underline">Remove</button>
                            </div>
                        </div>
                    ))}
                    {cart.length === 0 && (
                        <div className="text-center text-slate-500 mt-10">
                            <ShoppingCart className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                            <p>Your cart is empty.</p>
                        </div>
                    )}
                </div>

                <div className="p-5 border-t border-slate-200 bg-slate-50 rounded-b-xl">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-slate-600 font-medium">Total</span>
                        <span className="text-xl font-bold text-slate-900">${cartTotal.toFixed(2)}</span>
                    </div>
                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white font-bold rounded-lg shadow-sm transition"
                    >
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
}
