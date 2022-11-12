import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsEmail } from 'class-validator';

export class loginDto {
   @ApiProperty({ description: 'user email' })
   @IsString()
   @IsEmail()
   email: string;
   @ApiProperty({ description: 'user password' })
   @IsString()
   @MinLength(6)
   password: string;
}
