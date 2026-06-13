import { Zap, Code2, Globe, BookOpen, Lightbulb, Pencil } from "lucide-react";

const CAPABILITIES = [
  {
    icon: Code2,
    title: "Write & debug code",
    desc: "Any language, explained clearly",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: Globe,
    title: "Research & explain",
    desc: "Complex topics made simple",
    color: "from-cyan-500 to-blue-600",
  },
  {
    icon: Pencil,
    title: "Write & edit",
    desc: "Emails, essays, stories",
    color: "from-pink-500 to-rose-600",
  },
  {
    icon: Lightbulb,
    title: "Brainstorm ideas",
    desc: "Creative problems, new angles",
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: BookOpen,
    title: "Summarize content",
    desc: "Documents, articles, data",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: Zap,
    title: "Lightning fast",
    desc: "Blazing fast responses",
    color: "from-yellow-400 to-amber-500",
  },
];

export default function WelcomeScreen({ onSuggestion }) {
  const starters = [
    "What can you help me with?",
    "Write me a Python script to rename files",
    "Explain the difference between TCP and UDP",
    "Draft a professional email declining a meeting",
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-12 max-w-2xl mx-auto text-center">
      {/* Logo */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-pulse to-glow flex items-center justify-center shadow-2xl shadow-purple-500/40 animate-glow-pulse">
          <Zap size={36} className="text-white" fill="white" />
        </div>
        {/* Orbit ring */}
        <div className="absolute inset-0 rounded-3xl border-2 border-pulse/30 scale-110 animate-ping" style={{ animationDuration: "3s" }} />
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-starlight mb-2 tracking-tight">
        Hi, I'm <span className="bg-clip-text text-transparent bg-gradient-to-r from-flare to-shimmer">Nova</span>
      </h1>
      <p className="text-moonbeam text-base mb-2">
        Your AI assistant, powered by{" "}
        <span className="text-flare font-medium">Nova by Reshmith K</span>
      </p>
      <p className="text-twilight text-sm mb-10">
        What can I help you with today?
      </p>

      {/* Capabilities grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full mb-10">
        {CAPABILITIES.map((cap) => {
          const Icon = cap.icon;
          return (
            <div
              key={cap.title}
              className="group p-4 rounded-2xl bg-nebula border border-stardust hover:border-stardust/80 transition-all duration-200 text-left hover:bg-aurora/50 cursor-default"
            >
              <div
                className={`w-8 h-8 rounded-xl bg-gradient-to-br ${cap.color} flex items-center justify-center mb-2.5 shadow-lg`}
              >
                <Icon size={15} className="text-white" />
              </div>
              <p className="text-sm font-semibold text-starlight leading-tight">{cap.title}</p>
              <p className="text-xs text-twilight mt-0.5">{cap.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Quick starters */}
      <div className="w-full">
        <p className="text-xs text-twilight uppercase tracking-wider font-semibold mb-3">
          Quick starters
        </p>
        <div className="space-y-2">
          {starters.map((s) => (
            <button
              key={s}
              onClick={() => onSuggestion(s)}
              className="w-full text-left px-4 py-3 rounded-xl bg-nebula border border-stardust text-sm text-moonbeam hover:border-pulse/40 hover:bg-aurora/60 hover:text-starlight transition-all duration-150"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
