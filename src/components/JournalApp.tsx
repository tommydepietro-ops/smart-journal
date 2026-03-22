"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { getTodayString, formatDate, formatTime, renderMarkdown } from "@/lib/utils";
import CalendarView from "./CalendarView";
import PromptsView from "./PromptsView";
import QuoteOfTheDay from "./QuoteOfTheDay";

interface Entry {
  id: number;
  content: string;
  date: string;
  created_at: string;
  updated_at: string;
}

type View = "journal" | "calendar" | "prompts" | "summary";

export default function JournalApp() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [newEntry, setNewEntry] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<View>("journal");
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);

  const today = getTodayString();

  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch("/api/entries");
      if (res.ok) {
        const data = await res.json();
        setEntries(data);
      }
    } catch (err) {
      console.error("Failed to fetch entries:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  useEffect(() => {
    if (editingId !== null && editTextareaRef.current) {
      editTextareaRef.current.focus();
      editTextareaRef.current.style.height = "auto";
      editTextareaRef.current.style.height =
        editTextareaRef.current.scrollHeight + "px";
    }
  }, [editingId]);

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  const saveEntry = async () => {
    if (!newEntry.trim() || saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newEntry.trim(), date: today }),
      });
      if (res.ok) {
        setNewEntry("");
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
        await fetchEntries();
      }
    } catch (err) {
      console.error("Failed to save entry:", err);
    } finally {
      setSaving(false);
    }
  };

  const updateEntry = async (id: number) => {
    if (!editContent.trim()) return;
    try {
      const res = await fetch(`/api/entries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent.trim() }),
      });
      if (res.ok) {
        setEditingId(null);
        setEditContent("");
        await fetchEntries();
      }
    } catch (err) {
      console.error("Failed to update entry:", err);
    }
  };

  const deleteEntry = async (id: number) => {
    try {
      const res = await fetch(`/api/entries/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchEntries();
      }
    } catch (err) {
      console.error("Failed to delete entry:", err);
    }
  };

  const generateSummary = async () => {
    setSummaryLoading(true);
    setSummaryError("");
    setSummary("");
    try {
      const res = await fetch("/api/summary", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setSummary(data.summary);
      } else {
        setSummaryError(data.error || "Failed to generate summary");
      }
    } catch (err) {
      console.error("Failed to generate summary:", err);
      setSummaryError("Network error. Please try again.");
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      saveEntry();
    }
  };

  // Group entries by date
  const groupedEntries = entries.reduce<Record<string, Entry[]>>((acc, entry) => {
    if (!acc[entry.date]) acc[entry.date] = [];
    acc[entry.date].push(entry);
    return acc;
  }, {});

  const todayEntries = groupedEntries[today] || [];
  const pastDates = Object.keys(groupedEntries)
    .filter((d) => d !== today)
    .sort((a, b) => b.localeCompare(a));

  return (
    <div className="relative z-10 flex flex-col min-h-screen max-w-2xl mx-auto w-full px-4 py-6">
      {/* Header */}
      <header className="text-center mb-6" style={{ animation: "fade-in 0.5s ease-out" }}>
        <h1 className="text-3xl font-bold tracking-tight mb-1">
          <span className="bg-gradient-to-r from-[#a594ff] to-[#7c6ef0] bg-clip-text text-transparent">
            Smart Journal
          </span>
        </h1>
        <p className="text-sm text-white/50">{formatDate(today)}</p>
      </header>

      {/* View Toggle */}
      <div
        className="flex gap-2 mb-6 p-1 rounded-2xl mx-auto"
        style={{
          background: "rgba(255,255,255,0.06)",
          borderTop: "1px solid rgba(255,255,255,0.25)",
          borderLeft: "1px solid rgba(255,255,255,0.2)",
          borderRight: "1px solid rgba(255,255,255,0.08)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 0 20px rgba(255,255,255,0.03)",
        }}
      >
        <button
          onClick={() => setView("journal")}
          className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300"
          style={
            view === "journal"
              ? {
                  background: "linear-gradient(135deg, #7c6ef0, #a594ff)",
                  color: "white",
                  boxShadow: "0 4px 15px rgba(124,110,240,0.3)",
                }
              : { color: "rgba(248,248,255,0.5)" }
          }
        >
          Journal
        </button>
        <button
          onClick={() => setView("calendar")}
          className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300"
          style={
            view === "calendar"
              ? {
                  background: "linear-gradient(135deg, #7c6ef0, #a594ff)",
                  color: "white",
                  boxShadow: "0 4px 15px rgba(124,110,240,0.3)",
                }
              : { color: "rgba(248,248,255,0.5)" }
          }
        >
          Calendar
        </button>
        <button
          onClick={() => setView("prompts")}
          className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300"
          style={
            view === "prompts"
              ? {
                  background: "linear-gradient(135deg, #7c6ef0, #a594ff)",
                  color: "white",
                  boxShadow: "0 4px 15px rgba(124,110,240,0.3)",
                }
              : { color: "rgba(248,248,255,0.5)" }
          }
        >
          Prompts
        </button>
        <button
          onClick={() => {
            setView("summary");
            if (!summary && !summaryLoading) generateSummary();
          }}
          className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300"
          style={
            view === "summary"
              ? {
                  background: "linear-gradient(135deg, #7c6ef0, #a594ff)",
                  color: "white",
                  boxShadow: "0 4px 15px rgba(124,110,240,0.3)",
                }
              : { color: "rgba(248,248,255,0.5)" }
          }
        >
          Summary
        </button>
      </div>

      {/* Journal View */}
      {view === "journal" && (
        <div style={{ animation: "fade-in 0.3s ease-out" }}>
          {/* New Entry Input */}
          <div
            className="mb-6 p-5 relative"
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
            <textarea
              ref={textareaRef}
              value={newEntry}
              onChange={(e) => {
                setNewEntry(e.target.value);
                autoResize(e.target);
              }}
              onKeyDown={handleKeyDown}
              placeholder="What's on your mind today?"
              rows={3}
              className="w-full resize-none text-base p-4 mb-3 transition-all duration-300"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)",
                borderTop: "1px solid rgba(255,255,255,0.18)",
                borderLeft: "1px solid rgba(255,255,255,0.14)",
                borderRight: "1px solid rgba(255,255,255,0.06)",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                borderRadius: 14,
                color: "#f8f8ff",
                outline: "none",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), inset 0 0 15px rgba(255,255,255,0.02)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#7c6ef0";
                e.target.style.boxShadow = "0 0 0 3px rgba(124,110,240,0.2)";
                e.target.style.background = "rgba(255,255,255,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255,255,255,0.12)";
                e.target.style.boxShadow = "none";
                e.target.style.background = "rgba(255,255,255,0.07)";
              }}
            />
            <button
              onClick={saveEntry}
              disabled={!newEntry.trim() || saving}
              className="w-full font-semibold text-base py-3.5 transition-all duration-300"
              style={{
                background: !newEntry.trim() || saving
                  ? "rgba(124,110,240,0.3)"
                  : "linear-gradient(135deg, #7c6ef0, #a594ff)",
                color: "white",
                border: "none",
                borderRadius: 14,
                cursor: !newEntry.trim() || saving ? "not-allowed" : "pointer",
                boxShadow:
                  !newEntry.trim() || saving
                    ? "none"
                    : "0 4px 15px rgba(124,110,240,0.3)",
                opacity: !newEntry.trim() || saving ? 0.5 : 1,
              }}
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner /> Saving...
                </span>
              ) : (
                "Save Entry"
              )}
            </button>
            <p className="text-xs text-white/30 text-center mt-2">
              Press Cmd+Enter to save
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.04) 75%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.5s ease-in-out infinite",
                  }}
                />
              ))}
            </div>
          )}

          {/* Today's Entries */}
          {!loading && todayEntries.length > 0 && (
            <section className="mb-8" style={{ animation: "fade-in-up 0.4s ease-out" }}>
              <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-3 px-1">
                Today
              </h2>
              <div className="space-y-3">
                {todayEntries.map((entry, idx) => (
                  <EntryCard
                    key={entry.id}
                    entry={entry}
                    index={idx}
                    editingId={editingId}
                    editContent={editContent}
                    editTextareaRef={editTextareaRef}
                    onEdit={() => {
                      setEditingId(entry.id);
                      setEditContent(entry.content);
                    }}
                    onEditChange={setEditContent}
                    onEditSave={() => updateEntry(entry.id)}
                    onEditCancel={() => {
                      setEditingId(null);
                      setEditContent("");
                    }}
                    onDelete={() => deleteEntry(entry.id)}
                    autoResize={autoResize}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Past Entries */}
          {!loading &&
            pastDates.map((date) => (
              <section
                key={date}
                className="mb-8"
                style={{ animation: "fade-in-up 0.4s ease-out" }}
              >
                <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-3 px-1">
                  {formatDate(date)}
                </h2>
                <div className="space-y-3">
                  {groupedEntries[date].map((entry, idx) => (
                    <EntryCard
                      key={entry.id}
                      entry={entry}
                      index={idx}
                      editingId={editingId}
                      editContent={editContent}
                      editTextareaRef={editTextareaRef}
                      onEdit={() => {
                        setEditingId(entry.id);
                        setEditContent(entry.content);
                      }}
                      onEditChange={setEditContent}
                      onEditSave={() => updateEntry(entry.id)}
                      onEditCancel={() => {
                        setEditingId(null);
                        setEditContent("");
                      }}
                      onDelete={() => deleteEntry(entry.id)}
                      autoResize={autoResize}
                    />
                  ))}
                </div>
              </section>
            ))}

          {/* Empty State */}
          {!loading && entries.length === 0 && (
            <div
              className="text-center py-16 px-6"
              style={{ animation: "fade-in 0.5s ease-out" }}
            >
              <div className="text-5xl mb-4 opacity-60">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.2}
                  viewBox="0 0 24 24"
                  style={{ color: "rgba(165,148,255,0.5)" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                  />
                </svg>
              </div>
              <p className="text-white/50 text-lg mb-1">Your journal is empty</p>
              <p className="text-white/30 text-sm">
                Start writing to capture your thoughts
              </p>
            </div>
          )}
        </div>
      )}

      {/* Calendar View */}
      {view === "calendar" && <CalendarView entries={entries} />}

      {/* Prompts View */}
      {view === "prompts" && (
        <PromptsView
          onSelectPrompt={(prompt) => {
            setNewEntry(prompt);
            setView("journal");
            // Focus the textarea after switching view
            setTimeout(() => {
              if (textareaRef.current) {
                textareaRef.current.focus();
                textareaRef.current.style.height = "auto";
                textareaRef.current.style.height =
                  textareaRef.current.scrollHeight + "px";
              }
            }, 100);
          }}
        />
      )}

      {/* Summary View */}
      {view === "summary" && (
        <div style={{ animation: "fade-in 0.3s ease-out" }}>
          <div
            className="p-6 relative"
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
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-white/90">AI Insights</h2>
              <button
                onClick={generateSummary}
                disabled={summaryLoading || entries.length === 0}
                className="text-sm px-4 py-2 rounded-xl font-medium transition-all duration-300"
                style={{
                  background:
                    summaryLoading || entries.length === 0
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(124,110,240,0.2)",
                  color:
                    summaryLoading || entries.length === 0
                      ? "rgba(255,255,255,0.3)"
                      : "#a594ff",
                  border: "1px solid",
                  borderColor:
                    summaryLoading || entries.length === 0
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(124,110,240,0.3)",
                  cursor:
                    summaryLoading || entries.length === 0
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {summaryLoading ? "Analyzing..." : "Refresh"}
              </button>
            </div>

            {summaryLoading && (
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-3 mb-6">
                  <Spinner />
                  <span
                    className="text-sm text-white/50"
                    style={{ animation: "pulse-soft 2s ease-in-out infinite" }}
                  >
                    Analyzing your journal entries...
                  </span>
                </div>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="rounded-xl"
                    style={{
                      height: i % 2 === 0 ? 16 : 20,
                      width: `${70 + (i * 7) % 30}%`,
                      background:
                        "linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.04) 75%)",
                      backgroundSize: "200% 100%",
                      animation: "shimmer 1.5s ease-in-out infinite",
                    }}
                  />
                ))}
              </div>
            )}

            {summaryError && (
              <div
                className="p-4 rounded-xl text-sm"
                style={{
                  background: "rgba(255,107,107,0.1)",
                  border: "1px solid rgba(255,107,107,0.2)",
                  color: "#ff8a8a",
                }}
              >
                {summaryError}
              </div>
            )}

            {summary && !summaryLoading && (
              <div
                className="text-sm leading-relaxed"
                style={{ animation: "fade-in-up 0.4s ease-out" }}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(summary) }}
              />
            )}

            {!summary && !summaryLoading && !summaryError && entries.length === 0 && (
              <p className="text-white/40 text-sm text-center py-8">
                Write some journal entries first, then come back for AI-powered insights.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Quote of the Day — always visible at the bottom */}
      <QuoteOfTheDay />
    </div>
  );
}

/* ---------- Sub-components ---------- */

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      style={{ color: "currentColor" }}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

interface EntryCardProps {
  entry: Entry;
  index: number;
  editingId: number | null;
  editContent: string;
  editTextareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onEdit: () => void;
  onEditChange: (value: string) => void;
  onEditSave: () => void;
  onEditCancel: () => void;
  onDelete: () => void;
  autoResize: (el: HTMLTextAreaElement) => void;
}

function EntryCard({
  entry,
  index,
  editingId,
  editContent,
  editTextareaRef,
  onEdit,
  onEditChange,
  onEditSave,
  onEditCancel,
  onDelete,
  autoResize,
}: EntryCardProps) {
  const isEditing = editingId === entry.id;

  return (
    <div
      className="p-4 transition-all duration-300 relative"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)",
        borderTop: "1px solid rgba(255,255,255,0.22)",
        borderLeft: "1px solid rgba(255,255,255,0.15)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 0 20px rgba(255,255,255,0.03)",
        borderRadius: 16,
        animationDelay: `${index * 50}ms`,
        animation: "fade-in-up 0.4s ease-out forwards",
        opacity: 0,
      }}
    >
      {isEditing ? (
        <div>
          <textarea
            ref={editTextareaRef}
            value={editContent}
            onChange={(e) => {
              onEditChange(e.target.value);
              autoResize(e.target);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                onEditSave();
              }
              if (e.key === "Escape") onEditCancel();
            }}
            className="w-full resize-none text-sm p-3 mb-3"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid #7c6ef0",
              borderRadius: 12,
              color: "#f8f8ff",
              outline: "none",
              boxShadow: "0 0 0 3px rgba(124,110,240,0.2)",
            }}
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={onEditCancel}
              className="text-xs px-3 py-1.5 rounded-lg transition-colors"
              style={{
                color: "rgba(248,248,255,0.5)",
                background: "rgba(255,255,255,0.05)",
              }}
            >
              Cancel
            </button>
            <button
              onClick={onEditSave}
              className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
              style={{
                background: "rgba(124,110,240,0.3)",
                color: "#a594ff",
              }}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-sm text-white/85 leading-relaxed whitespace-pre-wrap mb-3">
            {entry.content}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/30">
              {formatTime(entry.created_at)}
            </span>
            <div className="flex gap-2">
              <button
                onClick={onEdit}
                className="text-xs px-2.5 py-1 rounded-lg transition-colors"
                style={{ color: "rgba(248,248,255,0.4)" }}
              >
                Edit
              </button>
              <button
                onClick={onDelete}
                className="text-xs px-2.5 py-1 rounded-lg transition-colors"
                style={{ color: "rgba(255,107,107,0.6)" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
