export type IncomingMessage = { externalId: string; phone: string; text: string; timestamp: Date };
export type OutgoingMessage = { phone: string; text: string };
export interface WhatsAppAdapter { sendMessage(message: OutgoingMessage): Promise<{ providerId: string }>; verifyWebhook(payload: string, signature: string): boolean; }
export interface AIProvider { complete(input: { system: string; user: string; context?: string }): Promise<string>; }

export class MockWhatsAppAdapter implements WhatsAppAdapter {
  async sendMessage(message: OutgoingMessage) { return { providerId: `mock-${Date.now()}-${message.phone}` }; }
  verifyWebhook() { return true; }
}

export class MockAIProvider implements AIProvider {
  async complete(input: { system: string; user: string; context?: string }) { return `Resposta simulada para: ${input.user}`; }
}
