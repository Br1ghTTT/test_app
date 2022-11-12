import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';


import { MicroServiceError } from './micro-service-error/micro-service-error';
import { MicroServiceErrorResponseInterface } from './interfaces/micro-service-error-response.interface';
import { MicroServiceExceptionUtil } from './utils/micero-service-exception.util';
import { ILogger } from '../logger/models/app-logger';

@Catch(Error)
export class MicroServiceExceptionFilter implements ExceptionFilter {

   private readonly TAG: string = `${this.constructor.name}`;

   constructor(private readonly appLogger: ILogger) {
   }

   catch(exception: any | {}, host: ArgumentsHost) {

      const ctx: HttpArgumentsHost = host.switchToHttp();
      const response = ctx.getResponse();

      let microServiceErrorResponse: MicroServiceErrorResponseInterface;

      if (exception instanceof MicroServiceError) {
         microServiceErrorResponse = MicroServiceExceptionUtil.buildMicroServiceErrorResponse(exception);
      } else {
         switch (exception.status) {
            case 400:
               microServiceErrorResponse = MicroServiceExceptionUtil.buildBadRequestErrorResponse(exception.response.message);
               break;
            case 401:
               microServiceErrorResponse = MicroServiceExceptionUtil.buildMicroServiceUnauthorizedErrorResponse();
               break;
            case 403:
               microServiceErrorResponse = MicroServiceExceptionUtil.buildMicroServiceForbiddenResponse();
               break;
            case 404:
               microServiceErrorResponse = MicroServiceExceptionUtil.buildNotFoundErrorResponse();
               break;
            case 413:
               microServiceErrorResponse = MicroServiceExceptionUtil.buildRequestTooLargeResponse();
               break;
            default:
               microServiceErrorResponse = MicroServiceExceptionUtil.buildUnknownErrorResponse();
         }
      }


      this.appLogger.error(exception.stack, this.TAG);
      this.appLogger.error(exception.response, this.TAG);

      const status: number = microServiceErrorResponse.statusCode ? microServiceErrorResponse.statusCode : HttpStatus.INTERNAL_SERVER_ERROR;
      response
         .status(status)
         .json({ error: microServiceErrorResponse });
   }

}
