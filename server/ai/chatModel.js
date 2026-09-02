const {ChatGoogleGenerativeAI} = require("@langchain/google-genai") ;
const chatModel = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: process.env.GEMINI_API_KEY,
    temperature: 0.3,
});

module.exports = chatModel;