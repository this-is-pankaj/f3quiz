'use strict';

const express = require('express'),
	bodyParser = require('body-parser'),
	cors = require('cors'),
	mongoose = require('mongoose'),
  config = require(`./server/config/${process.env.NODE_ENV||'local'}`),
  LOG = require('./server/utils/logger');

const component = 'index';

mongoose.Promise = global.Promise;
console.log(config.connectionString);
const options = {
	useNewUrlParser: true,
	// autoIndex: false, // Don't build indexes
	reconnectTries: 100, // Never stop trying to reconnect
	reconnectInterval: 500, // Reconnect every 500ms
	poolSize: 10, // Maintain up to 10 socket connections
	// If not connected, return errors immediately rather than waiting for reconnect
	bufferMaxEntries: 0
};
mongoose.connect(config.connectionString, options)
  .then(() => {
    LOG.info(`${component}.mongoose`, 'defaultId', 'Database is connected');
  })
  .catch((err) => { 
    LOG.error(`${component}.mongoose`, 'defaultId', `Can not connect to the database ${err}`);
  });

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.set('socketio', io);
// Create link to Angular build directory
let distDir = __dirname + "/dist/";
app.use(express.static(distDir));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

// Get all the other routes for the app.
require('./server/routes/index.route')(app);


app.use('/*', (req, res, next)=>{
	res.sendFile(distDir);
});



const server = http.listen(port, () => {
	LOG.info(`${component}.server`, 'defaultId', `Listening on port ${port}`);
});

server.timeout = 10000;