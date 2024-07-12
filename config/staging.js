// config/development.js

const config = {
  dbUrl:
    "mongodb+srv://raguworkiy:Ragu%401978@cluster0.qipjc4f.mongodb.net/crm-db?retryWrites=true&w=majority",
  MenuCollectionName: "menus", // Add your collection name here
  pagesCollectionName: "pages", // Add your collection name here
  webFormCollectionName: "webforms", // Add your collection name here
  usersCollectionName: "users",
  appdataCollectionName: "appdata",
  dashboardsCollectionName: "dashboards", // Add your collection name here
  controlsCollectionName: "controls",
};

module.exports = config;
