import { IsNumberString, IsOptional, IsString, Matches } from 'class-validator';

export class GetConflictsQueryDto {
  @Matches(/^-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?$/, {
    message: 'bbox must be in the format minLng,minLat,maxLng,maxLat',
  })
  bbox: string;

  @IsOptional()
  @IsString()
  stationCode?: string;

  @IsOptional()
  @IsString()
  utilityType?: string;

  @IsOptional()
  @IsNumberString({}, { message: 'radiusMeters must be a number' })
  radiusMeters?: string;
}
