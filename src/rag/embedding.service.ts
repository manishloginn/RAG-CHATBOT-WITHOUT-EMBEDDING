import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import "dotenv/config";
import { GoogleGenerativeAI } from '@google/generative-ai';
import ollama from 'ollama';


@Injectable()
export class EmbeddingService {
    private openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    })
    private genAI = new GoogleGenerativeAI(
    process.env.OPENAI_API_KEY!,
  );


    async createEmbedding(text:string){
        const res = await ollama.embeddings({
      model: 'nomic-embed-text',
      prompt: text,
    });
    console.log(res, "embedding response")

    return res.embedding;
    }
}
