const contactAnalytics = require("../models/historyTrackModel");
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
};

exports.createContactAnalyticsRecord = async (req, res) => {
    try {
        let {
            requesterId,
            requestedPostId,
            requesterWhatappNumber,
            postOwnerId,
            requestedPetname,
            requestedMode,
            requestedDateAndTime
        } = req.body;

        let createRecord = await contactAnalytics.create({
            requesterId,
            requestedPostId,
            requesterWhatappNumber,
            postOwnerId,
            requestedPetname,
            requestedMode,
            requestedDateAndTime
        })
        res.status(201).json(customizeResponse(true, 'Record created successfully', createRecord))
    } catch (error) {
        console.log("Error while creating analytics", error)
        res
        .status(500)
        .json(customizeResponse(false, "Error while creating analytics", error));
    }
};

exports.getContatactAnalytics = async (req, res) => {
    try {
        let { ownerId } = req.params;
        const records = await contactAnalytics.find({postOwnerId: ownerId});
        res
        .status(200)
        .json(customizeResponse(true, "Records fetched successfully", records));

    } catch (error) {
        console.log("Error while getting analytics", error)
        res
        .status(500)
        .json(customizeResponse(false, "Error while getting analytics", error));
    }
}