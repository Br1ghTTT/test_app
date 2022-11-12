import mongoose, {Schema} from "mongoose";

export const UserSchema = new mongoose.Schema({
    user_id: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    avatar: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: 'user'
    },
    appointments:
        {
            type: Schema.Types.ObjectId,
            ref: 'Appointment'
        }

});
