"use client";

import { useEffect, useState } from "react";
import {
    Package,
    ShoppingBag,
    Users,
    ClipboardList,
    Plus,
    Trash2,
    Pencil,
    X,
    ChevronDown,
    CheckCircle2,
    AlertCircle,
    Clock,
    Truck,
    LayoutGrid,
    List,
    Search,
    IndianRupee,
    Wallet,
} from "lucide-react";

// ─── Status Badge ───────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
    string,
    { label: string; cls: string; icon: React.ReactNode }
> = {
    PENDING: {
        label: "Pending",
        cls: "bg-amber-50 text-amber-700 ring-amber-200",
        icon: <Clock className="h-3.5 w-3.5" />,
    },
    PACKED: {
        label: "Packed",
        cls: "bg-purple-50 text-purple-700 ring-purple-200",
        icon: <Package className="h-3.5 w-3.5" />,
    },
    OUT_FOR_DELIVERY: {
        label: "Out for Delivery",
        cls: "bg-blue-50 text-blue-700 ring-blue-200",
        icon: <Truck className="h-3.5 w-3.5" />,
    },
    DELIVERED: {
        label: "Delivered",
        cls: "bg-emerald-50 text-emerald-700 ring-emerald-200",
        icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    },
};

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({
    label,
    value,
    icon,
    color,
}: {
    label: string;
    value: number | string;
    icon: React.ReactNode;
    color: string;
}) {
    return (
        <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-2xl font-bold leading-none text-gray-900">{value}</p>
                <p className="mt-1 text-sm text-gray-500">{label}</p>
            </div>
        </div>
    );
}

