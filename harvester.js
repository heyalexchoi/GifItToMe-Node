var MongoClient = require('mongodb').MongoClient,
	Server = require('mongodb').Server,
	CollectionDriver = require('./collectionDriver').CollectionDriver,
	bodyParser = require('body-parser'),
	request = require('request');
	// do i need body-parser?

var mongoHost = 'localHost'; //A
var mongoPort = 27017; 
var mongoClient = new MongoClient(new Server(mongoHost, mongoPort)); //B
var collectionDriver;

mongoClient.open(function(err, mongoClient) { //C
  if (!mongoClient) {
      console.error("Error! Exiting... Must start MongoDB first");
      process.exit(1); //D
  }
  var db = mongoClient.db("MyDatabase");  //E
  collectionDriver = new CollectionDriver(db); //F
});


var Harvester = function() {
};



Harvester.prototype.getGifs = function() {

	var self = this;
	var	url = "http://api.giphy.com/v1/gifs/search?q=funny+cat&api_key=dc6zaTOxFJmzC";
	
	request(url, function (error, response, body) {
  		
  		if (!error && response.statusCode == 200) {
  			var json = body;
  			var parsed = JSON.parse(body);
  			var data = parsed.data;

  			data.forEach(function(gif) {
    			self.saveGif(gif);
    		});
    			
  		} else {
  			console.error(error);	
  		}
  
	});
};

Harvester.prototype.saveGif = function(gif) {
	collectionDriver.save("gifs", gif, this.logOutcome);
};

Harvester.prototype.logOutcome = function (error, response) {
	if (error) {
		console.error("error: " + error);
	} else {
		console.log("response: " + response);
	}
};

var harvester = new Harvester();
harvester.getGifs();
//collectionDriver.save("gifs", {"lol":"lol"}, harvester.logOutcome);





