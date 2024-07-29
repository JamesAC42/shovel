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

const config = require('./config.json');
const redisLogin = require('./redis_login.json');

const sequelize = require('./database');

let io;
if(config.local) {
  io = new Server(httpServer, {
    cors: {
      origin: '*'
    }
  });
} else {
  io = new Server(httpServer, {
  	path:'/socket',
    cors: {
        origin: 'https://ovel.sh',
        methods: ['GET','POST']
    } 
  });
}

redisClient.auth(redisLogin.password);

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
const addGoal = require('./controllers/roomControllers/addGoal');
const deleteGoal = require('./controllers/roomControllers/deleteGoal');
const addTask = require('./controllers/roomControllers/addTask');
const deleteTask = require('./controllers/roomControllers/deleteTask');
const toggleTask = require('./controllers/roomControllers/toggleTask');
const saveJournalEntry = require('./controllers/roomControllers/saveJournalEntry');
const toggleRoomVisibility = require('./controllers/roomControllers/toggleRoomVisibility');
const getFeedback = require('./controllers/socialControllers/getFeedback');
const getUpdates = require('./controllers/socialControllers/getUpdates');
const addFeedbackPost = require('./controllers/socialControllers/addFeedbackPost');
const addUpdate = require('./controllers/socialControllers/addUpdate');
const deleteFeedbackPost = require('./controllers/socialControllers/deleteFeedbackPost');
const deleteUpdate = require('./controllers/socialControllers/deleteUpdate');
const editFeedbackPost = require('./controllers/socialControllers/editFeedbackPost');
const getAdminUsernames = require('./controllers/socialControllers/getAdmins');
const deleteFeedbackPostAdmin = require('./controllers/socialControllers/deleteFeedbackPostAdmin');
const publicRooms = require("./controllers/publicRooms");
const getStats = require('./controllers/getStats');

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1);
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: 'domoarigato',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: config.secureSession, // Set to true if using HTTPS
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

app.post('/addGoal', async (req, res) => {
  addGoal(req, res, models, io);
});

app.post('/deleteGoal', async (req, res) => {
  deleteGoal(req, res, models, io);
});

app.post('/addTask', async (req, res) => {
  addTask(req, res, models, io);
});

app.post('/deleteTask', async (req, res) => {
  deleteTask(req, res, models, io);
});

app.post('/toggleTask', async (req, res) => {
  toggleTask(req, res, models, io);
});

app.post('/saveJournalEntry', async (req, res) => {
  saveJournalEntry(req, res, models, io);
});

app.post('/toggleRoomVisibility', async (req, res) => {
  toggleRoomVisibility(req, res, models, io);
});

app.post('/addFeedbackPost', async (req, res) => {
  addFeedbackPost(req, res, models, io);
});

app.post('/addUpdate', async (req, res) => {
  addUpdate(req, res, models, redisClient, io);
});

app.post('/deleteFeedbackPost', async (req, res) => {
  deleteFeedbackPost(req, res, models, io);
});

app.post('/deleteUpdate', async (req, res) => {
  deleteUpdate(req, res, models, redisClient, io);
});

app.post('/editFeedbackPost', async (req, res) => {
  editFeedbackPost(req, res, models, io);
});

app.post('/deleteFeedbackPostAdmin', async (req, res) => {
  deleteFeedbackPostAdmin(req, res, models, redisClient, io);
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

app.get('/getFeedback', (req, res) => {
  getFeedback(req, res, models);
});

app.get('/getUpdates', (req, res) => {
  getUpdates(req, res, models);
});

app.get('/getAdminUsernames', (req, res) => {
  getAdminUsernames(req, res, redisClient);
});

app.get('/getStats', (req, res) => {
  getStats(req, res, models);
});

app.get('/publicRooms', (req, res) => {
  publicRooms(req, res, models);
});

io.on('connection', handleConnection);

// Start the server
httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});