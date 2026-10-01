"use client";

import { useState, useEffect } from "react";
import ProductForm from "./ProductForm";
import ProductSearchForm from "./ProductSearchForm";
import {
  fetchProducts,
  defaultQuery,
  type Product,
  type ProductDraft,
  type SearchQuery,
} from "@/app/lib/products";

export default function ProductExplorer() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadProducts(query: SearchQuery) {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProducts(query);
      setProducts(data.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProducts(defaultQuery);
  }, []);

  // บันทึกสินค้า (สร้างใหม่ หรือ ปรับปรุงของเดิม)
  function handleSaveProduct(draft: ProductDraft) {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? { ...draft, id: p.id } : p))
      );
      setEditingProduct(null);
    } else {
      const newProduct: Product = {
        ...draft,
        id: Date.now(),
      };
      setProducts((prev) => [newProduct, ...prev]);
    }
  }

  // ลบสินค้า
  function removeProduct(id: number | string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (editingProduct?.id === id) {
      setEditingProduct(null);
    }
  }

  // คำนวณสถิติภาพรวม
  const totalProducts = products.length;
  const lowStockCount = products.filter((p) => p.stock <= 10).length;
  const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50/60 via-white to-blue-50/50 pb-16">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-sky-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-sky-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-800 to-sky-600 bg-clip-text text-transparent">
                Product Explorer
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                ระบบจัดการและค้นหาสินค้าอัจฉริยะ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              ออนไลน์ ({totalProducts} รายการ)
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Banner & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-sky-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">สินค้าทั้งหมด</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{totalProducts} รายการ</h3>
              <p className="text-xs text-sky-600 mt-1">พร้อมจำหน่ายในระบบ</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-sky-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">สินค้าใกล้หมด</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{lowStockCount} รายการ</h3>
              <p className="text-xs text-amber-600 mt-1">คงเหลือ ≤ 10 ชิ้น</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-sky-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">จำนวนสต็อกรวม</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{totalStock.toLocaleString()} ชิ้น</h3>
              <p className="text-xs text-emerald-600 mt-1">สินค้าคงคลังทั้งหมด</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Section 1: ค้นหาและกรองข้อมูล */}
        <section>
          <ProductSearchForm onSearch={loadProducts} />
        </section>

        {/* Section 2: ฟอร์มจัดการสินค้า (เพิ่ม / แก้ไข) */}
        <section>
          <ProductForm
            key={editingProduct ? editingProduct.id : "new"}
            editing={editingProduct}
            onSave={handleSaveProduct}
            onCancel={() => setEditingProduct(null)}
          />
        </section>

        {/* Section 3: รายการสินค้าและตาราง */}
        <section className="bg-white/80 backdrop-blur-md rounded-2xl border border-sky-100 shadow-sm shadow-sky-100/50 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-800">ตารางแสดงรายการสินค้า</h2>
              <p className="text-xs text-slate-500">ข้อมูลสินค้าล่าสุดในระบบ สามารถแก้ไขหรือลบรายการได้</p>
            </div>
            <button
              onClick={() => loadProducts(defaultQuery)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              รีเฟรชข้อมูล
            </button>
          </div>

          {/* แสดงสถานะ Loading */}
          {loading && (
            <div className="py-16 flex flex-col items-center justify-center text-center px-4">
              <div className="w-12 h-12 rounded-full border-4 border-sky-100 border-t-sky-600 animate-spin mb-3"></div>
              <p className="text-slate-600 font-medium text-sm">กำลังโหลดข้อมูลสินค้า...</p>
              <p className="text-xs text-slate-400 mt-1">กรุณารอสักครู่ ระบบกำลังดึงข้อมูลล่าสุด</p>
            </div>
          )}

          {/* แสดงสถานะ Error */}
          {error && !loading && (
            <div className="p-6">
              <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 flex items-start gap-3">
                <div className="text-rose-500 shrink-0 mt-0.5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-rose-800">เกิดข้อผิดพลาดในการโหลดข้อมูล</h4>
                  <p className="text-xs text-rose-600 mt-0.5">{error}</p>
                  <button
                    onClick={() => loadProducts(defaultQuery)}
                    className="mt-2 text-xs font-semibold text-rose-700 underline hover:text-rose-900 cursor-pointer"
                  >
                    ลองใหม่อีกครั้ง
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ตารางแสดงสินค้า */}
          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-sky-50/70 border-b border-sky-100 text-xs font-semibold text-sky-900 uppercase tracking-wider">
                    <th scope="col" className="py-3.5 px-4 sm:px-6">สินค้า</th>
                    <th scope="col" className="py-3.5 px-4">ราคา</th>
                    <th scope="col" className="py-3.5 px-4">จำนวนคงเหลือ</th>
                    <th scope="col" className="py-3.5 px-4">หมวดหมู่</th>
                    <th scope="col" className="py-3.5 px-4 text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-16 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-400 flex items-center justify-center mb-3">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                          </div>
                          <p className="text-slate-600 font-semibold text-base">ไม่พบข้อมูลสินค้า</p>
                          <p className="text-xs text-slate-400 mt-1">ลองเปลี่ยนคำค้นหา หรือเพิ่มสินค้าใหม่จากฟอร์มด้านบน</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => {
                      const isLowStock = product.stock <= 5;
                      const isMediumStock = product.stock > 5 && product.stock <= 20;

                      return (
                        <tr
                          key={product.id}
                          className="hover:bg-sky-50/40 transition-colors group"
                        >
                          {/* สินค้า */}
                          <td className="py-3.5 px-4 sm:px-6">
                            <div className="flex items-center gap-3">
                              {product.thumbnail ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                  src={product.thumbnail}
                                  alt={product.title}
                                  className="w-11 h-11 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                                />
                              ) : (
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-100 to-blue-100 text-sky-600 flex items-center justify-center font-bold text-sm shrink-0 border border-sky-200">
                                  {product.title?.charAt(0)?.toUpperCase() || "P"}
                                </div>
                              )}
                              <div>
                                <span className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                                  {product.title}
                                </span>
                                <span className="text-[11px] text-slate-400">
                                  รหัส: #{product.id}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* ราคา */}
                          <td className="py-3.5 px-4 font-semibold text-blue-700">
                            ${Number(product.price).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>

                          {/* จำนวนคงเหลือ */}
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                isLowStock
                                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                                  : isMediumStock
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isLowStock
                                    ? "bg-rose-500"
                                    : isMediumStock
                                    ? "bg-amber-500"
                                    : "bg-emerald-500"
                                }`}
                              ></span>
                              {product.stock} ชิ้น
                            </span>
                          </td>

                          {/* หมวดหมู่ */}
                          <td className="py-3.5 px-4">
                            <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200/60">
                              {product.category}
                            </span>
                          </td>

                          {/* จัดการ */}
                          <td className="py-3.5 px-4 text-center">
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setEditingProduct(product);
                                  window.scrollTo({ top: 180, behavior: "smooth" });
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors active:scale-95 cursor-pointer"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                แก้ไข
                              </button>
                              <button
                                onClick={() => removeProduct(product.id)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors active:scale-95 cursor-pointer"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                ลบ
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}