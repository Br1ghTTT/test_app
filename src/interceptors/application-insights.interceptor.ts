import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';


@Injectable()
export class ApplicationInsightsInterceptor implements NestInterceptor {
   intercept(context: ExecutionContext, next: CallHandler): any {
      return next.handle();
   }
}
