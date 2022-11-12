import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { TypeOrmConnectionManagerService } from '../../database/type-orm-connection-manager.service';
import { ILogger } from '../../logger/models/app-logger';

@Injectable()
export class ConnectionManagerGuard implements CanActivate {
   private readonly TAG: string = `${this.constructor.name}`;

   constructor(private readonly appLogger: ILogger) {
      this.appLogger.log('Init', this.TAG);
   }

   async canActivate(context: ExecutionContext): Promise<boolean> {
      try {
         if (TypeOrmConnectionManagerService.isConnection) {
            this.appLogger.debug('Reconnecting driver to the DB are in progress', this.TAG);
            await TypeOrmConnectionManagerService.reconnectionPromise;
         }
      } catch (e) {
         this.appLogger.error(e, this.TAG);
      }
      return true;
   }
}
