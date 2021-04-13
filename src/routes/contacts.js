module.exports = app => {
    const contacts = require("../controllers/contact-controller");
    const router = require("express").Router();
    const middleware = require("../middleware");

    router.get("/", middleware.verify, contacts.findAll);

    router.post("/", middleware.verify, contacts.create);

    router.get("/:id", middleware.verify, contacts.findOne);

    router.get("/:name", middleware.verify, contacts.findByName);

    router.get("/:phoneNumber", middleware.verify, contacts.findByPhone);

    router.put("/:id", middleware.verify, contacts.update);

    router.delete("/:id", middleware.verify, contacts.delete);

    router.delete("/", middleware.verify, contacts.deleteAll);

    app.use('/api/contacts', router);
};