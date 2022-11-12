import {HttpStatus, Injectable} from '@nestjs/common';;
import {InjectModel} from "@nestjs/mongoose";
import {Model, Query} from "mongoose";

import {ILogger} from '../../../../logger/models/app-logger';
import {MicroServiceError} from '../../../../exceptions/micro-service-error/micro-service-error';
import {UserDto} from "../../models/dto/user-dtos/user.dto";
import {DoctorDto} from "../../models/dto/user-dtos/doctor.dto";
import {CreateAppointmentDto} from "../../models/dto/user-dtos/create-appointment.dto";
import {UserTransformer} from "../../transformers/user.transformer";
import {AppointmentDto} from "../../models/dto/user-dtos/appointment.dto";
import {UpdateAppointmentDto} from "../../models/dto/user-dtos/update-appointment.dto";
import {DeleteAppointmentDto} from "../../models/dto/user-dtos/delete-appointment.dto";
import {ApiAppointmentErrorEnums} from "../../enums/api-appointment-error.enums";


@Injectable()
export class AppointmentsService {
    private readonly TAG: string = `${this.constructor.name}`;


    constructor(@InjectModel('Appointment') private appointmentModel: Model<AppointmentDto>,
                private readonly appLogger: ILogger) {
        this.appLogger.log('Init', this.TAG);
    }

    async getAppointmentByDoctorId(doctorId: string): Promise<AppointmentDto[]> {
        try {
            return this.appointmentModel.find({doctor_id: doctorId}).exec();
        } catch (err) {
            this.appLogger.error(`Failed to get appointments user`, this.TAG);
            throw new MicroServiceError(ApiAppointmentErrorEnums.FAILED_TO_GET_APPOINTMENT_BY_ID, HttpStatus.BAD_GATEWAY);
        }
    }

    async getAppointmentByDate(date: string, doctorId: string): Promise<AppointmentDto[]> {
        try {
            return this.appointmentModel.find(
                {
                    doctor_id: doctorId, date: {$regex: '^' + date.split('')[0], $options: 'i'}
                }).exec();
        } catch (err) {
            this.appLogger.error(`Failed to get appointments user`, this.TAG);
            throw new MicroServiceError(ApiAppointmentErrorEnums.FAILED_TO_GET_APPOINTMENTS, HttpStatus.BAD_GATEWAY);
        }
    }

    async createAppointment(appointment: CreateAppointmentDto, user: UserDto, doctor: DoctorDto): Promise<AppointmentDto> {
        try {
            const appointmentToCreate = UserTransformer.createAppointment(appointment, user, doctor);
            return (await new this.appointmentModel(appointmentToCreate)).save();
        } catch (err) {
            this.appLogger.error(`Failed to create appointment`, this.TAG);
            throw new MicroServiceError(ApiAppointmentErrorEnums.FAILED_TO_CREATE_APPOINTMENT, HttpStatus.BAD_GATEWAY);
        }
    }

    async activateAppointment(appointment: UpdateAppointmentDto): Promise<AppointmentDto> {
        try {
            return this.appointmentModel.findOneAndUpdate(
                {
                    id: appointment.appointmentId,
                    doctor_id: appointment.doctor_id
                },
                {active: appointment.activate},
                {new: true}
            );
        } catch (err) {
            this.appLogger.error(`Failed to activate appointment`, this.TAG);
            throw new MicroServiceError(ApiAppointmentErrorEnums.FAILED_TO_ACTIVATE_APPOINTMENT, HttpStatus.BAD_GATEWAY);
        }
    }

    async declineAppointment(appointment: DeleteAppointmentDto): Promise<void | any> {
        try {
            return this.appointmentModel.deleteOne({id: appointment.appointmentId, doctor_id: appointment.doctor_id});
        } catch (err) {
            this.appLogger.error(`Failed to decline appointment`, this.TAG);
            throw new MicroServiceError(ApiAppointmentErrorEnums.FAILED_TO_DECLINE_APPOINTMENT, HttpStatus.BAD_GATEWAY);
        }
    }

    async getAppointments(): Promise<Query<Omit<any, never>[], any, {}, any>> {
        try {
            return this.appointmentModel.find().populate('user', 'name').populate('doctor','spec');
        } catch (err) {
            this.appLogger.error(`Failed to decline appointment`, this.TAG);
            throw new MicroServiceError(ApiAppointmentErrorEnums.FAILED_TO_GET_APPOINTMENTS, HttpStatus.BAD_GATEWAY);
        }
    }
}
