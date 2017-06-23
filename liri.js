//=================================================================================================================
						//				variables set up
//=================================================================================================================

//intialize keys.js for spotify and twitter, packages: fs, request, spotify, twitter
var keys = require("./keys");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require('request');
var fs = require('fs');

//initialize client for Twitter API
var client = new Twitter ({
	consumer_key: keys.twitterKeys.consumer_key,
	consumer_secret: keys.twitterKeys.consumer_secret,
	access_token_key: keys.twitterKeys.access_token_key,
	access_token_secret: keys.twitterKeys.access_token_secret
});

//initialize parameters for Twitter request
var params = {screen_name: '@jagerhunter2', count: 5};

//initialize client for Spotify API
var spotify = new Spotify ({
	id: keys.spotifyKeys.clientId,
	secret: keys.spotifyKeys.clientSecret
});

//Capture user input on command line
var args = process.argv;
var command = process.argv[2];
console.log("Command: " + command);

//empty array for user input if more than 2 words
var input = [];

//for loop to push user input to input array
for (var i = 3; i < args.length; i++) {
	input.push(args[i]);
}

//join input array data at spaces
var userInput = input.join(" ");

console.log("User Input: " + userInput);


//========================================================================================================================
						//				functions set up
//========================================================================================================================


//spotify function
var spotifyFunction = function(){
	spotify.search ({ type: 'track', query: userInput, limit: 1}, function(err, data){
		if (err) {
			return console.log('Error occurred: ' + err);
		} else {
			console.log("Artist: " + JSON.stringify(data.tracks.items[0].artists[0].name, null, 2));
			console.log("Album Name: " + JSON.stringify(data.tracks.items[0].album.name, null, 2));
			console.log("Song Name: " + JSON.stringify(data.tracks.items[0].name, null, 2));
			if (data.tracks.items[0].preview_url === null){
				console.log("Preview Link: Sorry, there is not a preview link available for this song.");
			} else {
				console.log("Preview Link: " + JSON.stringify(data.tracks.items[0].preview_url, null, 2));
			}
		}
	});
};


//twitter function
var twitterFunction = function(){
	client.get('statuses/user_timeline', params, function(err, tweets, response ){
		if (err){
			return console.log('Error occurred: ' + JSON.stringify(err));
		} else {
			for (var i = 0; i < tweets.length; i++) {
				console.log("\n" + JSON.stringify(tweets[i].created_at + " : " + tweets[i].text));
			}
		}
	});
};


//omdb/request function
var omdbFunction = function(){
	//if user input is empty
	if(userInput == ""){
		request("http://www.omdbapi.com/?apikey=40e9cece&t=mr.nobody", function(err, response, body){
			if(err){
				return console.log('Error occured: ' + JSON.stringify(err));
			}
			let theMovie = JSON.parse(body);
			console.log("Title: " + (theMovie.Title));
			console.log("Year Released: " + theMovie.Year);
			console.log("IMDB Rating: " + theMovie.imdbRating);
			console.log("Country of Production: " + theMovie.Country);
			console.log("Language: " + theMovie.Language);
			console.log("Plot: " + theMovie.Plot);
			console.log("Actors: " + theMovie.Actors);
			console.log("Website: " + theMovie.Website);
		});
	} else {
		request("http://www.omdbapi.com/?apikey=40e9cece&t=" + userInput, function(err, response, body){
			if(err){
				return console.log('Error occured: ' + JSON.stringify(err));
			}
			let theMovie = JSON.parse(body);
			console.log("Title: " + (theMovie.Title));
			console.log("Year Released: " + theMovie.Year);
			console.log("IMDB Rating: " + theMovie.imdbRating);
			console.log("Country of Production: " + theMovie.Country);
			console.log("Language: " + theMovie.Language);
			console.log("Plot: " + theMovie.Plot);
			console.log("Actors: " + theMovie.Actors);
			console.log("Website: " + theMovie.Website);
		});
	}
};


//read file function/do-what-it-says
var doItFunction = function(){
	fs.readFile("random.txt", "utf8", function(error, data){
		if (error){
			return console.log("Error occured: " + error);
		} else {
			var pageInfo = data.split(",");

			let command = pageInfo[0];
			let userInput = pageInfo[1];

			spotify.search ({ type: 'track', query: userInput, limit: 1}, function(err, data){
				if (err) {
					return console.log('Error occurred: ' + err);
				} else {
					console.log("Artist: " + JSON.stringify(data.tracks.items[0].artists[0].name, null, 2));
					console.log("Album Name: " + JSON.stringify(data.tracks.items[0].album.name, null, 2));
					console.log("Song Name: " + JSON.stringify(data.tracks.items[0].name, null, 2));
					console.log("Preview Link: " + JSON.stringify(data.tracks.items[0].preview_url, null, 2));
				}
			});
		}
	});
}


//========================================================================================================================
							// 				if/else statement to run programs
//========================================================================================================================


//spotify
if(command == "spotify-this-song"){
	spotifyFunction();

//twitter
} else if (command == "my-tweets"){
	twitterFunction();

//omdb movie
} else if (command == "movie-this"){
	omdbFunction();

//do-what-it-says to return spotify of random.txt
} else if (command == "do-what-it-says"){
	doItFunction();

//default
} else {
	console.log("Please enter one of these commands: spotify-this-song, my-tweets, movie-this, or do-what-it-says")

}