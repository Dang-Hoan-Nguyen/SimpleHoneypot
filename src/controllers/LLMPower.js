import OpenAI from "openai";
import YAML from "js-yaml";
import fs from "fs";
require('dotenv').config();

const getHTML = './src/PromptTemplates/page_retrieval.yaml';
const getHTML_template = YAML.load(fs.readFileSync(getHTML, 'utf-8'));

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const PasreRequest = () => {
    return;
}

const ParseResponse = (response) => {

    let parsed_reponse = response;
    console.log(typeof response)
    if (typeof response == "string") {
        let start = 0;
        let end = response.length;

        for (start; start < end; start++) {
            if (response[start] == '{') break;
        }

        for (end; end >= 0; end --) {
            if (response[end] == '}') break;
        }

        response = response.slice(start, end+1);
        // console.log(response);
        // console.log(start);
        // console.log(end);
        // console.log(typeof response);
        // console.log("------");
        // response = match[0];
        parsed_reponse = JSON.parse(response);
    }
    return parsed_reponse;
}

const PromptLLM = async (request, datatype) => {
    let system_prompt = getHTML_template['system_prompt'];
    let user_prompt = getHTML_template['user_prompt'];
    user_prompt = user_prompt.replace('${request}', request);
    const chatCompletion = await client.chat.completions.create({
        messages: [{role: 'system', content: system_prompt}, { role: 'user', content: user_prompt }],
        model: 'gpt-3.5-turbo-1106',
        temperature:0,
      });
    // console.log(chatCompletion.choices[0].message);
    let parsed_reponse = ParseResponse(chatCompletion.choices[0].message.content);
    return parsed_reponse;
}

module.exports = {
    PromptLLM: PromptLLM,
}