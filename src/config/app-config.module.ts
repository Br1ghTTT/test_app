import { Module } from '@nestjs/common';
import * as Joi from 'joi';

import { ConfigModule } from '@nestjs/config';
import appConfig from './app.config';
import { LoggerModule } from '../logger/logger.module';

@Module({
   imports: [
      ConfigModule.forRoot({
         envFilePath: ['production.env', '.staging.env', 'development.env'],
         load: [appConfig],
         validationSchema: Joi.object({
            NODE_ENV: Joi.string()
               .valid('development', 'production', 'staging')
               .default('development'),
            DB_HOST: Joi.string(),
            DB_PORT: Joi.number(),
            DB_USERNAME: Joi.string(),
            DB_PASSWORD: Joi.string(),
            DB_SCHEMA: Joi.string(),
         }),
         validationOptions: {
            abortEarly: true,
         },
      }),
      LoggerModule,
   ],
})
export class AppConfigModule {
}
