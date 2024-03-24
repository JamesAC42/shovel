const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: {
    type: DataTypes.STRING(50),
    field: 'first_name',
  },
  lastName: {
    type: DataTypes.STRING(50),
    field: 'last_name',
  },
  dateCreated: {
    type: DataTypes.DATEONLY,
    field: 'date_created',
  },
  color: {
    type: DataTypes.STRING(20),
  },
  password: {
    type: DataTypes.STRING(100),
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
}, {
  tableName: 'users',
  timestamps: false,
});

const Room = sequelize.define('Room', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(50),
  }
}, {
  tableName: 'room',
  timestamps: false,
});

const RoomRequest = sequelize.define('RoomRequest', {
  room: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'room',
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  tableName: 'room_requests',
  timestamps: false,
});

const RoomUser = sequelize.define('RoomUser', {
  room: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'room',
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    field: 'user_id',
    primaryKey: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  tableName: 'room_users',
  timestamps: false,
});

const DeepWorkHourTracker = sequelize.define('DeepWorkHourTracker', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id',
    }
  },
  room: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'room',
      key: 'id',
    }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    primaryKey: true,
  },
  hours: {
    type: DataTypes.INTEGER,
  },
  wasNotable: {
    type: DataTypes.BOOLEAN,
    field: 'was_notable',
  },
  accomplishment: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'deep_work_hour_tracker',
  timestamps: false,
});

const StreakTracker = sequelize.define('StreakTracker', {
  userId: {
    type: DataTypes.INTEGER,
    field: 'user_id',
    primaryKey: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  room: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'room',
      key: 'id',
    },
  },
  startDate: {
    type: DataTypes.DATEONLY,
    field: 'start_date',
  },
  endDate: {
    type: DataTypes.DATEONLY,
    field: 'end_date',
  },
}, {
  tableName: 'streak_tracker',
  timestamps: false,
});

const StreakHighscore = sequelize.define('StreakHighscore', {
  userId: {
    type: DataTypes.INTEGER,
    field: 'user_id',
    primaryKey: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  room: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'room',
      key: 'id',
    },
  },
  startDate: {
    type: DataTypes.DATEONLY,
    field: 'start_date',
  },
  endDate: {
    type: DataTypes.DATEONLY,
    field: 'end_date',
  },
}, {
  tableName: 'streak_highscore',
  timestamps: false,
});

const Goal = sequelize.define('Goal', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  room: {
    type: DataTypes.INTEGER,
    references: {
      model: 'room',
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id',
    },
  },
  startDate: {
    type: DataTypes.DATEONLY,
    field: 'start_date',
  },
  endDate: {
    type: DataTypes.DATEONLY,
    field: 'end_date',
  },
  status: {
    type: DataTypes.STRING(200),
  },
  title: {
    type: DataTypes.STRING(100),
  },
  description: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'goals',
  timestamps: false,
});

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  goalId: {
    type: DataTypes.INTEGER,
    field: 'goal_id',
    references: {
      model: 'goals',
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id',
    },
  },
  title: {
    type: DataTypes.STRING(100),
  },
  description: {
    type: DataTypes.TEXT,
  },
  dateCreated: {
    type: DataTypes.DATEONLY,
    field: 'date_created',
  },
  dateCompleted: {
    type: DataTypes.DATEONLY,
    field: 'date_completed',
  },
}, {
  tableName: 'tasks',
  timestamps: false,
});

const Journal = sequelize.define('Journal', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id',
    },
  },
  room: {
    type: DataTypes.INTEGER,
    references: {
      model: 'room',
      key: 'id',
    },
  },
  date: {
    type: DataTypes.DATEONLY,
  },
  entry: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'journal',
  timestamps: false,
});

const Tag = sequelize.define('Tag', {
  tag: {
    type: DataTypes.STRING(50),
    collate: 'default'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  room: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  }
}, {
  tableName: 'tags',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'id', 'room']
    }
  ]
});

