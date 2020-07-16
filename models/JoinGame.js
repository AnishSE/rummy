module.exports      = function(sequelize, DataTypes) {
  var JoinGame         = sequelize.define('JoinGame', {
    id              : {
      type          : DataTypes.INTEGER(11),
      allowNull     : false,
      primaryKey    : true,
      autoIncrement : true,     
    },
    player_id       : {
      type          : DataTypes.INTEGER(11),
      allowNull     : false
    },
    room_id         : {
      type          : DataTypes.STRING(255),
      allowNull     : false
    },
    localroom_id    : {
      type          : DataTypes.STRING(255),
      allowNull     : false
    },    
    player_count    : {
      type          : DataTypes.INTEGER(11),
      allowNull     : false
    },    
    connection_status  : {
      type          : DataTypes.INTEGER(1),
      allowNull     : false,
      defaultValue  : 1
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
    tableName       : 'joingame',
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
  return JoinGame;
};