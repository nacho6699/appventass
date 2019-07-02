var express = require('express');
var router = express.Router();
//llamando al esquema
const productoObj = require("../database/producto");
const PRODUCTO = productoObj.model;
const PRODUCTOSCHEMA = productoObj.schema;
//para seguridad
const valid = require('../utils/valid');
var sha1 = require("sha1");
var jwt = require("jsonwebtoken");

var rols = require("../permisos/chekpermisos");
var verifytoken = rols.verifytoken;


//registrar usuarios
router.post('/productos', async(req, res) =>{
  var params = req.body;
  params['register'] =new Date();
    //validando los parametros
   if(!valid.checkParams(PRODUCTOSCHEMA, params)){
    res.status(300).json({msj:"parametros incorrectos"});
    return;
  }

  try{

  var producto = new PRODUCTO(params);
  var result = await producto.save();
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


router.get('/productos',async(req,res)=>{
  var params = req.query; 
  var userId= {};
  var buscar= {};
  var limit = 10;//cantidad a mostrar
  var order =-1;

  //ver si existe o no el ide de usuario
  if(params.buscar != null){
    buscar ={descripcion:{$regex:params.buscar}};
  }

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
  var datos = await PRODUCTO.find(buscar).limit(limit).sort({_id:order});
  res.status(200).json(datos);
})
/*
//el PUT actualiza todo el objeto y el patch solo cierta información
router.patch('/user', verifytoken,async(req,res)=>{
  if(req.query.id == null){
    res.status(300).json({
      msj:"no existe id"
    });
    return;
  }
  var id = req.query.id;
  var params = req.body;

  if(params['password']=!null){
    params['password']=sha1(params.password);  
  }
  var users = await USER.findOneAndUpdate({_id:id}, params);
  res.status(200).json(users);
  /*USER.findOneAndUpdate({_id:id}, params, (err,docs)=>{
    res.status(200).json(docs);
  });
})
//delete para borrado de usuarios
//###lista de todos los usuarios [DELETE]
//###lista un usuario usuarios [DELETE/user?id=12345]
router.delete('/user', verifytoken, async(req,res)=>{
  if(req.query.id == null){
    res.status(300).json({
      msj:"no existe id"
    });
    return;
  }
  var id = req.query.id;
  var result = await USER.remove({_id:id});
  res.status(200).json(result);
})*/
module.exports = router;
//esto es un ocomentario de jose