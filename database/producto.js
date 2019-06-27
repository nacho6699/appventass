const mongoose = require("./connect");
var productoSchema = {
    id_user:String,
    precio:Number,
    cantidad:Number,
    register:Date,
    img:String
}
const PRODUCTO = mongoose.model("producto", productoSchema);
//module.exports = USERS;
module.exports = {model: PRODUCTO, schema: productoSchema};