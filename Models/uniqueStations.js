const mongoose = require('mongoose');
const { required } = require('nodemon/lib/config');

const stationsSchema = new mongoose.Schema({
    uniqueStation: {
        type: String
    },
    longitude : {
        type: String
    },
    latitude : {
        type: String
    }
})

const stationsModel = mongoose.model('UniqueStations', stationsSchema);

module.exports = stationsModel;