
const config    = require('config');

module.exports = class PaymentDetailManager {

    constructor(wagner){
      this.PaymentDetails = wagner.get("PaymentDetails");      
    };

    insert(req){
        return new Promise(async (resolve, reject)=>{
            try{
              await this.PaymentDetails.destroy({where: {'orderId': req.paymentObj.orderId} });              
              
              let paymentDetails = await this.PaymentDetails.create(req.paymentObj);
              resolve(paymentDetails);
            } catch(error){
              console.log("PaymentDetails.insert",error);
              reject(error);
            }
        });
    };

    find(data){
      return new Promise(async (resolve, reject)=>{
          try{
            let paymentDetails =  await this.PaymentDetails.findOne({ where: data });
            resolve(paymentDetails);

          } catch(error){
            console.log("PaymentDetails.find",error);
            reject(error);
          }
      });
  };

    remove(req){
      return new Promise(async (resolve, reject)=>{
          try{

            let paymentDetails = await this.PaymentDetails.deleteOne({ where: data })
            resolve(paymentDetails);

          } catch(error){
            console.log("PaymentDetails.remove",error);
            reject(error);
          }
      });
  };

  update(params){
      return new Promise(async (resolve, reject)=>{
          try{
            let paymentDetails  = await this.PaymentDetails.update(
              params.paymentObj,
              { where : params.conditons }
            );
            resolve(paymentDetails)
          } catch(error){
            console.log(error);
            reject(error);
          }
      })
  }

};
