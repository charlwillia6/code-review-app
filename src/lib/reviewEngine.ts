import { z } from 'zod';
import OpenAI from 'openai';

export interface ReviewSuggestion {
  line: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
  suggestedFix?: string;
}

export interface FileReview {
  filePath: string;
  suggestions: ReviewSuggestion[];
  overallScore: number;
  summary: string;
}

const reviewConfigSchema = z.object({
  apiKey: z.string(),
  model: z.string().default('gpt-4'),
  maxTokens: z.number().default(2048),
  temperature: z.number().default(0.3),
});

export class CodeReviewEngine {
  private openai: OpenAI;
  private config: z.infer<typeof reviewConfigSchema>;

  constructor(config: z.infer<typeof reviewConfigSchema>) {
    this.config = reviewConfigSchema.parse(config);
    this.openai = new OpenAI({
      apiKey: this.config.apiKey
    });
  }

  async reviewFile(filePath: string, content: string): Promise<FileReview> {
    const prompt = this.buildReviewPrompt(content);
    
    const completion = await this.openai.chat.completions.create({
      model: this.config.model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: this.config.maxTokens,
      temperature: this.config.temperature,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error('No review response received');

    return this.parseReviewResponse(filePath, response);
  }

  private buildReviewPrompt(content: string): string {
    return `Please review the following code and provide:
1. Line-specific suggestions for improvements
2. Overall code quality score (0-100)
3. Brief summary of main findings
4. Suggested fixes for each issue

Code to review:
\`\`\`
${content}
\`\`\`

Format your response as JSON with the following structure:
{
  "suggestions": [
    {
      "line": number,
      "message": "string",
      "severity": "error" | "warning" | "info",
      "suggestedFix": "string"
    }
  ],
  "overallScore": number,
  "summary": "string"
}`;
  }

  private parseReviewResponse(filePath: string, response: string): FileReview {
    try {
      const parsed = JSON.parse(response);
      return {
        filePath,
        suggestions: parsed.suggestions,
        overallScore: parsed.overallScore,
        summary: parsed.summary,
      };
    } catch (error) {
      throw new Error(`Failed to parse review response: ${error}`);
    }
  }
}