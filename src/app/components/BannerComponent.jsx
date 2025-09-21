"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function BannerComponent() {
  const [banners, setBanners] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("Banners")
        .select("id, image, link, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching banners:", error.message);
        setBanners([]);
      } else {
        setBanners(data || []);
      }
      setIsLoading(false);
    };

    fetchBanners();
  }, []);

  // Auto-rotate banners if there are multiple
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
      }, 5000); // Change banner every 5 seconds

      return () => clearInterval(interval);
    }
  }, [banners.length]);

  if (isLoading) {
    return (
      <div className="banner-container">
        <div className="banner-skeleton"></div>
      </div>
    );
  }

  if (!banners || banners.length === 0) {
    return null; // Don't render anything if no banners
  }

  const currentBanner = banners[currentBannerIndex];

  const handleBannerClick = () => {
    if (currentBanner.link) {
      // Check if the link is external (starts with http/https) or internal
      if (currentBanner.link.startsWith("http")) {
        window.open(currentBanner.link, "_blank", "noopener,noreferrer");
      } else {
        // For internal links, you might want to use Next.js router
        window.location.href = currentBanner.link;
      }
    }
  };

  return (
    <div className="banner-container">
      <div
        className={`banner ${currentBanner.link ? "banner-clickable" : ""}`}
        onClick={handleBannerClick}
        style={{ cursor: currentBanner.link ? "pointer" : "default" }}
      >
        {currentBanner.image ? (
          <img
            src={currentBanner.image}
            alt="Banner"
            className="banner-image"
            loading="lazy"
          />
        ) : (
          <div className="banner-placeholder">
            <span>Banner</span>
          </div>
        )}

        {/* Banner indicators for multiple banners */}
        {banners.length > 1 && (
          <div className="banner-indicators">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`banner-indicator ${
                  index === currentBannerIndex ? "active" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentBannerIndex(index);
                }}
                aria-label={`عرض البانر ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
