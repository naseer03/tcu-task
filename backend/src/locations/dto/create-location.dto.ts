import { IsLatitude, IsLongitude, IsNotEmpty, IsString } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsLongitude()
  lng: number;

  @IsLatitude()
  lat: number;
}
