const express = require('express')
const app = express()
const router = express.Router()
const Bus = require('../Models/buses')
const Route = require('../Models/srcAndDest')
const Loc = require('../Models/uniqueStations')
const { required } = require('nodemon/lib/config')

router.post("/add", async (req, resp) => {

    // For Check Bus Exist Or Not 
    const existingUser = await Bus.findOne({ bus: req.body.bus });
    if (existingUser) {
        return resp.status(400).json({ Error: "Bus Already Existing" });
    }

    // Get all objects of stations and check in req.body stations are repeate or not
    let stationsArray = req.body.stations;
    const mySet = new Set();
    for (const i of stationsArray) {
        if (mySet.has(i.busStation)) {
            return resp.status(404).json({ Message: "Repeat Station" })
        }
        mySet.add(i.busStation)
    }

    // Save Bus Data
    const data = new Bus(req.body);
    const busData = await data.save();

    // Add into UniqueStation Database
    // Loc
    const checkLoc = await Loc.find()
    const storeLoc = req.body.stations
    let storeArr = []

    // Check Stations are already exists or not
    for (const i of storeLoc) {
        let flag = false;
        for (const j of checkLoc) {
            if (j.uniqueStation == i.busStation) {
                flag = true
                break
            }
        }
        if (!flag) {
            storeArr.push({ uniqueStation: i.busStation, longitude: i.longitude, latitude: i.latitude })
        }
    }
    await Loc.insertMany(storeArr) // Save Unique Stations


    // Update in Route Collection
    // Set route of Bus
    const dataForRoute = await Bus.findOne({ bus: req.body.bus });

    let stationsForRoute = dataForRoute.stations;
    let index = 0;
    let numberOfStation = dataForRoute.stations.length - 1;

    let arr = []
    for (let i = 0; i < numberOfStation; i++) {
        if (index < numberOfStation) {
            let src = dataForRoute.stations[i].busStation;
            let dest = dataForRoute.stations[i + 1].busStation;

            const checkSrcAndDestOfRoute = await Route.findOne({ srcStation: src, destStation: dest });

            if (checkSrcAndDestOfRoute) {
                checkSrcAndDestOfRoute.busNumbers.push({ separateBus: req.body.bus });
                await checkSrcAndDestOfRoute.save()

            } else {
                const temp = {
                    srcStation: src,
                    destStation: dest,
                    busNumbers: [{ separateBus: req.body.bus }],
                }
                arr.push(temp)
            }
        }
    }
    await Route.insertMany(arr)
    return resp.status(200).json({ Message: "Added Successfully" })
})

router.get("/", async (req, res) => {
    const buses = (await Bus.find()).map(bus => bus.bus).sort();

    res.status(200)
    return res.json({ buses })
})
module.exports = router