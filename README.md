# Nova — AI Chat powered by Groq ⚡

A full-featured, beautiful AI chatbot built with Next.js + Groq API. Deploy to Vercel in under 5 minutes.

![Nova AI Chat](https://img.shields.io/badge/Powered_by-Groq-orange) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)

---

## ✨ Features

- 🚀 **Real-time streaming** — responses appear word by word
- 🧠 **5 Groq models** — Llama 3.3 70B, Llama 3.1 8B, Mixtral 8x7B, Gemma 2 9B, and more
- 💬 **Full conversation history** — stored locally in your browser
- 📝 **Markdown rendering** — code blocks, tables, bold, lists, all beautifully styled
- 🎨 **Syntax highlighting** — 100+ programming languages
- 🖼️ **Image uploads** — drag & drop or click to attach
- 🎙️ **Voice input** — speak your messages (browser-supported)
- 🔊 **Text-to-speech** — have Nova read responses aloud
- 📤 **Export** — download conversations as markdown
- ✏️ **Rename / delete** — full conversation management
- 🔄 **Regenerate** — re-run the last response
- 👍 **Thumbs up/down** — rate responses
- ⚙️ **Settings** — system prompt, default model, temperature
- 📱 **Fully responsive** — mobile, tablet, laptop, desktop
- 🌑 **Dark space theme** — cosmic violet/cyan design

---

## 🚀 Deploy to Vercel in 5 minutes

### Step 1 — Get a Groq API key (free)

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up / log in
3. Click **API Keys** → **Create API Key**
4. Copy the key (starts with `gsk_...`)

---

### Step 2 — Deploy to Vercel

**Option A: One-click via GitHub (recommended)**

1. Push this repo to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/nova-ai.git
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your GitHub repo

3. In **Environment Variables**, add:
   | Name | Value |
   |------|-------|
   | `GROQ_API_KEY` | `gsk_your_key_here` |

4. Click **Deploy** — done! 🎉

**Option B: Vercel CLI**

```bash
npm install -g vercel
vercel
# Follow prompts, then:
vercel env add GROQ_API_KEY
# Enter your Groq API key when prompted
vercel --prod
```

---

### Step 3 — Run locally

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.local.example .env.local

# 3. Add your Groq API key to .env.local
# GROQ_API_KEY=gsk_your_key_here

# 4. Start dev server
npm run dev

# Open http://localhost:3000
```

---

## 📁 Project Structure

```
groq-chat/
├── pages/
│   ├── _app.js              # App wrapper, toast notifications
│   ├── _document.js         # HTML head, fonts
│   ├── index.js             # Main page layout
│   └── api/
│       ├── chat.js          # Groq streaming API route
│       └── models.js        # Available models list
├── components/
│   ├── useChat.js           # All chat state & logic
│   ├── Sidebar.js           # Conversation history sidebar
│   ├── ChatArea.js          # Message display area
│   ├── ChatInput.js         # Input bar, model picker, tools
│   ├── MessageBubble.js     # Individual message with markdown
│   ├── TopBar.js            # Header with controls
│   ├── WelcomeScreen.js     # Empty state / suggestions
│   └── SettingsModal.js     # Settings popup
├── styles/
│   └── globals.css          # Tailwind + custom styles
├── tailwind.config.js       # Color palette, animations
├── next.config.js
├── vercel.json              # Vercel deployment config
└── .env.local.example       # Environment variable template
```

---

## 🎨 Customization

**Change the AI name**
- Search and replace `Nova` in the codebase

**Add system prompt**
- Go to Settings (gear icon) → Custom System Prompt

**Change default model**
- Go to Settings → Default Model
- Or change `model` in the ChatInput.js MODELS array

**Modify colors**
- Edit `tailwind.config.js` — the `colors` section defines the palette

---

## 🔒 Security Notes

- The `GROQ_API_KEY` is server-side only (in `/pages/api/`) — never exposed to the browser
- All conversation data is stored in the user's browser (localStorage) — nothing goes to any server except Groq
- No database required

---

## 📦 Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (Pages Router) |
| AI | Groq SDK + Streaming |
| Styling | Tailwind CSS |
| Markdown | react-markdown + remark-gfm |
| Syntax highlighting | react-syntax-highlighter |
| Animations | CSS keyframes |
| Notifications | react-hot-toast |
| IDs | uuid |
| Deployment | Vercel |

---

## 🐛 Troubleshooting

**"Invalid API key"** — Check that `GROQ_API_KEY` is set correctly in `.env.local` or Vercel env vars

**"Rate limit reached"** — Groq free tier has limits. Wait a minute and try again.

**Models not working** — Some models have context limits. Switch to Llama 3.3 70B for best compatibility.

**Voice input not working** — Only works in Chrome/Edge. Safari has limited support.

---

## 📄 License

MIT — use freely, modify, deploy!
