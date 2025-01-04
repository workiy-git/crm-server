const config = require("../config/config"); // Ensure you have a config file with ivrCollectionName

const getIvrCollectionName = (req) => {
  return req.db.collection(config.ivrCollectionName);
};

const getMappingsCollection = (req) => {
  return req.db.collection(config.mappingsCollectionName);
};

const getAppDataCollection = (req) => {
  return req.db.collection(config.appdataCollectionName);
};

// Create new IVR data
const createIvr = async (req, res) => {
  try {
    const ivrData = {
      ...JSON.parse(req.body.data), // Parse the incoming data correctly
      receivedAt: new Date(),
    };

    const collection = getIvrCollectionName(req);
    const result = await collection.insertOne(ivrData);
    console.log("ivrData");
    console.log(result);

    if (result.acknowledged) {
      const mappingsCollection = getMappingsCollection(req);
      const appDataCollection = getAppDataCollection(req);

      const mappingResult = await createAppDataFromIvrData(
        ivrData,
        mappingsCollection,
        appDataCollection
      );

      if (mappingResult) {
        res.status(201).json(ivrData);
      } else {
        res.status(500).json({
          status: "error",
          message: "Failed to map IVR data to appdata",
        });
      }
    } else {
      res.status(500).json({
        status: "error",
        message: "Failed to create IVR data",
      });
    }
  } catch (error) {
    console.error("Error creating IVR data:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to create IVR data",
    });
  }
};

async function createAppDataFromIvrData(
  ivrData,
  mappingsCollection,
  appDataCollection
) {
  try {
    console.log("ivrData");
    const sourceJSON = ivrData;

    // Mapping JSON
    let mappingJSON = {};
    const mappingData = await mappingsCollection
      .find({ mapping_source: "ivr" })
      .toArray();
    if (mappingData.length > 0) {
      mappingJSON = mappingData[0];
    } else {
      console.log("No mapping data found for IVR");
    }

    // Destination JSON (initially empty or with some default values)
    let destinationJSON = {};

    // Update process
    for (const [newKey, oldKey] of Object.entries(mappingJSON)) {
      const skipKeys = ["_id", "mapping_source", "mapping_dest"];
      if (skipKeys.includes(newKey)) continue; // Skip _id, mapping_source, mapping

      if (sourceJSON.hasOwnProperty(oldKey)) {
        // Special case for dynamic values like new Date()
        destinationJSON[newKey] = sourceJSON[oldKey];
      } else {
        if (newKey === "pageName") {
          // Use the value from mappingJSON for pageName
          console.log(newKey, oldKey);
          destinationJSON[newKey] = "calls";
        } else if (newKey === "created_time") {
          destinationJSON[newKey] = new Date();
        } else {
          destinationJSON[newKey] = "";
        }
      }
    }

    const resultAppData = await appDataCollection.insertOne(destinationJSON);

    if (resultAppData.acknowledged) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
    return false; // Indicate failure
  }
}

module.exports = {
  createIvr,
};