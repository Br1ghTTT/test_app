import {HttpStatus, Injectable} from '@nestjs/common';
import * as moment from "moment-timezone";
import {JwtService} from "@nestjs/jwt";

import {ILogger} from '../../../../logger/models/app-logger';
import {MicroServiceError} from '../../../../exceptions/micro-service-error/micro-service-error';
import {UserService} from '../../services/user-service/user.service';
import {CreateAppointmentDto} from "../../models/dto/user-dtos/create-appointment.dto";
import {AppointmentDto} from "../../models/dto/user-dtos/appointment.dto";
import {UpdateAppointmentDto} from "../../models/dto/user-dtos/update-appointment.dto";
import {DeleteAppointmentDto} from "../../models/dto/user-dtos/delete-appointment.dto";
import {IsDeclinedInterface} from "../../models/interfaces/is-declined-interface";
import {DoctorDto} from "../../models/dto/user-dtos/doctor.dto";
import {AppointmentsService} from "../../services/appointments-service/appointments.service";
import {ApiAppointmentErrorEnums} from "../../enums/api-appointment-error.enums";


moment.tz.setDefault('Europe/Kyiv');

@Injectable()
export class AppointmentsProvider {
    private readonly TAG: string = `${this.constructor.name}`;


    constructor(private readonly appLogger: ILogger,
                private readonly userService: UserService,
                private readonly appointmentsService: AppointmentsService,
                private readonly jwtService: JwtService) {
        this.appLogger.log('Init', this.TAG);
    }

    async createAppointment(createAppointment: CreateAppointmentDto): Promise<AppointmentDto> {
        this.appLogger.log('trying to get appointments for specific doctor', this.TAG);
        const appointments = await this.appointmentsService.getAppointmentByDoctorId(createAppointment.doctor_id);
        let counter = 0;
        await Promise.all(appointments.map(async r => {
            if (r.date.split(',')[0] === createAppointment.date.split(',')[0]) {
                counter += 1;
            }
            return true;
        }));
        if (counter >= 4) {
            this.appLogger.error('Failed to create appointment', this.TAG);
            throw new MicroServiceError(ApiAppointmentErrorEnums.FAILED_TO_ADD_NEW_APPOINTMENT, HttpStatus.METHOD_NOT_ALLOWED);
        }
        counter = 0;
        if (moment(createAppointment.date).valueOf() < moment().valueOf()) {
            this.appLogger.error('Failed to create appointment', this.TAG);
            throw new MicroServiceError(ApiAppointmentErrorEnums.FAILED_TO_CREATE_NEW_APPOINTMENT, HttpStatus.METHOD_NOT_ALLOWED);
        }
        this.appLogger.log('trying to get user', this.TAG);
        const user = await this.userService.getUserByIdWithoutRelation(createAppointment.user_id);
        this.appLogger.log(`user with id: ${user.user_id} is successfully gotten`, this.TAG);
        this.appLogger.log('trying to get doctor', this.TAG);
        const doctor = await this.userService.getDoctorById(null, createAppointment.doctor_id);
        this.appLogger.log(`user with id: ${doctor.doctor_id} is successfully gotten`, this.TAG);
        this.appLogger.log('creating appointment in', this.TAG);
        const appointment = await this.appointmentsService.createAppointment(createAppointment, user, doctor);
        this.appLogger.log('appointment in successfully created', this.TAG);
        this.appLogger.log('trying to save appointment for user', this.TAG);
        await this.userService.saveUserAppointments(appointment);
        this.appLogger.log('Appointment is successfully saved for user', this.TAG);
        return appointment;
    }

    async getAppointmentsByDate(date: string, accessToken: string): Promise<AppointmentDto[]> {
        this.appLogger.log('trying to decode access token', this.TAG);
        const decodedToken = await this.jwtService.decode(accessToken.split(' ').slice(1).join()) as any;
        this.appLogger.log('Access token is successfully decoded', this.TAG);
        this.appLogger.log('trying to get appointments for doctor by specific date', this.TAG);
        const appointments = await this.appointmentsService.getAppointmentByDate(date, decodedToken.id);
        this.appLogger.log('Appointments is successfully gotten', this.TAG);
        return appointments;
    }

    async activateAppointment(activateAppointment: UpdateAppointmentDto): Promise<DoctorDto> {
        this.appLogger.log('Trying to activate appointment', this.TAG);
        const appointment = await this.appointmentsService.activateAppointment(activateAppointment);
        this.appLogger.log('Appointment is successfully activated', this.TAG);
        this.appLogger.log('Trying to save activated appointment into doctors data base', this.TAG);
        const saveDoctorsAppointment = await this.userService.saveDoctorsAppointments(appointment);
        this.appLogger.log('Activated appointment is successfully saved into doctors data base', this.TAG);
        return saveDoctorsAppointment;
    }

    async declineAppointment(declineAppointment: DeleteAppointmentDto): Promise<IsDeclinedInterface> {
        this.appLogger.log('Trying to declined appointment', this.TAG);
        await this.appointmentsService.declineAppointment(declineAppointment);
        this.appLogger.log('Appointment is successfully declined', this.TAG);
        return {isDeclined: true}
    }
}
