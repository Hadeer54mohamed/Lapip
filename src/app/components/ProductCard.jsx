"use client";
import React from "react";

export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <div className="product-name" title={product.name}>
        {product.name}
      </div>
      <div className="product-category">{product.category}</div>
      <div className="product-price">{product.price}</div>
      <div className="product-actions">
        <button className="btn btn-wishlist" aria-label="إضافة إلى المفضلة">
          ❤
        </button>
        <button className="btn btn-cart" aria-label="إضافة إلى السلة">
          🛒
        </button>
        <button className="btn btn-quickview" aria-label="عرض سريع">
          عرض سريع
        </button>
      </div>
    </div>
  );
}
