module.exports      = function(sequelize, DataTypes) {
  var PaymentDetails         = sequelize.define('PaymentDetails', {
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
    orderId       : {
      type          : DataTypes.STRING(255),
      allowNull     : false,
    },
    amount       : {
      type          : DataTypes.DECIMAL(10,5),
      allowNull     : false,
    },
    paymentId       : {
      type          : DataTypes.STRING(255),
      allowNull     : true,
    },
    paymentStatus       : {
      type          : DataTypes.STRING(255),
      allowNull     : true,
    },
    signature     : {
      type          : DataTypes.STRING(255),
      allowNull     : true,
    },                                           
    createdAt: {
      type          : DataTypes.DATE,
      allowNull     : true,
      defaultValue  : sequelize.literal('CURRENT_TIMESTAMP')
    }
  },  
  {
    tableName       : 'payment_details',
    paranoid        : true,
    // charset         : 'utf8',
    // collate         : 'utf8_general_ci', 
    // freezeTableName : true,
    timestamps      : false,
    classMethods: {
      associate: function(models) {

      }
    }    
  });
  return PaymentDetails;
};