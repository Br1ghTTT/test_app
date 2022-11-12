import { HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";

import {CreateUserDto} from "../../models/dto/user-dtos/create-user.dto";
import {DoctorDto} from "../../models/dto/user-dtos/doctor.dto";
import {UserDto} from "../../models/dto/user-dtos/user.dto";
import { ILogger } from '../../../../logger/models/app-logger';
import { UserTransformer } from '../../transformers/user.transformer';
import { MicroServiceError } from '../../../../exceptions/micro-service-error/micro-service-error';
import { ApiAuthErrorsEnums } from '../../enums/api-auth-errors.enums';

@Injectable()
export class AuthService {
   private readonly TAG: string = `${this.constructor.name}`;


   constructor(@InjectModel('User') private userModel: Model<UserDto>,
               @InjectModel('Doctor') private doctorModel: Model<DoctorDto>,
               private readonly appLogger: ILogger,
               private readonly jwtService: JwtService,
               ) {
      this.appLogger.log('Init', this.TAG);
   }

   async hashPassword(password: string): Promise<string> {
      return bcrypt.hash(password, 10);
   }

   async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
      return bcrypt.compare(password, hashedPassword);
   }

   async createToken(userId: string, email: string): Promise<string> {
      return this.jwtService.signAsync({ id: userId, email: email });
   }

   async createUser(user: CreateUserDto, hashedPassword: string): Promise<UserDto> {
      try {
         const userToCreate = UserTransformer.createUserInterfaceToEntity(user, hashedPassword);
         return (await new this.userModel(userToCreate)).save();
      } catch (err) {
         this.appLogger.error(`Failed to create user`, this.TAG);
         throw new MicroServiceError(ApiAuthErrorsEnums.USER_CREATION_FAILED, HttpStatus.BAD_GATEWAY);
      }
   }

   async createDoctor(user: CreateUserDto, hashedPassword: string): Promise<DoctorDto> {
      try {
         const userToCreate = UserTransformer.createDoctorInterfaceToEntity(user, hashedPassword);
         return (await new this.doctorModel(userToCreate)).save();
      } catch (err) {
         this.appLogger.error(`Failed to create user`, this.TAG);
         throw new MicroServiceError(ApiAuthErrorsEnums.DOCTOR_CREATION_FAILED, HttpStatus.BAD_GATEWAY);
      }
   }

}
