"use client";

import { useState } from "react";

export default function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  function getUrl() {
    return typeof window !== "undefined" ? window.location.href : "";
  }

  function openShareWindow(url: string) {
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=600");
  }

  function shareFacebook() {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}`;
    openShareWindow(url);
  }

  function shareTwitter() {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(getUrl())}&text=${encodeURIComponent(title)}`;
    openShareWindow(url);
  }

  function shareLinkedIn() {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getUrl())}`;
    openShareWindow(url);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard access denied; ignore silently
    }
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Share:</span>

      <button
        onClick={shareFacebook}
        aria-label="Share on Facebook"
        className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-500 dark:text-slate-300 transition-colors"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z" />
        </svg>
      </button>

      <button
        onClick={shareTwitter}
        aria-label="Share on X (Twitter)"
        className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-black hover:text-white text-slate-500 dark:text-slate-300 transition-colors"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.9 2H22l-7.7 8.8L23 22h-6.7l-5.2-6.6L5 22H2l8.2-9.4L1.5 2h6.8l4.7 6.1L18.9 2zm-2.4 18h1.9L7.6 4H5.6l10.9 16z" />
        </svg>
      </button>

      <button
        onClick={shareLinkedIn}
        aria-label="Share on LinkedIn"
        className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-700 hover:text-white text-slate-500 dark:text-slate-300 transition-colors"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
        </svg>
      </button>

      <button
        onClick={copyLink}
        aria-label="Copy link"
        className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-300 transition-colors relative"
      >
        {copied ? (
          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 010 5.656l-2 2a4 4 0 11-5.656-5.656l1.5-1.5M10.172 13.828a4 4 0 010-5.656l2-2a4 4 0 115.656 5.656l-1.5 1.5" />
          </svg>
        )}
      </button>

      {copied && <span className="text-xs text-green-500">Copied!</span>}
    </div>
  );
}
