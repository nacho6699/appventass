var jwt = require("jsonwebtoken");
const userObj = require("../database/user");
const USER = userObj.model;
//para verificar si tiene acceso o tiene el token

var rols = {
    verifytoken: function(req, res, next){
        var token = req.headers["authorization"];
        if(token == null){
          res.status(300).json({"msj": "Error no tiene Acceso"});
          return;
        }
        jwt.verify(token, "password", async(err, auth)=>{
          if(err){
            res.status(300).json({"msj":"token invalido"});
          }
          var users = await USER.find({email:auth.name});
          var roles = users[0].roles;
          if(roles == null){
            res.status(300).json({"msj":"No tiene permisos"});
            return;
          }
          for(var i=0 ; i < roles.length; i++ ){
            if(roles[i] == "user" && req["method"] == "GET" && req["url"].match(/\/user/g) !=null ){
              next();
              return;
            }
            if(roles[i] == "user" && req["method"] == "DELETE" && req["url"].match(/\/user/g) !=null ){
              next();
              return;
            }
            if(roles[i] == "user" && req["method"] == "PATCH" && req["url"].match(/\/user/g) !=null ){
              next();
              return;
            }
          }
          res.status(300).json({"msj":"El usuario no cuenta con el permiso para este servicio"});
          //res.status(200).json(auth);
        });
      }
}
module.exports = rols;