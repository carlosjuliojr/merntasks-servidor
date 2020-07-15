const mongoose = require('mongoose');
require('dotenv').config({path : 'variables.env'});

const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser : true,
            useUnifiedTopology : true,
            unseFindAndModify : false
        });
        console.log("data base coneecte successful")
    } catch (error) {
        console.log(error);
        process.exit(1); // dtener la app
    }

}

module.exports = conectarDB;