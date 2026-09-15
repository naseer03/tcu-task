import { Controller, Get, Query } from "@nestjs/common";
import{ GetConflictsQueryDto} from './get-conflicts-query.dto.js'
import { TicketService } from "./tickets.service.js";


@Controller('api/tickets')
export class TicketsController{
    constructor(private readonly ticketService: TicketService) {}
    @Get('conflicts')

    getConflicts(@Query() query: GetConflictsQueryDto){
        return this.ticketService.getConflicts(query);
    }
}

