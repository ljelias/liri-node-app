require("dotenv").config();
var fs = require("fs");
var axios = require('axios');
var inquirer = require("inquirer");
var moment = require('moment');
var Spotify = require("node-spotify-api");

var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);


inquirer
  .prompt([
    {    // provide a list of actions to choose from
      type: "list",
      message: "Which search do you want to do?",
      choices: ["spotify-this-song", "concert-this", "movie-this", "do-what-it-says"],
      name: "type"
    },
    {    // a text prompt for the title or name
      type: "input",
      message: "What is the title or name? \n (for 'do-what-it-says' hit 'Enter')",
      name: "title"
    }
  ])
  .then(function(inquirerResponse) {
      console.log("\nProcessing your request: " + inquirerResponse.type + ", " + inquirerResponse.title);
      userSearchType = inquirerResponse.type;
      userSearchTitle = inquirerResponse.title.trim();
      userSearch(userSearchType, userSearchTitle);
    }
  );

function userSearch(userSearchType, userSearchTitle) {
    switch(userSearchType) {
    case "spotify-this-song": spotifyThis(userSearchTitle);
        break;
    case "concert-this": concertThis(userSearchTitle);
        break;
    case "movie-this": movieThis(userSearchTitle);
        break;
    case "do-what-it-says": doThis();
        break;
    default: console.log("your input is not recognized");
        break;
    }
}

function spotifyThis() {
    if (!userSearchTitle) {
        userSearchTitle = 'the sign by ace of base';
        console.log("\n Oops!! \n You did not enter a song name. \n I will choose one for you.");
    }
    console.log('\n---->>>Searching for: ' + userSearchTitle);

    spotify
      .search({ type: 'track', query: userSearchTitle, limit: 1})
      .then(function(response) {
        // console.log(response.tracks.items[0]);
        console.log('\nYOUR RESULTS:');
        console.log('Artist: ' + response.tracks.items[0].artists[0].name);
        console.log('Song: ' + response.tracks.items[0].name);
        console.log('Album: ' + response.tracks.items[0].album.name);
        console.log('Spotify link: ' + response.tracks.items[0].external_urls.spotify);
        fs.appendFileSync('log.txt', + "\n" + '*****MUSIC LOG*****' + "\r\n", 'utf8');
        fs.appendFileSync('log.txt', + "\n" + 'Artist: ' + response.tracks.items[0].artists[0].name + "\n", 'utf8');
        fs.appendFileSync('log.txt', + "\n" + 'Song: ' + response.tracks.items[0].name + "\n", 'utf8');
        fs.appendFileSync('log.txt', + "\n" + 'Album: ' + response.tracks.items[0].album.name + "\n", 'utf8');
        fs.appendFileSync('log.txt', + "\n" + 'Spotify link: ' + response.tracks.items[0].external_urls.spotify + "\n", 'utf8');
      })
      .catch(function(err) {
        console.log('Error: ' + err);
      })
}

function concertThis() {
    console.log('\n---->>>Searching for next show of: ' + userSearchTitle);
    axios.get('https://rest.bandsintown.com/artists/' + userSearchTitle + '/events?app_id=codingbootcamp')
    .then(function (response) {
          //console.log(response.data);
          for (i = 0; i < response.data.length; i++) {
            console.log('\nYOUR RESULTS: ');
            console.log('Venue: ' + response.data[i].venue.name);
            console.log('City: ' + response.data[i].venue.city + ", " + response.data[i].venue.region);
            console.log('Date and Time: ' + moment(response.data[i].datetime).format("MM/DD/YYYY HH:mm"));
            fs.appendFileSync('log.txt', + "\n" + '******CONCERT LOG******' + "\n", 'utf8');
            fs.appendFileSync('log.txt', + "\n" + 'Venue: ' + response.data[i].venue.name + "\n", 'utf8');
            fs.appendFileSync('log.txt', + "\n" + 'City: ' + response.data[i].venue.city + ", " + response.data[i].venue.region + "\n", 'utf8');
            fs.appendFileSync('log.txt', + "\n" + 'Date and Time: ' + moment(response.data[i].datetime).format("MM/DD/YYYY, HH:mm") + "\n", 'utf8');
          }
        })
}

function movieThis() {
    if (!userSearchTitle) {
        userSearchTitle = 'Shrek';
        console.log("\n Oops!! \n You did not enter a movie name. \n I would like to suggest the movie: Shrek");
    }
    console.log('\n---->>>Searching for: ' + userSearchTitle);
        
    axios.get("https://www.omdbapi.com/?t=" + userSearchTitle + "&apikey=trilogy")
        .then(function (response) {
          //console.log(response.data);
          console.log('\nYOUR RESULTS: ');
          console.log('Title: ' + response.data.Title);
          console.log('Released: ' + response.data.Year);
          console.log('Rated: ' + response.data.Rated);
          console.log('Genre: ' + response.data.Genre);
          console.log('Run Time: ' + response.data.Runtime);
          console.log('Rating: ' + response.data.imdbRating);
          console.log('Rotten Tomatoes Rating: ' + response.data.Ratings[1].Value);
          console.log('Country: ' + response.data.Country);
          console.log('Language:  ' + response.data.Language);
          console.log('Actors: ' + response.data.Actors);
          console.log('Plot: ' + response.data.Plot);
          fs.appendFileSync('log.txt', + "\n" + '******MOVIE LOG*****' + "\n", 'utf8');
          fs.appendFileSync('log.txt', + "\n" + 'Title: ' + response.data.Title + "\n", 'utf8');
          fs.appendFileSync('log.txt', + "\n" + 'Released: ' + response.data.Year  + "\n", 'utf8');
          fs.appendFileSync('log.txt', + "\n" + 'Rated: ' + response.data.Rated  + "\n", 'utf8');
          fs.appendFileSync('log.txt', + "\n" + 'Genre: ' + response.data.Genre  + "\n", 'utf8');
          fs.appendFileSync('log.txt', + "\n" + 'Run Time: ' + response.data.Runtime  + "\n", 'utf8');
          fs.appendFileSync('log.txt', + "\n" + 'Rating: ' + response.data.imdbRating  + "\n", 'utf8');
          fs.appendFileSync('log.txt', + "\n" + 'Rotten Tomatoes Rating: ' + response.data.Ratings[1].Value  + "\n", 'utf8');
          fs.appendFileSync('log.txt', + "\n" + 'Country: ' + response.data.Country  + "\n", 'utf8');
          fs.appendFileSync('log.txt', + "\n" + 'Language:  ' + response.data.Language  + "\n", 'utf8');
          fs.appendFileSync('log.txt', + "\n" + 'Actors: ' + response.data.Actors  + "\n", 'utf8');
          fs.appendFileSync('log.txt', + "\n" + 'Plot: ' + response.data.Plot  + "\n", 'utf8');
        })
        .catch(function (error) {
            console.log("Error: " + error);
        })
}

function doThis() {
    fs.readFile("random.txt", "utf8", function(error, data){
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");
        console.log(dataArr);
        userSearchType = dataArr[0];
        userSearchTitle = dataArr[1];
        userSearch(userSearchType, userSearchTitle); //call the function 
    });
}
