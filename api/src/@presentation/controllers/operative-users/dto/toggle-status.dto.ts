import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ToggleOperativeUserStatusDto {
  @ApiProperty({ description: 'Enable (true) or disable (false)', example: true })
  @IsBoolean()
  @IsNotEmpty()
  enable!: boolean;
}
