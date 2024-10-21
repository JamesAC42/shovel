const express = require('express');
const session = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);
const http = require('http');
const { Server } = require('socket.io');

const stripeLogin = require('./stripe_key.json');
const stripe = require('stripe')(stripeLogin.key);

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
const googleLogin = require('./controllers/googleLogin');
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
const updateTaskOrder = require('./controllers/roomControllers/updateTaskOrder');
const updateGoalOrder = require('./controllers/roomControllers/updateGoalOrder');
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
const addEmailToUser = require('./controllers/addEmailToUser');
const getNewsletters = require('./controllers/getNewsletters');
const sendNewsletter = require('./controllers/sendNewsletter');
const subscribeNewsletter = require('./controllers/subscribeNewsletter');
const unsubscribeNewsletter = require('./controllers/unsubscribeNewsletter');
const renameRoom = require('./controllers/roomControllers/renameRoom');
const deleteRoom = require('./controllers/roomControllers/deleteRoom');
const leaveRoom = require('./controllers/roomControllers/leaveRoom');
const archiveGoal = require('./controllers/roomControllers/archiveGoal');
const unarchiveGoal = require('./controllers/roomControllers/unarchiveGoal');

const createCheckoutSession = require('./controllers/createCheckoutSession');
const handleWebhook = require('./controllers/handleWebhook');

const { logUserRequest } = require('./featureTracking/collectFeatureTrackingData');
const getFeatureTrackingData = require('./controllers/getFeatureTrackingData');

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

app.use('/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1);
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: 'domoarigato',
    resave: false,
    name: 'shovel-session',
    saveUninitialized: false,
    cookie: {
      secure: config.secureSession,
      domain: 'ovel.sh',
      path: '/',
      httpOnly: true,
      maxAge: 7 *24 * 60 * 60 * 1000
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
  logUserRequest(redisClient, req, 'logged_in');
  login(req, res, models, redisClient);
});

app.post('/logout', (req, res) => {
  logUserRequest(redisClient, req, 'logged_in'); // Logging out is still an activity
  logout(req, res);
});

app.post('/googleLogin', (req, res) => {
  logUserRequest(redisClient, req, 'logged_in');
  googleLogin(req, res, models, redisClient);
});

app.post('/createUser', async (req, res) => {
  logUserRequest(redisClient, req, 'created_account');
  createUser(req, res, models);
});

app.post('/joinRoom', async (req, res) => {
  logUserRequest(redisClient, req, 'joined_room');
  validateRoom(req, res, models, io);
});

app.post('/createRoom', async (req, res) => {
  logUserRequest(redisClient, req, 'created_room');
  createRoom(req, res, models);
});

app.post('/saveWorkHours', async (req, res) => {
  logUserRequest(redisClient, req, 'added_work_hour');
  saveWorkHours(req, res, models, io);
});

app.post('/respondRequest', async (req, res) => {
  respondRequest(req, res, models, io);
});

app.post('/checkIn', async (req, res) => {
  logUserRequest(redisClient, req, 'check_in');
  checkIn(req, res, models, io);
});

app.post('/addGoal', async (req, res) => {
  logUserRequest(redisClient, req, 'added_goal');
  addGoal(req, res, models, io);
});

app.post('/deleteGoal', async (req, res) => {
  logUserRequest(redisClient, req, 'deleted_goal');
  deleteGoal(req, res, models, io);
});

app.post('/addTask', async (req, res) => {
  logUserRequest(redisClient, req, 'added_task');
  addTask(req, res, models, io);
});

app.post('/deleteTask', async (req, res) => {
  logUserRequest(redisClient, req, 'deleted_task');
  deleteTask(req, res, models, io);
});

app.post('/toggleTask', async (req, res) => {
  logUserRequest(redisClient, req, req.body.checked ? 'checked_task' : 'unchecked_task');
  toggleTask(req, res, models, io);
});

app.post('/saveJournalEntry', async (req, res) => {
  logUserRequest(redisClient, req, 'saved_journal');
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

app.post('/newsletterSignup', async (req, res) => {
  addEmailToUser(req, res, models);
});

app.post('/updateTaskOrder', async (req, res) => {
  logUserRequest(redisClient, req, 'reordered_task');
  updateTaskOrder(req, res, models);
});

app.post('/updateGoalOrder', async (req, res) => {
  logUserRequest(redisClient, req, 'reordered_goal');
  updateGoalOrder(req, res, models);
});

app.post('/getNewsletters', async (req, res) => {
  getNewsletters(req, res, redisClient);
});

app.post('/sendNewsletter', async (req, res) => {
  sendNewsletter(req, res, models, redisClient);
});

app.post('/subscribeNewsletter', async (req, res) => {
  subscribeNewsletter(req, res, models, redisClient);
});

app.post('/unsubscribeNewsletter', async (req, res) => {
  unsubscribeNewsletter(req, res, models, redisClient);
});

app.post('/deleteRoom', async (req, res) => {
  logUserRequest(redisClient, req, 'deleted_room');
  deleteRoom(req, res, models);
});

app.post('/leaveRoom', async (req, res) => {
  leaveRoom(req, res, models, io);
});

app.post('/renameRoom', async (req, res) => {
  logUserRequest(redisClient, req, 'renamed_room');
  renameRoom(req, res, models, io);
});

app.post('/archiveGoal', async (req, res) => {
  logUserRequest(redisClient, req, 'archived_goal');
  archiveGoal(req, res, models, io);
});

app.post('/unarchiveGoal', async (req, res) => {
  logUserRequest(redisClient, req, 'archived_goal'); // Unarchiving is still part of archiving feature
  unarchiveGoal(req, res, models, io);
});

app.post('/createCheckoutSession', async (req, res) => {
  createCheckoutSession(req, res, stripe, models, redisClient);
});

app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  handleWebhook(req, res, stripe, stripeLogin, models, redisClient);
});

app.get('/room', (req, res) => {
  room(req, res, models, redisClient);
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

app.get('/unsubscribeNewsletter', (req, res) => {
  unsubscribeNewsletter(req, res, redisClient);
});

app.get('/getFeatureTrackingData', (req, res) => {
    getFeatureTrackingData(req, res, redisClient);
});

io.on('connection', handleConnection);

// Start the server
httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
