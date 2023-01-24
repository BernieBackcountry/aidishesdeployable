import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});


const openai = new OpenAIApi(configuration);
/*const prompt = "Chicken Parm";
let res;*/

export default async function (req, res, image) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const food = req.body.food || '';

  try {
    const completion = await openai.createCompletion({
      prompt: generatePrompt(food),
      model: "text-davinci-003",
      temperature: 0.5,
      max_tokens: 2000,
      top_p: 1,
      frequency_penalty: 1,
      presence_penalty: 1
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }


 /* try {

    const completion = await openai.images.create({
      prompt
      , n: 1
      , size: "1024x1024"
    });
    image.status(200).json({ result: completion.data[0].url });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }*/
}


function generatePrompt(food) {
  const capitalizedFood =
    food[0].toUpperCase() + food.slice(1).toLowerCase();
  return `Suggest a recipe that uses these ingredients, respond with recipe in jsx

  


food: ${capitalizedFood}
recipe:`;
}







