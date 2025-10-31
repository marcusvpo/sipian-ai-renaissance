import ReactMarkdown from "react-markdown";

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  return (
    <div className="prose prose-sm max-w-none">
      <ReactMarkdown
        components={{
        p: ({ children }) => <p className="mb-2 last:mb-0 text-gray-700">{children}</p>,
        strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
        ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-2">{children}</ol>,
        li: ({ children }) => <li className="text-gray-700">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-siplan-carmesim pl-4 py-2 my-2 bg-gray-50">
            {children}
          </blockquote>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto my-2">
            <table className="min-w-full divide-y divide-gray-300 border border-gray-300">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
        tbody: ({ children }) => <tbody className="divide-y divide-gray-200 bg-white">{children}</tbody>,
        tr: ({ children }) => <tr>{children}</tr>,
        th: ({ children }) => (
          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900 border border-gray-300">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-3 py-2 text-sm text-gray-700 border border-gray-300">{children}</td>
        ),
        code: ({ children }) => (
          <code className="px-1 py-0.5 bg-gray-100 rounded text-sm font-mono text-siplan-carmesim">
            {children}
          </code>
        ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
