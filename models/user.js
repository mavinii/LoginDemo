const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

//Instala alguns plugins do pacote que instalamos pelo NODE
UserSchema.plugin(passportLocalMongoose);

//Exporta o nosso Schema para o app.js
module.exports = mongoose.model("User", UserSchema);