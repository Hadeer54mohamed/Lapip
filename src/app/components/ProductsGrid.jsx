"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ProductCard } from "./ProductCard";
import { useI18nClient } from "@/lib/i18nClient";

export default function ProductsGrid() {
  const { i18n, t, mounted } = useI18nClient();
  const currentLang = i18n.language; // "ar" or "en"
  const [category, setCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // جلب المنتجات
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          title_ar,
          title_en,
          description_ar,
          description_en,
          price,
          image_url,
          discount,
          created_at,
          category_id,
          categories (
            id,
            name_ar,
            name_en
          )
        `);

      if (error) {
        console.error("Error fetching products:", error.message);
      } else {
        setProducts(data || []);
      }
    };

    fetchProducts();
  }, []);

  // جلب الكاتيجوري
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name_ar, name_en");

      if (error) {
        console.error("Error fetching categories:", error.message);
      } else {
        setCategories(data || []);
      }
    };

    fetchCategories();
  }, []);

  // فلترة المنتجات
  const filtered =
    category === "all"
      ? products
      : products.filter((p) => p.category_id === category);

  // اسم التصنيف الحالي
  const currentCategoryName =
    category === "all"
      ? t("all")
      : categories.find((c) => c.id === category)
      ? (currentLang === "ar"
          ? categories.find((c) => c.id === category).name_ar
          : categories.find((c) => c.id === category).name_en)
      : "";

  // عرض loading
  if (!mounted) {
    return (
      <div className="w-full">
        <nav className="categories">
          <button type="button" className="cat-btn active">
            {t("all")}
          </button>
        </nav>

        <div className="products-grid">
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* الفلاتر */}
      <nav className="categories">
        <button
          type="button"
          onClick={() => setCategory("all")}
          className={`cat-btn ${category === "all" ? "active" : ""}`}
        >
          {t("all")}
        </button>

        {categories.map((c) => (
          <button
            type="button"
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`cat-btn ${category === c.id ? "active" : ""}`}
          >
            {currentLang === "ar" ? c.name_ar : c.name_en}
          </button>
        ))}
      </nav>

      {/* شريط التصنيف الحالي */}
      <div className="current-category-banner">
        <h2>{currentCategoryName}</h2>
        <p>{t("Quality you can taste.")}</p>
      </div>

      {/* المنتجات */}
      <div className="products-grid">
        {filtered.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            category={product.categories}
            lang={currentLang}
          />
        ))}
      </div>
    </div>
  );
}
