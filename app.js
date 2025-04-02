import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load config
dotenv.config();

// Load express
const app = express();
const PORT = 3000;

app.use("/", express.static('public'));
app.use(express.json());

app.post('/api/translate', async (req, res) => {
  const { text, targetlang } = req.body;
  const promptSystem1 = 'You are a professional translate.';
  const promptSystem2 =
    'You can only respond with a direct translation of the text, any other type of answer is prohibited.';
  const promptUser = `Translate the following to ${targetlang}: ${text}`;

  try {
    const openai = new OpenAI({ apiKey: process.env.OPEN_API_KEY });
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: promptSystem1,
        },
        {
          role: 'system',
          content: promptSystem2,
        },
        {
          role: 'user',
          content: promptUser,
        },
      ],
      max_tokens: 500,
      store: true,
      response_format: { type: 'text' },
    });

    const translatedText = completion.choices[0].message.content;
    return res.status(200).json({ translatedText });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Translate error' });
  }
});

app.listen(PORT, () => {
  console.log('hello', process.env.PORT)
  console.log(`App runing in port ${ PORT }`);
})
