const config = require('../config/config'); // Ensure you have a config file with channelPartnerCollectionName

const getChannelPartnerCollection = (req) => {
    return req.db.collection(config.channelPartnerCollectionName);
};

// Create new channel partner data
const createChannelPartnerData = async (req, res) => {
    try {
        const channelPartnerData = {
            ...req.body,
            receivedAt: new Date(),
        };
        const collection = getChannelPartnerCollection(req);
        const result = await collection.insertOne(channelPartnerData);

        if (result.acknowledged) {
            // For insertOne, use insertedId to get the ID of the inserted document
            const insertedDocument = await collection.findOne({ _id: result.insertedId });
            res.status(201).json({
                status: "success",
                data: insertedDocument,
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
module.exports = { createChannelPartnerData };