"use client";
import { useState } from "react";
import MarkdownPreview from "./MarkdownPreview";

type Props = {
  initial?: string;
  onChange?: (value: string) => void;
};

export default function TwoPaneEditor({ initial = "", onChange }: Props) {
  const [text, setText] = useState(initial);

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onChange?.(e.target.value);
        }}
        className="min-h-[420px] w-full rounded-md bg-black/30 border border-white/10 p-4 focus:outline-none focus:ring-2 focus:ring-violet-400"
        placeholder="Type or paste Markdown…"
      />
      <div className="min-h-[420px] rounded-md bg-black/20 border border-white/10 p-4 overflow-auto">
        <MarkdownPreview markdown={text} />
      </div>
    </div>
  );
}
