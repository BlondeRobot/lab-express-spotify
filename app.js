require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:

//home
app.get("/", (req, res) => {
  res.render("index.hbs");
});

//artist search

app.get("/artist-search", (req, res) => {
spotifyApi
  .searchArtists(req.query.artistName)
  .then((data) => {
    
    res.render("artist-search-results", {returnedArtist: data.body.artists.items});
    console.log("Artist data received from the API: ", data.body);
  })
  .catch((err) =>
    console.log("The error while searching artists occurred: ", err)
  );
});

//albums search
app.get("/albums/:artistId", (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      res.render("albums", { returnedAlbum: data.body.items });
      console.log("Album data received from the API: ", data.body);
    })
    .catch((err) =>
      console.log("The error while searching albums occurred: ", err)
    );
});

//tracks search
app.get("/tracks/:albumId", (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then((data) => {
      res.render("tracks", { returnedTrack: data.body.items });
      console.log("Track data received from the API: ", data.body);
    })
    .catch((err) =>
      console.log("The error while searching tracks occurred: ", err)
    );
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
