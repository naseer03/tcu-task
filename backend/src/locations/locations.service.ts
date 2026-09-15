import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './location.entity.js';
import type { CreateLocationDto } from './dto/create-location.dto.js';
import type { FindNearbyDto } from './dto/find-nearby.dto.js';

export interface LocationGeoJson {
  id: string;
  name: string;
  createdAt: Date;
  geom: string;
  distanceMeters?: string;
}

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  create(dto: CreateLocationDto): Promise<Location> {
    const location = this.locationRepository.create({
      name: dto.name,
      geom: {
        type: 'Point',
        coordinates: [dto.lng, dto.lat],
      },
    });
    return this.locationRepository.save(location);
  }

  findAll(): Promise<LocationGeoJson[]> {
    return this.locationRepository
      .createQueryBuilder('location')
      .select('location.id', 'id')
      .addSelect('location.name', 'name')
      .addSelect('location.createdAt', 'createdAt')
      .addSelect('ST_AsGeoJSON(location.geom)', 'geom')
      .getRawMany();
  }

  findNearby(query: FindNearbyDto): Promise<LocationGeoJson[]> {
    return this.locationRepository
      .createQueryBuilder('location')
      .select('location.id', 'id')
      .addSelect('location.name', 'name')
      .addSelect('location.createdAt', 'createdAt')
      .addSelect('ST_AsGeoJSON(location.geom)', 'geom')
      .addSelect(
        'ST_Distance(location.geom::geography, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography)',
        'distanceMeters',
      )
      .where(
        'ST_DWithin(location.geom::geography, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography, :radiusMeters)',
      )
      .orderBy('"distanceMeters"', 'ASC')
      .setParameters(query)
      .getRawMany();
  }
}
