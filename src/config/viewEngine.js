import express from "express";
// const path = require("path");
const serveIndex = require("serve-index");


let configViewEngine = (app) => {
    app.use("/public", express.static("./src/public"), serveIndex("./src/public", {icons: true}));
    app.set("view engine", "ejs");
    app.set("views", "./src/views");
}

module.exports = configViewEngine;