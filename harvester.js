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

  //my api key:
  //moVVtNDUEHbe8
  //public api key:
  //dc6zaTOxFJmzC

var COLLECTION_NAME = 'gifs';
var API_KEY = 'moVVtNDUEHbe8';

mongoClient.open(function(err, mongoClient) { //C
  if (!mongoClient) {
      console.error("Error! Exiting... Must start MongoDB first");
      process.exit(1); //D
  }
  var db = mongoClient.db("MyDatabase");  //E
  collectionDriver = new CollectionDriver(db); //F
  collectionDriver.collectionName = COLLECTION_NAME;
  collectionDriver.getCollection(collectionDriver.collectionName, function(error, collection) { 
  	if (collection) {
  		collection.ensureIndex( { "id": 1 }, { unique: true, dropDups: true }, function(error, outcome) {
        if (error) console.error(error);
        //else console.log(outcome);
      } );
  	} 
  	if (error) {
  		console.error('get collection error: ' + error);
  	}
  });
});

var Harvester = function() {
};



Harvester.prototype.getGifs = function(endpoint, params) {

	var self = this;
  params.api_key = API_KEY;

	var	url = "http://api.giphy.com/v1/gifs/" + endpoint + "?" + paramsToQueryString(params);

	request(url, function (error, response, body) {
  		
  		if (!error && response.statusCode == 200) {
  			var json = body;
  			var parsed = JSON.parse(body);
  			var data = parsed.data;

  			data.forEach(function(gif) {
    			self.saveGif(gif);
    		});
    			
  		} else {
  			console.error('error: ' + error);	
  		}
  
	});

	function paramsToQueryString(params) {
   	var ret = [];
   	for (var i in params)
    	  ret.push(encodeURIComponent(i) + "=" + encodeURIComponent(params[i]));
   	return ret.join("&");
	}
};

Harvester.prototype.saveGif = function(gif) {
	collectionDriver.save(collectionDriver.collectionName, gif, function(error, gif) {
    if (error) console.error(error);
    else console.log('saved gif: ' + gif.id + ' tags: ' + gif.tags);
  });
};

Harvester.prototype.harvestSearchTerm = function (searchTerm, pages) {
  var offsets = pages || 20;
  for (var offset = 0; offset < offsets; offset++) {
    var limit = 20;
    var params = {"q": searchTerm,
                "limit": limit,
                "offset": offset * limit};
    this.getGifs("search", params);
  }
};

//var harvester = new Harvester();
//harvester.harvestSearchTerm('trees');
exports.Harvester = Harvester;





