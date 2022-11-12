import mongoose, {Schema} from "mongoose";

export const AppointmentsSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    date: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
    },
    user_id: {
        type: String,
        required: true
    },
    doctor_id: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
    ,
    doctor: {
        type: Schema.Types.ObjectId,
        ref: 'Doctor'
    }


});
