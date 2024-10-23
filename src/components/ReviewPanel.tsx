import React from 'react';
import { FileReview, ReviewSuggestion } from '../lib/reviewEngine';

interface ReviewPanelProps {
  review: FileReview | null;
  onSuggestionClick: (suggestion: ReviewSuggestion) => void;
}

export function ReviewPanel({ review, onSuggestionClick }: ReviewPanelProps) {
  if (!review) {
    return (
      <div className="p-4 text-gray-500">
        No review available. Select a file to review.
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">{review.filePath}</h2>
        <div className="mt-2 flex items-center gap-2">
          <div className="text-sm">Score:</div>
          <div className={`font-bold ${review.overallScore >= 80 ? 'text-green-600' : 
            review.overallScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
            {review.overallScore}/100
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-600">{review.summary}</p>
      </div>

      <div className="p-4">
        <h3 className="text-sm font-semibold mb-2">Suggestions</h3>
        {review.suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="mb-4 p-3 rounded-lg border cursor-pointer hover:bg-gray-50"
            onClick={() => onSuggestionClick(suggestion)}
          >
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 text-xs rounded ${
                suggestion.severity === 'error' ? 'bg-red-100 text-red-800' :
                suggestion.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {suggestion.severity}
              </span>
              <span className="text-sm text-gray-500">Line {suggestion.line}</span>
            </div>
            <p className="mt-2 text-sm">{suggestion.message}</p>
            {suggestion.suggestedFix && (
              <div className="mt-2 text-sm bg-gray-50 p-2 rounded">
                <div className="font-mono text-xs">{suggestion.suggestedFix}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}