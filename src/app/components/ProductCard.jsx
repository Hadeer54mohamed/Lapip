"use client";
import React from "react";
import { useI18nClient } from "@/lib/i18nClient";

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
  const { i18n, mounted } = useI18nClient();

  const isRTL = mounted && i18n.language === "ar";

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
        {discount !== 0 ||
          (discount === null && (
            <span
              className={`discount-badge ${isRTL ? "rtl-badge" : "ltr-badge"}`}
            >
              -{discount}%
            </span>
          ))}
      </div>

      <div className="product-info">
        <h3 className="product-name">{lang === "ar" ? title_ar : title_en}</h3>
        <p className="product-desc">
          {lang === "ar" ? category?.name_ar : category?.name_en}
        </p>
        {(description_ar || description_en) && (
          <p
            className="product-description"
            dangerouslySetInnerHTML={{
              __html: lang === "ar" ? description_ar : description_en,
            }}
          />
        )}
        <p className="product-price">
          {lang === "ar" ? " السعر: " : "Price: "} {finalPrice}{" "}
          {lang === "ar" ? "ج.م" : "EGP"}
          {discount !== 0 ||
            (discount === null && (
              <span className="old-price">
                {lang === "ar" ? "السعر: " : "Price: "} {price}{" "}
                {lang === "ar" ? "ج.م" : "EGP"}
              </span>
            ))}
        </p>
      </div>
    </div>
  );
}
