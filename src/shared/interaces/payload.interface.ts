import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PayloadInterface {
   @ApiProperty({ description: 'hospital-app id' })
   @IsString()
   user_id: string;
   @ApiProperty({ description: 'hospital-app email' })
   @IsString()
   email: string;
}
