"use client";
import React, { useState } from "react";
import { createPortal } from "react-dom";

export function ProductCard({
  id,
  title_ar,
  title_en,
  description_ar,
  description_en,
  price,
  image_url,
  discount,
  category,
  lang,
}) {
  const [showQuickView, setShowQuickView] = useState(false);

  const handleQuickView = () => {
    setShowQuickView(true);
  };

  const closeQuickView = () => {
    setShowQuickView(false);
  };

  return (
    <div className="product-card">
      {/* صورة المنتج */}
      <div className="product-image">
        <img
          src={image_url || "/images/placeholder.png"}
          alt={lang === "ar" ? title_ar : title_en}
        />
        {discount && <span className="discount-badge">-{discount}%</span>}
      </div>

      {/* تفاصيل المنتج */}
      <div className="product-info">
        <h3 className="product-name">{lang === "ar" ? title_ar : title_en}</h3>
        <p className="product-desc">
          {lang === "ar" ? category?.name_ar : category?.name_en}
        </p>
        <p className="product-price">
          {price} {lang === "ar" ? "ج.م" : "EGP"}
        </p>
      </div>

      {/* الأكشنز */}
      <div className="product-actions">
        <button className="btn btn-quickview" onClick={handleQuickView}>
          {lang === "ar" ? "عرض سريع" : "Quick View"}
        </button>
      </div>

      {/* Quick View Modal - خارج الكارت */}
      {showQuickView &&
        createPortal(
          <div className="quick-view-modal">
            <div className="modal-overlay" onClick={closeQuickView}></div>
            <div className="modal-content">
              <div className="modal-header">
                <h2>{lang === "ar" ? title_ar : title_en}</h2>
                <button className="close-btn" onClick={closeQuickView}>
                  ×
                </button>
              </div>

              <div className="modal-body">
                <div className="modal-image">
                  <img
                    src={image_url || "/images/placeholder.png"}
                    alt={lang === "ar" ? title_ar : title_en}
                  />
                  {discount && (
                    <span className="discount-badge">-{discount}%</span>
                  )}
                </div>

                <div className="modal-info">
                  <p className="modal-category">
                    {lang === "ar" ? category?.name_ar : category?.name_en}
                  </p>
                  <p className="modal-price">
                    {price} {lang === "ar" ? "ج.م" : "EGP"}
                  </p>
                  <p
                    className="modal-description"
                    dangerouslySetInnerHTML={{
                      __html: lang === "ar" ? description_ar : description_en,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
