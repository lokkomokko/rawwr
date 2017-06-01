import mongoose from 'mongoose';
import '../models/Mess';


const Mess = mongoose.model('Mess');

export function setUpConnection() {
    mongoose.connect(`mongodb://admin:195934qeqe@chat-shard-00-00-p7f1d.mongodb.net:27017,chat-shard-00-01-p7f1d.mongodb.net:27017,chat-shard-00-02-p7f1d.mongodb.net:27017/chat?ssl=true&replicaSet=chat-shard-0&authSource=admin`);
}

export function listMess() {
    return Mess.find();
}

export function createMess(data) {
    const mess = new Mess ({
        text: data.text,
        user: data.user
    });
    return mess.save();
}

export function deleteMess(id) {
    return Mess.findById(id).remove();
}