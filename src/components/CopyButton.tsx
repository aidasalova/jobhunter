"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { marked } from "marked";

interface CopyButtonProps {
  textToCopy: string;
  className?: string;
}

export function CopyButton({ textToCopy, className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!textToCopy) return;
    try {
      // Parse markdown to HTML
      const htmlContent = await marked.parse(textToCopy);

      const htmlBlob = new Blob([htmlContent], { type: "text/html" });
      const textBlob = new Blob([textToCopy], { type: "text/plain" });

      const clipboardItem = new ClipboardItem({
        "text/html": htmlBlob,
        "text/plain": textBlob,
      });

      await navigator.clipboard.write([clipboardItem]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy rich text: ", err);
      // Fallback for older browsers
      try {
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error("Fallback copy failed: ", fallbackErr);
      }
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1.5 rounded-md border border-slate-200 bg-white/80 px-2.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:text-slate-900 z-10 ${className}`}
      title="Copy to clipboard"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-green-500" />
          <span className="text-green-600">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}
