import { IsString, IsNumber, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateProposalDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  estimatedCost: number;

  @IsNumber()
  @IsNotEmpty()
  estimatedEnergyOutput: number;

  @IsNumber()
  @IsNotEmpty()
  estimatedReturn: number;

  @IsUUID()
  @IsNotEmpty()
  landId: string;
}