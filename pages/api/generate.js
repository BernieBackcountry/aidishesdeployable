import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openaiApi = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const food = req.body.food || 'chicken';

  try {
    // Generate recipe title
    const titleCompletion = await openaiApi.createCompletion({
      prompt: generatePrompt(food),
      model: "text-davinci-003",
      temperature: 0.5,
      max_tokens: 10,
      top_p: 1,
      frequency_penalty: 1,
      presence_penalty: 1
    });

    // Generate ingredients
    const ingredientCompletion = await openaiApi.createCompletion({
      prompt: "Give me just the ingredients for the recipe " + titleCompletion.data.choices[0].text + " in plain text , and print the word ingredients",
      model: "text-davinci-003",
      temperature: 0.5,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 1,
      presence_penalty: 1
    });

    // Generate instructions
    const instructionCompletion = await openaiApi.createCompletion({
      prompt: "Give me just the instructions for the recipe " + titleCompletion.data.choices[0].text + " in plain text, and print the word instructions",
      model: "text-davinci-003",
      temperature: 0.5,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 1,
      presence_penalty: 1
    });

    // Generate image
    const imageResponse = await openaiApi.createImage({
      prompt: titleCompletion.data.choices[0].text,
      n: 1,
      size: "256x256",
    });

    if (!imageResponse.data.data.length){
      res.status(500).json({
        error: {
          message: 'No image suggestions found',
        }
      });
      return;
    } else {
      const imageUrl = imageResponse.data.data[0].url;

      res.status(200).json({
        titleWords: titleCompletion.data.choices[0].text,
        ingredientWords: ingredientCompletion.data.choices[0].text,
        instructionWords: instructionCompletion.data.choices[0].text,
        imageUrl: imageUrl
      });
    }
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
      })
    }
  }
}


function generatePrompt(food) {
  const capitalizedFood =
    food[0].toUpperCase() + food.slice(1).toLowerCase();
  return `Suggest a recipe title that uses these ingredients
food: ${capitalizedFood}
recipe:`;
}









