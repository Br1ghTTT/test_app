import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import {MongooseModule} from "@nestjs/mongoose";
import { ScheduleModule } from '@nestjs/schedule';

import { MicroServiceExceptionFilter } from './exceptions/micro-service-exception.filter';
import { TimeoutInterceptor } from './interceptors/timeout.interceptor';
import { ApplicationInsightsInterceptor } from './interceptors/application-insights.interceptor';
import { CacheInterceptor } from './interceptors/cache.interceptor';
import { SharedModule } from './shared/shared.module';
import { HealthModule } from './modules/app/health/health.module';
import { HospitalAppModule } from './modules/hospital-app/hospital-app.module';
import { LoggerModule } from './logger/logger.module';
import MongoConfig from './config/mongo-config';
import {AppConfigModule} from "./config/app-config.module";


@Module({
   imports: [
      SharedModule,
      HealthModule,
      AppConfigModule,
      LoggerModule,
      HospitalAppModule,
      MongooseModule.forRootAsync({
          useClass: MongoConfig
      }),
      ScheduleModule.forRoot(),
   ],
   controllers: [],
   providers: [
      {
         provide: APP_FILTER,
         useClass: MicroServiceExceptionFilter,
      },
      {
         provide: APP_INTERCEPTOR,
         useClass: CacheInterceptor,
      },
      {
         provide: APP_INTERCEPTOR,
         useClass: TimeoutInterceptor,
      },
      {
         provide: APP_INTERCEPTOR,
         useClass: ApplicationInsightsInterceptor,
      },
   ],
})
export class AppModule {
}
