import { Injectable, Scope } from '@nestjs/common';
import * as winston from 'winston';
import { format } from 'winston';

import { ILogger } from './models/app-logger';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger implements ILogger {
   private logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'debug',
      defaultMeta: {
         context: 'NestJS',
         service: process.env.SERVICE_NAME || 'Unknown-Service',
      },
      format: winston.format.combine(winston.format.timestamp(), format.splat()),
      transports: [
         new winston.transports.Console({
            format: format.combine(
               format.colorize(),
               format.printf(
                  ({ level, message, context, timestamp }) =>
                     `${timestamp} [${context}] ${level}: ${message}`,
               ),
            ),
         }),
      ],
   });

   public error(message: string, tag: string): void {
      this.setContext(tag);
      this.logger.error(message);
   }

   public log(message: string, tag: string) {
      this.setContext(tag);
      this.logger.info(message);
   }

   public warn(message: string, tag: string) {
      this.setContext(tag);
      this.logger.warn(message);
   }

   public debug(message: string, tag: string) {
      this.setContext(tag);
      this.logger.debug(message);
   }

   public setContext(context: string): void {
      this.logger.defaultMeta = { ...this.logger.defaultMeta, context };
   }

}
