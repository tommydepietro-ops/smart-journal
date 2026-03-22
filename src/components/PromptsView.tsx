"use client";

import { useState } from "react";

interface PromptsViewProps {
  onSelectPrompt: (prompt: string) => void;
}

interface Category {
  name: string;
  icon: string;
  prompts: string[];
}

const categories: Category[] = [
  {
    name: "Self-Reflection",
    icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z",
    prompts: [
      "What's one thing you're avoiding right now? Why?",
      "What would your younger self think of who you are today?",
      "What belief have you changed your mind about recently?",
      "If you could give yourself advice 5 years ago, what would it be?",
      "What part of your daily routine brings you the most peace?",
      "What are you most proud of that nobody knows about?",
      "What do you need to forgive yourself for?",
      "When do you feel most like yourself?",
      "What story do you keep telling yourself that might not be true?",
      "What would you do differently if nobody was watching?",
    ],
  },
  {
    name: "Gratitude",
    icon: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z",
    prompts: [
      "What are 3 things you're grateful for today?",
      "Who made a positive difference in your life this week?",
      "What simple pleasure did you enjoy recently?",
      "What's something you usually take for granted?",
      "Write about a challenge that turned out to be a blessing.",
      "What's a skill or ability you're thankful to have?",
      "Describe a place that makes you feel grateful.",
      "What's a recent meal or experience that brought you joy?",
      "Who is someone you haven't thanked enough?",
      "What's something about today that was better than yesterday?",
    ],
  },
  {
    name: "Goals",
    icon: "M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5",
    prompts: [
      "What would you do if you knew you couldn't fail?",
      "What's one small step you can take today toward a big goal?",
      "Where do you see yourself in one year?",
      "What habit would change your life if you stuck with it?",
      "What's holding you back from your biggest dream?",
      "Describe your perfect day in detail.",
      "What skill do you want to learn next and why?",
      "What would you attempt if you had unlimited resources?",
      "What goal have you been procrastinating on?",
      "Write about what success means to you personally.",
    ],
  },
  {
    name: "Relationships",
    icon: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z",
    prompts: [
      "Who do you need to reconnect with and why?",
      "What's the best advice someone has ever given you?",
      "Describe a relationship that has shaped who you are.",
      "What do you wish you could say to someone but haven't?",
      "How do you show love to the people closest to you?",
      "What quality do you admire most in your closest friend?",
      "Write about a moment of genuine connection you experienced.",
      "What boundary do you need to set in a relationship?",
      "Who inspires you the most and why?",
      "What's something kind someone did for you recently?",
    ],
  },
  {
    name: "Creativity",
    icon: "M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42",
    prompts: [
      "Write a letter to your future self.",
      "If your life was a movie, what would the title be?",
      "Describe a color without naming it.",
      "Write about a dream you had recently.",
      "If you could have dinner with anyone, living or dead, who and why?",
      "Create a short story starting with: 'The door opened and...'",
      "What song best describes your current mood and why?",
      "Invent a holiday. What would it celebrate and how?",
      "Describe your life using only questions.",
      "Write about an ordinary object as if seeing it for the first time.",
    ],
  },
  {
    name: "Growth",
    icon: "M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5",
    prompts: [
      "What's the hardest lesson you've learned this year?",
      "What fear would you like to overcome?",
      "Describe a failure that taught you something valuable.",
      "What's one thing you can do today to be 1% better?",
      "What comfort zone do you need to step out of?",
      "What's a mistake you're glad you made?",
      "How have you grown in the last 6 months?",
      "What's something you used to struggle with but don't anymore?",
      "What new perspective have you gained recently?",
      "What would the best version of you do today?",
    ],
  },
  {
    name: "Emotions",
    icon: "M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z",
    prompts: [
      "How are you really feeling right now? Be honest.",
      "What emotion have you been pushing away lately?",
      "Describe a moment today that made you smile.",
      "What's weighing on your mind the most?",
      "Write about a time you felt completely at peace.",
      "What makes you feel anxious and how do you cope?",
      "Describe your current mood as weather.",
      "What would you say to comfort a friend feeling the way you feel now?",
      "What triggered your strongest emotion today?",
      "Write about something that made you laugh recently.",
    ],
  },
  {
    name: "Fun",
    icon: "M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z",
    prompts: [
      "What's the most spontaneous thing you've ever done?",
      "If you could teleport anywhere right now, where would you go?",
      "What's your guilty pleasure that always cheers you up?",
      "Describe your dream vacation with no budget limit.",
      "What's the funniest thing that happened to you recently?",
      "If you could learn any superpower, what would it be and why?",
      "What's on your bucket list that you haven't told anyone?",
      "If you could relive one day of your life, which would it be?",
      "What's something weird or quirky about you that you love?",
      "If you could swap lives with anyone for a day, who would it be?",
    ],
  },
];

