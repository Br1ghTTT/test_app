import { IsString } from 'class-validator';

export class CreateAppointmentDto {
    @IsString()
    user_id: string;
    @IsString()
    doctor_id: string;
    @IsString()
    date: string;
}
