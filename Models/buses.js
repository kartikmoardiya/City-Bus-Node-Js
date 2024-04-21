const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
    bus : {
        type : String,
        required : true
    },
    stations : [
        {
            busStation : {
                type : String,
                required : true
            },
            longitude: {
                type: String
            },
            latitude: {
                type: String
            }
        }
    ]
})

const busModel = mongoose.model('Buses', busSchema);

module.exports = busModel;