module.exports      = function(sequelize, DataTypes) {
  var Games         = sequelize.define('Games', {
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
    bet_amount      : {
      type          : DataTypes.DECIMAL(15,2),
      allowNull     : false
    },      

    player_count    : {
      type          : DataTypes.INTEGER(11),
      allowNull     : false
    },  
    status  : {
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
    tableName       : 'games',
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
  return Games;
};