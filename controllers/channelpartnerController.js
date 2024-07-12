const config = require("../config/config"); // Ensure you have a config file with channelPartnerCollectionName

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
      console.log("result");
      console.log(result);

      // Check if the insert operation was successful
      const newChannelPartnerId = result.insertedId; // Retrieve the ObjectId of the newly inserted document
      // Get the batchFlagsCollection
      const batchFlagsCollection = req.db.collection(
        config.batchFlagsCollectionName
      );

      // Prepare the document to insert into batchFlagsCollection
      const batchFlagDocument = {
        channelPartnerId: newChannelPartnerId,
        mapped: "false",
        createdAt: new Date(), // Timestamp of when the document is created
        updatedAt: new Date(), // Timestamp of the last update, initially same as createdAt
        status: "pending", // Initial status of the batch flag
        processedCount: 0, // Number of times processed, initially 0
        errors: [], // Array to hold any processing errors
        // Add any other fields you need for the batchFlagDocument
      };

      // Insert the new document into batchFlagsCollection
      const batchFlagResult = await batchFlagsCollection.insertOne(
        batchFlagDocument
      );

      console.log("batchFlagResult");
      console.log(batchFlagResult);

      if (batchFlagResult.acknowledged) {
        console.log(
          "New ChannelPartnerId successfully added to batchFlagsCollection"
        );
      } else {
        console.error("Failed to add ChannelPartnerId to batchFlagsCollection");
      }
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
