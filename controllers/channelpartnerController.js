const config = require('../config/config'); // Ensure you have a config file with channelPartnerCollectionName

const getChannelPartnerCollection = (req) => {
    return req.db.collection(config.channelPartnerCollectionName);
};

// Create new channel partner data
// Updated createChannelPartnerData function without ID in the response
const createChannelPartnerData = async (req, res) => {
    try {
        const channelPartnerData = {
            ...req.body,
            receivedAt: new Date(),
        };
        const collection = getChannelPartnerCollection(req);
        const result = await collection.insertOne(channelPartnerData);

        if (result.acknowledged) {
            res.status(201).json({
                status: "success",
                message: "Channel partner data created successfully",
            });
        } else {
            res.status(400).json({
                status: "fail",
                message: "Failed to create channel partner data",
            });
        }
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "An error occurred while creating channel partner data",
        });
    }
};

// New function to read all channel partner data
const readAllChannelPartnerData = async (req, res) => {
    try {
        const collection = getChannelPartnerCollection(req);
        const channelPartnerData = await collection.find({}).toArray();

        if (channelPartnerData.length > 0) {
            res.status(200).json({
                status: "success",
                data: channelPartnerData,
            });
        } else {
            res.status(404).json({
                status: "fail",
                message: "No channel partner data found",
            });
        }
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "An error occurred while reading channel partner data",
        });
    }
};
module.exports = { createChannelPartnerData, readAllChannelPartnerData };