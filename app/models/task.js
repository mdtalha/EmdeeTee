var mongoose = require('mongoose');

var TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,

    },
    _userId: {
        //type: mongoose.Types.ObjectId,
       // required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});



module.exports = mongoose.model('Task', TaskSchema);