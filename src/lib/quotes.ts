export interface Quote {
  text: string;
  author: string;
}

const quotes: Quote[] = [
  // Mark Twain
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Whenever you find yourself on the side of the majority, it is time to pause and reflect.", author: "Mark Twain" },
  { text: "Courage is resistance to fear, mastery of fear, not absence of fear.", author: "Mark Twain" },
  { text: "The two most important days in your life are the day you are born and the day you find out why.", author: "Mark Twain" },
  { text: "Do the thing you fear most and the death of fear is certain.", author: "Mark Twain" },
  { text: "Kindness is the language which the deaf can hear and the blind can see.", author: "Mark Twain" },
  { text: "If you tell the truth, you don't have to remember anything.", author: "Mark Twain" },
  { text: "The man who does not read has no advantage over the man who cannot read.", author: "Mark Twain" },
  { text: "Never allow someone to be your priority while allowing yourself to be their option.", author: "Mark Twain" },
  { text: "Keep away from people who try to belittle your ambitions. Small people always do that.", author: "Mark Twain" },

  // Rumi
  { text: "The wound is the place where the Light enters you.", author: "Rumi" },
  { text: "What you seek is seeking you.", author: "Rumi" },
  { text: "Let yourself be silently drawn by the strange pull of what you really love.", author: "Rumi" },
  { text: "Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.", author: "Rumi" },
  { text: "Don't be satisfied with stories, how things have gone with others. Unfold your own myth.", author: "Rumi" },
  { text: "The garden of the world has no limits, except in your mind.", author: "Rumi" },
  { text: "Raise your words, not your voice. It is rain that grows flowers, not thunder.", author: "Rumi" },
  { text: "You were born with wings, why prefer to crawl through life?", author: "Rumi" },
  { text: "Silence is the language of God, all else is poor translation.", author: "Rumi" },
  { text: "When you do things from your soul, you feel a river moving in you, a joy.", author: "Rumi" },

  // Alan Watts
  { text: "The only way to make sense out of change is to plunge into it, move with it, and join the dance.", author: "Alan Watts" },
  { text: "Muddy water is best cleared by leaving it alone.", author: "Alan Watts" },
  { text: "You are the universe experiencing itself.", author: "Alan Watts" },
  { text: "The meaning of life is just to be alive. It is so plain and so obvious and so simple.", author: "Alan Watts" },
  { text: "This is the real secret of life — to be completely engaged with what you are doing in the here and now.", author: "Alan Watts" },
  { text: "No one is more dangerously insane than one who is sane all the time.", author: "Alan Watts" },
  { text: "Trying to define yourself is like trying to bite your own teeth.", author: "Alan Watts" },
  { text: "The art of living is neither careless drifting on the one hand nor fearful clinging on the other.", author: "Alan Watts" },
  { text: "You don't look out there for God, something in the sky, you look in you.", author: "Alan Watts" },
  { text: "Every intelligent individual wants to know what makes him tick, and yet is at once fascinated and frustrated by the fact that oneself is the most difficult of all things to know.", author: "Alan Watts" },

  // Sheryl Sandberg
  { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
  { text: "If you're offered a seat on a rocket ship, don't ask what seat. Just get on.", author: "Sheryl Sandberg" },
  { text: "We cannot change what we are not aware of, and once we are aware, we cannot help but change.", author: "Sheryl Sandberg" },
  { text: "In the future, there will be no female leaders. There will just be leaders.", author: "Sheryl Sandberg" },
  { text: "Motivation comes from working on things we care about.", author: "Sheryl Sandberg" },
  { text: "Taking initiative pays off. It is hard to visualize someone as a leader if she is always waiting to be told what to do.", author: "Sheryl Sandberg" },
  { text: "What would you do if you weren't afraid?", author: "Sheryl Sandberg" },
  { text: "We hold ourselves back in ways both big and small, by lacking self-confidence, by not raising our hands.", author: "Sheryl Sandberg" },
  { text: "Leadership is about making others better as a result of your presence and making sure that impact lasts in your absence.", author: "Sheryl Sandberg" },
  { text: "Option A is not available. So let's just kick the hell out of option B.", author: "Sheryl Sandberg" },

  // Albert Einstein
  { text: "Imagination is more important than knowledge.", author: "Albert Einstein" },
  { text: "Life is like riding a bicycle. To keep your balance, you must keep moving.", author: "Albert Einstein" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
  { text: "The important thing is not to stop questioning. Curiosity has its own reason for existing.", author: "Albert Einstein" },
  { text: "A person who never made a mistake never tried anything new.", author: "Albert Einstein" },
  { text: "Logic will get you from A to B. Imagination will take you everywhere.", author: "Albert Einstein" },
  { text: "Look deep into nature, and then you will understand everything better.", author: "Albert Einstein" },
  { text: "Learn from yesterday, live for today, hope for tomorrow.", author: "Albert Einstein" },
  { text: "I have no special talents. I am only passionately curious.", author: "Albert Einstein" },

  // Marcus Aurelius
  { text: "You have power over your mind — not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" },
  { text: "The happiness of your life depends upon the quality of your thoughts.", author: "Marcus Aurelius" },
  { text: "Waste no more time arguing about what a good man should be. Be one.", author: "Marcus Aurelius" },
  { text: "Very little is needed to make a happy life; it is all within yourself, in your way of thinking.", author: "Marcus Aurelius" },
  { text: "When you arise in the morning, think of what a precious privilege it is to be alive.", author: "Marcus Aurelius" },
  { text: "The soul becomes dyed with the color of its thoughts.", author: "Marcus Aurelius" },
  { text: "It is not death that a man should fear, but he should fear never beginning to live.", author: "Marcus Aurelius" },
  { text: "Accept the things to which fate binds you, and love the people with whom fate brings you together.", author: "Marcus Aurelius" },
  { text: "Everything we hear is an opinion, not a fact. Everything we see is a perspective, not the truth.", author: "Marcus Aurelius" },
  { text: "If it is not right do not do it; if it is not true do not say it.", author: "Marcus Aurelius" },

  // Maya Angelou
  { text: "We delight in the beauty of the butterfly, but rarely admit the changes it has gone through to achieve that beauty.", author: "Maya Angelou" },
  { text: "If you don't like something, change it. If you can't change it, change your attitude.", author: "Maya Angelou" },
  { text: "There is no greater agony than bearing an untold story inside you.", author: "Maya Angelou" },
  { text: "I've learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel.", author: "Maya Angelou" },
  { text: "Nothing will work unless you do.", author: "Maya Angelou" },
  { text: "Try to be a rainbow in someone's cloud.", author: "Maya Angelou" },
  { text: "We need much less than we think we need.", author: "Maya Angelou" },
  { text: "You may not control all the events that happen to you, but you can decide not to be reduced by them.", author: "Maya Angelou" },
  { text: "Life is not measured by the number of breaths we take, but by the moments that take our breath away.", author: "Maya Angelou" },
  { text: "Courage is the most important of all the virtues because without courage, you can't practice any other virtue consistently.", author: "Maya Angelou" },

  // Steve Jobs
  { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "The people who are crazy enough to think they can change the world are the ones who do.", author: "Steve Jobs" },
  { text: "Design is not just what it looks like and feels like. Design is how it works.", author: "Steve Jobs" },
  { text: "Have the courage to follow your heart and intuition. They somehow already know what you truly want to become.", author: "Steve Jobs" },
  { text: "Quality is more important than quantity. One home run is much better than two doubles.", author: "Steve Jobs" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "You can't connect the dots looking forward; you can only connect them looking backwards.", author: "Steve Jobs" },
  { text: "Simple can be harder than complex. You have to work hard to get your thinking clean to make it simple.", author: "Steve Jobs" },

  // Lao Tzu
  { text: "A journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { text: "When I let go of what I am, I become what I might be.", author: "Lao Tzu" },
  { text: "Nature does not hurry, yet everything is accomplished.", author: "Lao Tzu" },
  { text: "Knowing others is intelligence; knowing yourself is true wisdom.", author: "Lao Tzu" },
  { text: "Be content with what you have; rejoice in the way things are.", author: "Lao Tzu" },
  { text: "The best time to plant a tree was twenty years ago. The second best time is now.", author: "Lao Tzu" },
  { text: "He who conquers others is strong; he who conquers himself is mighty.", author: "Lao Tzu" },
  { text: "Silence is a source of great strength.", author: "Lao Tzu" },
  { text: "To the mind that is still, the whole universe surrenders.", author: "Lao Tzu" },
  { text: "Life is a series of natural and spontaneous changes. Don't resist them; that only creates sorrow.", author: "Lao Tzu" },

  // Brene Brown
  { text: "Vulnerability is not winning or losing; it's having the courage to show up and be seen when we have no control over the outcome.", author: "Brene Brown" },
  { text: "You are imperfect, you are wired for struggle, but you are worthy of love and belonging.", author: "Brene Brown" },
  { text: "Courage starts with showing up and letting ourselves be seen.", author: "Brene Brown" },
  { text: "What we know matters, but who we are matters more.", author: "Brene Brown" },
  { text: "Owning our story can be hard but not nearly as difficult as spending our lives running from it.", author: "Brene Brown" },
  { text: "Talk to yourself like you would to someone you love.", author: "Brene Brown" },
  { text: "Authenticity is a collection of choices that we have to make every day.", author: "Brene Brown" },
  { text: "Imperfections are not inadequacies; they are reminders that we're all in this together.", author: "Brene Brown" },
  { text: "Stay in your own lane. Comparison kills creativity and joy.", author: "Brene Brown" },
  { text: "Clear is kind. Unclear is unkind.", author: "Brene Brown" },
  { text: "Daring greatly means the courage to be vulnerable.", author: "Brene Brown" },
];

/**
 * Get the quote of the day — deterministic based on the date string (YYYY-MM-DD).
 * The same date always returns the same quote.
 */
export function getQuoteOfTheDay(dateString: string): Quote {
  // Simple deterministic hash from the date string
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0; // Convert to 32bit integer
  }
  const index = Math.abs(hash) % quotes.length;
  return quotes[index];
}
