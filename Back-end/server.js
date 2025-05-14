const express = require('express');
const http = require('http');
const { ParseServer } = require('parse-server');
const { ParseLiveQueryServer } = require('parse-server');


const app = express();
const httpServer = http.createServer(app);

const api = new ParseServer({
  databaseURI: 'mongodb://localhost:27017/parse-db',
  cloud: './cloud/main.js',
  appId: 'myAppId123',
  masterKey: 'myMasterKey123',
  serverURL: 'http://localhost:1337/parse',
  publicServerURL: 'http://localhost:1337/parse',
  allowClientClassCreation: true,
  liveQuery: {
    classNames: ['Notification'], 
  },
});

const createAdminUser = async () => {
  const query = new Parse.Query(Parse.User);
  query.equalTo("role", "admin");
  const adminUser = await query.first({ useMasterKey: true });

  if (!adminUser) {
    const admin = new Parse.User();
    admin.set("username", "admin@gmail.com");
    admin.set("email", "admin@gmail.com");
    admin.set("password", "admin123");
    admin.set("role", "admin");
    await admin.signUp();
    console.log("Admin user created");
  } else {
    console.log("Admin user already exists");
  }
};

createAdminUser();

app.use('/parse', api);

httpServer.listen(1337, () => {
  console.log('parse is running and the live query is also working');
});

ParseServer.createLiveQueryServer(httpServer);
