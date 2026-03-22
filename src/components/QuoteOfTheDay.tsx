"use client";

import { useState, useEffect } from "react";
import { getTodayString } from "@/lib/utils";
import { getQuoteOfTheDay, Quote } from "@/lib/quotes";

export default function QuoteOfTheDay() {
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    const today = getTodayString();
    setQuote(getQuoteOfTheDay(today));
  }, []);

  if (!quote) return null;

  return (
    <div
      className="mt-8 mb-4 mx-auto w-full max-w-2xl px-4"
      style={{ animation: "fade-in 0.8s ease-out" }}
    >
      <div
        className="p-5 text-center relative"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
          borderTop: "1px solid rgba(255,255,255,0.28)",
          borderLeft: "1px solid rgba(255,255,255,0.18)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 0 30px rgba(255,255,255,0.04)",
          borderRadius: 18,
        }}
      >
        <p
          className="text-sm leading-relaxed mb-2"
          style={{
            color: "rgba(248,248,255,0.7)",
            fontStyle: "italic",
          }}
        >
          &ldquo;{quote.text}&rdquo;
        </p>
        <p
          className="text-xs font-medium"
          style={{
            color: "rgba(165,148,255,0.6)",
          }}
        >
          &mdash; {quote.author}
        </p>
      </div>
    </div>
  );
}
