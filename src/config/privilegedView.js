import express from "express";
// const path = require("path");
const serveIndex = require("serve-index");


let configPrivilegedViewEngine = (app) => {
    app.use ((req, res, next) => {
        let role = req.cookies.role;
        if (role !== "admin") {
            return res.send("You are not a privileged user.");
        }
        next();
    });
    app.use("/upload", express.static("./src/upload"), serveIndex("./src/upload", {icons: true}));
}

module.exports = configPrivilegedViewEngine;