"use client";
import React, { useState } from "react";
import ProductCard from "./ProductCard";

const products = [
  { name: "Waka 15k", category: "disposable", price: "EGP499.00" },
  { name: "Caliburn G3 Lite", category: "pod", price: "EGP599.00" },
  { name: "Argus Xt Kit", category: "kit", price: "EGP1,850.00" },
  { name: "VCT Salt", category: "premium", price: "EGP600.00" },
];

export default function ProductsGrid() {
  const [category, setCategory] = useState("all");

  const filtered =
    category === "all"
      ? products
      : products.filter((p) => p.category === category);

  return (
    <div>
      <nav className="categories pt-5">
        <button
          onClick={() => setCategory("all")}
          className={category === "all" ? "active" : ""}
        >
          الكل
        </button>
        <button
          onClick={() => setCategory("disposable")}
          className={category === "disposable" ? "active" : ""}
        >
          الديسبوزبول
        </button>
        <button
          onClick={() => setCategory("pod")}
          className={category === "pod" ? "active" : ""}
        >
          أجهزة البود
        </button>
        <button
          onClick={() => setCategory("kit")}
          className={category === "kit" ? "active" : ""}
        >
          الأجهزة والكيت
        </button>
        <button
          onClick={() => setCategory("premium")}
          className={category === "premium" ? "active" : ""}
        >
          الليكويد البريميم
        </button>
      </nav>

      <div className="products-grid">
        {filtered.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
}
