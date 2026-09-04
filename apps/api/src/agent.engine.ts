import { Injectable } from '@nestjs/common';
export type AgentInput = { message: string; agentName?: string; context?: string };
@Injectable()
export class AgentEngine {
  async respond(input: AgentInput) {
    const name = input.agentName || 'VendaFlow';
    return { provider: 'mock', text: `Olá! Sou o ${name}. Recebi sua mensagem e posso ajudar com produtos, preços e disponibilidade.`, confidence: 0.86 };
  }
}
