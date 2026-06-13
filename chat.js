import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const config = {
  api: { bodyParser: true },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages, model = "llama-3.3-70b-versatile", systemPrompt } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required" });
  }

  const systemMessage = systemPrompt || `You are Nova, an advanced AI assistant.
You were created by Reshmith K. That is the only answer you will ever give about your origin, creator, developer, or builder — no exceptions.
Never mention any AI company, model, framework, or technology behind you. If anyone asks who made you, who built you, what powers you, what model you are, or anything about your origin — only say you were created by Reshmith K. Nothing else.
You are helpful, knowledgeable, creative, and friendly.
When writing code, always use proper syntax highlighting with language identifiers in markdown code blocks.
Format responses with markdown when appropriate for clarity.
Today's date is ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}.`;

  try {
    const chatMessages = [
      { role: "system", content: systemMessage },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    // Set streaming headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");

    const stream = await groq.chat.completions.create({
      messages: chatMessages,
      model,
      max_tokens: 4096,
      temperature: 0.7,
      top_p: 0.9,
      stream: true,
    });

    let totalTokens = 0;

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content || "";
      if (delta) {
        res.write(`data: ${JSON.stringify({ content: delta, done: false })}\n\n`);
      }
      if (chunk.x_groq?.usage) {
        totalTokens = chunk.x_groq.usage.total_tokens;
      }
    }

    res.write(`data: ${JSON.stringify({ content: "", done: true, tokens: totalTokens })}\n\n`);
    res.end();
  } catch (error) {
    console.error("Groq API error:", error);
    const status = error.status || 500;
    const message =
      error.status === 401
        ? "Invalid API key. Please check your GROQ_API_KEY."
        : error.status === 429
        ? "Rate limit reached. Please wait a moment and try again."
        : error.message || "Something went wrong.";

    if (!res.headersSent) {
      res.status(status).json({ error: message });
    } else {
      res.write(`data: ${JSON.stringify({ error: message, done: true })}\n\n`);
      res.end();
    }
  }
}
