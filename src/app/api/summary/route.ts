import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getAllEntries } from "@/lib/db";

export async function POST() {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Anthropic API key is not configured. Set the ANTHROPIC_API_KEY environment variable." },
        { status: 500 }
      );
    }

    const entries = getAllEntries();
    if (entries.length === 0) {
      return NextResponse.json(
        { error: "No journal entries to summarize" },
        { status: 400 }
      );
    }

    const entriesText = entries
      .map((e) => `[${e.date}] ${e.content}`)
      .join("\n\n");

    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are a thoughtful personal journal analyst. Below are journal entries from a user. Please analyze them and provide:

1. **Key Themes**: What topics or subjects come up repeatedly?
2. **Emotional Patterns**: What emotional trends do you notice over time?
3. **Insights**: What deeper patterns or connections do you see that the writer might not notice themselves?
4. **Suggestions**: Based on these entries, what might be helpful for the writer to reflect on?

Keep your tone warm, supportive, and insightful. Use clear formatting with headers and bullet points. Be specific and reference actual content from the entries.

Here are the journal entries:

${entriesText}`,
        },
      ],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    const summary = textBlock ? textBlock.text : "No summary generated.";

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Failed to generate summary:", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate summary";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
