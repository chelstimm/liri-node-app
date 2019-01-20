require("dotenv").config();

var Spotify = require('node-spotify-api');

var keys = require("./keys.js");

var request = require("request");

var moment = require('moment');
moment().format();

var fs = require('fs');


var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret,
});

var SpotifyAPI = function (song) {
    if (song === undefined) {
        song = "the sign ace of base";
    }
    spotify.search(
        {
            type: "track",
            query: song,
            limit: 3
        },
        function (err, data) {
            if (err) {
                console.log("Error occurred: " + err);
                return;
            }
            var songs = data.tracks.items;
            for (var i = 0; i < songs.length; i++) {
                console.log("\n-------------------------------------------------\n" +
                    "\nArtist name: \n" + songs[i].artists[0].name +
                    "\nSong title: \n" + songs[i].name +
                    "\nTrack number: \n" + songs[i].track_number +
                    "\nAlbum: \n" + songs[i].album.name +
                    "\nRelease date: \n" + songs[i].album.release_date +
                    "\nAlbum type: \n" + songs[i].album.album_type +
                    "\nPreview song: \n" + songs[i].preview_url +
                    "\n-------------------------------------------------\n")
            }
        }
    );
};

var OMDBAPI = function (movie) {
    if (movie === undefined) {
        movie = "Mr. Nobody";
        console.log('-------------------------------------------------');
        console.log("If you haven't watched Mr Nobody, then you should. It's on Netflix!");
    }
    var URL =
        "http://www.omdbapi.com/?t=" + movie + "&y=&plot=full&tomatoes=true&apikey=trilogy";
    request(URL, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var body = JSON.parse(body);
            console.log('\n-------------------------------------------------\n' +
                "\nTitle: " + body.Title +
                "\nYear: \n" + body.Year +
                "\nRated: \n" + body.Rated +
                "\nIMDB Rating: \n" + body.imdbRating +
                "\nRotton Tomatoes Rating: \n" + body.Ratings[1].Value +
                "\nCountry: \n" + body.Country +
                "\nLanguage: \n" + body.Language +
                "\nPlot: \n" + body.Plot +
                "\nActors: \n" + body.Actors +
                '\n-------------------------------------------------\n')
        }
    });
};


var BANDSAPI = function (artist) {
    if (artist === undefined) {
        artist = "Backstreet Boys";
    }

    var URL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    request(URL, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var data = JSON.parse(body);
            for (var i = 0; i < data.length; i++) {
                console.log('\n-------------------------------------------------\n' +
                    "\nLineup: \n" + data[i].lineup +
                    "\nVenue: \n" + data[i].venue.name +
                    "\nCity: \n" + data[i].venue.city +
                    "\nCountry: \n" + data[i].venue.country);
                var date = data[i].datetime;
                var time = data[i].datetime;
                time = moment(time).format("h:mm a");
                date = moment(date).format("MM/DD/YYYY");
                console.log("concert starts at: " + date + "  " + time)
            }
        }
    });
};


//switch case
var userInput = function (caseData, functionData) {
    switch (caseData) {

        case "spotify-this-song":
            SpotifyAPI(functionData);
            break;

        case "movie-this":
            OMDBAPI(functionData);
            break;

        case "concert-this":
            BANDSAPI(functionData);
            break;

        case "do-what-it-says":
            doWhatItSays();
            break;
        default:
            console.log("LIRI can't understand you!");
    }
};

var doWhatItSays = function () {
    fs.readFile('random.txt', 'utf8', function (error, data) {
        console.log(data);
        var dataArr = data.split(',');
        if (dataArr.length === 2) {
            userInput(dataArr[0], dataArr[1]);
        } else if (dataArr.length === 1) {
            userInput(dataArr[0]);
        }
    });
};

var cmdLnArgs = function (argOne, argTwo) {
    userInput(argOne, argTwo);
};

cmdLnArgs(process.argv[2], process.argv[3]);
