"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ProductCard } from "./ProductCard";
import { useI18nClient } from "@/lib/i18nClient";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductsGrid() {
  const { i18n, t, mounted } = useI18nClient();
  const currentLang = i18n.language;
  const [category, setCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

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

  const filtered =
    category === "all"
      ? products
      : products.filter((p) => p.category_id === category);

  useEffect(() => {
    setCurrentPage(1);
  }, [category]);

  const totalPages = Math.ceil(filtered.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filtered.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const currentCategoryName =
    category === "all"
      ? t("all")
      : categories.find((c) => c.id === category)
      ? (currentLang === "ar"
          ? categories.find((c) => c.id === category).name_ar
          : categories.find((c) => c.id === category).name_en)
      : "";

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
      <section className="hero">
        <div className="hero-inner">
          <h1 className="hero-title">
            {currentLang === "ar" ? "Turn Your Mode 180° Better" : "Turn Your Mode 180° Better"}
          </h1>
          <p className="hero-subtitle">
            {currentLang === "ar"
              ? "LAPIP - COFFEE & LOUNGE"
              : "LAPIP - COFFEE & LOUNGE"}
          </p>
        </div>
        <div className="hero-decor">
          <span className="hero-orb orb1" />
          <span className="hero-orb orb2" />
          <span className="hero-orb orb3" />
        </div>
      </section>

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

      <div className="current-category-banner">
        <h2>{currentCategoryName}</h2>
        <p>{t("Quality you can taste.")}</p>
      </div>

      <div className="products-grid">
        {currentProducts.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            category={product.categories}
            lang={currentLang}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="pagination">
          <button
            type="button"
            aria-label="السابق"
            onClick={() => goToPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="page-btn icon"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            const isActive = currentPage === page;
            return (
              <button
                type="button"
                key={page}
                onClick={() => goToPage(page)}
                className={`page-btn ${isActive ? "active" : ""}`}
              >
                {page}
              </button>
            );
          })}

          <button
            type="button"
            aria-label="التالي"
            onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="page-btn icon"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </nav>
      )}
    </div>
  );
}
