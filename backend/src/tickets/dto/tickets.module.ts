import {Module} from '@nestjs/common';
import { TicketsController } from './tickets.controller.js';
import { TicketService } from './tickets.service.js';


@Module({

    controllers: [TicketsController],
    providers: [TicketService],
})
export class TicketsModule {}