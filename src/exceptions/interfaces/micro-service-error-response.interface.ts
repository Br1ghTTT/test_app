import { HttpStatus } from '@nestjs/common';

export interface MicroServiceErrorResponseInterface {
   statusCode: HttpStatus;
   errorMessage: string | [];
}
