import mongoose from 'mongoose';

const log = new mongoose.Schema({
    event: {
        type: String,
        default: ''
    },
    time: {
        type: Date,
        default: new Date()
    },
    address: {
        type: String,
        default: ''
    },
    addInfo: {
        type: String,
        default: ''
    }
});

export default mongoose.model('Log', log, 'logs');
