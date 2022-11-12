import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserService } from '../../modules/hospital-app/services/user-service/user.service';

@Injectable()
export class RoleGuard implements CanActivate {
   constructor(private reflector: Reflector,
               private readonly userService: UserService) {
   }

   async canActivate(context: ExecutionContext): Promise<boolean> {
      const roles = this.reflector.get<string[]>('roles', context.getHandler());
      const request = context.switchToHttp().getRequest();
      if (request.headers.authorization) {
         const user = await this.userService.getDoctorById(request.headers.authorization.split(' ')[1]);
         if(!user) {
            return false;
         }
         return roles.includes(user.type?.toLowerCase());
      }
      return false;
   }
}
