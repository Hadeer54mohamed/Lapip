"use client";
import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    if (showQuickView) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showQuickView]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeQuickView();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const finalPrice = discount
    ? (price - price * (discount / 100)).toFixed(2)
    : price;

  return (
    <div className="product-card">
      <div className="product-image">
        <img
          src={image_url || "/images/placeholder.png"}
          alt={lang === "ar" ? title_ar : title_en}
        />
        {discount && <span className="discount-badge">-{discount}%</span>}
      </div>

      <div className="product-info">
        <h3 className="product-name">{lang === "ar" ? title_ar : title_en}</h3>
        <p className="product-desc">
          {lang === "ar" ? category?.name_ar : category?.name_en}
        </p>
        <p className="product-price">
          {finalPrice} {lang === "ar" ? "ج.م" : "EGP"}
          {discount && (
            <span className="old-price">
              {price} {lang === "ar" ? "ج.م" : "EGP"}
            </span>
          )}
        </p>
      </div>

      <div className="product-actions">
        <button className="btn btn-quickview" onClick={handleQuickView}>
          {lang === "ar" ? "تفاصيل" : "Details"}
        </button>
      </div>

      {showQuickView &&
        createPortal(
          <div className="quick-view-modal">
            <div className="modal-overlay" onClick={closeQuickView}></div>
            <div className="modal-content animate-fade">
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
                    {finalPrice} {lang === "ar" ? "ج.م" : "EGP"}
                    {discount && (
                      <span className="old-price">
                        {price} {lang === "ar" ? "ج.م" : "EGP"}
                      </span>
                    )}
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
