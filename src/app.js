const express = require('express');
const cors = require("cors");
const db = require("./models");
const bodyParser = require("body-parser");

// express app
const app = express();

// cors sites
const corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// register routes
require("./routes/users")(app);

// need to drop existing tables and re-sync database
// db.sequelize.sync({ force: true }).then(() => {
db.sequelize.sync({ force: false }).then(() => {
    console.log("Drop and re-sync db.");
});

// register view engine
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);

// lister for requests
app.listen(3000);

