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
const userObj = require("../database/user");
const USER = userObj.model;

var rols = require("../permisos/chekpermisos");
var verifytoken = rols.verifytoken;
//extras-----------------para las imagenes -----------
var multer = require('multer');
var fs = require('fs');

var storage = multer.diskStorage({
  destination: "./public/imgProductos",
  filename: function (req, file, cb) {
    var misParams=req.body;
    console.log("-------------------------");
    //console.log(misParams);
    //console.log(file);
    cb(null, "IMG_" + Date.now() + "_.jpg");
  }
});
var upload = multer({
  storage: storage
}).single("img");;
//-------------


//registrar producto
//##save producto[/v1.0/api/productos?token=userToken]
router.post('/productos', async(req, res) =>{
  var params = req.body;
  var token = req.headers["authorization"];
    //verificando su session
  if(token == null){
    res.status(300).json({"msj": "Error no tiene Acceso"});
    return;
  }
  jwt.verify(token, "password", async(err, auth)=>{
    if(err){
      res.status(300).json({"msj":"token invalido"});
    }
    var users = await USER.find({email:auth.name});
    if(users!= null){
      var userId = users[0]._id;
      //params['register'] =new Date();
      //params['id_user'] = userId;
      //----------------
            
      upload(req, res, async(err) => {
        var datos = req.body;
        datos['register'] =new Date();
        datos['id_user'] = userId;
        var rutaImg = req.file.path.replace(/public/g, "");
        datos['img'] = rutaImg;//mi direccion local de la imagen
      
        //console.log("la ruta es "+ rutaImg);
        
        console.log(datos);
        if (err) {
          res.status(500).json({
            "msn" : "No se ha podido subir la imagen"
          });
        } else {
          
          if(!valid.checkParams(PRODUCTOSCHEMA, datos)){
            
            res.status(300).json({msj:"parametros incorrectos"});
            return;
          }
          try{
            //registrando producto
            var producto = new PRODUCTO(datos);
            var result = await producto.save();
            res.status(200).json(result);
            }catch(e){
              console.log("el errorrrr esss   "+e);
          }
        }
      });
      //validando los parametros
      
    }
   
    //res.status(300).json({"msj":"El usuario no cuenta con el permiso para este servicio"});
    //res.status(200).json(auth);
  });
  
});

//obtener datos get
//#Group users
//##colleccion usuarios [/v1.0/api/producto]
//###lista de todos los usuarios [GET/producto]
//###lista un usuario usuarios [GET/user?idUs=12345]
//###lista un usuario usuarios [GET/user?limit=5]
//###lista ordenada ascendente y descendente [GET/user?order=asc|order=des]


router.get('/productos',async(req,res)=>{
  var params = req.query; 
  var userId= {};
  var buscar= {};
  var limit = 26;//cantidad a mostrar
  var order =-1;
  //ver si existe o no el ide de usuario
  if(params.buscar != null){
    buscar ={descripcion:{$regex:params.buscar}};
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

//servicio para obtener los productos de un determinado usuario a traves del token
router.get('/productosUser', async(req, res) =>{
  var params = req.query; 
  var userId= {};
  var token = req.headers["authorization"];
  var order =-1;
  //ver si existe order 
  if(params.order != null){
    if(params.order=="des"){
      order = -1;
    }
    if(params.order == "asc"){
      order = 1;
    }
  }
    //verificando su session
  if(token == null){
    res.status(300).json({"msj": "Error no tiene Acceso"});
    return;
  }
  jwt.verify(token, "password", async(err, auth)=>{
    if(err){
      res.status(300).json({"msj":"token invalido"});
    }
    var users = await USER.find({email:auth.name});
    if(users!= null){
      var idUs = users[0]._id;
        //ver si existe o no el ide de usuario
      console.log(idUs);
      if(idUs != null){
        userId ={id_user:idUs};
        var datos = await PRODUCTO.find(userId).sort({_id:order});
        res.status(200).json(datos);
      }
      
    }

  });
  
});

//servicio para borrar un producto a partir de id producto y su token 
router.delete('/productosUser', async(req, res) =>{
  var params = req.query; 
  var idPro=params.idPro;
  var token = req.headers["authorization"];
   
    //verificando su session
  if(token == null){
    res.status(300).json({"msj": "Error no tiene Acceso"});
    return;
  }
  jwt.verify(token, "password", async(err, auth)=>{
    if(err){
      res.status(300).json({"msj":"token invalido"});
    }
    //var users = await USER.find({email:auth.name});
    if(idPro == null){
      res.status(300).json({
        msj:"no existe idPro"
      });
      return;
    }
    var result = await PRODUCTO.remove({_id:idPro});
    res.status(200).json(result);
    

  });
  
});
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