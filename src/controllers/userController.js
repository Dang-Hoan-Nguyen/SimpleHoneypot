import LLM from "../controllers/LLMPower";



const renderAdminPage = async (req, res) => {
    
    let data = await LLM.GenerateInstance();

    console.log(typeof data);
    
    return res.render("admin", {data: data || []});
}


module.exports = {
    renderAdminPage: renderAdminPage
}