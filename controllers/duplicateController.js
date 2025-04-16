const handleDuplicateLead = async (collection, newData, insertedId) => {
  console.log("Checking if new data is a duplicate");
 
  // Check if the mobile_phone already exists (excluding the current inserted doc)
  console.log("Checking for mobile_phone:", newData.mobile_phone);
  const existingData = await collection.findOne({
    mobile_phone: newData.mobile_phone,
    _id: { $ne: insertedId }
  });
 
  console.log("Existing data with same mobile_phone:", existingData);
 
  if (!existingData) {
    // Create a new lead document
    const replicaData = { ...newData, pageName: "leads" };
    delete replicaData._id;
    delete replicaData.enquiry_id;
 
    // Generate unique lead_id
    const lastLead = await collection
      .find({ pageName: "leads", lead_id: { $regex: /^LD\d+$/ } })
      .sort({ lead_id: -1 })
      .limit(1)
      .toArray();
 
    if (lastLead.length > 0 && lastLead[0].lead_id) {
      const lastLeadId = lastLead[0].lead_id;
      const numericPart = parseInt(lastLeadId.slice(2)) + 1;
      replicaData.lead_id = "LD" + numericPart;
    } else {
      replicaData.lead_id = "LD1001"; // default starting point
    }
 
    // Add history entry for creation
    const currentTime = new Date();
    replicaData.history = [
      {
        updated_at: currentTime,
        updated_by: newData.created_by || "System",
        updated_by_id: newData.created_by_id || "",
        updated_by_time_zone: "UTC",
        changes: {
          created: {
            new: "Lead created"
          }
        }
      }
    ];
 
    await collection.insertOne(replicaData);
    console.log("New Lead inserted with lead_id and creation history");
  }
};
 
module.exports = { handleDuplicateLead };