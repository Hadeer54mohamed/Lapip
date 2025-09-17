"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function DebugPage() {
  useEffect(() => {
    const fetchData = async () => {
      // 🟢 products
      const { data: products, error: prodErr } = await supabase
        .from("products")
        .select("*")
        .limit(1);

      if (prodErr) {
        console.error("❌ Error fetching products:", prodErr.message);
      } else {
        console.log("📦 Sample product row:", products);
      }

      // 🟢 categories
      const { data: categories, error: catErr } = await supabase
        .from("categories")
        .select("*")
        .limit(1);

      if (catErr) {
        console.error("❌ Error fetching categories:", catErr.message);
      } else {
        console.log("🏷️ Sample category row:", categories);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Debug Page</h1>
      <p>افتح Console (F12 → Console) عشان تشوف بيانات أول صف من products و categories 👀</p>
    </div>
  );
}
