import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class VectorService {
  constructor(private readonly prisma: PrismaService) {}

  // ✅ Store document + embedding
 async store(content: string, embedding: any) {
  // 🔥 normalize embedding
  if (Array.isArray(embedding[0])) {
    embedding = embedding[0];
  }

  embedding = embedding.map(Number);

  if (embedding.length !== 1536) {
    throw new Error(`Invalid embedding length: ${embedding.length}`);
  }

  const vector = `[${embedding.join(',')}]`;

  await this.prisma.$executeRawUnsafe(
    `INSERT INTO documents (content, embedding)
     VALUES ($1, $2::vector)`,
    content,
    vector
  );
}

  // ✅ Vector similarity search (pgvector)
 async search(embedding: number[], topK: number) {
  const vector = `[${embedding.join(',')}]`;

  const result = await this.prisma.$queryRawUnsafe<
    { content: string }[]
  >(
    `SELECT content
     FROM documents
     ORDER BY embedding <-> $1::vector
     LIMIT $2`,
    vector,
    topK
  );

  return result.map((r) => r.content);
}
}