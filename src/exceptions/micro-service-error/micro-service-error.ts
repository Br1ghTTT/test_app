import { HttpStatus } from '@nestjs/common';

export class MicroServiceError extends Error {

   public errorMessage: string;
   public httpStatus: HttpStatus;

   constructor(errorMessage: string, httpStatus: HttpStatus) {
      super();
      this.errorMessage = errorMessage;
      this.httpStatus = httpStatus;
   }
}
