"use client";

import { useState } from "react";
import { ShieldCheck, ExternalLink, Key, X } from "lucide-react";

interface ApiKeyModalProps {
  onClose: () => void;
  onSave: (key: string) => void;
}

export function ApiKeyModal({ onClose, onSave }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState("");

  const handleSave = () => {
    if (apiKey.trim()) {
      onSave(apiKey.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5">
        {/* Header */}
        <div className="relative border-b border-slate-100 bg-slate-50 px-6 py-5">
          <button 
            onClick={onClose} 
            className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Get your free AI Key</h2>
          </div>
          <p className="mt-4 text-sm font-medium leading-relaxed text-slate-600">
            To keep your resume and data 100% private, this app runs entirely on your device. We just need a free "key" from Google to power the AI.
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600 ring-1 ring-blue-100">1</div>
              <div>
                <h3 className="font-semibold text-slate-900">Go to Google AI Studio</h3>
                <p className="mt-1 text-sm text-slate-600">
                  <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Open AI Studio <ExternalLink className="h-3 w-3" />
                  </a>
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600 ring-1 ring-blue-100">2</div>
              <div>
                <h3 className="font-semibold text-slate-900">Sign In</h3>
                <p className="mt-1 text-sm text-slate-600">Use your regular Google or Gmail account.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600 ring-1 ring-blue-100">3</div>
              <div>
                <h3 className="font-semibold text-slate-900">Create Key</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Click the prominent <span className="font-semibold text-slate-800">Create API key</span> button, then click it again in the popup to generate a new key in a default project.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600 ring-1 ring-blue-100">4</div>
              <div>
                <h3 className="font-semibold text-slate-900">Copy & Paste</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Copy the long string of text (it usually starts with <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-800">AIza...</code>) and paste it below.
                </p>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="mt-8 border-t border-slate-100 pt-6">
            <label className="mb-2 block text-sm font-semibold text-slate-900">Your Google API Key</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Key className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="block w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!apiKey.trim()}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 disabled:opacity-50"
          >
            Save Key & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
