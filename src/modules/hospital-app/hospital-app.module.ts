import {Module} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";

import {AppConfigModule} from '../../config/app-config.module';
import {GuardModule} from '../../guards/guard.module';
import {LoggerModule} from '../../logger/logger.module';
import {AuthController} from './controllers/auth-controller/auth.controller';
import {AuthProvider} from './providers/auth-provider/auth.provider';
import {AuthService} from './services/auth-service/auth.service';
import {UserService} from './services/user-service/user.service';
import {UserSchema} from "./models/schemas/user.schema";
import {DoctorSchema} from "./models/schemas/doctor.schema";
import {UserController} from "./controllers/user-controller/user.controller";
import {UserProvider} from "./providers/user-provider/user.provider";
import {AppointmentsSchema} from "./models/schemas/appointments.schema";
import {JwtStrategy} from "../../guards/auth/jwt.strategy";
import {TaskSchedulingService} from "./services/task-scheduling/task-scheduling.service";
import {AppointmentsController} from "./controllers/appointments-controller/appointments.controller";
import {AppointmentsProvider} from "./providers/appointments-provider/appointments.provider";
import {AppointmentsService} from "./services/appointments-service/appointments.service";


@Module({
    imports: [
        AppConfigModule,
        MongooseModule.forFeature(
            [
                {name: "User", schema: UserSchema},
                {name: "Doctor", schema: DoctorSchema},
                {name: "Appointment", schema: AppointmentsSchema}
            ]
        ),
        GuardModule,
        LoggerModule,
    ],
    controllers: [AuthController, UserController, AppointmentsController],
    providers: [
        JwtStrategy,
        AuthProvider,
        AuthService,
        UserService,
        UserProvider,
        AppointmentsProvider,
        AppointmentsService,
        TaskSchedulingService
    ],
    exports: [AuthService],
})
export class HospitalAppModule {
}
