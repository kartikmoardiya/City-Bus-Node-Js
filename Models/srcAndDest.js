const mongoose = require('mongoose')

const routeSchema = new mongoose.Schema({
    srcStation: {
        type: String,
        require: true
    },
    destStation: {
        type: String,
        require: true
    },
    busNumbers: [
        {
            separateBus: {
                type: String,
                require: true
            }
        }
    ]
})

const routeModel = mongoose.model('SrcAndDest', routeSchema);

module.exports = routeModel;