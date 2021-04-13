module.exports = app => {
    const contacts = require("../controllers/company-controller");
    const router = require("express").Router();
    const middleware = require("../middleware");

    router.get("/", middleware.verify, contacts.findAll);

    router.post("/", middleware.verify, contacts.create);

    router.get("/:name", middleware.verify, contacts.findByName);

    app.use('/api/companies', router);
};