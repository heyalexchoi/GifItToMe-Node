var MongoClient = require('mongodb').MongoClient,
	Server = require('mongodb').Server,
	CollectionDriver = require('./collectionDriver').CollectionDriver;

var mongoHost = 'localHost'; //A
var mongoPort = 27017; 
var mongoClient = new MongoClient(new Server(mongoHost, mongoPort)); //B
var collectionDriver;

var DATABASE_NAME = 'MyDatabase';
//var COLLECTION_NAMES = ['gifs', 'gifs1', 'gifs2', 'gifs3'];


mongoClient.open(function(err, mongoClient) { //C
  if (!mongoClient) {
      console.error("Error! Exiting... Must start MongoDB first");
      process.exit(1); //D
  }
  var db = mongoClient.db(DATABASE_NAME);  //E
  collectionDriver = new CollectionDriver(db); //F
  
  COLLECTION_NAMES.forEach(function(collectionName) {
  	collectionDriver.getCollection(collectionName, function(error, collection) { 
  	if (collection) collection.drop();
  	else console.error('get collection error: ' + error);
  });
  });
  
});