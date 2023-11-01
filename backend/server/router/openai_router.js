const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: "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",
});
const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post("/chat", async (req, res) => {
  const { prompt } = req.body;
  const completion = await openai.completions.create({
    model: "text-davinci-003",
    max_tokens: 512,
    temperature: 0,
    prompt: prompt,
  });
  res.send(completion.choices[0].text);
});

const PORT = 8020;
app.listen(PORT, () => {
  console.log(`Successfully running on PORT ${PORT}`);
});
