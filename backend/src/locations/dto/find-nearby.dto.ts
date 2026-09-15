import { Type } from 'class-transformer';
import { IsLatitude, IsLongitude, IsPositive } from 'class-validator';

export class FindNearbyDto {
  @Type(() => Number)
  @IsLongitude()
  lng: number;

  @Type(() => Number)
  @IsLatitude()
  lat: number;

  @Type(() => Number)
  @IsPositive()
  radiusMeters: number;
}
