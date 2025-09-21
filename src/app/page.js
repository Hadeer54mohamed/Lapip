"use client";
import { useState } from "react";
import ProductsGrid from "./components/ProductsGrid";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CategoryButtons from "./components/CategoryButtons";

export default function Home() {
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const [resetSubcategory, setResetSubcategory] = useState(false);

  const handleMainCategorySelect = (categoryId) => {
    if (selectedMainCategory === categoryId) {
      // If clicking the same category, trigger reset to show subcategories
      setResetSubcategory(!resetSubcategory);
    } else {
      // If clicking a different category, select it
      setSelectedMainCategory(categoryId);
    }
  };

  return (
    <>
      <Header />
      <CategoryButtons
        onMainCategorySelect={handleMainCategorySelect}
        selectedMainCategory={selectedMainCategory}
      />
      <ProductsGrid
        selectedMainCategory={selectedMainCategory}
        resetSubcategory={resetSubcategory}
      />
      <Footer />
    </>
  );
}