const JournalTag = sequelize.define('JournalTag', {
  journalEntry: {
    type: DataTypes.INTEGER,
    field: 'journal_entry',
    primaryKey: true
  },
  tag: {
    type: DataTypes.INTEGER,
    primaryKey: true
  }
}, {
  tableName: 'journal_tags',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['journal_entry', 'tag']
    }
  ]
});

const TaskTag = sequelize.define('TaskTag', {
  taskId: {
    type: DataTypes.INTEGER,
    field: 'task_id',
    primaryKey: true
  },
  tag: {
    type: DataTypes.INTEGER,
    primaryKey: true
  }
}, {
  tableName: 'task_tags',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['task_id', 'tag']
    }
  ]
});

User.hasMany(RoomRequest, {foreignKey: "user_id"});
User.hasMany(DeepWorkHourTracker, {foreignKey: "user_id"});
User.hasMany(StreakHighscore, {foreignKey: "user_id"});
User.hasMany(StreakTracker, {foreignKey: "user_id"});
User.hasMany(Goal, {foreignKey: "user_id"});
User.hasMany(Journal, {foreignKey: "user_id"});
User.hasMany(RoomUser, {foreignKey: "user_id"});
User.hasMany(Tag, {foreignKey: "user_id"});
User.hasMany(Task, {foreignKey: "user_id"});

Room.hasMany(RoomRequest, {foreignKey: 'room'});
Room.hasMany(RoomUser, {foreignKey: 'room'});
Room.hasMany(DeepWorkHourTracker, {foreignKey: 'room'});
Room.hasMany(StreakHighscore, {foreignKey: 'room'});
Room.hasMany(StreakTracker, {foreignKey: 'room'});
Room.hasMany(Goal, {foreignKey: 'room'});
Room.hasMany(Journal, {foreignKey: 'room'});
Room.hasMany(Tag, {foreignKey: 'room'});

RoomUser.belongsTo(Room, { foreignKey: 'room' });
RoomUser.belongsTo(User, { foreignKey: 'user_id' });

RoomRequest.belongsTo(Room, { foreignKey: 'room' });
RoomRequest.belongsTo(User, { foreignKey: 'user_id' });

Journal.hasMany(JournalTag, {foreignKey: 'journal_entry'});
Journal.belongsTo(Room, { foreignKey: 'room' });
Journal.belongsTo(User, { foreignKey: 'user_id' });

DeepWorkHourTracker.belongsTo(Room, { foreignKey: 'room' });
DeepWorkHourTracker.belongsTo(User, { foreignKey: 'user_id' });

StreakTracker.belongsTo(Room, { foreignKey: 'room' });
StreakTracker.belongsTo(User, { foreignKey: 'user_id' });

StreakHighscore.belongsTo(Room, { foreignKey: 'room' });
StreakHighscore.belongsTo(User, { foreignKey: 'user_id' });

Goal.belongsTo(Room, { foreignKey: 'room' });
Goal.belongsTo(User, { foreignKey: 'user_id' });
Goal.hasMany(Task, { foreignKey: 'goal_id'})

Task.belongsTo(User, { foreignKey: 'user_id' });
Task.belongsTo(Goal, { foreignKey: 'goal_id' });
Task.hasMany(TaskTag, { foreignKey: 'task_id' });

Tag.belongsTo(User, { foreignKey: 'user_id' });
Tag.belongsTo(Room, { foreignKey: 'room' });
Tag.hasMany(JournalTag, { foreignKey: 'tag' });
Tag.hasMany(TaskTag, { foreignKey: 'tag' });

JournalTag.belongsTo(Journal, { foreignKey: 'journal_entry', targetKey: 'id' });
JournalTag.belongsTo(Tag, { foreignKey: 'tag', targetKey: 'id' });

TaskTag.belongsTo(Task, { foreignKey: 'task_id', targetKey: 'id' });
TaskTag.belongsTo(Tag, { foreignKey: 'tag', targetKey: 'id' });

module.exports = {
  User,
  Room,
  RoomRequest,
  RoomUser,
  DeepWorkHourTracker,
  StreakHighscore,
  StreakTracker,
  Goal,
  Task,
  Journal,
  Tag,
  JournalTag,
  TaskTag
};
