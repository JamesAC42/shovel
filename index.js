const express = require('express');
const session = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = http.createServer(app);
const redisClient = redis.createClient({ legacyMode: true });
const port = 5000;
const sequelize = require('./database');

//const io = new Server(httpServer, {
//	path:'/socket'
//});

const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
});

const models = require('./models/models');

const login = require('./controllers/login');
const logout = require('./controllers/logout');
const createUser = require('./controllers/createUser');
const room = require('./controllers/room');
const validateRoom = require('./controllers/validateRoom');
const createRoom = require('./controllers/createRoom');
const roomData = require('./controllers/roomData');
const getUserRooms = require('./controllers/getUserRooms');
const saveWorkHours = require('./controllers/roomControllers/saveWorkHours');
const respondRequest = require('./controllers/roomControllers/respondRequest');
const handleConnection = require('./socket');
const checkIn = require('./controllers/roomControllers/checkIn');

sequelize.sync()
  .then(() => {
    console.log('Database synchronized');
  })
  .catch((error) => {
    console.error('Error synchronizing database:', error);
  });

try {
  sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

redisClient.auth("");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: 'domoarigato',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 * 7, // it's been, 1 week
    },
  })
);
// Middleware
app.use(express.json());

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.post('/login', (req, res) => {
  login(req, res, models);
});

app.post('/logout', (req, res) => {
  logout(req, res);
});

app.post('/createUser', async (req, res) => {
  createUser(req, res, models);
});

app.post('/joinRoom', async (req, res) => {
  validateRoom(req, res, models, io);
});

app.post('/createRoom', async (req, res) => {
  createRoom(req, res, models);
});

app.post('/saveWorkHours', async (req, res) => {
  saveWorkHours(req, res, models, io);
});

app.post('/respondRequest', async (req, res) => {
  respondRequest(req, res, models, io);
});

app.post('/checkIn', async (req, res) => {
  checkIn(req, res, models, io);
});

app.get('/room', (req, res) => {
  room(req, res, models);
});

app.get('/roomData', (req, res) => {
  roomData(req, res, models);
});

app.get('/getUserRooms', (req, res) => {
  getUserRooms(req, res, models);
});

io.on('connection', handleConnection);

// Start the server
httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});