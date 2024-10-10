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
    console.log("channelPartnerData");
    console.log(result);
    if (result.acknowledged) {
      console.log("result");
      console.log(result);

      // Check if the insert operation was successful
      const newChannelPartnerId = result.insertedId; // Retrieve the ObjectId of the newly inserted document
      // Get the batchFlagsCollection
      const batchFlagsCollection = req.db.collection(
        config.batchFlagsCollectionName
      );
      const mappingsCollection = req.db.collection(
        config.mappingsCollectionName
      );
      const appDataCollection = req.db.collection(config.appdataCollectionName);

      // Prepare the document to insert into batchFlagsCollection
      const batchFlagResult = await addChannelPartnerToBatchFlagsCollection(
        batchFlagsCollection,
        newChannelPartnerId,
        mappingsCollection,
        channelPartnerData,
        appDataCollection
      );

      if (batchFlagResult) {
        res.status(201).json({
          status: "success",
          message: "Channel partner data created successfully",
        });
      } else {
        res.status(500).json({
          status: "error",
          message: "Failed to create channel partner data",
        });
      }
    } else {
      res.status(400).json({
        status: "fail",
        message: "Failed to create channel partner data",
      });
    }
  } catch (error) {
    console.error("Error:", error);
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

//Functional libraries

async function addChannelPartnerToBatchFlagsCollection(
  batchFlagsCollection,
  newChannelPartnerId,
  mappingsCollection,
  channelPartnerData,
  appDataCollection
) {
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
    console.log("createOrUpdateAppDataFromChannelPartnerData");
    // Assuming this is within an async function
    const result = await createOrUpdateAppDataFromChannelPartnerData(
      channelPartnerData,
      mappingsCollection,
      appDataCollection
    );
    if (result) {
      return true; // Return true if createappDataFromChannelPartnerData succeeded
    } else {
      return false; // Optionally handle the failure case
    }
  } else {
    console.error("Failed to add ChannelPartnerId to batchFlagsCollection");
    return false;
  }
}

