import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Application')
@Controller('health')
export class HealthController {
   constructor() {
   }

   @Get()
   @HttpCode(HttpStatus.OK)
   @ApiResponse({
      status: HttpStatus.OK,
   })
   async healthCheck(): Promise<number> {
      return HttpStatus.OK;
   }
}
