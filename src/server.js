import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from './components/app';
import fs from 'fs';
import childProcess from 'child_process';
const exec = childProcess.exec;

// init express
const app = express();

// static
app.use('/static', express.static('dist'));

// content
app.get('/', (req, res) => {
  res.send(
    ReactDOMServer.renderToString(
      <html lang="ja">
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <link rel="stylesheet" href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css" />
          <link rel="stylesheet" href="/static/css/app.css" />
          <title>sdvxめも</title>
        </head>
        <body>
          <div>
            <div id="app">
            </div>
            <script src="/static/js/app.bundle.js" />
          </div>
          <script src="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js"></script>
          <script>window.mdc.autoInit();</script>
        </body>
      </html>
    )
  );
});

// api
app.get('/api/track/list', (req, res) => {
  const level = req.query.level;
  const word = req.query.word;
  if (!level || !word) res.send('{}');

  const trackJsonPath = 'private/data/'+ level +'.json';
  const tracks = JSON.parse(fs.readFileSync(trackJsonPath, 'utf8'));

  let matchedTrackList = [];
  for (const key in tracks) {
    const track = tracks[key];
    const name = track.name + ' [' + track.difficulty + ']';
    const path = track.path;

    if (!name.toLowerCase().includes(word.toLowerCase())) continue;

    matchedTrackList.push({"name":name, "path":path});
  }

  res.send(JSON.stringify(matchedTrackList));
});
app.get('/api/track/update', (req, res) => {
  const COMMAND = 'python private/bin/sdvxFumen.py';
  exec(COMMAND, function(error, stdout, stderr) {
    if (error !== null) {
      res.send('update exec error : ' + error);
    }
  });
  res.send('update done');
});

// start listen
app.listen(process.env.PORT || 3000, () => {
  const port = (process.env.PORT || 3000);
  console.log('Express listening on port ' + port + '!');
});
