// config/development.js

const config = {
  dbUrl: "mongodb+srv://crmstag:Workiy2024@workiycrm.9gr0e.mongodb.net/crm-stag?retryWrites=true&w=majority&appName=workiyCRM",
  MenuCollectionName: "menus", // Add your collection name here
  pagesCollectionName: "pages", // Add your collection name here
  webFormCollectionName: "webforms", // Add your collection name here
  usersCollectionName: "users",
  appdataCollectionName: "appdata",
  channelPartnerCollectionName: "channelPartner", // Add your collection name here
  dashboardsCollectionName: "dashboards", // Add your collection name here
  controlsCollectionName: "controls",
  mappingsCollectionName: "mappings",
  mappingSummaryCollectionName: "mappingSummary",
  batchFlagsCollectionName: "batchFlags",
};

module.exports = config;
