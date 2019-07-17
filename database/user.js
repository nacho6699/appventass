const mongoose = require("./connect");
var userSchema = {
    user_name:String,
    email:String,
    celular:String,
    password:String,
    register:Date,
    roles:Array
}
const USERS = mongoose.model("users", userSchema);
//module.exports = USERS;
module.exports = {model: USERS, schema: userSchema};