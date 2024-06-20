const store = require("../models/storeData");
const { customizeResponse } = require("../utils/customResponse");

exports.isUpdateAvailable = async (req, res) => {
    try {
        let update = await store.find({});
        console.log("update==>", update);
        res
    .status(200)
    .json(customizeResponse(true, "Fetched store data", update));
        
    } catch (error) {
        console.log("Error while getting info from store model", error)
    res
    .status(500)
    .json(customizeResponse(false, "Error while getting info from store model", error));
    }
};

exports.createStoreData = async (req, res) => {
    try {
        let storeData = await store.create({isForceUpdateEnable : false});
        res
        .status(201)
        .json(customizeResponse(true, "Create a new store data", storeData));
        
    } catch (error) {
        console.log("Error while getting info from store model", error)
    res
    .status(500)
    .json(customizeResponse(false, "Error while getting info from store model", error));
    }
}