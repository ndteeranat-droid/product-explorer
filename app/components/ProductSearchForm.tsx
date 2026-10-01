"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SORT_FIELDS, SearchQuerySchema, defaultQuery } from "@/app/lib/products";
import { useForm } from "react-hook-form";
import type { SearchQuery } from "@/app/lib/products";

type ProductSearchFormProps = {
  onSearch: (query: SearchQuery) => Promise<void>;
};

const SORT_LABELS: Record<(typeof SORT_FIELDS)[number], string> = {
  title: "ชื่อสินค้า (Title)",
  price: "ราคา (Price)",
  stock: "จำนวนคงเหลือ (Stock)",
};

export default function ProductSearchForm({ onSearch }: ProductSearchFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SearchQuery>({
    resolver: zodResolver(SearchQuerySchema),
    mode: "onTouched",
    defaultValues: defaultQuery,
  });

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-sky-100 shadow-sm shadow-sky-100/50 transition-all">
      <div className="flex items-center gap-2 mb-4 text-sky-900">
        <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-base text-slate-800">ค้นหาและกรองสินค้า</h3>
          <p className="text-xs text-slate-500">กำหนดเงื่อนไขเพื่อค้นหาสินค้าที่ต้องการ</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSearch)} noValidate className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* ค้นหาชื่อสินค้า */}
          <div className="md:col-span-6">
            <label htmlFor="q" className="block text-xs font-semibold text-slate-600 mb-1.5">
              คำค้นหา (ชื่อสินค้า)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                id="q"
                type="text"
                {...register("q")}
                placeholder="เช่น Phone, Laptop, Perfume..."
                className={`w-full pl-9 pr-3 py-2 text-sm bg-slate-50/50 hover:bg-white focus:bg-white border rounded-xl transition-all duration-150 outline-none text-slate-800 placeholder-slate-400 ${
                  errors.q
                    ? "border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
                    : "border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                }`}
              />
            </div>
            {errors.q && (
              <p role="alert" className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.q.message}
              </p>
            )}
          </div>

          {/* จำนวนรายการ */}
          <div className="md:col-span-3">
            <label htmlFor="limit" className="block text-xs font-semibold text-slate-600 mb-1.5">
              จำนวนรายการ (1 - 30)
            </label>
            <input
              id="limit"
              type="number"
              min={1}
              max={30}
              {...register("limit", { valueAsNumber: true })}
              className={`w-full px-3 py-2 text-sm bg-slate-50/50 hover:bg-white focus:bg-white border rounded-xl transition-all duration-150 outline-none text-slate-800 ${
                errors.limit
                  ? "border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
                  : "border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              }`}
            />
            {errors.limit && (
              <p role="alert" className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.limit.message}
              </p>
            )}
          </div>

          {/* เรียงตาม */}
          <div className="md:col-span-3">
            <label htmlFor="sortBy" className="block text-xs font-semibold text-slate-600 mb-1.5">
              จัดเรียงข้อมูลตาม
            </label>
            <div className="relative">
              <select
                id="sortBy"
                {...register("sortBy")}
                className="w-full px-3 py-2 text-sm bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 rounded-xl transition-all duration-150 outline-none text-slate-800 cursor-pointer appearance-none pr-8"
              >
                {SORT_FIELDS.map((field) => (
                  <option key={field} value={field}>
                    {SORT_LABELS[field] ?? field}
                  </option>
                ))}
              </select>
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
          </div>
        </div>

        {/* ปุ่ม Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 active:scale-[0.98] text-white font-medium text-sm shadow-md shadow-sky-500/25 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>กำลังค้นหาข้อมูล...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>ค้นหาสินค้า</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}