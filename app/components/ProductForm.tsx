"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CATEGORIES, ProductDraftSchema } from "@/app/lib/products";
import type { Product, ProductDraft } from "@/app/lib/products";

type ProductFormProps = {
  editing: Product | null;
  onSave: (draft: ProductDraft) => void;
  onCancel: () => void;
};

export default function ProductForm({
  editing,
  onSave,
  onCancel,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ProductDraft>({
    resolver: zodResolver(ProductDraftSchema),
    mode: "onChange",
    defaultValues: editing
      ? {
          title: editing.title,
          price: editing.price,
          stock: editing.stock,
          category: editing.category,
        }
      : {
          title: "",
          price: undefined,
          stock: undefined,
          category: "" as unknown as ProductDraft["category"],
        },
  });

  function saveProduct(values: ProductDraft) {
    onSave(values);
    reset();
  }

  const isEditing = Boolean(editing);

  return (
    <div
      className={`rounded-2xl p-6 transition-all duration-200 border ${
        isEditing
          ? "bg-gradient-to-br from-white to-blue-50/70 border-blue-300 shadow-md shadow-blue-500/10"
          : "bg-white/80 backdrop-blur-md border-sky-100 shadow-sm shadow-sky-100/50"
      }`}
    >
      {/* Header section of the form */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-colors ${
              isEditing
                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                : "bg-sky-100 text-sky-600"
            }`}
          >
            {isEditing ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg text-slate-800">
                {isEditing ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
              </h3>
              {isEditing ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                  กำลังแก้ไข ID: {editing?.id}
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                  ฟอร์มลงทะเบียนสินค้า
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditing
                ? "ปรับปรุงข้อมูลสินค้าที่เลือก และกดบันทึกการแก้ไขเพื่ออัปเดต"
                : "กรอกข้อมูลรายละเอียดของสินค้าเพื่อบันทึกลงในระบบ"}
            </p>
          </div>
        </div>

        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            ยกเลิกการแก้ไข
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(saveProduct)} noValidate className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* ชื่อสินค้า */}
          <div className="lg:col-span-2">
            <label htmlFor="title" className="block text-xs font-semibold text-slate-700 mb-1.5">
              ชื่อสินค้า <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="title"
                type="text"
                {...register("title")}
                aria-invalid={!!errors.title}
                placeholder="เช่น Wireless Noise Cancelling Headphones"
                className={`w-full px-3.5 py-2 text-sm bg-slate-50/50 hover:bg-white focus:bg-white border rounded-xl transition-all duration-150 outline-none text-slate-800 placeholder-slate-400 ${
                  errors.title
                    ? "border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
                    : "border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                }`}
              />
            </div>
            {errors.title && (
              <span role="alert" className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.title.message}
              </span>
            )}
          </div>

          {/* ราคา */}
          <div>
            <label htmlFor="price" className="block text-xs font-semibold text-slate-700 mb-1.5">
              ราคา (บาท / USD) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-sm font-semibold">
                $
              </span>
              <input
                id="price"
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                aria-invalid={!!errors.price}
                placeholder="0.00"
                className={`w-full pl-8 pr-3 py-2 text-sm bg-slate-50/50 hover:bg-white focus:bg-white border rounded-xl transition-all duration-150 outline-none text-slate-800 ${
                  errors.price
                    ? "border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
                    : "border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                }`}
              />
            </div>
            {errors.price && (
              <span role="alert" className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.price.message}
              </span>
            )}
          </div>

          {/* จำนวนคงเหลือ */}
          <div>
            <label htmlFor="stock" className="block text-xs font-semibold text-slate-700 mb-1.5">
              จำนวนคงเหลือ (ชิ้น) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="stock"
                type="number"
                {...register("stock", { valueAsNumber: true })}
                aria-invalid={!!errors.stock}
                placeholder="0"
                className={`w-full px-3.5 py-2 text-sm bg-slate-50/50 hover:bg-white focus:bg-white border rounded-xl transition-all duration-150 outline-none text-slate-800 ${
                  errors.stock
                    ? "border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
                    : "border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                }`}
              />
            </div>
            {errors.stock && (
              <span role="alert" className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.stock.message}
              </span>
            )}
          </div>

          {/* หมวดหมู่ */}
          <div className="lg:col-span-2">
            <label htmlFor="category" className="block text-xs font-semibold text-slate-700 mb-1.5">
              หมวดหมู่สินค้า <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                id="category"
                {...register("category")}
                aria-invalid={!!errors.category}
                className={`w-full px-3.5 py-2 text-sm bg-slate-50/50 hover:bg-white focus:bg-white border rounded-xl transition-all duration-150 outline-none text-slate-800 cursor-pointer appearance-none pr-8 ${
                  errors.category
                    ? "border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
                    : "border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                }`}
              >
                <option value="">-- กรุณาเลือกหมวดหมู่ --</option>
                {CATEGORIES.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
            {errors.category && (
              <span role="alert" className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.category.message}
              </span>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm text-white shadow-md transition-all duration-150 cursor-pointer ${
              isEditing
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/25 active:scale-[0.98]"
                : "bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-sky-500/25 active:scale-[0.98]"
            } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
          >
            {isEditing ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>บันทึกการแก้ไข</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>เพิ่มสินค้า</span>
              </>
            )}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 active:scale-[0.98] transition-all duration-150 cursor-pointer"
            >
              <span>ยกเลิก</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}