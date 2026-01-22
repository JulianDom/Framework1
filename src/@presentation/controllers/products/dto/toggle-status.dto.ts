import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ToggleProductStatusDto {
  @ApiProperty({ description: 'Activate (true) or deactivate (false)', example: true })
  @IsBoolean()
  @IsNotEmpty()
  activate!: boolean;
}
