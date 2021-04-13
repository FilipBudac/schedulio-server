
module.exports = app => {
    const users = require("../controllers/user-controller");
    const router = require("express").Router();
    const middleware = require("../middleware");

    router.post("/login", users.login);

    router.delete("/logout", users.logout);

    router.post("/sign", users.signUp);

    router.post("/token", users.refreshToken);

    router.get("/", middleware.verify, users.findAll);

    router.delete("/", middleware.verify, users.deleteAll);

    router.get("/:id", middleware.verify, users.findOne);

    router.put("/:id", middleware.verify, users.update);

    router.delete("/:id", middleware.verify, users.delete);

    app.use('/api/users', router);
};