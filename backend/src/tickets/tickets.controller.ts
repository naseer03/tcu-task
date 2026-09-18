import { Controller, Get, Query } from '@nestjs/common';
import { GetConflictsQueryDto } from './dto/get-conflicts-query.dto.js';
import { TicketsService } from './tickets.service.js';

@Controller('api/tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get('conflicts')
  getConflicts(@Query() query: GetConflictsQueryDto) {
    return this.ticketsService.getConflicts(query);
  }
}
