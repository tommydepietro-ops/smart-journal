"use client";

import { useState, useEffect, useMemo } from "react";
import { formatTime, renderMarkdown } from "@/lib/utils";

interface Entry {
  id: number;
  content: string;
  date: string;
  created_at: string;
  updated_at: string;
}

interface CalendarViewProps {
  entries: Entry[];
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function formatMonthYear(year: number, month: number): string {
  const date = new Date(year, month);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function formatDateHeading(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function CalendarView({ entries }: CalendarViewProps) {
  const [today, setToday] = useState("");
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const now = new Date();
    setToday(getTodayString());
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    setMounted(true);
  }, []);

  // Build a Set of dates that have entries for quick lookup
  const entryDatesSet = useMemo(() => {
    const set = new Set<string>();
    for (const entry of entries) {
      set.add(entry.date);
    }
    return set;
  }, [entries]);

  // Get entries for a specific date
  const selectedEntries = useMemo(() => {
    if (!selectedDate) return [];
    return entries.filter((e) => e.date === selectedDate);
  }, [entries, selectedDate]);

  // Build calendar grid for the current month
  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const days: (number | null)[] = [];
    // Leading blanks
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(d);
    }
    return days;
  }, [viewYear, viewMonth]);

  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
    setSelectedDate(null);
  };

  const dateStringForDay = (day: number): string => {
    return `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  return (
    <div style={{ animation: "fade-in 0.3s ease-out" }}>
      {/* Calendar Card */}
      <div
        className="p-5 mb-4 relative"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.05) 100%)",
          borderTop: "1px solid rgba(255,255,255,0.3)",
          borderLeft: "1px solid rgba(255,255,255,0.2)",
          borderRight: "1px solid rgba(255,255,255,0.08)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 0 30px rgba(255,255,255,0.04)",
          borderRadius: 20,
        }}
      >
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={goToPrevMonth}
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.05) 100%)",
              borderTop: "1px solid rgba(255,255,255,0.2)",
              borderLeft: "1px solid rgba(255,255,255,0.15)",
              borderRight: "1px solid rgba(255,255,255,0.06)",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
              color: "#a594ff",
            }}
            aria-label="Previous month"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <h2 className="text-lg font-semibold text-white/90">
            {formatMonthYear(viewYear, viewMonth)}
          </h2>

          <button
            onClick={goToNextMonth}
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.05) 100%)",
              borderTop: "1px solid rgba(255,255,255,0.2)",
              borderLeft: "1px solid rgba(255,255,255,0.15)",
              borderRight: "1px solid rgba(255,255,255,0.06)",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
              color: "#a594ff",
            }}
            aria-label="Next month"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS_OF_WEEK.map((d) => (
            <div
              key={d}
              className="text-center text-xs font-medium py-1"
              style={{ color: "rgba(165,148,255,0.6)" }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, idx) => {
            if (day === null) {
              return <div key={`blank-${idx}`} className="aspect-square" />;
            }

            const dateStr = dateStringForDay(day);
            const isToday = dateStr === today;
            const hasEntries = entryDatesSet.has(dateStr);
            const isSelected = dateStr === selectedDate;

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                className="aspect-square flex flex-col items-center justify-center rounded-xl transition-all duration-200 relative"
                style={{
                  background: isSelected
                    ? "linear-gradient(135deg, #7c6ef0, #a594ff)"
                    : isToday
                    ? "rgba(124,110,240,0.2)"
                    : "transparent",
                  border: isToday && !isSelected
                    ? "1px solid rgba(124,110,240,0.4)"
                    : "1px solid transparent",
                  color: isSelected
                    ? "#fff"
                    : isToday
                    ? "#a594ff"
                    : "rgba(248,248,255,0.7)",
                  boxShadow: isSelected
                    ? "0 4px 15px rgba(124,110,240,0.3)"
                    : "none",
                  fontWeight: isToday || isSelected ? 700 : 400,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                <span>{day}</span>
                {hasEntries && (
                  <span
                    className="absolute bottom-1.5"
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: isSelected ? "#fff" : "#a594ff",
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Entries */}
      {selectedDate && (
        <div style={{ animation: "fade-in-up 0.3s ease-out" }}>
          <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-3 px-1">
            {formatDateHeading(selectedDate)}
          </h3>

          {selectedEntries.length === 0 ? (
            <div
              className="text-center py-10 px-6 relative"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                borderTop: "1px solid rgba(255,255,255,0.22)",
                borderLeft: "1px solid rgba(255,255,255,0.15)",
                borderRight: "1px solid rgba(255,255,255,0.06)",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 0 20px rgba(255,255,255,0.03)",
                borderRadius: 16,
              }}
            >
              <p className="text-white/40 text-sm">No entries for this day</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedEntries.map((entry, idx) => (
                <div
                  key={entry.id}
                  className="p-4 transition-all duration-300 relative"
                  style={{
                    background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)",
                    borderTop: "1px solid rgba(255,255,255,0.22)",
                    borderLeft: "1px solid rgba(255,255,255,0.15)",
                    borderRight: "1px solid rgba(255,255,255,0.06)",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 0 20px rgba(255,255,255,0.03)",
                    borderRadius: 16,
                    animationDelay: `${idx * 50}ms`,
                    animation: "fade-in-up 0.4s ease-out forwards",
                    opacity: 0,
                  }}
                >
                  <p className="text-sm text-white/85 leading-relaxed whitespace-pre-wrap mb-3">
                    {entry.content}
                  </p>
                  <span className="text-xs text-white/30">
                    {formatTime(entry.created_at)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
