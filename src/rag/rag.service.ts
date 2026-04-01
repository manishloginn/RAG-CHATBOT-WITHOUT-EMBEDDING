import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { EmbeddingService } from './embedding.service';
import { VectorService } from './vector.service';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class RagService {

  private groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
  });

  constructor(
    private readonly embeddingService: EmbeddingService,
    private readonly vectorService: VectorService,
  ) {}

  async ask(question: string) {
    const fakeEmbedding = new Array(1536).fill(0.1);

    const store = await this.vectorService.store(question, fakeEmbedding);
    const docs = await this.vectorService.search(fakeEmbedding, 5);

    const context = docs
      .slice(0, 3)
      .map((doc: any) => doc.content) // ensure correct structure
      .join('\n\n');
    const prompt = `
You are a helpful AI assistant.

Use ONLY the provided context to answer.

Context:
${context}

Question:
${question}

`;

    const response = await this.groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      temperature: 1,
    });
    console.log(response, 'groq response');
    return response.choices[0].message.content;
  }
}