export default function PromptsView({ onSelectPrompt }: PromptsViewProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleCategory = (name: string) => {
    setExpandedCategory((prev) => (prev === name ? null : name));
  };

  return (
    <div style={{ animation: "fade-in 0.3s ease-out" }}>
      <div className="mb-4 px-1">
        <p className="text-sm text-white/50">
          Tap a category to browse prompts. Tap any prompt to start writing.
        </p>
      </div>

      <div className="space-y-3">
        {categories.map((category, catIdx) => {
          const isExpanded = expandedCategory === category.name;
          return (
            <div
              key={category.name}
              className="relative"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
                borderTop: "1px solid rgba(255,255,255,0.28)",
                borderLeft: "1px solid rgba(255,255,255,0.18)",
                borderRight: "1px solid rgba(255,255,255,0.07)",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                boxShadow: isExpanded
                  ? "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 0 30px rgba(255,255,255,0.04)"
                  : "0 4px 16px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 0 20px rgba(255,255,255,0.03)",
                borderRadius: 18,
                transition: "all 0.3s ease",
                animation: `fade-in-up 0.4s ease-out ${catIdx * 50}ms both`,
              }}
            >
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.name)}
                className="w-full flex items-center gap-3 p-4 text-left"
                style={{ cursor: "pointer" }}
              >
                <div
                  className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl"
                  style={{
                    background: isExpanded
                      ? "linear-gradient(135deg, #7c6ef0, #a594ff)"
                      : "rgba(124,110,240,0.15)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                    style={{
                      color: isExpanded ? "white" : "#a594ff",
                      transition: "color 0.3s ease",
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={category.icon}
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <span
                    className="text-base font-semibold"
                    style={{
                      color: isExpanded ? "#a594ff" : "rgba(248,248,255,0.85)",
                      transition: "color 0.3s ease",
                    }}
                  >
                    {category.name}
                  </span>
                  <p className="text-xs text-white/40 mt-0.5">
                    {category.prompts.length} prompts
                  </p>
                </div>
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  style={{
                    color: "rgba(248,248,255,0.3)",
                    transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>

              {/* Prompts List */}
              {isExpanded && (
                <div
                  className="px-4 pb-4 space-y-2"
                  style={{ animation: "fade-in 0.25s ease-out" }}
                >
                  {category.prompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSelectPrompt(prompt)}
                      className="w-full text-left p-3 rounded-xl text-sm transition-all duration-200"
                      style={{
                        background: "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 100%)",
                        borderTop: "1px solid rgba(255,255,255,0.15)",
                        borderLeft: "1px solid rgba(255,255,255,0.1)",
                        borderRight: "1px solid rgba(255,255,255,0.04)",
                        borderBottom: "1px solid rgba(255,255,255,0.03)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                        color: "rgba(248,248,255,0.75)",
                        cursor: "pointer",
                        animation: `fade-in-up 0.3s ease-out ${idx * 30}ms both`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "linear-gradient(180deg, rgba(124,110,240,0.18) 0%, rgba(124,110,240,0.08) 100%)";
                        e.currentTarget.style.borderTop =
                          "1px solid rgba(124,110,240,0.4)";
                        e.currentTarget.style.borderLeft =
                          "1px solid rgba(124,110,240,0.3)";
                        e.currentTarget.style.color = "#a594ff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 100%)";
                        e.currentTarget.style.borderTop =
                          "1px solid rgba(255,255,255,0.15)";
                        e.currentTarget.style.borderLeft =
                          "1px solid rgba(255,255,255,0.1)";
                        e.currentTarget.style.color = "rgba(248,248,255,0.75)";
                      }}
                    >
                      <span className="leading-relaxed">{prompt}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
