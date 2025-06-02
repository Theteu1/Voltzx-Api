// src/investments/dto/create-investment.dto.ts
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateInvestmentDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsNumber()
  @IsNotEmpty()
  value: number;

  @IsString()
  @IsNotEmpty()
  description: string;
}