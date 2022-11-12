import { v4 as uuidv4 } from 'uuid';
import * as moment from "moment-timezone";

import { CreateUserDto } from '../models/dto/user-dtos/create-user.dto';
import {DoctorDto} from "../models/dto/user-dtos/doctor.dto";
import {UserDto} from "../models/dto/user-dtos/user.dto";
import {CreateAppointmentDto} from "../models/dto/user-dtos/create-appointment.dto";
import {AppointmentDto} from "../models/dto/user-dtos/appointment.dto";

moment.tz.setDefault('Europe/Kyiv');

export class UserTransformer {
   public static createUserInterfaceToEntity(userData: CreateUserDto, hashedPassword: string): DoctorDto | UserDto | any {
      return {
         user_id: uuidv4(),
         email: userData.email,
         password: hashedPassword,
         name: userData.name,
         phone: userData.phone,
         avatar: userData.avatar,
      }
   }

   public static createDoctorInterfaceToEntity(userData: CreateUserDto, hashedPassword: string): DoctorDto | any {
      return {
         doctor_id: uuidv4(),
         email: userData.email,
         password: hashedPassword,
         name: userData.name,
         phone: userData.phone,
         avatar: userData.avatar,
      }
   }

   public static createAppointment(appointment: CreateAppointmentDto, user, doctor): AppointmentDto {
      return {
         id: uuidv4(),
         user_id: appointment.user_id,
         doctor_id: appointment.doctor_id,
         date: appointment.date,
         active: false,
         user: user,
         doctor: doctor
      } as any
   }

   public static createdUserToInterface(user: UserDto, accessToken: string): { accessToken: string; userId: string; email: string } {
      return {
         accessToken: accessToken,
         userId: user.user_id ? user.user_id : '',
         email: user.email ? user.email : '',
      };
   }

   public static createdDoctorToInterface(user: DoctorDto, accessToken: string): { accessToken: string; doctorId: string; email: string }{
      return {
         accessToken: accessToken,
         doctorId: user.doctor_id ? user.doctor_id : '',
         email: user.email ? user.email : '',
      };
   }

}
