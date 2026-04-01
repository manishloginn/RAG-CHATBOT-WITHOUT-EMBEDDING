import { Body, Controller, Post } from '@nestjs/common';
import { RagService } from './rag.service';

@Controller('rag')
export class RagController {
    constructor(
        private readonly ragService : RagService
    ){

    }

    @Post('aks')
    async ask(
        @Body('question') question: string 
    ){
        console.log(question, "question")
        return this.ragService.ask(question)
    }
}
