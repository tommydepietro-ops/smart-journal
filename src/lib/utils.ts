export function formatDate(dateString: string): string {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatTime(isoString: string): string {
  const date = new Date(isoString + "Z");
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function renderMarkdown(text: string): string {
  return text
    // Bold
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    // Italic
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    // Headers
    .replace(/^### (.*$)/gm, '<h3 class="text-base font-bold mt-5 mb-2 text-white/90">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-lg font-bold mt-6 mb-2 text-white/90">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-xl font-bold mt-6 mb-3 text-white">$1</h1>')
    // Unordered lists
    .replace(/^- (.*$)/gm, '<li class="ml-4 mb-1 text-white/80 list-disc">$1</li>')
    .replace(/^\* (.*$)/gm, '<li class="ml-4 mb-1 text-white/80 list-disc">$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 mb-1 text-white/80 list-decimal">$1</li>')
    // Paragraphs (double newline)
    .replace(/\n\n/g, '</p><p class="mb-3 leading-relaxed text-white/80">')
    // Single newlines within paragraphs
    .replace(/\n/g, "<br>")
    // Wrap in paragraph
    .replace(/^/, '<p class="mb-3 leading-relaxed text-white/80">')
    .replace(/$/, "</p>");
}
