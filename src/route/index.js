import express from "express";
import generalController from "../controllers/generalController";



let router = express.Router();

let initPublicWebRoutes = (app) => {

    router.get("/", generalController.renderIndex);
    router.get("/are-you-a-bank", generalController.CheckCache);
    router.get("/hello", (req, res) => {res.render("index.ejs")});
    router.get("/:request", generalController.CheckCache);
    router.get("/public/:request", generalController.CheckCache);
    router.get("/upload/:request", generalController.CheckCache);
    return app.use("/", router);

}


module.exports = initPublicWebRoutes;