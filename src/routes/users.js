
module.exports = app => {
    const users = require("../controllers/userController");
    const router = require("express").Router();
    const middleware = require("../middleware");

    router.post("/login", users.login);

    router.post("/sign", users.signUp);

    router.get("/", middleware.verify, users.findAll);

    router.get("/:id", middleware.verify, users.findOne);

    router.put("/:id", middleware.verify, users.update);

    router.delete("/:id", middleware.verify, users.delete);

    router.delete("/", middleware.verify, users.deleteAll);

    app.use('/api/users', router);
};