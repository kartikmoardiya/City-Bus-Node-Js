const express = require('express')
const app = express()
const router = express.Router()
const Bus = require('../Models/buses')
const Route = require('../Models/srcAndDest')
const Loc = require('../Models/uniqueStations')
function transformData(input) {
    // Initialize an empty object to store the transformed data
    const transformedData = {};

    // Loop through each object in the input data
    input.forEach(item => {
        // If the destination station is not yet in the transformed data, initialize it
        if (!transformedData[item.destStation]) {
            transformedData[item.destStation] = { destStation: item.destStation, busNumbers: [] };
        }

        // Merge and union the busNumbers arrays
        const existingBusNumbers = new Set(transformedData[item.destStation].busNumbers.map(bus => bus.separateBus));
        item.busNumbers.forEach(bus => {
            if (!existingBusNumbers.has(bus.separateBus)) {
                transformedData[item.destStation].busNumbers.push(bus);
                existingBusNumbers.add(bus.separateBus);
            }
        });
    });

    // Convert the object into an array of values
    const result = Object.values(transformedData);
    
    return result;
}
  
let u = 0
let tmp = {}
const getPath = async (source, dest, allData) => {
    const q = [];
    const adj = {};
    const vis = {};
    const parent = {};

    q.push(source);
    parent[source] = "-1";
    vis[source] = true;

    let checkHelper = [];
    let checkHelper2 = [];
    let isCheckSrcAndDest = []
    let supporterHelp = []

    while (q.length !== 0) {
        const front = q.shift();

        // Get Data from database 
        for (const i of allData) {
            if (i.srcStation == front) {
                isCheckSrcAndDest.push({ destStation: i.destStation, busNumbers: i.busNumbers })
            }
            if (i.destStation == front) {
                isCheckSrcAndDest.push({ destStation: i.srcStation, busNumbers: i.busNumbers })
            }
        }

        // For create One Object Array
        let adjHelper = []
        for (const i of isCheckSrcAndDest) {

            adjHelper.push({ destStation: i.destStation })
            checkHelper.push(i)
        }

        // Process to Get Parent of Child
        adj[front] = adjHelper
        for (const i of adj[front]) {
            if (vis[i.destStation] === undefined) {
                vis[i.destStation] = true;
                parent[i.destStation] = front;
                q.push(i.destStation);
            }
        }
    }

    // // Sort the array based on destStation and then by the size of busNumbers
    checkHelper.sort((a, b) => {
        // First, compare destStation values
        let destStationComparison = a.destStation.localeCompare(b.destStation);
        // If destStation values are equal, compare busNumbers array lengths
        if (destStationComparison === 0) {
            return b.busNumbers.length - a.busNumbers.length; // Sort by busNumbers size in descending order
        }
        return destStationComparison; // Sort by destStation value
    });
    checkHelper2 = transformData(checkHelper)
    console.log(checkHelper2)

    const path = [];
    let bcurrent = dest;

    // console.log(checkHelper)
    while (bcurrent !== undefined && bcurrent !== '-1') {
        for (const i of checkHelper2) {
            if (i.destStation == bcurrent) {
                path.push(i)
                break;
            }
        }
        bcurrent = parent[bcurrent];
    }
    path.reverse()

    return path
}

router.post('/path', async (req, res) => {
    let allData = await Route.find()

    const source = req.body.src;
    const destination = req.body.dest;

    const data = await getPath(source, destination, allData)

    let path = data.map(obj => ({ destStation: obj.destStation, busNumbers: obj.busNumbers.map(bus => (bus.separateBus)) }))

    // let path = data
    return res.json({
        path
    });
});

module.exports = router
