const { Configuration, OpenAIApi } = require("openai");
const bodyParser = require('body-parser')
require('dotenv').config()
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

// openai API call params
const MODEL = "gpt-3.5-turbo"
const CHAT_BOT_PRIMER = "You are a my secretary. I am a busy CEO. Your job is "
                        + "to help summarise my emails. Highlight "
                        + "important points, questions, and action items."
const SUMMARY_GENERATION_PROMPT = "Summarise this email. Structure the summary "
                                  + "as three lists - Important Points, Questions "
                                  + "and Action Items.\n"

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })                                 


express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/handleOpenaiApiCall', urlencodedParser, async function(req, res) {
    const response = await makeOpenAiApiCall(req);
    res.send(response);
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


  async function makeOpenAiApiCall(req){
    try {
      const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);
      const response = await openai.createChatCompletion({
        model: MODEL,
        messages: [
          {"role": "system", "content": CHAT_BOT_PRIMER},
          {"role": "user", "content": SUMMARY_GENERATION_PROMPT + req.body.input_data}
        ]
      });
      return response.data.choices[0].message.content
    }
    catch (exception){
      console.log(exception)
    }
  }