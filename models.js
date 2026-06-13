export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Groq's available models as of 2024
  const models = [
    {
      id: "llama-3.3-70b-versatile",
      name: "Llama 3.3 70B",
      description: "Best overall — fast and highly capable",
      badge: "Recommended",
      badgeColor: "pulse",
      contextWindow: "128K",
      speed: "Fast",
    },
    {
      id: "llama-3.1-8b-instant",
      name: "Llama 3.1 8B",
      description: "Lightning fast for simple tasks",
      badge: "Fastest",
      badgeColor: "glow",
      contextWindow: "128K",
      speed: "Blazing",
    },
    {
      id: "mixtral-8x7b-32768",
      name: "Mixtral 8x7B",
      description: "Mixture of experts — great at coding",
      badge: "Coding",
      badgeColor: "flare",
      contextWindow: "32K",
      speed: "Fast",
    },
    {
      id: "gemma2-9b-it",
      name: "Gemma 2 9B",
      description: "Google's efficient instruction model",
      badge: "Efficient",
      badgeColor: "shimmer",
      contextWindow: "8K",
      speed: "Very Fast",
    },
    {
      id: "llama-3.3-70b-specdec",
      name: "Llama 3.3 70B SpecDec",
      description: "Speculative decoding for ultra speed",
      badge: "Experimental",
      badgeColor: "twilight",
      contextWindow: "8K",
      speed: "Ultra Fast",
    },
  ];

  res.status(200).json({ models });
}
