import { Configuration, OpenAIApi } from "openai";

const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

// openai api helper setup
const configuration = new Configuration({
  organization: "org-Ku9kxO5ElyIKsEbBhqS1FCUP",
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// openai API call params
const MODEL = "gpt-3.5-turbo"
const CHAT_BOT_PRIMER = "You are a secretary for a busy CEO. Your job is to help summarise their emails, "
                        + "highlighting important points, questions, and action items."

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/handleOpenaiApiCall', (req, res) => makeOpenAiApiCall(req, res))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

  async function makeOpenAiApiCall(req, res){
    response = openai.ChatCompletion.create(
      model= MODEL,
      messages=[
          {"role": "system", "content": CHAT_BOT_PRIMER},
          {"role": "user", "content": prompt},
          {"role": "assistant", "content": input_data},
      ],
      temperature=temperature,
  )
  }