export const QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "Either you run the day, or the day runs you.", author: "Jim Rohn" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Until we can manage time, we can manage nothing else.", author: "Peter Drucker" },
  { text: "Productivity is never an accident. It is always the result of a commitment to excellence.", author: "Paul J. Meyer" },
];
export const getRandomQuote = () => QUOTES[Math.floor(Math.random() * QUOTES.length)];
