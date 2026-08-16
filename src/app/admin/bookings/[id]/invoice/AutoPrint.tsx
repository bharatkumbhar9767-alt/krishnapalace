"use client";
import { useEffect } from "react";

export default function AutoPrint() {
  useEffect(() => {
    // Delay print slightly to ensure styles are loaded
    setTimeout(() => {
      window.print();
    }, 500);
  }, []);
  
  return null;
}
