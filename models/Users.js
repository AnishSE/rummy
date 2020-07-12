module.exports      = function(sequelize, DataTypes) {
  var Users         = sequelize.define('Users', {
    id              : {
      type          : DataTypes.INTEGER(11),
      allowNull     : false,
      primaryKey    : true,
      autoIncrement : true,
      // references    : {
      //   model       : 'media',
      //   key         : 'uploaded_by' 
      // }      
     
    },
    first_name       : {
      type          : DataTypes.STRING(255),
      allowNull     : true
    },
    last_name        : {
      type          : DataTypes.STRING(255),
      allowNull     : true
    },      

    mobile_number   : {
      type          : DataTypes.STRING(20),
      allowNull     : true
    },
    email           : {
      type          : DataTypes.STRING(255),
      allowNull     : true
    },      
    password        : {
      type          : DataTypes.STRING(255),
      allowNull     : true
    }, 
    user_language   : {
      type          : DataTypes.STRING(255),
      allowNull     : true
    },
    device_type : {
      type          : DataTypes.ENUM,      
      values        : ['0', '1', '2'],
      defaultValue  : 0
    }, 
    device_token    : {
      type          : DataTypes.STRING(255),
      allowNull     : true,
      allowNull     : true
    },   
    status  : {
      type          : DataTypes.INTEGER(1),
      allowNull     : false,
      defaultValue  : 0
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
    tableName       : 'users',
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
  return Users;
};