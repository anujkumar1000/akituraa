// Tiny, dependency-free markdown subset renderer: ## headings,
// - bullet lists, **bold**, *italic*, and paragraphs. Enough for
// editorial blog content without pulling in a full MD pipeline.
import { Fragment } from "react";

function renderInline(text: string, keyPrefix: string) {
  // Split on **bold** and *italic*
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${keyPrefix}-${i}`} className="font-bold text-lav-900">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={`${keyPrefix}-${i}`}>{part.slice(1, -1)}</em>;
    }
    return <Fragment key={`${keyPrefix}-${i}`}>{part}</Fragment>;
  });
}

export function Markdown({ content }: { content: string }) {
  const blocks = content.trim().split(/\n\n+/);

  return (
    <div className="space-y-4 text-[15px] leading-relaxed text-lav-800/90">
      {blocks.map((block, i) => {
        const key = `b-${i}`;
        if (block.startsWith("## ")) {
          return (
            <h2 key={key} className="pt-2 font-display text-2xl font-bold text-lav-900">
              {renderInline(block.slice(3), key)}
            </h2>
          );
        }
        if (block.split("\n").every((l) => l.trim().startsWith("- "))) {
          const items = block.split("\n").map((l) => l.trim().slice(2));
          return (
            <ul key={key} className="ml-1 space-y-1.5">
              {items.map((it, j) => (
                <li key={`${key}-${j}`} className="flex gap-2">
                  <span className="mt-1 text-blush-deep">✿</span>
                  <span>{renderInline(it, `${key}-${j}`)}</span>
                </li>
              ))}
            </ul>
          );
        }
        return <p key={key}>{renderInline(block, key)}</p>;
      })}
    </div>
  );
}
