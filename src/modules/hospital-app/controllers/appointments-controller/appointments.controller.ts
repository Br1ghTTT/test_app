import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Injectable,
    Param,
    Post,
    UseGuards,
    Headers,
    Patch, Delete
} from '@nestjs/common';
import {ApiOperation, ApiResponse} from '@nestjs/swagger';

import {ILogger} from '../../../../logger/models/app-logger';
import {MicroServiceError} from '../../../../exceptions/micro-service-error/micro-service-error';
import {JwtAuthGuard} from '../../../../guards/auth/jwt.guard';
import {DoctorDto} from "../../models/dto/user-dtos/doctor.dto";
import {CreateAppointmentDto} from "../../models/dto/user-dtos/create-appointment.dto";
import {AppointmentDto} from "../../models/dto/user-dtos/appointment.dto";
import {PARAMS} from "../../../../shared/consts/params.const";
import {ApiUserErrorsEnums} from "../../enums/api-user-errors.enums";
import {Roles} from "../../../../guards/roles/role.decorator";
import {RoleGuard} from "../../../../guards/roles/role.guard";
import {UpdateAppointmentDto} from "../../models/dto/user-dtos/update-appointment.dto";
import {DeleteAppointmentDto} from "../../models/dto/user-dtos/delete-appointment.dto";
import {IsDeclinedInterface} from "../../models/interfaces/is-declined-interface";
import {AppointmentsProvider} from "../../providers/appointments-provider/appointments.provider";
import {ApiAppointmentErrorEnums} from "../../enums/api-appointment-error.enums";


@Injectable()
@Controller()
export class AppointmentsController {
    private readonly TAG: string = `${this.constructor.name}`;

    constructor(private readonly appLogger: ILogger,
                private readonly appointmentProvider: AppointmentsProvider) {
        this.appLogger.log('Init', this.TAG);
    }

    @Post('create-appointment')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({description: 'create appointments'})
    @HttpCode(HttpStatus.CREATED)
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Appointment is created ',
        type: AppointmentDto,
    })
    @HttpCode(HttpStatus.BAD_REQUEST)
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: ApiAppointmentErrorEnums.FAILED_TO_CREATE_APPOINTMENT,
        type: MicroServiceError,
    })
    async createAppointment(@Body() createAppointment: CreateAppointmentDto): Promise<AppointmentDto> {
        return this.appointmentProvider.createAppointment(createAppointment);
    }

    @Get(`appointments/:${PARAMS.DATE}`)
    @Roles('doc')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @ApiOperation({description: 'appointments'})
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Appointments is successfully gotten',
        type: [AppointmentDto],
    })
    @HttpCode(HttpStatus.BAD_REQUEST)
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: ApiAppointmentErrorEnums.FAILED_TO_GET_APPOINTMENTS,
        type: MicroServiceError,
    })
    async getAppointmentsByDate(@Param(PARAMS.DATE) date: string,
                                @Headers() header): Promise<AppointmentDto[]> {
        return this.appointmentProvider.getAppointmentsByDate(date, header.authorization);
    }

    @Patch('activate-appointment')
    @Roles('doc')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @ApiOperation({description: 'active appointments'})
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Appointment is activated ',
        type: DoctorDto,
    })
    @HttpCode(HttpStatus.BAD_REQUEST)
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: ApiAppointmentErrorEnums.FAILED_TO_ACTIVATE_APPOINTMENT,
        type: MicroServiceError,
    })
    async activateAppointment(@Body() updateAppointment: UpdateAppointmentDto): Promise<DoctorDto> {
        return this.appointmentProvider.activateAppointment(updateAppointment);
    }

    @Delete('decline-appointment')
    @Roles('doc')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @ApiOperation({description: 'decline appointment'})
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Appointment is declined ',
        type: AppointmentDto,
    })
    @HttpCode(HttpStatus.BAD_REQUEST)
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: ApiAppointmentErrorEnums.FAILED_TO_DECLINE_APPOINTMENT,
        type: MicroServiceError,
    })
    async declineAppointment(@Body() deleteAppointment: DeleteAppointmentDto): Promise<IsDeclinedInterface> {
        return this.appointmentProvider.declineAppointment(deleteAppointment);
    }
}
