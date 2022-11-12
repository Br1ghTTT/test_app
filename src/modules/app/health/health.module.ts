import { TerminusModule } from '@nestjs/terminus';
import { Module } from '@nestjs/common';

import { HealthController } from './health.controller';
import { LoggerModule } from '../../../logger/logger.module';

@Module({
   controllers: [HealthController],
   imports: [TerminusModule, LoggerModule],
   providers: [],
})
export class HealthModule {
}
