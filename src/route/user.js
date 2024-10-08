import express from "express"
import userController from "../controllers/userController"

let router = express.Router();

let initUserWebRoutes = (app) => {

    router.get("/admin", userController.renderAdminPage)

    return app.use("/user/", router)
};

module.exports = initUserWebRoutes;