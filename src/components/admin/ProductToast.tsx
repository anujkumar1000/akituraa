"use client";

import { useEffect, useRef, useState } from "react";

export default function ProductToast() {
  const [toast, setToast] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const data = sessionStorage.getItem("toast");

    if (!data) return;

    const parsed = JSON.parse(data);

    setToast(parsed);
    sessionStorage.removeItem("toast");
  }, []);

  useEffect(() => {
    if (!toast) return;

    timerRef.current = setTimeout(() => {
      console.log("Hiding...");
      setToast(null);
    }, 3000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [toast]);

  if (!toast) return null;

  return (
    <div
      className={`fixed top-6 right-6 z-[9999] rounded-xl px-5 py-4 text-white shadow-2xl ${
        toast.success ? "bg-green-600" : "bg-red-600"
      }`}
    >
      <div className="font-semibold">
        {toast.success ? "✅ Success" : "❌ Error"}
      </div>
      <div>{toast.message}</div>
    </div>
  );
}
