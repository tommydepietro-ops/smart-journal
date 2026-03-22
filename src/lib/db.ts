import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "journal.db");

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");

    db.exec(`
      CREATE TABLE IF NOT EXISTS entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        date TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_entries_date ON entries(date)
    `);
  }
  return db;
}

export interface JournalEntry {
  id: number;
  content: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export function createEntry(content: string, date: string): JournalEntry {
  const d = getDb();
  const stmt = d.prepare(
    "INSERT INTO entries (content, date) VALUES (?, ?)"
  );
  const result = stmt.run(content, date);
  return getEntryById(result.lastInsertRowid as number)!;
}

export function getEntryById(id: number): JournalEntry | undefined {
  const d = getDb();
  return d.prepare("SELECT * FROM entries WHERE id = ?").get(id) as
    | JournalEntry
    | undefined;
}

export function getEntriesByDate(date: string): JournalEntry[] {
  const d = getDb();
  return d
    .prepare("SELECT * FROM entries WHERE date = ? ORDER BY created_at ASC")
    .all(date) as JournalEntry[];
}

export function getAllEntries(): JournalEntry[] {
  const d = getDb();
  return d
    .prepare("SELECT * FROM entries ORDER BY date DESC, created_at DESC")
    .all() as JournalEntry[];
}

export function updateEntry(id: number, content: string): JournalEntry | undefined {
  const d = getDb();
  d.prepare(
    "UPDATE entries SET content = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(content, id);
  return getEntryById(id);
}

export function deleteEntry(id: number): boolean {
  const d = getDb();
  const result = d.prepare("DELETE FROM entries WHERE id = ?").run(id);
  return result.changes > 0;
}

export function getEntryDates(): string[] {
  const d = getDb();
  const rows = d
    .prepare("SELECT DISTINCT date FROM entries ORDER BY date DESC")
    .all() as { date: string }[];
  return rows.map((r) => r.date);
}