async function createappDataFromChannelPartnerData(
  channelPartnerData,
  mappingsCollection,
  appDataCollection
) {
  // Extract the data you need from the channelPartnerData
  // Source JSON
  try {
    console.log("channelPartnerData");
    const sourceJSON = channelPartnerData;

    // Mapping JSON
    let mappingJSON = {};
    const mappingData = await mappingsCollection
      .find({ mapping_source: "channelPartner" })
      .toArray();
    if (mappingData.length > 0) {
      mappingJSON = mappingData[0];
    } else {
      console.log("No mapping data found for channelPartner");
    }

    // Destination JSON (initially empty or with some default values)
    let destinationJSON = {};

    // Update process
    for (const [newKey, oldKey] of Object.entries(mappingJSON)) {
      const skipKeys = ["_id", "mapping_source", "mapping_dest"];
      if (skipKeys.includes(newKey)) continue; // Skip _id, mapping_source, mapping
      //if (newKey === "_id") continue; // Skip adding _id to destinationJSON

      if (sourceJSON.hasOwnProperty(oldKey)) {
        // Special case for dynamic values like new Date()

        destinationJSON[newKey] = sourceJSON[oldKey];
      } else {
        if (newKey === "pageName") {
          // Use the value from mappingJSON for pageName
          console.log(newKey, oldKey);
          destinationJSON[newKey] = oldKey;
        } else if (newKey === "created_time") {
          destinationJSON[newKey] = new Date();
        } else {
          destinationJSON[newKey] = "";
        }
        // If oldKey is not available in sourceJSON, add newKey with an empty string
      }
    }
    // console.log("destinationJSON");
    // console.log(destinationJSON);
    // const destinationJSONString = JSON.stringify(destinationJSON);
    // console.log("destinationJSONString");
    // console.log(destinationJSONString);

    // let parsedJSON;
    // try {
    //   parsedJSON = JSON.parse(destinationJSONString);
    //   // console.log("parsedJSON");
    //   // console.log(parsedJSON);
    // } catch (error) {
    //   console.log("Error:", error);
    // }
    const resultappData = await appDataCollection.insertOne(destinationJSON);

    if (resultappData.acknowledged) {
      return true;
    } else {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error:", error);
    return false; // Indicate failure
  }
}

async function createOrUpdateAppDataFromChannelPartnerData(
  channelPartnerData,
  mappingsCollection,
  appDataCollection
) {
  try {
    console.log("channelPartnerData");
    const sourceJSON = channelPartnerData;
    console.log(sourceJSON);

    // Mapping JSON
    let mappingJSONCollection = [];
    const mappingData = await mappingsCollection
      .find({ mapping_source: "channelPartner" })
      .toArray();
    if (mappingData.length > 0) {
      mappingJSONCollection = mappingData;
    } else {
      console.log("No mapping data found for channelPartner");
    }

    for (const mappingJSON of mappingJSONCollection) {
      // Check if mobile_phone exists in appDataCollection
      const existingData = await appDataCollection.findOne({
        mobile_phone: sourceJSON.phone,
      });

      let destinationJSON = {};

      // Update process
      // for (const [newKey, oldKey] of Object.entries(mappingJSON)) {
      //   const skipKeys = ["_id", "mapping_source", "mapping_dest"];
      //   if (skipKeys.includes(newKey)) continue;

      //   if (sourceJSON.hasOwnProperty(oldKey)) {
      //     destinationJSON[newKey] = sourceJSON[oldKey];
      //   } else {
      //     if (newKey === "pageName") {
      //       destinationJSON[newKey] = mappingJSON.pageName;
      //     } else if (newKey === "created_time") {
      //       destinationJSON[newKey] = new Date();
      //     } else {
      //       destinationJSON[newKey] = "";
      //     }
      //   }
      // }

      if (existingData && mappingJSON.filter === "duplicate") {
        console.log(mappingJSON.pageName, mappingJSON.filter, " - Lead already exists");
        let destinationJSON = {};

        // Update process to enquiry for duplicate lead
        for (const [newKey, oldKey] of Object.entries(mappingJSON)) {
          // console.log("Keys in mappingJSON:", Object.keys(mappingJSON));
          const skipKeys = ["_id", "mapping_source", "mapping_dest"];
          if (skipKeys.includes(newKey)) continue;

          if (sourceJSON.hasOwnProperty(oldKey)) {
            destinationJSON[newKey] = sourceJSON[oldKey];
          } else {
            if (newKey === "pageName") {
              console.log("Assigning pageName:", mappingJSON.pageName);
              destinationJSON[newKey] = oldKey;
            } else if (newKey === "created_time") {
              destinationJSON[newKey] = new Date();
            } else if (newKey === "enquiry_status") {
              destinationJSON[newKey] = "Duplicate";
            } else {
              destinationJSON[newKey] = "";
            }
          }
        }

        // Fetch the last enquiry_id and increment it by 1
        const lastEnquiry = await appDataCollection.find({ pageName: "enquiry" }).sort({ enquiry_id: -1 }).limit(1).toArray();
            if (lastEnquiry.length > 0) {
              const lastEnquiryId = lastEnquiry[0].enquiry_id;
              const numericPart = parseInt(lastEnquiryId.slice(2)) + 1;
              const newEnquiryId = "EN" + numericPart;
              destinationJSON.enquiry_id = newEnquiryId;
            }

        // // Check if mobile_phone exists in appDataCollection with pageName="leads"
        // const existingData = await appDataCollection.findOne({
        //   mobile_phone: destinationJSON.mobile_phone,
        //   pageName: "leads",
        // });

        // if (existingData) {
        //   // Update re_engaged to true
        //   const updateResult = await appDataCollection.updateOne(
        //     { _id: existingData._id },
        //     { $set: { re_engaged: true } }
        //   );
        //   return updateResult.modifiedCount > 0;
        // } else {

        // Update re_engaged to "Yes" for the existing lead with pageName="leads"
        const updateResult = await appDataCollection.updateOne(
          { _id: existingData._id },
          { $set: { re_engaged: "Yes" } }
        );

        // Insert new data
        const resultappData = await appDataCollection.insertOne(
          destinationJSON
        );
        console.log(destinationJSON);
        return resultappData.acknowledged;
      } else if (mappingJSON.filter === "no duplicates") {
        console.log(mappingJSON.pageName, mappingJSON.filter, " - New lead");

        // Update process to leads for new lead
        for (const [newKey, oldKey] of Object.entries(mappingJSON)) {
          const skipKeys = ["_id", "mapping_source", "mapping_dest"];
          if (skipKeys.includes(newKey)) continue;
  
          if (sourceJSON.hasOwnProperty(oldKey)) {
            destinationJSON[newKey] = sourceJSON[oldKey];
          } else {
            if (newKey === "pageName") {
              destinationJSON[newKey] = mappingJSON.pageName;
            } else if (newKey === "created_time") {
              destinationJSON[newKey] = new Date();
            } else {
              destinationJSON[newKey] = "";
            }
          }
        }

        // Fetch the last lead_id and increment it by 1
        const lastLead = await appDataCollection.find({ pageName: "leads" }).sort({ lead_id: -1 }).limit(1).toArray();
          if (lastLead.length > 0) {
            const lastLeadId = lastLead[0].lead_id;
            const numericPart = parseInt(lastLeadId.slice(2)) + 1;
            const newLeadId = "LD" + numericPart;
            destinationJSON.lead_id = newLeadId;
          }

        // Insert new data for leads
        const resultappData = await appDataCollection.insertOne(destinationJSON);
        console.log(destinationJSON);

        // If the current mapping is for "leads", create another record for "enquiry"
        if (mappingJSON.pageName === "leads") {
          const enquiryMapping = mappingJSONCollection.find(m => m.pageName === "enquiry");
          if (enquiryMapping) {
            let enquiryJSON = {};
            for (const [newKey, oldKey] of Object.entries(enquiryMapping)) {
              const skipKeys = ["_id", "mapping_source", "mapping_dest"];
              if (skipKeys.includes(newKey)) continue;

              if (sourceJSON.hasOwnProperty(oldKey)) {
                enquiryJSON[newKey] = sourceJSON[oldKey];
              } else {
                if (newKey === "pageName") {
                  enquiryJSON[newKey] = enquiryMapping.pageName;
                } else if (newKey === "created_time") {
                  enquiryJSON[newKey] = new Date();
                } else if (newKey === "enquiry_status") {
                  enquiryJSON[newKey] = "New Lead";
                } else {
                  enquiryJSON[newKey] = "";
                }
              }
            }

            // Fetch the last enquiry_id and increment it by 1
            const lastEnquiry = await appDataCollection.find({ pageName: "enquiry" }).sort({ enquiry_id: -1 }).limit(1).toArray();
            if (lastEnquiry.length > 0) {
              const lastEnquiryId = lastEnquiry[0].enquiry_id;
              const numericPart = parseInt(lastEnquiryId.slice(2)) + 1;
              const newEnquiryId = "EN" + numericPart;
              enquiryJSON.enquiry_id = newEnquiryId;
            }

            const resultEnquiryData = await appDataCollection.insertOne(enquiryJSON);
            console.log(enquiryJSON);
          }
        }
        return resultappData.acknowledged;
      }
    }
    return true;
  } catch (error) {
    console.error("Error:", error);
    return false; // Indicate failure
  }
}

module.exports = { createChannelPartnerData, readAllChannelPartnerData };
