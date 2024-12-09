const handleDuplicateLead = async (collection, newData, insertedId) => {
    console.log("Checking if new data is a duplicate");
  
    // Check if mobile_phone value is already present in the collection, excluding the newly inserted document
    console.log("Checking for mobile_phone:", newData.mobile_phone);
    const existingData = await collection.findOne({
      mobile_phone: newData.mobile_phone,
      _id: { $ne: insertedId } // Exclude the newly inserted document
    });
  
    console.log("Existing data with same mobile_phone:", existingData);
  
    if (!existingData) {
      // Create a replica data with pageName changed to "leads"
      const replicaData = { ...newData, pageName: "leads" };
      delete replicaData._id; // Remove the _id field to avoid duplicate key error
      delete replicaData.enquiry_id; // Remove the _id field to avoid duplicate key error

      const lastLead = await collection.find({ pageName: "leads" }).sort({ lead_id: -1 }).limit(1).toArray();
      if (lastLead.length > 0) {
        const lastLeadId = lastLead[0].lead_id;
        const numericPart = parseInt(lastLeadId.slice(2)) + 1;
        const newLeadId = "LD" + numericPart;
        replicaData.lead_id = newLeadId;
      }

      await collection.insertOne(replicaData);
      console.log('New Lead inserted');
    }
  };
  
  module.exports = { handleDuplicateLead };