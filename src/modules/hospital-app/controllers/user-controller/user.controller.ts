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
import {AuthProvider} from '../../providers/auth-provider/auth.provider';
import {ApiAuthErrorsEnums} from '../../enums/api-auth-errors.enums';
import {UserDto} from '../../models/dto/user-dtos/user.dto';
import {CreateUserDto} from '../../models/dto/user-dtos/create-user.dto';
import {loginDto} from '../../models/dto/user-dtos/login.dto';
import {JwtAuthGuard} from '../../../../guards/auth/jwt.guard';
import {DoctorDto} from "../../models/dto/user-dtos/doctor.dto";
import {UserProvider} from "../../providers/user-provider/user.provider";
import {CreateAppointmentDto} from "../../models/dto/user-dtos/create-appointment.dto";
import {AppointmentDto} from "../../models/dto/user-dtos/appointment.dto";
import {PARAMS} from "../../../../shared/consts/params.const";
import {ApiUserErrorsEnums} from "../../enums/api-user-errors.enums";
import {Roles} from "../../../../guards/roles/role.decorator";
import {RoleGuard} from "../../../../guards/roles/role.guard";
import {UpdateAppointmentDto} from "../../models/dto/user-dtos/update-appointment.dto";
import {DeleteAppointmentDto} from "../../models/dto/user-dtos/delete-appointment.dto";
import {IsDeclinedInterface} from "../../models/interfaces/is-declined-interface";


@Injectable()
@Controller()
export class UserController {
    private readonly TAG: string = `${this.constructor.name}`;

    constructor(private readonly appLogger: ILogger,
                private readonly userProvider: UserProvider) {
        this.appLogger.log('Init', this.TAG);
    }

    @Get(`user`)
    @UseGuards(JwtAuthGuard)
    @ApiOperation({description: 'user'})
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'User is successfully gotten',
        type: UserDto,
    })
    @HttpCode(HttpStatus.BAD_REQUEST)
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: ApiUserErrorsEnums.FAILED_TO_GET_USER,
        type: MicroServiceError,
    })
    async getUser(@Headers() header): Promise<UserDto> {
        return this.userProvider.getUser(header.authorization);
    }
}
