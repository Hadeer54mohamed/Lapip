"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useI18nClient } from "@/lib/i18nClient";

export default function CategoryButtons({
  onMainCategorySelect,
  selectedMainCategory,
}) {
  const { i18n, mounted } = useI18nClient();
  const currentLang = i18n.language;
  const [mainCategories, setMainCategories] = useState([]);

  useEffect(() => {
    const fetchMainCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name_ar, name_en, parent_id, image_url")
        .is("parent_id", null); // Only main categories (no parent)

      if (error) {
        console.error("Error fetching main categories:", error.message);
      } else {
        setMainCategories(data || []);
      }
    };

    fetchMainCategories();
  }, []);

  if (!mounted) {
    return (
      <div className="category-buttons-container">
        <div className="category-button">
          <div className="button-content">
            <h3>قائمة المشروبات</h3>
          </div>
        </div>
        <div className="category-button">
          <div className="button-content">
            <h3>قائمة الطعام</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="category-buttons-container">
      {mainCategories.map((category, index) => (
        <div
          key={category.id}
          className={`category-button ${
            selectedMainCategory === category.id ? "active" : ""
          }`}
          style={{
            backgroundImage: category.image_url
              ? `url("${category.image_url}")`
              : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          onClick={() => onMainCategorySelect(category.id)}
        >
          <div className="button-content">
            <h3>
              {currentLang === "ar" ? category.name_ar : category.name_en}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}
