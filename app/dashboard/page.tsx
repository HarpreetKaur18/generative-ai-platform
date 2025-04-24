"use client";

import { useState } from "react";

const templates = [
  { label: "Short factual answer", instruction: "Answer in one word only." },
  { label: "Creative writing", instruction: "Respond in a poetic and imaginative way." },
  { label: "Blog introduction", instruction: "Write a blog intro of 3–4 sentences for this topic." },
  { label: "Explain like I am 5", instruction: "Explain this concept very simply." }
];

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [history, setHistory] = useState<{ prompt: string; response: string }[]>([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);

    const fullPrompt = `${prompt}\n\n${selectedTemplate.instruction}`;
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: fullPrompt }),
      });
      const data = await res.json();
      const response = data.content || "No response.";

      setHistory(prev => [...prev, { prompt, response }]);
      setPrompt("");
    } catch (err) {
      setHistory(prev => [...prev, { prompt, response: "Something went wrong." }]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <main className="flex-grow flex flex-col items-center justify-start py-10 px-4">
        <div className="max-w-2xl w-full">
          <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
            🧠 <span>Generative AI Content Platform</span>
          </h1>

          <div className="bg-zinc-900 shadow-lg rounded-lg p-6 mb-6 border border-zinc-700">
            <label className="block mb-2 font-medium text-white">Choose a prompt style:</label>
            <select
              className="w-full p-2 border border-zinc-700 bg-black text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedTemplate.label}
              onChange={(e) => {
                const t = templates.find((temp) => temp.label === e.target.value);
                if (t) setSelectedTemplate(t);
              }}
            >
              {templates.map((t) => (
                <option key={t.label} value={t.label}>{t.label}</option>
              ))}
            </select>

            <div className="h-4" />

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt..."
              className="w-full p-4 border border-zinc-700 bg-black text-white rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-5 py-2 rounded transition-all"
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>

          {history.length > 0 && (
            <div className="space-y-6">
              {history.map((entry, index) => (
                <div key={index} className="bg-zinc-900 border border-zinc-700 shadow rounded-lg p-6">
                  <p className="text-blue-400 font-semibold mb-2">Prompt:</p>
                  <p className="mb-4 whitespace-pre-wrap break-words">{entry.prompt}</p>
                  <p className="text-green-400 font-semibold mb-2">Response:</p>
                  <p className="whitespace-pre-wrap break-words text-gray-100">{entry.response}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="text-center text-sm text-zinc-500 mb-4">
        © {new Date().getFullYear()} Harpreet Kaur. All rights reserved.
      </footer>
    </div>
  );
}
