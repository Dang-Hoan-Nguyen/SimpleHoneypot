import express from "express";
import generalController from "../controllers/generalController"



let router = express.Router();

let initPublicWebRoutes = (app) => {


    // Public routes 

    return app.use("/", router);
}


module.exports = initPublicWebRoutes;