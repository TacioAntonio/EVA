const electron = require('electron');
const { contextBridge } = electron;

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});

const openai = new OpenAIApi(configuration);

async function handleResponse(response) {
    function replaceAll(str, find, replace) {
        function escapeRegExp(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }

        return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    }

    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: response,
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
    });

    return replaceAll(completion.data.choices[0].text, '\\n', ' ');
}

contextBridge.exposeInMainWorld('electron', {
  receive: (value) => {
    return handleResponse(value);
  }
});