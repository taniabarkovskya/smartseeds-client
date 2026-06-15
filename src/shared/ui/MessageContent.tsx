function renderInline(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*"))
      return <em key={i}>{part.slice(1, -1)}</em>;
    return <span key={i}>{part}</span>;
  });
}

export function MessageContent({ content }: { content: string }) {
  const blocks = content.split(/\n{2,}/);
  return (
    <div className="space-y-2">
      {blocks.map((block, i) => {
        const lines = block.split("\n").filter(Boolean);

        const isNumbered = lines.length > 0 && lines.every(l => /^\d+\.\s/.test(l.trim()));
        if (isNumbered) {
          return (
            <ol key={i} className="list-decimal pl-5 space-y-0.5">
              {lines.map((l, j) => (
                <li key={j}>{renderInline(l.replace(/^\d+\.\s*/, ""))}</li>
              ))}
            </ol>
          );
        }

        const isBullet = lines.length > 0 && lines.every(l => /^[-*]\s/.test(l.trim()));
        if (isBullet) {
          return (
            <ul key={i} className="list-disc pl-5 space-y-0.5">
              {lines.map((l, j) => (
                <li key={j}>{renderInline(l.replace(/^[-*]\s*/, ""))}</li>
              ))}
            </ul>
          );
        }

        if (lines.length > 1) {
          return (
            <div key={i} className="space-y-0.5">
              {lines.map((l, j) => {
                if (/^\d+\.\s/.test(l)) return <p key={j} className="pl-1">{renderInline(l)}</p>;
                if (/^[-*]\s/.test(l)) return <p key={j} className="pl-1">• {renderInline(l.replace(/^[-*]\s*/, ""))}</p>;
                return <p key={j}>{renderInline(l)}</p>;
              })}
            </div>
          );
        }

        return <p key={i}>{renderInline(block)}</p>;
      })}
    </div>
  );
}
