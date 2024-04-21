const express = require('express')
const app = express()
const router = express.Router()
const Bus = require('../Models/buses')
const Loc = require('../Models/uniqueStations')
const { route } = require('./path')

// Get All Station
router.get("/", async (req, resp) => {
    const allStations = (await Loc.find()).map(obj => obj.uniqueStation).sort();

    return resp.status(200).json({allStations:allStations})
})

// Get All Station Corresponding to the bus and get longitude and latitude
router.get("/:bus", async (req, resp) => {
    const busStations = await Bus.find({ bus: req.params.bus });
    return resp.status(200).json({
        busStations : busStations[0]
    })
    // }
    return resp.status(404).json({
        Error: "Bus Not Found Internal Server Problem"
    })
})
module.exports = router