import mongoose from 'mongoose';

const Log = new mongoose.Schema({
    Event: {
        type: String,
        default: ''
    },
    Time: {
        type: Date,
        default: Date.now()
    },
    Address: {
        type: String,
        default: ''
    },
    AddInfo: {
        type: String,
        default: ''
    }
});

export default mongoose.model('Log', Log, 'logs');
