import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateLandDto {
  @IsNumber()
  area: number;

  @IsString()
  street: string;

  @IsString()
  number: string;

  @IsString()
  @IsOptional()
  complement?: string;

  @IsString()
  district: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  postalCode: string;

  @IsString()
  country: string;

  @IsBoolean()
  @IsOptional()
  available?: boolean;
}