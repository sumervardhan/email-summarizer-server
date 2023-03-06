const { Configuration, OpenAIApi } = require('openai');
const express = require('express');
const url = require('url');
const querystring = require('querystring');
const path = require('path');
const PORT = process.env.PORT || 5000;

// Uncomment below line to access API KEY stored locally in .env
// Make sure to not push key to github
// require('dotenv').config();


// openai API call params
const MODEL = "gpt-3.5-turbo"
const CHAT_BOT_PRIMER = "You are a my secretary. I am a busy CEO. Your job is "
                        + "to help summarise my emails. Highlight "
                        + "important points, questions, and action items."
const SUMMARY_GENERATION_PROMPT = "Summarise this email. Structure the summary "
                                  + "as three lists - Important Points, Questions "
                                  + "and Action Items.\n"                              


express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/handleOpenaiApiCall', async function(req, res) {
    const response = await makeOpenAiApiCall(req);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(response);
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


  async function makeOpenAiApiCall(req){
    try {
      const parsedUrl = url.parse(req.url);
      const query = querystring.parse(parsedUrl.query);
      console.log(query)
      const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);
      const response = await openai.createChatCompletion({
        model: MODEL,
        messages: [
          {"role": "system", "content": CHAT_BOT_PRIMER},
          {"role": "user", "content": SUMMARY_GENERATION_PROMPT + decodeURIComponent(query.input_data)}
        ]
      });
      return response.data.choices[0].message.content
    }
    catch (exception){
      console.log(exception)
    }
  }