import {Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';

import {LoggerModule} from '../logger/logger.module';
import {AppConfigModule} from "../config/app-config.module";


@Module({
    imports: [
        AppConfigModule,
        LoggerModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.SECRET,
            signOptions: {expiresIn: process.env.EXPIRE},
        }),
    ],
    controllers: [],
    providers: [],
    exports: [JwtModule, PassportModule],

})

export class GuardModule {
}
