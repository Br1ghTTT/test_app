import {IsBoolean, IsString} from "class-validator";

export class DeleteAppointmentDto  {
    @IsString()
    doctor_id: string;
    @IsBoolean()
    decline: boolean;
    @IsString()
    appointmentId: string;
}
