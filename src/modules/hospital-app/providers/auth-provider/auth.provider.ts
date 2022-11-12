import { HttpStatus, Injectable } from '@nestjs/common';

import { ILogger } from '../../../../logger/models/app-logger';
import { CreateUserDto } from '../../models/dto/user-dtos/create-user.dto';
import { AuthService } from '../../services/auth-service/auth.service';
import { MicroServiceError } from '../../../../exceptions/micro-service-error/micro-service-error';
import { ApiAuthErrorsEnums } from '../../enums/api-auth-errors.enums';
import { UserTransformer } from '../../transformers/user.transformer';
import { UserService } from '../../services/user-service/user.service';
import { loginDto } from '../../models/dto/user-dtos/login.dto';


@Injectable()
export class AuthProvider {
   private readonly TAG: string = `${this.constructor.name}`;


   constructor(private readonly appLogger: ILogger,
               private readonly authService: AuthService,
               private readonly userService: UserService) {
      this.appLogger.log('Init', this.TAG);
   }

   async doctorSignUp(createDoctor: CreateUserDto): Promise<{ accessToken: string; doctorId: string; email: string }> {
      this.appLogger.log('Trying to hash doctor password', this.TAG);
      const hashedPassword = await this.authService.hashPassword(createDoctor.password);
      if (!hashedPassword) {
         this.appLogger.error(`Failed to hash password`, this.TAG);
         throw new MicroServiceError(ApiAuthErrorsEnums.HASHING_ERROR, HttpStatus.BAD_GATEWAY);
      }
      this.appLogger.log('Trying to save doctor', this.TAG);
      const doctor = await this.authService.createDoctor(createDoctor, hashedPassword);
      this.appLogger.log('Creating accessToken for doctor', this.TAG);
      const accessToken = await this.authService.createToken(doctor.doctor_id, doctor.email);
      if (!accessToken) {
         this.appLogger.error(`Failed to login`, this.TAG);
         throw new MicroServiceError(ApiAuthErrorsEnums.WRONG_DATA, HttpStatus.UNAUTHORIZED);
      }
      this.appLogger.log(`Doctor with id: ${doctor.doctor_id} is successfully created`, this.TAG);
      return UserTransformer.createdDoctorToInterface(doctor, accessToken);
   }

   async userSignUp(createUser: CreateUserDto): Promise<{ accessToken: string; userId: string; email: string }> {
      this.appLogger.log('Trying to hash user password', this.TAG);
      const hashedPassword = await this.authService.hashPassword(createUser.password);
      if (!hashedPassword) {
         this.appLogger.error(`Failed to hash password`, this.TAG);
         throw new MicroServiceError(ApiAuthErrorsEnums.HASHING_ERROR, HttpStatus.BAD_GATEWAY);
      }
      this.appLogger.log('Trying to save user', this.TAG);
      const user = await this.authService.createUser(createUser, hashedPassword);
      this.appLogger.log('Creating accessToken', this.TAG);
      const accessToken = await this.authService.createToken(user.user_id, user.email);
      if (!accessToken) {
         this.appLogger.error(`Failed to login`, this.TAG);
         throw new MicroServiceError(ApiAuthErrorsEnums.WRONG_DATA, HttpStatus.UNAUTHORIZED);
      }
      this.appLogger.log(`User with id: ${user.user_id} is successfully created`, this.TAG);
      return UserTransformer.createdUserToInterface(user, accessToken);
   }

   async userLogin(loginData: loginDto): Promise<{ accessToken: string; userId: string; email: string }> {
      this.appLogger.log('logging in', this.TAG);
      const user = await this.userService.getUserByEmail(loginData.email);
      if (!user) {
         this.appLogger.error(`Failed to login`, this.TAG);
         throw new MicroServiceError(ApiAuthErrorsEnums.WRONG_DATA, HttpStatus.UNAUTHORIZED);
      }
      this.appLogger.log('Comparing passwords', this.TAG);
      const comparePassword = await this.authService.comparePassword(loginData.password, user.password);
      if (!comparePassword) {
         this.appLogger.error(`Failed to login`, this.TAG);
         throw new MicroServiceError(ApiAuthErrorsEnums.WRONG_DATA, HttpStatus.UNAUTHORIZED);
      }
      this.appLogger.log('Creating accessToken', this.TAG);
      const accessToken = await this.authService.createToken(user.user_id, user.email);
      if (!accessToken) {
         this.appLogger.error(`Failed to login`, this.TAG);
         throw new MicroServiceError(ApiAuthErrorsEnums.WRONG_DATA, HttpStatus.UNAUTHORIZED);
      }
      this.appLogger.log(`User with id: ${user.user_id} successfully logging in`, this.TAG);
      return UserTransformer.createdUserToInterface(user, accessToken);
   }

   async doctorLogin(loginData: loginDto): Promise<{ accessToken: string; doctorId: string; email: string }> {
      this.appLogger.log('logging in', this.TAG);
      const doctor = await this.userService.getDoctorByEmail(loginData.email);
      if (!doctor) {
         this.appLogger.error(`Failed to login`, this.TAG);
         throw new MicroServiceError(ApiAuthErrorsEnums.WRONG_DATA, HttpStatus.UNAUTHORIZED);
      }
      this.appLogger.log('Comparing passwords', this.TAG);
      const comparePassword = await this.authService.comparePassword(loginData.password, doctor.password);
      if (!comparePassword) {
         this.appLogger.error(`Failed to login`, this.TAG);
         throw new MicroServiceError(ApiAuthErrorsEnums.WRONG_DATA, HttpStatus.UNAUTHORIZED);
      }
      this.appLogger.log('Creating accessToken', this.TAG);
      const accessToken = await this.authService.createToken(doctor.doctor_id, doctor.email);
      if (!accessToken) {
         this.appLogger.error(`Failed to login`, this.TAG);
         throw new MicroServiceError(ApiAuthErrorsEnums.WRONG_DATA, HttpStatus.UNAUTHORIZED);
      }
      this.appLogger.log(`Doctor with id: ${doctor.doctor_id} successfully logging in`, this.TAG);
      return UserTransformer.createdDoctorToInterface(doctor, accessToken);
   }
}
