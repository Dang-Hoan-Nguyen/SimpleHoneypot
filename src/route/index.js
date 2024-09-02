import express from "express";
import generalController from "../controllers/generalController";



let router = express.Router();

let initPublicWebRoutes = (app) => {


    // Public routes 

    router.get("/", generalController.renderIndex);
    router.get("/testllm", generalController.testPage);
    router.get("/hello", (req, res) => {res.render("index.ejs")});

    return app.use("/", router);
}


module.exports = initPublicWebRoutes;