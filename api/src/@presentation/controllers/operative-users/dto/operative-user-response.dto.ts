import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OperativeUserResponseDto {
  @ApiProperty({ description: 'Operative user ID' })
  id!: string;

  @ApiProperty({ description: 'Full name' })
  fullName!: string;

  @ApiProperty({ description: 'Email address' })
  email!: string;

  @ApiProperty({ description: 'Username' })
  username!: string;

  @ApiProperty({ description: 'Account enabled status' })
  enabled!: boolean;

  @ApiPropertyOptional({ description: 'ID of admin who created this user' })
  createdById?: string | null;
}

export class OperativeUserDetailResponseDto extends OperativeUserResponseDto {
  @ApiProperty({ description: 'Creation date' })
  createdAt!: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt!: Date;
}

export class OperativeUserListResponseDto {
  @ApiProperty({ type: [OperativeUserResponseDto], description: 'List of operative users' })
  data!: OperativeUserResponseDto[];

  @ApiProperty({ description: 'Total number of operative users' })
  total!: number;

  @ApiProperty({ description: 'Current page' })
  page!: number;

  @ApiProperty({ description: 'Items per page' })
  limit!: number;
}
