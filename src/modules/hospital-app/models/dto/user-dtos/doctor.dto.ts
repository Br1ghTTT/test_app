import {Document} from 'mongoose';

export class DoctorDto extends Document {
    doctor_id: string;
    email: string;
    password: string;
    name: string;
    phone: string;
    avatar: string;
    type: string;
    free: boolean;
    spec: string;
    accepted_appointments: [];
}
