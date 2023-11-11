const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post("/chat", async (req, res) => {
  const prompt = req.body.currentMessage;
  console.log(prompt);
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: prompt,
  });
  console.log(completion.choices[0].message);
  res.send(completion.choices[0].message);
});

app.post("/ask", async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log(prompt);
    const completion = await openai.completions.create({
      model: "text-davinci-003",
      max_tokens: 512,
      temperature: 0,
      prompt: prompt,
    });
    res.send(completion.choices[0].text);
  }
  catch (err) {
    if (err.type === 'invalid_request_error') {
      res.send(err.message)
    }
    console.log(err.type)
  }
});

const PORT = 8020;
app.listen(PORT, () => {
  console.log(`Successfully running on PORT ${PORT}`);
});
