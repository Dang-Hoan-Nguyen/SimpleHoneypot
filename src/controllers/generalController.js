import LLM from "../controllers/LLMPower";


const renderIndex = (req, res) => {
    return res.render("copies.ejs");
}

const testPage = (req, res) => {
    const llm_response = new Promise (async (resolve, reject) => {
        try {
            let response = await LLM.PromptLLM("GET /are-you-a-honey-pot HTML/1.1\nHost: localhost:8080\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36\nAccept: */*\n", "HTML");
            resolve (response);
            console.log(response);
            console.log(typeof response);
             return res.status(parseInt(response.Headers["Status Code"], 10)).send(response["Body"]);

        } catch (e) {
            reject (e);
            return res.status(404);
        }
    });




}

module.exports = {
    renderIndex: renderIndex,
    testPage: testPage,
}