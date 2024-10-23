import React, { useState } from 'react';
import { CodeEditor } from './components/CodeEditor';
import { ReviewPanel } from './components/ReviewPanel';
import { CodeReviewEngine, FileReview, ReviewSuggestion } from './lib/reviewEngine';

function App() {
  const [content, setContent] = useState('');
  const [review, setReview] = useState<FileReview | null>(null);
  const [selectedFile, setSelectedFile] = useState('');

  const handleReview = async () => {
    if (!selectedFile || !content) return;

    try {
      const engine = new CodeReviewEngine({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
      });

      const newReview = await engine.reviewFile(selectedFile, content);
      setReview(newReview);
    } catch (error) {
      console.error('Review failed:', error);
    }
  };

  const handleSuggestionClick = (suggestion: ReviewSuggestion) => {
    // Implement scrolling to the specific line in the editor
    console.log('Navigate to suggestion:', suggestion);
  };

  return (
    <div className="h-screen flex">
      <div className="w-2/3 border-r">
        <div className="h-12 flex items-center px-4 border-b">
          <input
            type="text"
            value={selectedFile}
            onChange={(e) => setSelectedFile(e.target.value)}
            placeholder="Enter file path..."
            className="flex-1 px-2 py-1 border rounded"
          />
          <button
            onClick={handleReview}
            className="ml-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Review
          </button>
        </div>
        <CodeEditor
          content={content}
          language="typescript"
          onChange={(value) => setContent(value || '')}
          suggestions={review?.suggestions || []}
        />
      </div>
      <div className="w-1/3">
        <ReviewPanel
          review={review}
          onSuggestionClick={handleSuggestionClick}
        />
      </div>
    </div>
  );
}

export default App;