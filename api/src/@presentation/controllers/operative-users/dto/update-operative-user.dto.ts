import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, MaxLength, IsOptional } from 'class-validator';

export class UpdateOperativeUserDto {
  @ApiPropertyOptional({ description: 'Full name', example: 'John Operative Updated' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  fullName?: string;

  @ApiPropertyOptional({ description: 'Email address', example: 'john.new@company.com' })
  @IsOptional()
  @IsEmail()
  email?: string;
}
