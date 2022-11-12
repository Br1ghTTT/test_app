import {Injectable} from '@nestjs/common';
import {Cron, CronExpression} from "@nestjs/schedule";
import moment = require("moment-timezone");

import {ILogger} from '../../../../logger/models/app-logger';
import {AppointmentsService} from "../appointments-service/appointments.service";

moment.tz.setDefault('Europe/Kyiv');
moment.suppressDeprecationWarnings = true;

@Injectable()
export class TaskSchedulingService {
    private readonly TAG: string = `${this.constructor.name}`;


    constructor(
        private readonly appLogger: ILogger,
        private readonly appointmentsService: AppointmentsService
    ) {
        this.appLogger.log('Init', this.TAG);
    }

    //todo probably here we will be needed oneSignal for send notifications
    @Cron(CronExpression.EVERY_DAY_AT_NOON)
    async checkForActiveAppointmentsForADay() {
        this.appLogger.log(`Trying to get appointments`, this.TAG);
        const appointments = await this.appointmentsService.getAppointments();
        this.appLogger.log(`Getting current data`, this.TAG);
        const currentData = moment(moment().toISOString().split('T')[0]);
        this.appLogger.log(`Outputting notifications:`, this.TAG);
        await appointments.map(r => {
            if (moment(moment(r.date).toISOString().split('T')[0]).diff(currentData, 'days') === 1) {
                this.appLogger.log(
                    `${moment().format('LLL')}. Привіт ${r.user.name}! Нагадуємо, що Ви записані до ${r.doctor.spec} на ${r.date.split(',')[0]}`,
                    this.TAG);
            }
            return;
        })
        return;
    }

    //todo probably here we will be needed oneSignal for send notifications
    @Cron(CronExpression.EVERY_10_MINUTES)
    async checkForActiveAppointmentsForAnHours() {
        this.appLogger.log(`Trying to get appointments`, this.TAG);
        const appointments = await this.appointmentsService.getAppointments();
        this.appLogger.log(`Outputting notifications if their exists`, this.TAG);
        await appointments.map(r => {
            if (moment().seconds(0).milliseconds(0).add(2, 'hours').valueOf() === moment(r.date).valueOf()) {
                this.appLogger.log(
                    `${moment().format('LLL')}. Привіт ${r.user.name}! Вам через 2 години до ${r.doctor.spec} в ${r.date.split(' ')[3]}`,
                    this.TAG);
            }
            return;
        })
        return;
    }
}

