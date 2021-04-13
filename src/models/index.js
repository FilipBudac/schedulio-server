const Sequelize = require("sequelize");
const dbConfig = require("../config/db");

// mysql connection
const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
);

(async() => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();


const db = {};
module.exports = db;

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// register models
db.user = require("./User.js");
db.contact = require("./Contact.js");
db.company = require("./Company.js");
