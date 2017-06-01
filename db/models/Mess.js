import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const MessSchema = new Schema({
    text: { type: String, required: true},
    user: { type: String, required: true}
});

const Mess = mongoose.model('Mess', MessSchema);
