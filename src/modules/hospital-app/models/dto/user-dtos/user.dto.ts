import { Document } from 'mongoose';

export class UserDto extends Document {
   user_id: string;
   email: string;
   password: string;
   name: string;
   phone: string;
   avatar: string;
   type: string;
   appointments: [];
}
