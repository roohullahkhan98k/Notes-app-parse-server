import Parse from 'parse';

Parse.initialize("myAppId123");
Parse.serverURL = "http://localhost:1337/parse";
Parse.liveQueryServerURL = "ws://localhost:1337";

export default Parse;
