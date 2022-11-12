import { IsOptional, IsString, MinLength, IsEmail } from 'class-validator';

export class CreateUserDto {
   @IsString()
   @IsOptional()
   user_id?: string;
   @IsString()
   @IsEmail()
   email: string;
   @IsString()
   @MinLength(6)
   password: string;
   @IsString()
   name: string;
   @IsString()
   phone: string;
   @IsString()
   avatar: string;
}
