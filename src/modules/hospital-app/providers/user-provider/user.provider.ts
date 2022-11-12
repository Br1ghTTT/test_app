import {Injectable} from '@nestjs/common';
import * as moment from "moment-timezone";
import {JwtService} from "@nestjs/jwt";

import {ILogger} from '../../../../logger/models/app-logger';
import {UserService} from '../../services/user-service/user.service';
import {UserDto} from "../../models/dto/user-dtos/user.dto";


moment.tz.setDefault('Europe/Kyiv');

@Injectable()
export class UserProvider {
    private readonly TAG: string = `${this.constructor.name}`;


    constructor(private readonly appLogger: ILogger,
                private readonly userService: UserService,
                private readonly jwtService: JwtService) {
        this.appLogger.log('Init', this.TAG);
    }

    async getUser(accessToken: string): Promise<UserDto> {
        this.appLogger.log('trying to decode access token', this.TAG);
        const decodedToken = await this.jwtService.decode(accessToken.split(' ').slice(1).join()) as any;
        this.appLogger.log('Access token is successfully decoded', this.TAG);
        this.appLogger.log(`trying to get user by id: ${decodedToken.id}`, this.TAG);
        const user = await this.userService.getUserById(decodedToken.id);
        this.appLogger.log(`user with id id: ${decodedToken.id} is successfully gotten`, this.TAG);
        return user;
    }
}
