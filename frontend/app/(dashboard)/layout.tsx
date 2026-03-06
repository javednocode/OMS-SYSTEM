"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
    LogOut,
    Home,
    Package,
    ShoppingCart,
    LayoutDashboard,
    Users,
    Bell,
    Menu,
    X,
    ChevronRight,
    Tags,
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("oms_token");
        const storedUser = localStorage.getItem("oms_user");
        if (!token || !storedUser) {
            router.push("/login");
            return;
        }
        // eslint-disable-next-line
        setUser(JSON.parse(storedUser));
    }, [router]);

    if (!user)
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                    <p className="text-sm text-gray-500">Loading dashboard…</p>
                </div>
            </div>
        );

    const handleLogout = () => {
        localStorage.removeItem("oms_token");
        localStorage.removeItem("oms_user");
        router.push("/login");
    };

    const getLinks = () => {
        if (user.role === "SUPER_ADMIN") {
            return [{ label: "Dashboard", path: "/super-admin", icon: LayoutDashboard }];
        }
        if (user.role === "DISTRIBUTOR") {
            return [
                { label: "Dashboard", path: "/distributor", icon: Home },
                { label: "Categories", path: "/distributor/categories", icon: Tags }
            ];
        }
        if (user.role === "SHOPKEEPER") {
            return [
                { label: "Browse Products", path: "/shopkeeper", icon: Package },
                { label: "My Orders", path: "/shopkeeper/orders", icon: ShoppingCart },
            ];
        }
        return [];
    };

    const links = getLinks();

    const getRoleLabel = (role: string) => {
        const map: Record<string, string> = {
            SUPER_ADMIN: "Super Admin",
            DISTRIBUTOR: "Distributor",
            SHOPKEEPER: "Shopkeeper",
        };
        return map[role] || role;
    };

    const getInitials = (name: string) =>
        name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

    const navContent = (
        <>
            {/* Logo */}
            <div className="flex h-16 items-center gap-3 border-b border-gray-100 px-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow">
                    <Package className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold tracking-tight text-gray-900">OMS Portal</span>
            </div>

            {/* Nav links */}
            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                    Navigation
                </p>
                {links.map(({ label, path, icon: Icon }) => {
                    const active = pathname === path || (path !== "/" && pathname.startsWith(path));
                    return (
                        <Link
                            key={path}
                            href={path}
                            onClick={() => setSidebarOpen(false)}
                            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${active
                                ? "bg-blue-50 text-blue-700 shadow-inner"
                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                }`}
                        >
                            <Icon
                                className={`h-5 w-5 flex-shrink-0 transition-colors ${active ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                                    }`}
                            />
                            <span className="flex-1">{label}</span>
                            {active && <ChevronRight className="h-4 w-4 text-blue-400" />}
                        </Link>
                    );
                })}
            </nav>

            {/* User Footer */}
            <div className="border-t border-gray-100 p-3">
                <div className="mb-2 flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white shadow">
                        {getInitials(user.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="truncate text-xs text-gray-400">{getRoleLabel(user.role)}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </button>
            </div>
        </>
    );

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Desktop Sidebar */}
            <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-gray-200 bg-white md:flex">
                {navContent}
            </aside>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar Drawer */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white shadow-2xl transition-transform duration-300 md:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="absolute right-4 top-4 rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
                >
                    <X className="h-5 w-5" />
                </button>
                {navContent}
            </aside>

            {/* Main Panel */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top Header */}
                <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-8">
                    <div className="flex items-center gap-3">
                        <button
                            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 md:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <div>
                            <p className="text-sm font-semibold text-gray-900 hidden sm:block">
                                Welcome back, {user.name.split(" ")[0]} 👋
                            </p>
                            <p className="text-xs text-gray-400 hidden sm:block">
                                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="relative rounded-xl p-2.5 text-gray-500 hover:bg-gray-100">
                            <Bell className="h-5 w-5" />
                            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white" />
                        </button>
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white shadow">
                            {getInitials(user.name)}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto">
                    <div className="mx-auto max-w-7xl p-4 md:p-8">{children}</div>
                </main>
            </div>
        </div>
    );
}
