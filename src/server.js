import express from 'express'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import App from './components/app'

// init express
const app = express();

// static
app.use('/static', express.static('dist'));

// root
app.get('/', (req, res) => {
  res.send(
    ReactDOMServer.renderToString(
      <html lang="ja">
        <head>
          <meta charset="UTF-8" />
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

// start listen
app.listen(3000, () => {
  console.log('Express listening on port 3000!');
});
