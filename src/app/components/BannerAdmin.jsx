// هذا مكون اختياري لإدارة البانرات (للاستخدام في لوحة التحكم)
"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function BannerAdmin() {
  const [imageUrl, setImageUrl] = useState("");
  const [link, setLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const { data, error } = await supabase.from("Banners").insert([
        {
          image: imageUrl,
          link: link || null, // إذا كان الرابط فارغاً، حفظه كـ null
        },
      ]);

      if (error) {
        setMessage(`خطأ: ${error.message}`);
      } else {
        setMessage("تم إضافة البانر بنجاح!");
        setImageUrl("");
        setLink("");
      }
    } catch (error) {
      setMessage(`خطأ: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="banner-admin">
      <h2>إضافة بانر جديد</h2>
      <form onSubmit={handleSubmit} className="banner-form">
        <div className="form-group">
          <label htmlFor="imageUrl">رابط الصورة:</label>
          <input
            type="url"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="link">الرابط (اختياري):</label>
          <input
            type="url"
            id="link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://example.com (اتركه فارغاً إذا لم تكن تريد رابطاً)"
          />
        </div>

        <button type="submit" disabled={isLoading} className="submit-btn">
          {isLoading ? "جاري الإضافة..." : "إضافة البانر"}
        </button>

        {message && (
          <div
            className={`message ${
              message.includes("خطأ") ? "error" : "success"
            }`}
          >
            {message}
          </div>
        )}
      </form>

      <div className="banner-instructions">
        <h3>تعليمات:</h3>
        <ul>
          <li>أضف رابط صورة صالح في حقل "رابط الصورة"</li>
          <li>
            يمكنك إضافة رابط اختياري في حقل "الرابط" - سيتم فتحه عند النقر على
            البانر
          </li>
          <li>إذا تركت حقل "الرابط" فارغاً، لن يكون البانر قابلاً للنقر</li>
          <li>يمكن عرض عدة بانرات وسيتم التناوب بينها كل 5 ثوانِ</li>
        </ul>
      </div>

      <style jsx>{`
        .banner-admin {
          max-width: 500px;
          margin: 20px auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 10px;
          background: #f9f9f9;
        }

        .banner-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .form-group label {
          font-weight: bold;
          color: #333;
        }

        .form-group input {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 14px;
        }

        .submit-btn {
          padding: 12px;
          background: var(--primary-color);
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          transition: background 0.3s;
        }

        .submit-btn:hover {
          background: var(--accent-color);
        }

        .submit-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .message {
          padding: 10px;
          border-radius: 5px;
          text-align: center;
          font-weight: bold;
        }

        .message.success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .message.error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .banner-instructions {
          margin-top: 20px;
          padding: 15px;
          background: #e9ecef;
          border-radius: 5px;
        }

        .banner-instructions h3 {
          margin-top: 0;
          color: #495057;
        }

        .banner-instructions ul {
          margin: 10px 0;
          padding-right: 20px;
        }

        .banner-instructions li {
          margin-bottom: 5px;
          color: #6c757d;
        }
      `}</style>
    </div>
  );
}
