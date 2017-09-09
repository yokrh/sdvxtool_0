import express from 'express'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import App from './components/app'
import fs from 'fs'

// init express
const app = express();

// static
app.use('/static', express.static('dist'));

// root
app.get('/', (req, res) => {
  console.log('/');

  res.send(
    ReactDOMServer.renderToString(
      <html lang="ja">
        <head>
          <meta charSet="UTF-8" />
          <title>app</title>
        </head>
        <body>
          <div>
            <div id="app">
              <App />
            </div>
            <script src="/static/bundle.js" />
          </div>
        </body>
      </html>
    )
  );
});

// api
app.get('/api/fumen/list', (req, res) => {
  console.log('/api/fumen/list');

  const level = req.query.level;
  const word = req.query.word;

  const trackJsonPath = "private/"+ level +".json";
  const tracks = JSON.parse(fs.readFileSync(trackJsonPath, 'utf8'));

  let matchedTrackList = [];
  for (const key in tracks) {
    const track = tracks[key];
    const name = track.name;
    const path = track.path;

    if (!name.toLowerCase().includes(word.toLowerCase())) continue;

    matchedTrackList.push({"name":name, "path":path});
  }

  res.send(JSON.stringify(matchedTrackList));
});

// start listen
app.listen(3000, () => {
  console.log('Express listening on port 3000!');
});
