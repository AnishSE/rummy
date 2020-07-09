module.exports      = function(sequelize, DataTypes) {
  var Tokens         = sequelize.define('Tokens', {
    id              : {
      type          : DataTypes.INTEGER(11),
      allowNull     : false,
      primaryKey    : true,
      autoIncrement : true,
    },
    userId          : {
      type          : DataTypes.INTEGER(11),
      allowNull     : false,
    },
    authToken       : {
      type          : DataTypes.STRING(255),
      allowNull     : true,
    },
    deviceToken     : {
      type          : DataTypes.STRING(255),
      allowNull     : true,
    },                                           
    createdAt: {
      type          : DataTypes.DATE,
      allowNull     : true,
      defaultValue  : sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt       : {
      type          : DataTypes.DATE,
      allowNull     : true,
      defaultValue  : sequelize.literal('CURRENT_TIMESTAMP')
    }
  },  
  {
    tableName       : 'tokens',
    paranoid        : true,
    charset         : 'utf8',
    collate         : 'utf8_general_ci', 
    freezeTableName : true,
    timestamps      : false,
    classMethods: {
      associate: function(models) {

      }
    }    
  });
  return Tokens;
};