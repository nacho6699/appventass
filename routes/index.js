var express = require('express');
var router = express.Router();
//llamando al esquema
const userObj = require("../database/user");
const USER = userObj.model;
const USERSCHEMA = userObj.schema;

//insertando el validador
const valid = require('../utils/valid');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).json({
    msj:"esto es mi app"
  });
});
//registrar usuarios
router.post('/user', async(req, res) =>{
  var params = req.body;
  params['register'] =new Date();
  //validando los parametros
 
  if(!valid.checkParams(USERSCHEMA, params)){
    res.status(300).json({msj:"parametros incorrectos"});
    return;
  }
  if(!valid.checkEmail(params.email)){
    res.status(300).json({msj:"email incorrecto"});
    return;
  }
  try{
  var user = new USER(params);
  var result = await user.save();
  res.status(200).json(result);
  }catch(e){
    console.log("el errorrrr esss   "+e);
  }
});
//obtener datos get
//#Group users
//##colleccion usuarios [/v1.0/api/user]
//###lista de todos los usuarios [GET/user]
//###lista un usuario usuarios [GET/user?id=12345]
//###lista un usuario usuarios [GET/user?limit=5]
//###lista ordenada ascendente y descendente [GET/user?order=asc|order=des]
router.get('/user', async(req,res)=>{
  var params = req.query; 
  var userId= {};
  var limit = 10;//cantidad a mostrar
  var order =-1;
  //ver si existe o no el ide de usuario
  if(params.id != null){
    userId ={_id:params.id};
  }
  //ver si existe el limite
  if(params.limit != null){
    limit = parseInt(params.limit);
  }
  //ver si existe order 
  if(params.order != null){
    if(params.order=="des"){
      order = -1;
    }
    if(params.order == "asc"){
      order = 1;
    }
  }
  var datos = await USER.find(userId).limit(limit).sort({_id:order});
  res.status(200).json(datos);
})

//el PUT actualiza todo el objeto y el patch solo cierta información
router.patch('/user', (req,res)=>{
  if(req.query.id == null){
    res.status(300).json({
      msj:"no existe id"
    });
    return;
  }
  var id = req.query.id;
  var params = req.body;
  USER.findOneAndUpdate({_id:id}, params, (err,docs)=>{
    res.status(200).json(docs);
  });
})
//delete para borrado de usuarios
//###lista de todos los usuarios [DELETE]
//###lista un usuario usuarios [DELETE/user?id=12345]
router.delete('/user', async(req,res)=>{
  if(req.query.id == null){
    res.status(300).json({
      msj:"no existe id"
    });
    return;
  }
  var id = req.query.id;
  var result = await USER.remove({_id:id});
  res.status(200).json(result);
})
module.exports = router;
