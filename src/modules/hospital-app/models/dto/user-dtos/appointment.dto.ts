import { Document } from 'mongoose';

export class AppointmentDto extends Document {
    id: string;
    user_id: string;
    doctor_id: string;
    active: boolean;
    date: string;
    user: {};
    doctor: {};
}
