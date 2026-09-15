import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { LocationsService } from './locations.service.js';
import { CreateLocationDto } from './dto/create-location.dto.js';
import { FindNearbyDto } from './dto/find-nearby.dto.js';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  create(@Body() dto: CreateLocationDto) {
    return this.locationsService.create(dto);
  }

  @Get()
  findAll() {
    return this.locationsService.findAll();
  }

  @Get('nearby')
  findNearby(@Query() query: FindNearbyDto) {
    return this.locationsService.findNearby(query);
  }
}
