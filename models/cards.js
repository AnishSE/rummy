module.exports      = function(sequelize, DataTypes) {
  var Cards         = sequelize.define('Cards', {
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
    points    : {
      type          : DataTypes.INTEGER(11),
      allowNull     : false
    },    
    cards  : {
      type          : DataTypes.STRING(255),
      allowNull     : false,
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
    tableName       : 'cards',
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
  return Cards;
};