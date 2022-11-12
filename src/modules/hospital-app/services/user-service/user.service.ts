import {HttpStatus, Injectable} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";

import {ILogger} from '../../../../logger/models/app-logger';
import {MicroServiceError} from '../../../../exceptions/micro-service-error/micro-service-error';
import {ApiUserErrorsEnums} from '../../enums/api-user-errors.enums';
import {UserDto} from "../../models/dto/user-dtos/user.dto";
import {DoctorDto} from "../../models/dto/user-dtos/doctor.dto";
import {AppointmentDto} from "../../models/dto/user-dtos/appointment.dto";
import {ApiAppointmentErrorEnums} from "../../enums/api-appointment-error.enums";


@Injectable()
export class UserService {
    private readonly TAG: string = `${this.constructor.name}`;


    constructor(@InjectModel('User') private userModel: Model<UserDto>,
                @InjectModel('Doctor') private doctorModel: Model<DoctorDto>,
                private readonly appLogger: ILogger,
                private readonly jwtService: JwtService) {
        this.appLogger.log('Init', this.TAG);
    }

    async getUserByEmail(email: string): Promise<any> {
        try {
            return this.userModel.findOne({email: email}).exec();
        } catch (err) {
            this.appLogger.error(`Failed to get user by email`, this.TAG);
            throw new MicroServiceError(ApiUserErrorsEnums.FAILED_TO_GET_USER_BY_EMAIL, HttpStatus.BAD_GATEWAY);
        }
    }

    async getDoctorByEmail(email: string): Promise<DoctorDto> {
        try {
            return this.doctorModel.findOne({email: email}, '+password').exec();
        } catch (err) {
            this.appLogger.error(`Failed to get doctor by email`, this.TAG);
            throw new MicroServiceError(ApiUserErrorsEnums.FAILED_TO_GET_DOCTOR_BY_EMAIL, HttpStatus.BAD_GATEWAY);
        }
    }

    async getDoctorById(accessToken: string, doctorId?: string): Promise<DoctorDto> {
        try {
            if (accessToken) {
                const decodedToken = await this.jwtService.decode(accessToken) as any;
                return this.doctorModel.findOne({doctor_id: decodedToken.id}, '-password');
            }
            if (!accessToken) {
                ;
                return this.doctorModel.findOne({doctor_id: doctorId}, '-password');
            }

        } catch (err) {
            this.appLogger.error(`Failed to get doctor by id`, this.TAG);
            throw new MicroServiceError(ApiAppointmentErrorEnums.FAILED_TO_CREATE_APPOINTMENT, HttpStatus.BAD_GATEWAY);
        }
    }

    async saveUserAppointments(appointment: AppointmentDto): Promise<UserDto> {
        try {
            return this.userModel.findOneAndUpdate(
                {
                    user_id: appointment.user_id
                },
                {$push: {appointments: appointment}},
                {new: true}
            );
        } catch (err) {
            this.appLogger.error(`Failed to decline appointment`, this.TAG);
            throw new MicroServiceError(ApiAppointmentErrorEnums.FAILED_TO_SAVE_APPOINTMENT, HttpStatus.BAD_GATEWAY);
        }
    }

    async saveDoctorsAppointments(appointment: AppointmentDto): Promise<DoctorDto> {
        try {
            return this.doctorModel.findOneAndUpdate(
                {
                    doctor_id: appointment.doctor_id,
                },
                {$push: {accepted_appointments: appointment}},
                {new: true}
            );
        } catch (err) {
            this.appLogger.error(`Failed to decline appointment`, this.TAG);
            throw new MicroServiceError(ApiAppointmentErrorEnums.FAILED_TO_SAVE_APPOINTMENT, HttpStatus.BAD_GATEWAY);
        }
    }

    async getUserByIdWithoutRelation(userId: string): Promise<UserDto> {
        try {
            return this.userModel.findOne({user_id: userId}, '-password').exec();
        } catch (err) {
            this.appLogger.error(`Failed to decline appointment`, this.TAG);
            throw new MicroServiceError(ApiUserErrorsEnums.FAILED_TO_GET_USER, HttpStatus.BAD_GATEWAY);
        }
    }

    async getUserById(userId: string): Promise<UserDto> {
        try {
            return this.userModel.findOne({user_id: userId}, '-password').populate('appointments')
        } catch (err) {
            this.appLogger.error(`Failed to decline appointment`, this.TAG);
            throw new MicroServiceError(ApiUserErrorsEnums.FAILED_TO_GET_USER, HttpStatus.BAD_GATEWAY);
        }
    }
}
