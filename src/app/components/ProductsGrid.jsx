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
    category === "all"
      ? products
      : products.filter((p) => {
          // If selected category is a main category, show products from all its subcategories
          if (isMainCategory(category)) {
            const subcategoryIds = getSubcategoryIds(category);
            return (
              p.category_id === category ||
              subcategoryIds.includes(p.category_id)
            );
          }
          // If selected category is a subcategory, show only products from that subcategory
          return p.category_id === category;
        });

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
  }, [category]);

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

      <nav className="categories">
        <button
          type="button"
          onClick={() => {
            setCategory("all");
            setOpenDropdown(null);
          }}
          className={`cat-btn ${category === "all" ? "active" : ""}`}
        >
          {t("all")}
        </button>

        {/* Main Categories with Dropdowns */}
        {categories
          .filter((c) => !c.parent_id) // Only main categories (no parent)
          .map((mainCat) => {
            const subcategories = categories.filter(
              (subCat) => subCat.parent_id === mainCat.id
            );
            const isOpen = openDropdown === mainCat.id;
            const isMainCatActive = category === mainCat.id;
            const hasActiveSubcat = subcategories.some(
              (sub) => category === sub.id
            );

            return (
              <div key={mainCat.id} className="category-dropdown">
                <button
                  type="button"
                  onClick={() => {
                    if (subcategories.length > 0) {
                      // If has subcategories, toggle dropdown
                      setOpenDropdown(isOpen ? null : mainCat.id);
                    } else {
                      // If no subcategories, select main category
                      setCategory(mainCat.id);
                      setOpenDropdown(null);
                    }
                  }}
                  className={`cat-btn main-cat ${
                    isMainCatActive || hasActiveSubcat ? "active" : ""
                  }`}
                >
                  {currentLang === "ar" ? mainCat.name_ar : mainCat.name_en}
                  {subcategories.length > 0 && (
                    <span className={`dropdown-arrow ${isOpen ? "open" : ""}`}>
                      ▼
                    </span>
                  )}
                </button>

                {/* Dropdown Menu */}
                {subcategories.length > 0 && isOpen && (
                  <div className="dropdown-menu">
                    {/* Main category option */}
                    <button
                      type="button"
                      onClick={() => {
                        setCategory(mainCat.id);
                        setOpenDropdown(null);
                      }}
                      className={`dropdown-item ${
                        isMainCatActive ? "active" : ""
                      }`}
                    >
                      {currentLang === "ar"
                        ? `جميع ${mainCat.name_ar}`
                        : `All ${mainCat.name_en}`}
                    </button>

                    {/* Subcategories */}
                    {subcategories.map((subCat) => (
                      <button
                        type="button"
                        key={subCat.id}
                        onClick={() => {
                          setCategory(subCat.id);
                          setOpenDropdown(null);
                        }}
                        className={`dropdown-item ${
                          category === subCat.id ? "active" : ""
                        }`}
                      >
                        {currentLang === "ar" ? subCat.name_ar : subCat.name_en}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
      </nav>

      <div className="current-category-banner">
        <h2>{currentCategoryName}</h2>
        <p>
          {currentLang === "ar"
            ? "جودة يمكنك تذوقها."
            : "Quality you can taste."}
        </p>
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
            {currentLang === "ar" ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
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
