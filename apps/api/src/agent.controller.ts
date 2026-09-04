import { Body, Controller, Post } from '@nestjs/common';
import { AgentEngine, AgentInput } from './agent.engine';
@Controller('agent')
export class AgentController {
  constructor(private readonly engine: AgentEngine) {}
  @Post('respond') respond(@Body() input: AgentInput) { return this.engine.respond(input); }
}
