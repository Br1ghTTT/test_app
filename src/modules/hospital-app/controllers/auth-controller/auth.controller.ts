import { Body, Controller, HttpCode, HttpStatus, Injectable, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { ILogger } from '../../../../logger/models/app-logger';
import { MicroServiceError } from '../../../../exceptions/micro-service-error/micro-service-error';
import { AuthProvider } from '../../providers/auth-provider/auth.provider';
import { ApiAuthErrorsEnums } from '../../enums/api-auth-errors.enums';
import { UserDto } from '../../models/dto/user-dtos/user.dto';
import { CreateUserDto } from '../../models/dto/user-dtos/create-user.dto';
import { loginDto } from '../../models/dto/user-dtos/login.dto';
import {DoctorDto} from "../../models/dto/user-dtos/doctor.dto";


@Injectable()
@Controller('auth')
export class AuthController {
   private readonly TAG: string = `${this.constructor.name}`;

   constructor(private readonly appLogger: ILogger,
               private readonly authProvider: AuthProvider) {
      this.appLogger.log('Init', this.TAG);
   }

   @Post('user/signUp')
   @ApiOperation({ description: 'Create user' })
   @HttpCode(HttpStatus.CREATED)
   @ApiResponse({
      status: HttpStatus.CREATED,
      description: 'User created',
      type: UserDto,
   })
   @HttpCode(HttpStatus.BAD_REQUEST)
   @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: ApiAuthErrorsEnums.USER_CREATION_FAILED,
      type: MicroServiceError,
   })
   async userSignUp(@Body() createUser: CreateUserDto): Promise<{ accessToken: string; userId: string; email: string }> {
      return this.authProvider.userSignUp(createUser);
   }

   @Post('doctor/signUp')
   @ApiOperation({ description: 'Create doctor' })
   @HttpCode(HttpStatus.CREATED)
   @ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Doctor created',
      type: DoctorDto,
   })
   @HttpCode(HttpStatus.BAD_REQUEST)
   @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: ApiAuthErrorsEnums.DOCTOR_CREATION_FAILED,
      type: MicroServiceError,
   })
   async doctorSignUp(@Body() createUser: CreateUserDto): Promise<{ accessToken: string; doctorId: string; email: string }> {
      return this.authProvider.doctorSignUp(createUser);
   }

   @Post('user/login')
   @ApiOperation({ description: 'Login in' })
   @HttpCode(HttpStatus.CREATED)
   @ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Login succeeded',
      type: UserDto,
   })
   @HttpCode(HttpStatus.BAD_REQUEST)
   @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: ApiAuthErrorsEnums.LOGIN_FAILED,
      type: MicroServiceError,
   })
   async userLogin(@Body() loginData: loginDto): Promise<{ accessToken: string; userId: string; email: string }> {
      return this.authProvider.userLogin(loginData);
   }

   @Post('doctor/login')
   @ApiOperation({ description: 'Login in' })
   @HttpCode(HttpStatus.CREATED)
   @ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Login succeeded',
      type: UserDto,
   })
   @HttpCode(HttpStatus.BAD_REQUEST)
   @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: ApiAuthErrorsEnums.LOGIN_FAILED,
      type: MicroServiceError,
   })
   async doctorLogin(@Body() loginData: loginDto): Promise<{ accessToken: string; doctorId: string; email: string }> {
      return this.authProvider.doctorLogin(loginData);
   }
}
