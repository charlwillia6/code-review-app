import React from 'react';
import Editor from '@monaco-editor/react';
import { ReviewSuggestion } from '../lib/reviewEngine';

interface CodeEditorProps {
  content: string;
  language: string;
  onChange: (value: string | undefined) => void;
  suggestions: ReviewSuggestion[];
}

export function CodeEditor({ content, language, onChange, suggestions }: CodeEditorProps) {
  const decorations = suggestions.map(suggestion => ({
    range: {
      startLineNumber: suggestion.line,
      startColumn: 1,
      endLineNumber: suggestion.line,
      endColumn: 1
    },
    options: {
      isWholeLine: true,
      className: `review-suggestion-${suggestion.severity}`,
      glyphMarginClassName: `suggestion-glyph-${suggestion.severity}`,
      glyphMarginHoverMessage: { value: suggestion.message }
    }
  }));

  return (
    <div className="h-full">
      <Editor
        height="100%"
        language={language}
        value={content}
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          lineNumbers: 'on',
          glyphMargin: true,
          folding: true,
          lineDecorationsWidth: 16,
          lineNumbersMinChars: 3,
        }}
        onMount={(editor) => {
          editor.createDecorationsCollection(decorations);
        }}
      />
    </div>
  );
}