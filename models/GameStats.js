module.exports      = function(sequelize, DataTypes) {
  var GameStats         = sequelize.define('GameStats', {
    id              : {
      type          : DataTypes.INTEGER(11),
      allowNull     : false,
      primaryKey    : true,
      autoIncrement : true,     
    },

    localroom_id    : {
      type          : DataTypes.STRING(255),
      allowNull     : false
    },
    room_id         : {
      type          : DataTypes.STRING(255),
      allowNull     : false
    },       
    player_id       : {
      type          : DataTypes.INTEGER(11),
      allowNull     : false
    }, 

    points  : {
      type          : DataTypes.INTEGER(11),
      allowNull     : true
    },
    status  : {
      type          : DataTypes.INTEGER(1),
      allowNull     : false
    },                                                    
    createdAt: {
      type          : DataTypes.DATE,
      allowNull     : true,
      defaultValue  : sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt        : {
      type          : DataTypes.TIME,
      allowNull     : true,
      defaultValue  : sequelize.literal('CURRENT_TIMESTAMP')
    }
  },  
   {
    tableName       : 'game_stats',
    paranoid        : true,
    deletedAt       : 'deletedAt',
    charset         : 'utf8',
    collate         : 'utf8_general_ci', 
    freezeTableName : true,
    timestamps      : false,

    classMethods: {
      associate: function(models) {}
    }    
  });
  return GameStats;
};