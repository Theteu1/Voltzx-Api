import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { UserType } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(UserType)
  type: 'OWNER' | 'COMPANY' | 'INVESTOR';
}