// ─── Product Card ────────────────────────────────────────────────────────────
function ProductCard({
    product,
    onDelete,
    onEdit,
}: {
    product: any;
    onDelete: (id: string) => void;
    onEdit: (p: any) => void;
}) {
    const stockOk = product.stock >= 10;
    const categories: Record<string, string> = {
        default: "bg-blue-100 text-blue-700",
        Electronics: "bg-violet-100 text-violet-700",
        Groceries: "bg-green-100 text-green-700",
        Fashion: "bg-pink-100 text-pink-700",
        Beverages: "bg-amber-100 text-amber-700",
    };
    const catColor = categories[product.category] ?? categories.default;

    return (
        <div className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-md">
            {product.imageUrl ? (
                <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                    <img
                        src={product.imageUrl.startsWith("http") ? product.imageUrl : `http://localhost:4000${product.imageUrl.startsWith('/') ? '' : '/'}${product.imageUrl}`}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => { e.currentTarget.src = "https://placehold.co/400x300?text=No+Image" }}
                    />
                    <span
                        className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${stockOk ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-red-50 text-red-700 ring-red-200"}`}
                    >
                        {stockOk ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                        {product.stock} in stock
                    </span>
                </div>
            ) : (
                <div className="relative flex h-36 items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-blue-50 to-slate-100">
                    <Package className="h-16 w-16 text-indigo-200" />
                    <span
                        className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${stockOk ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-red-50 text-red-700 ring-red-200"}`}
                    >
                        {stockOk ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                        {product.stock} in stock
                    </span>
                </div>
            )}

            <div className="flex flex-1 flex-col p-4">
                <span className={`mb-2 self-start rounded-full px-2.5 py-0.5 text-xs font-medium ${catColor}`}>
                    {product.category?.name || "Uncategorized"}
                </span>
                <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">{product.name}</h3>
                {product.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-gray-500">{product.description}</p>
                )}
                <p className="mt-auto pt-3 text-lg font-bold text-blue-600">
                    ₹{product.price.toFixed(2)}
                </p>
            </div>

            {/* Action Row */}
            <div className="flex items-center gap-2 border-t border-gray-100 px-4 py-3">
                <button
                    onClick={() => onEdit(product)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gray-50 py-2 text-xs font-medium text-gray-600 transition hover:bg-blue-50 hover:text-blue-700"
                >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                    onClick={() => onDelete(product.id)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gray-50 py-2 text-xs font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-600"
                >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
            </div>
        </div>
    );
}

// ─── Modal Shell ──────────────────────────────────────────────────────────────
function Modal({
    title,
    onClose,
    children,
}: {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <h3 className="text-base font-semibold text-gray-900">{title}</h3>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}

function InputField({
    label,
    ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
    return (
        <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
            <input
                {...props}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DistributorPage() {
    const [activeTab, setActiveTab] = useState("products");

    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [shopkeepers, setShopkeepers] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [productView, setProductView] = useState<"grid" | "list">("grid");

    // Modals
    const [showProductModal, setShowProductModal] = useState(false);
    const [showShopkeeperModal, setShowShopkeeperModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [editingShopkeeper, setEditingShopkeeper] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Delete Modal
    const [shopkeeperDeleteModal, setShopkeeperDeleteModal] = useState<any>(null);

    // Credit system state
    const [creditStats, setCreditStats] = useState<{ totalOutstanding: number; totalCreditLimit: number } | null>(null);
    const [paymentModal, setPaymentModal] = useState<{ order: any; amount: string } | null>(null);
    const [paymentLoading, setPaymentLoading] = useState(false);

    const [newProduct, setNewProduct] = useState<{
        name: string; categoryId: string; price: string; stock: string; description: string; isNewArrival: boolean; imageFile: File | null;
    }>({
        name: "", categoryId: "", price: "", stock: "", description: "", isNewArrival: false, imageFile: null,
    });
    const [newShopkeeper, setNewShopkeeper] = useState<{
        name: string; email: string; password: string; mobileNumber: string; shopName: string; shopAddress: string; city: string; state: string; pincode: string; shopPhotoFile: File | null;
    }>({
        name: "", email: "", password: "", mobileNumber: "", shopName: "", shopAddress: "", city: "", state: "", pincode: "", shopPhotoFile: null,
    });

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("oms_token");
            const h = { Authorization: `Bearer ${token}` };
            const [rP, rC, rS, rO, rCS] = await Promise.all([
                fetch("http://localhost:4000/api/distributor/products", { headers: h }),
                fetch("http://localhost:4000/api/distributor/categories", { headers: h }),
                fetch("http://localhost:4000/api/distributor/shopkeepers", { headers: h }),
                fetch("http://localhost:4000/api/distributor/orders", { headers: h }),
                fetch("http://localhost:4000/api/distributor/credit-stats", { headers: h }),
            ]);
            const [pData, cData, sData, oData, csData] = await Promise.all([rP.json(), rC.json(), rS.json(), rO.json(), rCS.json()]);
            setProducts(Array.isArray(pData) ? pData : []);
            setCategories(Array.isArray(cData) ? cData : []);
            setShopkeepers(Array.isArray(sData) ? sData : []);
            setOrders(Array.isArray(oData) ? oData : []);
            if (csData?.totalOutstanding !== undefined) setCreditStats(csData);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem("oms_token");
                const h = { Authorization: `Bearer ${token}` };
                const res = await fetch(`http://localhost:4000/api/distributor/products?search=${encodeURIComponent(searchQuery)}`, { headers: h });
                const pData = await res.json();
                setProducts(Array.isArray(pData) ? pData : []);
            } catch (e) {
                console.error(e);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchProducts();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("oms_token");
        const url = editingProduct
            ? `http://localhost:4000/api/distributor/products/${editingProduct.id}`
            : "http://localhost:4000/api/distributor/products";
        const method = editingProduct ? "PUT" : "POST";

        const formData = new FormData();
        formData.append("name", newProduct.name);
        formData.append("categoryId", newProduct.categoryId);
        formData.append("price", newProduct.price);
        formData.append("stock", newProduct.stock);
        formData.append("isNewArrival", String(newProduct.isNewArrival));
        if (newProduct.description) formData.append("description", newProduct.description);
        if (newProduct.imageFile) formData.append("image", newProduct.imageFile);

        await fetch(url, {
            method,
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData,
        });
        setShowProductModal(false);
        setEditingProduct(null);
        setNewProduct({ name: "", categoryId: "", price: "", stock: "", description: "", isNewArrival: false, imageFile: null });
        fetchData();
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm("Delete this product?")) return;
        const token = localStorage.getItem("oms_token");
        await fetch(`http://localhost:4000/api/distributor/products/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchData();
    };

    const openEditModal = (p: any) => {
        setEditingProduct(p);
        setNewProduct({
            name: p.name,
            categoryId: p.categoryId || (categories.length > 0 ? categories[0].id : ""),
            price: String(p.price),
            stock: String(p.stock),
            description: p.description || "",
            isNewArrival: p.isNewArrival || false,
            imageFile: null,
        });
        setShowProductModal(true);
    };

    const openEditShopkeeperModal = (s: any) => {
        setEditingShopkeeper(s);
        setNewShopkeeper({
            name: s.name,
            email: s.email,
            password: "",
            mobileNumber: s.mobileNumber || "",
            shopName: s.shopName || "",
            shopAddress: s.shopAddress || "",
            city: s.city || "",
            state: s.state || "",
            pincode: s.pincode || "",
            shopPhotoFile: null,
        });
        setShowShopkeeperModal(true);
    };

    const handleCreateShopkeeper = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation for Mobile Number
        if (newShopkeeper.mobileNumber && !/^\d{10}$/.test(newShopkeeper.mobileNumber)) {
            alert("Mobile number must be exactly 10 digits.");
            return;
        }

        // Basic validation for Image size (2MB max)
        if (newShopkeeper.shopPhotoFile && newShopkeeper.shopPhotoFile.size > 2 * 1024 * 1024) {
            alert("Shop photo must be less than 2MB.");
            return;
        }

        const token = localStorage.getItem("oms_token");
        const url = editingShopkeeper
            ? `http://localhost:4000/api/distributor/shopkeepers/${editingShopkeeper.id}`
            : "http://localhost:4000/api/distributor/shopkeepers";
        const method = editingShopkeeper ? "PUT" : "POST";

        const formData = new FormData();
        formData.append("name", newShopkeeper.name);
        formData.append("email", newShopkeeper.email);
        if (!editingShopkeeper) {
            formData.append("password", newShopkeeper.password);
        }
        formData.append("mobileNumber", newShopkeeper.mobileNumber);
        formData.append("shopName", newShopkeeper.shopName);
        formData.append("shopAddress", newShopkeeper.shopAddress);
        formData.append("city", newShopkeeper.city);
        formData.append("state", newShopkeeper.state);
        formData.append("pincode", newShopkeeper.pincode);
        if (newShopkeeper.shopPhotoFile) {
            formData.append("shopPhoto", newShopkeeper.shopPhotoFile);
        }

        const res = await fetch(url, {
            method,
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });

        if (res.ok) {
            alert(editingShopkeeper ? "Shopkeeper updated successfully!" : "Shopkeeper created successfully!");
            setShowShopkeeperModal(false);
            setEditingShopkeeper(null);
            setNewShopkeeper({ name: "", email: "", password: "", mobileNumber: "", shopName: "", shopAddress: "", city: "", state: "", pincode: "", shopPhotoFile: null });
            fetchData();
        } else {
            let errMsg = "An error occurred while saving the shopkeeper.";
            try {
                const errData = await res.json();
                if (errData?.message) errMsg = errData.message;
            } catch (_) { /* ignore */ }
            alert(`Error: ${errMsg}`);
        }
    };

    const handleDeleteShopkeeper = async (id: string) => {
        try {
            const token = localStorage.getItem("oms_token");
            const res = await fetch(`http://localhost:4000/api/distributor/shopkeepers/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                alert("Shopkeeper deleted successfully.");
                setShopkeeperDeleteModal(null);
                fetchData();
            } else {
                let errMsg = "An error occurred while deleting the shopkeeper.";
                try {
                    const errData = await res.json();
                    if (errData?.message) errMsg = errData.message;
                } catch (_) { /* ignore */ }
                alert(`Error: ${errMsg}`);
                setShopkeeperDeleteModal(null);
            }
        } catch (error) {
            console.error(error);
            alert("Network error. Please try again.");
            setShopkeeperDeleteModal(null);
        }
    };

    const handleUpdateOrderStatus = async (id: string, status: string) => {
        const token = localStorage.getItem("oms_token");
        await fetch(`http://localhost:4000/api/distributor/orders/${id}/status`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status }),
        });
        fetchData();
    };

    const pendingOrders = orders.filter((o) => o.status === "PENDING").length;

    // Credit status badge helper
    const getCreditStatus = (outstanding: number, limit: number) => {
        if (!limit || limit === 0) return null;
        const pct = (outstanding / limit) * 100;
        if (pct >= 100) return { label: "Limit Exceeded", cls: "bg-red-50 text-red-700 ring-red-200" };
        if (pct >= 70) return { label: "Near Limit", cls: "bg-amber-50 text-amber-700 ring-amber-200" };
        return { label: "Safe", cls: "bg-emerald-50 text-emerald-700 ring-emerald-200" };
    };

    const handleRecordPayment = async () => {
        if (!paymentModal || !paymentModal.amount || isNaN(parseFloat(paymentModal.amount))) return;
        setPaymentLoading(true);
        try {
            const token = localStorage.getItem("oms_token");
            const res = await fetch(`http://localhost:4000/api/distributor/orders/${paymentModal.order.id}/payment`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify({ amount: parseFloat(paymentModal.amount) }),
            });
            if (res.ok) {
                setPaymentModal(null);
                fetchData();
            } else {
                const d = await res.json();
                alert(d.message || "Failed to record payment");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setPaymentLoading(false);
        }
    };

    if (loading)
        return (
            <div className="flex h-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            </div>
        );

    const TABS = ["products", "shopkeepers", "orders"];

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Distributor Dashboard</h1>
                <p className="mt-0.5 text-sm text-gray-500">
                    Manage your catalog, partners, and fulfillment.
                </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-5">
                <StatCard
                    label="Total Products"
                    value={products.length}
                    icon={<Package className="h-6 w-6 text-blue-600" />}
                    color="bg-blue-50"
                />
                <StatCard
                    label="Pending Orders"
                    value={pendingOrders}
                    icon={<Clock className="h-6 w-6 text-amber-600" />}
                    color="bg-amber-50"
                />
                <StatCard
                    label="Active Shops"
                    value={shopkeepers.length}
                    icon={<Users className="h-6 w-6 text-emerald-600" />}
                    color="bg-emerald-50"
                />
                <StatCard
                    label="Total Orders"
                    value={orders.length}
                    icon={<ClipboardList className="h-6 w-6 text-violet-600" />}
                    color="bg-violet-50"
                />
                <StatCard
                    label="Total Outstanding"
                    value={creditStats ? `₹${creditStats.totalOutstanding.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : '₹0'}
                    icon={<Wallet className="h-6 w-6 text-rose-600" />}
                    color="bg-rose-50"
                />
            </div>

            {/* Tabs + Content */}
            <div>
                {/* Tab Bar */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
                        {TABS.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-all ${activeTab === tab
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Per-tab action buttons */}
                    {activeTab === "products" && (
                        <div className="flex items-center gap-2">
                            <div className="flex rounded-xl border border-gray-200 bg-white p-1">
                                <button
                                    onClick={() => setProductView("grid")}
                                    className={`rounded-lg p-1.5 ${productView === "grid" ? "bg-gray-100 text-gray-900" : "text-gray-400"}`}
                                >
                                    <LayoutGrid className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setProductView("list")}
                                    className={`rounded-lg p-1.5 ${productView === "list" ? "bg-gray-100 text-gray-900" : "text-gray-400"}`}
                                >
                                    <List className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full sm:w-64 rounded-xl border border-gray-200 px-4 py-2.5 pl-9 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400"
                                />
                            </div>
                            <button
                                onClick={() => {
                                    setEditingProduct(null);
                                    setNewProduct({ name: "", categoryId: categories.length > 0 ? categories[0].id : "", price: "", stock: "", description: "", isNewArrival: false, imageFile: null });
                                    setShowProductModal(true);
                                }}
                                className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                            >
                                <Plus className="h-4 w-4" /> Add Product
                            </button>
                        </div>
                    )}
                    {activeTab === "shopkeepers" && (
                        <button
                            onClick={() => {
                                setEditingShopkeeper(null);
                                setNewShopkeeper({ name: "", email: "", password: "", mobileNumber: "", shopName: "", shopAddress: "", city: "", state: "", pincode: "", shopPhotoFile: null });
                                setShowShopkeeperModal(true);
                            }}
                            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                        >
                            <Plus className="h-4 w-4" /> Add Shopkeeper
                        </button>
                    )}
                </div>

                {/* ── PRODUCTS ── */}
                {activeTab === "products" && (
                    <>
                        {products.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-20 text-center ring-1 ring-gray-100">
                                {searchQuery ? (
                                    <Search className="mb-3 h-12 w-12 text-gray-200" />
                                ) : (
                                    <Package className="mb-3 h-12 w-12 text-gray-200" />
                                )}
                                <p className="font-medium text-gray-500">
                                    {searchQuery ? "No products found" : "No products yet"}
                                </p>
                                <p className="text-sm text-gray-400">
                                    {searchQuery ? "Try adjusting your search query." : "Click \"Add Product\" to get started."}
                                </p>
                            </div>
                        ) : productView === "grid" ? (
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {products.map((p) => (
                                    <ProductCard
                                        key={p.id}
                                        product={p}
                                        onDelete={handleDeleteProduct}
                                        onEdit={openEditModal}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
                                <table className="w-full text-left text-sm">
                                    <thead className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        <tr>
                                            <th className="px-6 py-4">Product</th>
                                            <th className="px-6 py-4">Category</th>
                                            <th className="px-6 py-4">Price</th>
                                            <th className="px-6 py-4">Stock</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {products.map((p) => (
                                            <tr key={p.id} className="hover:bg-gray-50/50">
                                                <td className="px-6 py-4 font-semibold text-gray-900">{p.name}</td>
                                                <td className="px-6 py-4 text-gray-500">{p.category?.name || "Uncategorized"}</td>
                                                <td className="px-6 py-4 font-medium text-blue-600">₹{p.price.toFixed(2)}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${p.stock >= 10 ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-red-50 text-red-700 ring-red-200"}`}>
                                                        {p.stock}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button onClick={() => openEditModal(p)} className="mr-3 text-blue-500 hover:underline">Edit</button>
                                                    <button onClick={() => handleDeleteProduct(p.id)} className="text-red-500 hover:underline">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}

                {/* ── SHOPKEEPERS ── */}
                {activeTab === "shopkeepers" && (
                    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                    <th className="px-6 py-4">Shop</th>
                                    <th className="px-6 py-4">Owner / Mobile</th>
                                    <th className="px-6 py-4">City</th>
                                    <th className="px-6 py-4 text-right">Credit Limit</th>
                                    <th className="px-6 py-4 text-right">Outstanding</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {shopkeepers.map((s) => {
                                    const creditStatus = getCreditStatus(s.outstandingBalance || 0, s.creditLimit || 0);
                                    return (
                                        <tr key={s.id} className="hover:bg-gray-50/50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    {s.shopPhotoUrl ? (
                                                        <img src={s.shopPhotoUrl} alt={s.shopName || "Shop"} className="h-10 w-10 shrink-0 rounded-lg object-cover ring-1 ring-gray-200" />
                                                    ) : (
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                                                            <Package className="h-5 w-5" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{s.shopName || "Unnamed Shop"}</p>
                                                        <p className="text-xs text-gray-500">{s.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-gray-700">{s.name}</p>
                                                <p className="text-xs text-gray-400">{s.mobileNumber || "No mobile"}</p>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">{s.city || "N/A"}</td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="font-medium text-gray-700">
                                                    ₹{(s.creditLimit || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className="font-semibold text-gray-900">
                                                        ₹{(s.outstandingBalance || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                                    </span>
                                                    {creditStatus && (
                                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${creditStatus.cls}`}>
                                                            {creditStatus.label}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 text-sm font-medium">
                                                    <button onClick={() => openEditShopkeeperModal(s)} className="flex items-center gap-1 text-blue-500 hover:text-blue-700">
                                                        <Pencil className="h-3.5 w-3.5" /> Edit
                                                    </button>
                                                    <button onClick={() => setShopkeeperDeleteModal(s)} className="flex items-center gap-1 text-red-500 hover:text-red-700 ml-1">
                                                        <Trash2 className="h-3.5 w-3.5" /> Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {shopkeepers.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                            No shopkeepers found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ── ORDERS ── */}
                {activeTab === "orders" && (
                    <div className="space-y-4">
                        {orders.length === 0 && (
                            <div className="rounded-2xl bg-white py-16 text-center text-gray-400 ring-1 ring-gray-100">
                                No orders yet.
                            </div>
                        )}
                        {orders.map((order) => {
                            const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.PENDING;
                            return (
                                <div
                                    key={order.id}
                                    className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100"
                                >
                                    {/* Order Header */}
                                    <div className="flex flex-col gap-3 border-b border-gray-100 bg-gray-50/60 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-900">{order.shopkeeper.name}</p>
                                            <p className="text-xs text-gray-400">
                                                {new Date(order.createdAt).toLocaleString()} · {order.id}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {order.paymentStatus === "Paid" ? (
                                                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-200">
                                                    Paid
                                                </span>
                                            ) : order.paymentStatus === "Partial" ? (
                                                <span className="inline-flex items-center rounded-full bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700 ring-1 ring-inset ring-orange-200">
                                                    Partially Paid (₹{(order.remainingAmount || 0).toLocaleString('en-IN')} remaining)
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-200">
                                                    Unpaid
                                                </span>
                                            )}
                                            {order.status === "DELIVERED" && order.paymentStatus !== "Paid" && (
                                                <button
                                                    onClick={() => setPaymentModal({ order, amount: "" })}
                                                    className="inline-flex flex-shrink-0 items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200 transition hover:bg-emerald-100"
                                                >
                                                    <IndianRupee className="h-3 w-3" /> Record Payment
                                                </button>
                                            )}
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${cfg.cls}`}
                                            >
                                                {cfg.icon}
                                                {cfg.label}
                                            </span>
                                            <div className="relative">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                                    className="appearance-none rounded-xl border border-gray-200 bg-white py-1.5 pl-3 pr-8 text-sm font-medium text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                >
                                                    <option value="PENDING">Pending</option>
                                                    <option value="PACKED">Packed</option>
                                                    <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                                                    <option value="DELIVERED">Delivered</option>
                                                </select>
                                                <ChevronDown className="pointer-events-none absolute right-2 top-2 h-4 w-4 text-gray-400" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="px-6 py-4">
                                        <table className="w-full text-sm">
                                            <thead className="text-xs font-medium text-gray-400">
                                                <tr>
                                                    <th className="pb-2 text-left font-medium">Item</th>
                                                    <th className="pb-2 text-left font-medium">Qty</th>
                                                    <th className="pb-2 text-right font-medium">Unit</th>
                                                    <th className="pb-2 text-right font-medium">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {order.items.map((item: any) => (
                                                    <tr key={item.id}>
                                                        <td className="py-2.5 text-gray-700">{item.product.name}</td>
                                                        <td className="py-2.5 text-gray-500">×{item.quantity}</td>
                                                        <td className="py-2.5 text-right text-gray-500">₹{item.price.toFixed(2)}</td>
                                                        <td className="py-2.5 text-right font-semibold text-gray-900">
                                                            ₹{(item.price * item.quantity).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr className="border-t border-gray-100">
                                                    <td colSpan={3} className="pt-3 text-right text-sm font-medium text-gray-500">
                                                        Order Total
                                                    </td>
                                                    <td className="pt-3 text-right text-base font-bold text-gray-900">
                                                        ₹{order.totalAmount.toFixed(2)}
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── Product Modal ── */}
            {showProductModal && (
                <Modal
                    title={editingProduct ? "Edit Product" : "Add New Product"}
                    onClose={() => {
                        setShowProductModal(false);
                        setEditingProduct(null);
                    }}
                >
                    <form onSubmit={handleCreateProduct} className="space-y-4">
                        <InputField
                            label="Product Name"
                            required
                            placeholder="e.g. Basmati Rice 5KG"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        />
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">Category</label>
                            <div className="relative">
                                <select
                                    required
                                    value={newProduct.categoryId}
                                    onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                                    className="w-full appearance-none rounded-xl border border-gray-200 px-4 py-2.5 pr-10 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
                                >
                                    <option value="" disabled>Select a category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                label="Price (₹)"
                                required
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={newProduct.price}
                                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                            />
                            <InputField
                                label="Stock Qty"
                                required
                                type="number"
                                min="0"
                                placeholder="0"
                                value={newProduct.stock}
                                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">Product Image (Optional)</label>
                            <input
                                type="file"
                                accept="image/*"
                                className="w-full text-sm text-gray-500 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-50 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                                onChange={(e) => setNewProduct({ ...newProduct, imageFile: e.target.files?.[0] || null })}
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">Description (Optional)</label>
                            <textarea
                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                rows={3}
                                placeholder="A brief description of the product"
                                value={newProduct.description}
                                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                            />
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <input
                                type="checkbox"
                                id="isNewArrival"
                                checked={newProduct.isNewArrival}
                                onChange={(e) => setNewProduct({ ...newProduct, isNewArrival: e.target.checked })}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="isNewArrival" className="text-sm font-medium text-gray-700">
                                Mark as New Arrival
                            </label>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowProductModal(false);
                                    setEditingProduct(null);
                                }}
                                className="rounded-xl px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                                {editingProduct ? "Save Changes" : "Create Product"}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* ── Shopkeeper Modal ── */}
            {showShopkeeperModal && (
                <Modal title={editingShopkeeper ? "Edit Shopkeeper" : "Add New Shopkeeper"} onClose={() => {
                    setShowShopkeeperModal(false);
                    setEditingShopkeeper(null);
                }}>
                    <form onSubmit={handleCreateShopkeeper} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <InputField
                                label="Full Name"
                                required
                                placeholder="e.g. Ravi Kumar"
                                value={newShopkeeper.name}
                                onChange={(e) => setNewShopkeeper({ ...newShopkeeper, name: e.target.value })}
                            />
                            <InputField
                                label="Owner Mobile Number"
                                required
                                placeholder="10-digit number"
                                type="tel"
                                pattern="\d{10}"
                                value={newShopkeeper.mobileNumber}
                                onChange={(e) => setNewShopkeeper({ ...newShopkeeper, mobileNumber: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <InputField
                                label="Email Address"
                                required
                                type="email"
                                placeholder="email@example.com"
                                value={newShopkeeper.email}
                                onChange={(e) => setNewShopkeeper({ ...newShopkeeper, email: e.target.value })}
                            />
                            <InputField
                                label="Password"
                                required={!editingShopkeeper}
                                type="password"
                                placeholder={editingShopkeeper ? "(Leave blank to keep current)" : "••••••••"}
                                value={newShopkeeper.password}
                                onChange={(e) => setNewShopkeeper({ ...newShopkeeper, password: e.target.value })}
                            />
                        </div>

                        <hr className="my-2 border-gray-100" />

                        <InputField
                            label="Shop Name"
                            required
                            placeholder="e.g. Balaji Kirana"
                            value={newShopkeeper.shopName}
                            onChange={(e) => setNewShopkeeper({ ...newShopkeeper, shopName: e.target.value })}
                        />

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">Shop Address</label>
                            <textarea
                                required
                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                rows={2}
                                placeholder="Full street address"
                                value={newShopkeeper.shopAddress}
                                onChange={(e) => setNewShopkeeper({ ...newShopkeeper, shopAddress: e.target.value })}
                            />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <InputField
                                label="City"
                                required
                                placeholder="e.g. Bikaner"
                                value={newShopkeeper.city}
                                onChange={(e) => setNewShopkeeper({ ...newShopkeeper, city: e.target.value })}
                            />
                            <InputField
                                label="State"
                                required
                                placeholder="e.g. Rajasthan"
                                value={newShopkeeper.state}
                                onChange={(e) => setNewShopkeeper({ ...newShopkeeper, state: e.target.value })}
                            />
                            <InputField
                                label="Pincode"
                                required
                                placeholder="e.g. 334001"
                                value={newShopkeeper.pincode}
                                onChange={(e) => setNewShopkeeper({ ...newShopkeeper, pincode: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">Shop Photo (Max 2MB)</label>
                            <div className="flex items-center gap-4">
                                {newShopkeeper.shopPhotoFile && (
                                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-200">
                                        <img src={URL.createObjectURL(newShopkeeper.shopPhotoFile)} alt="Preview" className="h-full w-full object-cover" />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg, image/webp"
                                    required
                                    className="w-full text-sm text-gray-500 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-50 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                                    onChange={(e) => setNewShopkeeper({ ...newShopkeeper, shopPhotoFile: e.target.files?.[0] || null })}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowShopkeeperModal(false);
                                    setEditingShopkeeper(null);
                                }}
                                className="rounded-xl px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                                {editingShopkeeper ? "Save Changes" : "Create Shopkeeper"}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* ── Record Payment Modal ── */}
            {paymentModal && (
                <Modal
                    title="Record Payment"
                    onClose={() => setPaymentModal(null)}
                >
                    <div className="space-y-4">
                        {/* Order info */}
                        <div className="rounded-xl bg-gray-50 p-4 ring-1 ring-gray-100">
                            <p className="text-sm text-gray-500">Recording payment for Order <span className="font-mono">{paymentModal.order.id.split('-')[0]}</span></p>
                            <p className="mt-0.5 font-semibold text-gray-900">{paymentModal.order.shopkeeper.shopName || paymentModal.order.shopkeeper.name}</p>
                            <div className="mt-2 flex gap-6 text-sm">
                                <div>
                                    <p className="text-xs text-gray-400">Order Amount</p>
                                    <p className="font-medium text-gray-700">₹{(paymentModal.order.totalAmount || 0).toLocaleString('en-IN')}</p>
                                </div>
                                {paymentModal.order.totalPaid > 0 && (
                                    <div>
                                        <p className="text-xs text-gray-400">Total Paid</p>
                                        <p className="font-medium text-emerald-600">₹{(paymentModal.order.totalPaid || 0).toLocaleString('en-IN')}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-xs text-gray-400">Remaining Bal</p>
                                    <p className="font-semibold text-rose-600">₹{(paymentModal.order.remainingAmount ?? paymentModal.order.totalAmount ?? 0).toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                        </div>

                        <InputField
                            label="Payment Amount (₹)"
                            type="number"
                            min="0.01"
                            step="0.01"
                            placeholder="Enter amount received"
                            value={paymentModal.amount}
                            onChange={(e) => setPaymentModal({ ...paymentModal, amount: e.target.value })}
                        />

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setPaymentModal(null)}
                                className="rounded-xl px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={paymentLoading || !paymentModal.amount}
                                onClick={handleRecordPayment}
                                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                            >
                                {paymentLoading ? "Saving…" : "Record Payment"}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* ── Confirm Delete Shopkeeper Modal ── */}
            {shopkeeperDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-sm transition-opacity">
                    <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="mb-4 flex flex-col items-center text-center">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                <AlertCircle className="h-6 w-6 text-red-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Delete Shopkeeper
                            </h2>
                            <p className="mt-2 text-sm text-gray-500">
                                Are you sure you want to delete <span className="font-semibold text-gray-800">{shopkeeperDeleteModal.shopName || shopkeeperDeleteModal.name}</span>? This action cannot be undone.
                            </p>
                        </div>
                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setShopkeeperDeleteModal(null)}
                                className="w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 sm:w-auto"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDeleteShopkeeper(shopkeeperDeleteModal.id)}
                                className="w-full rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 sm:w-auto"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
