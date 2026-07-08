"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { CopyButton } from "./CopyButton";
import { Edit2, Eye } from "lucide-react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export function MarkdownEditor({ value, onChange, placeholder, label }: MarkdownEditorProps) {
  const [mode, setMode] = useState<"edit" | "preview">("preview");

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      {/* Header with Title and Toggle */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
        {label ? (
          <h3 className="font-semibold text-slate-800">{label}</h3>
        ) : (
          <div /> // Spacer
        )}
        
        <div className="flex items-center gap-1 rounded-lg bg-slate-200/50 p-1">
          <button
            onClick={() => setMode("edit")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              mode === "edit"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Edit2 className="h-3.5 w-3.5" />
            Edit (Markdown)
          </button>
          <button
            onClick={() => setMode("preview")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              mode === "preview"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            Preview (Rich Text)
          </button>
        </div>
      </div>

      {/* Editor/Preview Area */}
      <div className="relative flex-1 bg-white p-6">
        {value && <CopyButton textToCopy={value} className="absolute right-10 top-10" />}
        
        {mode === "edit" ? (
          <textarea
            className="h-[500px] w-full resize-none rounded-md border border-slate-200 bg-transparent p-6 font-mono text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            spellCheck={false}
          />
        ) : (
          <div className="h-[500px] w-full overflow-y-auto rounded-md border border-slate-200 bg-transparent p-6">
            {value ? (
              <div className="prose prose-sm prose-slate max-w-none text-slate-800">
                <ReactMarkdown>{value}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm italic text-slate-400">{placeholder || "Nothing to preview yet..."}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
