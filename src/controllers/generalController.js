import { setServers } from "dns";
import LLM from "../controllers/LLMPower";

import fs from "fs";

const dir = "./src/cached_answer/";
const sample_dir = "./src/upload/";

const renderIndex = (req, res) => {
  // console.log(req.session.user);
  return res.redirect("/user/admin");
};

// Check of the request is cached and not outdated
// If yes, return the cache
// Else, issue new query
const CheckCache = (req, res, next) => {
  req.cached = false;
  req.cached_sample = "";
  req.type = "HTML";
  if (req.path.endsWith(".json")) {
    req.type = "JSON";
  } else if (req.path.endsWith(".txt")) {
    req.type = "TEXT";
  }
  console.log("-------- Abnormal request", req.method, req.path, "---------");
  req.pool.getConnection((err, connection) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }
    let query = "SELECT * FROM cache WHERE req = ?;";

    connection.query(query, [req.path], (eror, result, field) => {
      connection.release();
      if (eror) {
        console.error(eror);
        return res.sendStatus(500);
      }
      if (result.length !== 0) {
        let today = new Date();
        let cached_date = new Date(result[0][`created_time`]);
        req.cached = true;

        // If the cache is more than 5 days old
        if (
          (today.getTime() - cached_date.getTime()) / (1000 * 3600 * 24) >=
          5
        ) {
          // console.log("outdate");
          req.cached_sample = result;
          LLMController(req, res);
          return;
        } else {
          // console.log(
          //   "diff: ",
          //   Math.abs(today.getTime() - cached_date) / (1000 * 3600 * 24)
          // );
          // console.log("Today: ", today);
          // console.log("Today getTime: ", today.getTime());
          // console.log("unparsed cached date: ", result[0][`created_time`]);
          // console.log("Cached date: ", cached_date);
          // console.log("Cached date getTime(): ", cached_date.getTime());
          // console.log("Request found in cache");
          let file_path = dir + result[0]["url_to_file"];
          console.log(result);
          console.log(file_path);
          // Check if the file is in cache
          fs.readFile(
            sample_dir + result[0]["url_to_file"].replace(".json", ""),
            "utf8",
            (err, loaded_sample_data) => {
              if (err) {
                console.log(
                  "File not found ",
                  sample_dir + result[0]["url_to_file"].replace(".json", "")
                );
                return res.sendStatus(404);
              }
              // console.log(loaded_sample_data);
              //
              fs.readFile(file_path, "utf8", (err, data) => {
                if (err) {
                  console.error("Error reading file:", err);
                  req.cached_sample = loaded_sample_data;
                  LLMController(req, res);
                  return;
                }
                try {
                  // Parse JSON data
                  let result_data = JSON.parse(data);
                  // console.log("Result data:", result_data);
                  let result_body = result_data.Body;
                  if (req.path.includes(".txt"))
                    res.setHeader("Content-Type", "text/plain");

                  return res.send(result_body);
                } catch (parseErr) {
                  console.error("Error parsing JSON:", parseErr);
                }
              });
            }
          );
        }
      } else {
        console.log("Request not found in cache");
        fs.readFile(
          sample_dir + req.path,
          "utf8",
          (err, loaded_sample_data) => {
            if (err) {
              console.log(
                "File not found "
              );
              return res.sendStatus(404);
            }
            // console.log(loaded_sample_data);
            req.cached_sample = loaded_sample_data
            LLMController(req, res);
            
          }
        );
      }
    });
  });
};

// Issue a query when needed
const LLMController = (req, res, next) => {
  let file_name = req.path.replace("/", "");
  const llm_response = new Promise(async (resolve, reject) => {
    try {
      let response = await LLM.PromptLLM(
        req.method,
        req.path,
        req.type,
        req.cached_sample,
        req.cached
      );
      console.log("======================");
      console.log(response["Body"]);
      console.log("======================");
      req.pool.getConnection((err, connection) => {
        if (err) {
          console.log("here1");
          res.sendStatus(500);
          return;
        }
        let url = file_name + ".json";

        let query = "Insert INTO cache (req, url_to_file) VALUES (?, ?);";
        let params = [req.path, url];

        if (req.cached == true) {
          query =
            "UPDATE cache SET created_time = CURRENT_DATE() WHERE req = ?";
          params = [req.path];
        }

        console.log("herer123");

        connection.query(query, params, (eror, result, field) => {
          connection.release();
          if (eror) {
            console.error(eror);
            res.sendStatus(500);
            return;
          }
          console.log("herer");
          return res
            .status(parseInt(response.Headers["Status Code"], 10))
            .send(response["Body"]);
        });
      });
    } catch (e) {
      reject(e);
      return res.status(404);
    }
  });
};

module.exports = {
  renderIndex: renderIndex,
  CheckCache: CheckCache,
};
