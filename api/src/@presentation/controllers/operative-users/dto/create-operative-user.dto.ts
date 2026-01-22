import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, MinLength, MaxLength } from 'class-validator';

export class CreateOperativeUserDto {
  @ApiProperty({ description: 'Full name', example: 'John Operative' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  fullName!: string;

  @ApiProperty({ description: 'Email address', example: 'john.operative@company.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ description: 'Username', example: 'john_operative' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  username!: string;

  @ApiProperty({ description: 'Initial password (min 8 characters)', example: 'InitialP@ss123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;
}
