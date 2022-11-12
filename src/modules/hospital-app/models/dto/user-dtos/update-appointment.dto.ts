import {IsBoolean, IsString} from "class-validator";

export class UpdateAppointmentDto {
    @IsString()
    doctor_id: string;
    @IsBoolean()
    activate: boolean;
    @IsString()
    appointmentId: string;
}
