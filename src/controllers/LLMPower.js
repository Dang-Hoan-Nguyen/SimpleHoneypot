import OpenAI from "openai";
import YAML from "js-yaml";
import fs from "fs";
require("dotenv").config();

const getHTML = "./src/PromptTemplates/page_retrieval.yaml";
const getHTML_template = YAML.load(fs.readFileSync(getHTML, "utf-8"));

const getFile = "./src/PromptTemplates/generate_file.yaml";
const getFile_template = YAML.load(fs.readFileSync(getFile, "utf-8"));

const getSQL = "./src/PromptTemplates/query_sql_database.yaml";
const getSQL_template = YAML.load(fs.readFileSync(getSQL, "utf-8"));

const GI = "./src/PromptTemplates/table_generate.yaml";
const GI_template = YAML.load(fs.readFileSync(GI, "utf-8"));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const PasreRequest = (req_method, req_path) => {
  let request = `${req_method} ${req_path} HTML/1.1\nHost: localhost:8080\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36\nAccept: */*\n`;
  return request;
};

const ParseResponse = (response) => {
  let parsed_response = response;
  // console.log(typeof response);
  if (typeof response == "string") {
    let start = 0;
    let end = response.length;

    for (start; start < end; start++) {
      if (response[start] == "{") break;
    }

    for (end; end >= 0; end--) {
      if (response[end] == "}") break;
    }

    response = response.slice(start, end + 1);
    // console.log(response);
    parsed_response = JSON.parse(response);
    try {
      parsed_response.Body = JSON.parse(parsed_response.Body);
    } catch (e) {
      parsed_response.Body = parsed_response.Body;
    }
  }
  return parsed_response;
};

// Loading template and sample data for LLM query
const PromptLLM = async (
  req_method,
  req_path,
  datatype,
  cached_sample,
  cache_situation
) => {
  let request = PasreRequest(req_method, req_path);

  let system_prompt = getHTML_template["system_prompt"];
  let user_prompt = getHTML_template["user_prompt"];

  if (datatype == "SQL") {
    system_prompt = getSQL_template["system_prompt"];
    user_prompt = getSQL_template["user_prompt"];
    // When the request is cached but outdated
    system_prompt.replace(
      "${sample}",
      `Previously cached response : ${cached_sample}`
    );
  } else if (datatype == "TEXT" || datatype == "JSON") {
    system_prompt = getFile_template["system_prompt"];
    user_prompt = getFile_template["user_prompt"];
  }



  // When the request is not cached
  if (cache_situation == false) {
    system_prompt = await system_prompt.replace(
      "${sample}",
      `FILE CONTENT EXAMPLE: "${cached_sample}"` // `Sample file body : ${cached_sample}`
    );
    // console.log("correct: ", system_prompt);
  } else {
    system_prompt = await system_prompt.replace(
      "${sample}",
      `Previously cached response : ${cached_sample}`
    );
  }

  //
  user_prompt = await user_prompt.replace("${request}", request);

  console.log("_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-");
  console.log(cache_situation);
  console.log(system_prompt);
  console.log(user_prompt);
  console.log("_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-");

  const chatCompletion = await client.chat.completions.create({
    messages: [
      { role: "system", content: system_prompt },
      { role: "user", content: user_prompt },
    ],
    model: "gpt-3.5-turbo-1106",
    temperature: 0,
  });
  console.log(chatCompletion.choices[0].message.content);
  let parsed_reponse = ParseResponse(chatCompletion.choices[0].message.content);

  let s_response = JSON.stringify(parsed_reponse, null, 2);
  let file_name = req_path.replace("/", "");
  let dir = "./src/cached_answer/" + file_name + ".json";

  // Write JSON string to cache file
  fs.writeFile(dir, s_response, (err) => {
    if (err) {
      console.error("Error writing JSON to file:", err);
      return;
    }
  });

  return parsed_reponse;
};


const GenerateInstance = async () => {

  let system_prompt = GI_template["system_prompt"];
  let user_prompt = GI_template["user_prompt"];

  console.log(system_prompt);
  console.log(user_prompt);

  const chatCompletion = await client.chat.completions.create({
    messages: [
      { role: "system", content: system_prompt },
      { role: "user", content: user_prompt },
    ],
    model: "gpt-3.5-turbo-1106",
    temperature: 0,
  });

  console.log(chatCompletion.choices[0].message.content);
  return JSON.parse(chatCompletion.choices[0].message.content);
}

module.exports = {
  PromptLLM: PromptLLM,
  GenerateInstance: GenerateInstance,
};
