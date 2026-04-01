import { Module } from '@nestjs/common';
import { RagService } from './rag.service';
import { RagController } from './rag.controller';
import { EmbeddingService } from './embedding.service';
import { VectorService } from './vector.service';
import { PrismaService } from './prisma.service';

@Module({
  providers: [RagService, EmbeddingService, VectorService, PrismaService],
  controllers: [RagController]
})
export class RagModule {}
