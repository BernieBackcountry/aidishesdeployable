import { useState } from "react";
import styles from "./index.module.css";
import generate from "./api/generate";


export default function Home() {
  const [foodInput, setfoodInput] = useState("");
  const [titleWords, setTitleWords] = useState();
  const [counter, setCounter] = useState(1);
  const [ingredientWords, setIngredientWords] = useState();
  const [instructionWords, setInstructionWords] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [ingredients, setIngredients] = useState([{ id: 1, value: "" }]);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ food: foodInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      setTitleWords(data.titleWords);
      setIngredientWords(data.ingredientWords)
      setInstructionWords(data.instructionWords)
      setImageUrl(data.imageUrl);
      setfoodInput("");

    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  const onChange = (e, id) => {
    const newIngredients = [...ingredients];
    const index = newIngredients.findIndex((i) => i.id === id);
    newIngredients[index].value = e.target.value;
    setIngredients(newIngredients);
    setfoodInput(newIngredients.map((i) => i.value).join(","));
  };

  const addRow = () => {
    setIngredients([...ingredients, { id: Date.now(), value: "" }]);
  }


  return (
    <div>
      <form id="ingredientsForm" onSubmit={onSubmit} className={styles.ingredientform}>
        <div className={styles.format}>
          {ingredients
            .filter((ingredient) => ingredient.value != null)
            .map((ingredient) => (
              <div key={ingredient.id}>
                <input
                  type="text"
                  placeholder="Enter an Ingredient"
                  defaultValue={ingredient.value}
                  onChange={(e) => onChange(e, ingredient.id)}
                  className={styles.ingredientform}
                />
              </div>
            ))}
        </div>
        <div>
          <button type="button" onClick={addRow} className={styles.generatebtn}>
            ADD
          </button>
          <br />
          <input type="submit" value="Generate Recipes" className={styles.generatebtn} />
        </div>
      </form>
      <div id="title" className={styles.title}>{titleWords}</div>
      <br/>
      <br/>
      <div id="ingredients" className={styles.ingredients}>{ingredientWords}</div>
      <br/>
      <br/>
      <div id="instructions" className={styles.instructions}>{instructionWords}</div>
      <br/>
      <div>
        <img src={imageUrl} alt="Recipe Image" className={styles.image} />
      </div>
    </div>
  );
}
