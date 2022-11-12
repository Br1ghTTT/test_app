import { HttpStatus } from '@nestjs/common';

import { MicroServiceError } from '../micro-service-error/micro-service-error';
import { MicroServiceErrorResponseInterface } from '../interfaces/micro-service-error-response.interface';
import { ErrorMap } from '../micro-service-error/error-map';

export const MicroServiceExceptionUtil = {
   buildMicroServiceErrorResponse(exception: MicroServiceError): MicroServiceErrorResponseInterface {
      return {
         statusCode: exception.httpStatus,
         errorMessage: exception.errorMessage,
      };
   },
   buildUnknownErrorResponse(): MicroServiceErrorResponseInterface {
      return {
         statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
         errorMessage: ErrorMap.UNKNOWN_ERROR,
      };
   },
   buildMicroServiceUnauthorizedErrorResponse(): MicroServiceErrorResponseInterface {
      return {
         statusCode: HttpStatus.UNAUTHORIZED,
         errorMessage: ErrorMap.TOKEN_IS_EXPIRED,
      };
   },

   buildMicroServiceForbiddenResponse(): MicroServiceErrorResponseInterface {
      return {
         statusCode: HttpStatus.FORBIDDEN,
         errorMessage: ErrorMap.FORBIDDEN_RESOURCE,
      };
   },

   buildNotFoundErrorResponse(): MicroServiceErrorResponseInterface {
      return {
         statusCode: HttpStatus.NOT_FOUND,
         errorMessage: ErrorMap.PAGE_NOT_FOUND,
      };
   },

   buildBadRequestErrorResponse(message: []): MicroServiceErrorResponseInterface {
      return {
         statusCode: HttpStatus.BAD_REQUEST,
         errorMessage: message,
      };
   },

   buildRequestTooLargeResponse(): MicroServiceErrorResponseInterface {
      return {
         statusCode: HttpStatus.PAYLOAD_TOO_LARGE,
         errorMessage: ErrorMap.PAYLOAD_TOO_LARGE,
      };
   },
};
