import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';

import { PayloadInterface } from '../../shared/interaces/payload.interface';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
   constructor() {
      super({
         secretOrKey: process.env.SECRET,
         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
         ignoreExpiration: false,
      });
   }

   async validate(payload: PayloadInterface) {
      return {
         id: payload.user_id,
         email: payload.email,
      };
   }
}
