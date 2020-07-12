
const config    = require('config');

module.exports = class TokenManager {

    constructor(wagner){
      this.Token = wagner.get("Token");
      this.User = wagner.get("User");      
    };

    insert(req){
        return new Promise(async (resolve, reject)=>{
            try{
              await this.Token.deleteOne({'userId': req.tokenObj.userId });
              
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
            let token =  await this.Token.findOne({where: req });
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

            let token = await this.Token.deleteOne({where: req })
            resolve(token);

          } catch(error){
            console.log(error);
            reject(error);
          }
      });
    };

    update(req){
      return new Promise(async (resolve, reject)=>{
          try{
            let token  = await this.Token.update(
              req.tokenObj,
              { where : req.conditons }
            );
            resolve(token)
          } catch(error){
            console.log(error);
            reject(error);
          }
      })
    };

};
