"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ProductCard } from "./ProductCard";
import { useI18nClient } from "@/lib/i18nClient";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BannerComponent from "./BannerComponent";

export default function ProductsGrid({
  selectedMainCategory,
  resetSubcategory,
}) {
  const { i18n, t, mounted } = useI18nClient();
  const currentLang = i18n.language;
  const [category, setCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("products").select(`
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
            name_en,
            parent_id,
            image_url
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
        .select("id, name_ar, name_en, parent_id, image_url");

      if (error) {
        console.error("Error fetching categories:", error.message);
      } else {
        setCategories(data || []);
      }
    };

    fetchCategories();
  }, []);

  // Helper function to get all subcategory IDs for a parent category
  const getSubcategoryIds = (parentId) => {
    return categories
      .filter((cat) => cat.parent_id === parentId)
      .map((cat) => cat.id);
  };

  // Helper function to check if a category is a main category (no parent)
  const isMainCategory = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat && !cat.parent_id;
  };

  const filtered =
    category === "all" && selectedMainCategory
      ? // Show all products from the selected main category and its subcategories
        products.filter((p) => {
          const subcategoryIds = getSubcategoryIds(selectedMainCategory);
          return (
            p.category_id === selectedMainCategory ||
            subcategoryIds.includes(p.category_id)
          );
        })
      : category === "all"
      ? products
      : products.filter((p) => p.category_id === category);

  // Sort products to show discounted items first
  const sortedProducts = filtered.sort((a, b) => {
    // If both have discounts, sort by discount percentage (higher discount first)
    if (a.discount && b.discount) {
      return b.discount - a.discount;
    }
    // If only one has discount, put it first
    if (a.discount && !b.discount) {
      return -1;
    }
    if (!a.discount && b.discount) {
      return 1;
    }
    // If neither has discount, maintain original order
    return 0;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [category, selectedMainCategory]);

  // Reset category when main category changes
  useEffect(() => {
    if (selectedMainCategory) {
      setCategory("all");
    }
  }, [selectedMainCategory]);

  // Reset to "all" when main category is clicked again
  useEffect(() => {
    if (selectedMainCategory && resetSubcategory !== undefined) {
      setCategory("all");
    }
  }, [resetSubcategory]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".category-dropdown")) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Function to get visible page numbers (max 8) with ellipsis indicators
  const getPaginationItems = () => {
    const maxVisible = 6; // Reduced to make room for ellipsis and first/last pages

    if (totalPages <= 8) {
      return Array.from({ length: totalPages }, (_, i) => ({
        type: "page",
        value: i + 1,
      }));
    }

    const items = [];
    const startPages = 2; // Always show first 2 pages
    const endPages = 2; // Always show last 2 pages
    const centerPages = maxVisible - startPages - endPages; // Remaining pages around current

    // Always add first page
    items.push({ type: "page", value: 1 });

    // Check if we need ellipsis after first page
    if (currentPage <= startPages + centerPages / 2 + 1) {
      // Current page is near the beginning
      for (let i = 2; i <= Math.min(maxVisible, totalPages - 1); i++) {
        items.push({ type: "page", value: i });
      }
      if (maxVisible < totalPages - 1) {
        items.push({ type: "ellipsis", value: "end" });
      }
    } else if (currentPage >= totalPages - startPages - centerPages / 2) {
      // Current page is near the end
      items.push({ type: "ellipsis", value: "start" });
      for (
        let i = Math.max(totalPages - maxVisible + 1, 2);
        i <= totalPages - 1;
        i++
      ) {
        items.push({ type: "page", value: i });
      }
    } else {
      // Current page is in the middle
      items.push({ type: "ellipsis", value: "start" });

      const halfCenter = Math.floor(centerPages / 2);
      const start = currentPage - halfCenter;
      const end = currentPage + halfCenter;

      for (let i = start; i <= end; i++) {
        items.push({ type: "page", value: i });
      }

      items.push({ type: "ellipsis", value: "end" });
    }

    // Always add last page (if not already added)
    if (totalPages > 1) {
      items.push({ type: "page", value: totalPages });
    }

    return items;
  };

  const currentCategoryName =
    category === "all"
      ? t("all")
      : categories.find((c) => c.id === category)
      ? currentLang === "ar"
        ? categories.find((c) => c.id === category).name_ar
        : categories.find((c) => c.id === category).name_en
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
      {/* <section className="hero">
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
      </section> */}

      {/* Show subcategories only when a main category is selected and "all" is active */}
      {selectedMainCategory && category === "all" && (
        <nav className="categories">
          <button
            type="button"
            onClick={() => setCategory("all")}
            className={`cat-btn ${category === "all" ? "active" : ""}`}
          >
            {t("all")}
          </button>

          {/* Show only subcategories of the selected main category */}
          {categories
            .filter((c) => c.parent_id === selectedMainCategory)
            .map((subCat) => (
              <button
                key={subCat.id}
                type="button"
                onClick={() => setCategory(subCat.id)}
                className={`cat-btn ${category === subCat.id ? "active" : ""}`}
              >
                {currentLang === "ar" ? subCat.name_ar : subCat.name_en}
              </button>
            ))}
        </nav>
      )}

      <div className="current-category-banner">
        <h2>{currentCategoryName}</h2>
        <p>
          {currentLang === "ar"
            ? "جودة يمكنك تذوقها."
            : "Quality you can taste."}
        </p>
      </div>

      {/* Banner Component */}
      <BannerComponent />

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
            {currentLang === "ar" ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>

          {getPaginationItems().map((item, index) => {
            if (item.type === "ellipsis") {
              return (
                <span key={item.value} className="pagination-ellipsis">
                  ...
                </span>
              );
            }

            const isActive = currentPage === item.value;
            return (
              <button
                type="button"
                key={item.value}
                onClick={() => goToPage(item.value)}
                className={`page-btn ${isActive ? "active" : ""}`}
              >
                {item.value}
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
            {currentLang === "ar" ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
        </nav>
      )}
    </div>
  );
}
