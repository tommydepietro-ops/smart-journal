import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

let initialized = false;

async function init() {
  if (initialized) return;
  await sql`
    CREATE TABLE IF NOT EXISTS entries (
      id SERIAL PRIMARY KEY,
      content TEXT NOT NULL,
      date TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_entries_date ON entries(date)
  `;
  initialized = true;
}

export interface JournalEntry {
  id: number;
  content: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export async function createEntry(content: string, date: string): Promise<JournalEntry> {
  await init();
  const rows = await sql`
    INSERT INTO entries (content, date) VALUES (${content}, ${date})
    RETURNING *
  `;
  return rows[0] as JournalEntry;
}

export async function getEntryById(id: number): Promise<JournalEntry | undefined> {
  await init();
  const rows = await sql`SELECT * FROM entries WHERE id = ${id}`;
  return rows[0] as JournalEntry | undefined;
}

export async function getEntriesByDate(date: string): Promise<JournalEntry[]> {
  await init();
  const rows = await sql`
    SELECT * FROM entries WHERE date = ${date} ORDER BY created_at ASC
  `;
  return rows as JournalEntry[];
}

export async function getAllEntries(): Promise<JournalEntry[]> {
  await init();
  const rows = await sql`
    SELECT * FROM entries ORDER BY date DESC, created_at DESC
  `;
  return rows as JournalEntry[];
}

export async function updateEntry(id: number, content: string): Promise<JournalEntry | undefined> {
  await init();
  const rows = await sql`
    UPDATE entries SET content = ${content}, updated_at = NOW()
    WHERE id = ${id} RETURNING *
  `;
  return rows[0] as JournalEntry | undefined;
}

export async function deleteEntry(id: number): Promise<boolean> {
  await init();
  const rows = await sql`DELETE FROM entries WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}

export async function getEntryDates(): Promise<string[]> {
  await init();
  const rows = await sql`SELECT DISTINCT date FROM entries ORDER BY date DESC`;
  return rows.map((r) => r.date as string);
}
