const mongoose = require("./connect");
var userSchema = {
    user_name:String,
    email:String,
    password:String,
    register:Date
}
const USERS = mongoose.model("users", userSchema);
//module.exports = USERS;
module.exports = {model: USERS, schema: userSchema};