import mongoose from "mongoose";

export const DoctorSchema = new mongoose.Schema({
    doctor_id: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: 'doc',
        require: true,
    },
    spec: {
        type: String,
        default: 'therapist',
        enum: ['therapist'],
        require: true,
    },
    free: {
        type: Boolean,
        default: true,
    },
    accepted_appointments: {
        type: Array
    }
});
