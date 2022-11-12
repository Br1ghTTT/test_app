import { Module } from '@nestjs/common';

import { AppLogger } from './logger';
import { ILogger } from './models/app-logger';

@Module({
   providers: [
      {
         provide: ILogger,
         useClass: AppLogger,
      },
   ],
   exports: [ILogger],
})
export class LoggerModule {
}
