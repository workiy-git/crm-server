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
      await collection.insertOne(replicaData);
      console.log('New Lead inserted');
    } else {
      console.log('This is a duplicated lead');
    }
  };
  
  module.exports = { handleDuplicateLead };