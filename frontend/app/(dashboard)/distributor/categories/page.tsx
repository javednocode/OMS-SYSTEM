"use client";

import { useEffect, useState } from "react";
import { Tags, Plus, Search, Edit2, Trash2 } from "lucide-react";

export default function CategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [categoryName, setCategoryName] = useState("");

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem("oms_token");
            const res = await fetch("http://localhost:4000/api/distributor/categories", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setCategories(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("oms_token");
        const url = editingCategory
            ? `http://localhost:4000/api/distributor/categories/${editingCategory.id}`
            : "http://localhost:4000/api/distributor/categories";
        const method = editingCategory ? "PUT" : "POST";

        await fetch(url, {
            method,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: categoryName }),
        });

        setShowModal(false);
        setEditingCategory(null);
        setCategoryName("");
        fetchCategories();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this category? Products using this category might be affected.")) return;

        const token = localStorage.getItem("oms_token");
        await fetch(`http://localhost:4000/api/distributor/categories/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchCategories();
    };

    const openEditModal = (cat: any) => {
        setEditingCategory(cat);
        setCategoryName(cat.name);
        setShowModal(true);
    };

    const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Manage Categories</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Create and organize categories for your products.
                    </p>
                </div>
                <button
                    onClick={() => {
                        setEditingCategory(null);
                        setCategoryName("");
                        setShowModal(true);
                    }}
                    className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                    <Plus className="h-4 w-4" />
                    New Category
                </button>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="w-full text-left text-sm text-gray-700">
                        <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                            <tr>
                                <th className="px-6 py-4">Category Name</th>
                                <th className="px-6 py-4">Items count (Approx)</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {filteredCategories.length > 0 ? (
                                filteredCategories.map((cat) => (
                                    <tr key={cat.id} className="transition-colors hover:bg-gray-50/50">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                                    <Tags className="h-4 w-4" />
                                                </div>
                                                {cat.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            -
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(cat)}
                                                    className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-blue-600"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(cat.id)}
                                                    className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Tags className="h-8 w-8 text-gray-300" />
                                            <p>No categories found.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Category Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-sm transition-opacity">
                    <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingCategory ? "Edit Category" : "New Category"}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-900"
                            >
                                <Plus className="h-5 w-5 rotate-45" />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="flex flex-col gap-5">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Category Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Beverages"
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>
                            <div className="mt-2 flex justify-end gap-3 border-t border-gray-100 pt-5">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="rounded-xl px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!categoryName.trim()}
                                    className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
                                >
                                    Save Category
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
