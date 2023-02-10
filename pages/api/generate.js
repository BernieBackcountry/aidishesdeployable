import { Configuration, OpenAIApi } from "openai";
import ran from 'random';

const recipe_names = ["Spaghetti Carbonara", "Stir-Fried Beef and Broccoli",
  "Chicken Tikka Masala", "Tomato Soup", "Baked Ziti",
  "Pad Thai", "Sushi Rolls", "Roasted Turkey", "Pesto Pasta Salad",
  "Hamburger Steak with Gravy", "Teriyaki Chicken Stir-Fry",
  "Vegetable Stir-Fry", "Fried Rice", "Grilled Cheese Sandwich",
  "Meatball Subs", "BBQ Ribs", "Chicken Alfredo", "Roast Beef Sandwich",
  "Taco Salad", "Potato Soup", "Taco Casserole", "Pumpkin Pie",
  "Apple Pie", "Blueberry Muffins", "Chocolate Chip Cookies",
  "Banana Bread", "Red Velvet Cupcakes", "Carrot Cake",
  "Pecan Pie", "Cheesecake", "Lemon Bars", "Brownies",
  "Pumpkin Bread", "Cherry Pie", "Peanut Butter Cookies",
  "Oatmeal Raisin Cookies", "Snickerdoodles", "Gingerbread Cookies",
  "Sugar Cookies", "Shortbread Cookies", "Chocolate Cake",
  "Vanilla Cake", "Strawberry Shortcake", "Baked Macaroni and Cheese",
  "Beef Stroganoff", "Chili Con Carne", "Baked Salmon",
  "Grilled Shrimp Skewers", "Tuna Salad Sandwich",
  "BLT Sandwich", "Peanut Butter and Jelly Sandwich",
  "Grilled Chicken Sandwich", "Vegetable Curry",
  "Beef and Vegetable Stir-Fry", "Shrimp Scampi",
  "Crab Cakes", "Lobster Bisque", "Shrimp Alfredo",
  "Clam Chowder", "Seafood Paella", "Grilled Swordfish Steaks",
  "Baked Cod with Lemon Butter", "Crab Stuffed Mushrooms",
  "Scallops with Garlic Butter", "Baked Oysters Rockefeller",
  "Lobster Roll", "Shrimp Po' Boy Sandwich",
  "Crab Louie Salad", "Fried Catfish with Tartar Sauce",
  "Grilled Tuna Steaks", "Baked Scallops Au Gratin",
  "Seafood Chowder", "Coconut Shrimp with Sweet Chili Sauce",
  "Tuna Noodle Casserole", "Crawfish Etouffee", "Shrimp Boil",
  "Lobster Newburg", "Crab Dip", "Seafood Gumbo",
  "Shrimp and Grits", "Grilled Lobster Tails", "Fried Shrimp"];

const selected_recipe = ran.choice(recipe_names)

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

  const food = req.body.food || selected_recipe;

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

    // Generate instructions
    const nutritionCompletion = await openaiApi.createCompletion({
      prompt: "Give me just the nutrition facts for the recipe " + titleCompletion.data.choices[0].text + " in plain text",
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

    if (!imageResponse.data.data.length) {
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
        nutritionWords: nutritionCompletion.data.choices[0].text,
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









