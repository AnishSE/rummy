
const config    = require('config');

module.exports = class TokenManager {

    constructor(wagner){
      this.Token = wagner.get("Token");
      this.User = wagner.get("User");      
    };

    insert(req){
        return new Promise(async (resolve, reject)=>{
            try{
              await this.Token.deleteOne({'deviceToken': req.tokenObj.deviceToken });
              // let searchToken = await this.Token.updateOne({ 'deviceToken': req.tokenObj.deviceToken },req.tokenObj, {upsert: true,setDefaultsOnInsert: true})
              let token = await this.Token.create(req.tokenObj);
              resolve(token);
            } catch(error){
              console.log("Tokens.insert",error);
              reject(error);
            }
        });
    };

    find(req){
      return new Promise(async (resolve, reject)=>{
          try{
            let token =  await this.Token.findOne({'authToken': req });
            resolve(token);

          } catch(error){
            console.log(error);
            reject(error);
          }
      });
  };

    remove(req){
      return new Promise(async (resolve, reject)=>{
          try{

            let token = await this.Token.deleteOne({'deviceToken': req.body.device_token })
            resolve(token);

          } catch(error){
            console.log(error);
            reject(error);
          }
      });
  };

};
