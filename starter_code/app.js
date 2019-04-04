//--00. REQUIRES + EXPRESS APP

const express = require('express');
const hbs = require('hbs');
const prettyjson = require('prettyjson');
// require spotify-web-api-node package here:
var SpotifyWebApi = require('spotify-web-api-node');
const bodyParser = require('body-parser');

const app = express();

//--0. SETUP

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

hbs.registerPartials(__dirname + '/views/partials');
/* setting the spotify-api goes here:
Client ID d3b762eba6f14bdf9c3a6365ff757c42
Client Secret 67768cda89af44a2942861aed4a0b089*/
// Remember to insert your credentials here
const clientId = 'd3b762eba6f14bdf9c3a6365ff757c42',
    clientSecret = '67768cda89af44a2942861aed4a0b089';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })

//--1. ROUTES

app.get('/', (req, res, next) => {
    res.render('index');
  });

app.post('/artists', (req, res, next) => {

    let artist=req.body.artist;
    console.log(req.body);
    spotifyApi.searchArtists(artist)
    .then(data => {

      console.log("The received data from the API: ", prettyjson.render(data.body.artists.items));
      //let artistsInfo=JSON.stringify(data.body.artists.items);
      let name= prettyjson.render(data.body.artists.items[0].images[0].url);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      console.log(name);
      res.render('artists', {data});

    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
  });  
  

  /*app.get('/albums', (req, res, next) => {
    res.render('albums');
  });*/

  app.get('/albums/:artistId', (req, res, next) => {
    // .getArtistAlbums() code goes here

    res.render('albums');
  });

//--2. SERVER LISTENING

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
