"use client";
import { useEffect, useRef } from "react";
import { marked } from "marked";

type Props = { markdown: string; className?: string };

export default function MarkdownPreview({ markdown, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = marked.parse(markdown || "") as string;
  }, [markdown]);

  return (
    <div
      ref={ref}
      className={className ?? "prose prose-invert max-w-none prose-headings:mt-6"}
    />
  );
}
