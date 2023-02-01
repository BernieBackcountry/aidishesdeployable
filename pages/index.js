import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [foodInput, setfoodInput] = useState("");
  const [titleWords, setTitleWords] = useState();
  const [ingredientWords, setIngredientWords] = useState();
  const [instructionWords, setInstructionWords] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [ingredients, setIngredients] = useState([{ id: 1, value: "" }]);
  const [isLoading, setIsLoading] = useState(false);
  const [showImage, setShowImage] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setShowImage(true);
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ food: foodInput }),
      });

      const data = await response.json();
      setIsLoading(false);
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

  const deleteRow = (id) => {
    setIngredients(ingredients.filter((ingredient) => ingredient.id !== id));
    setfoodInput(ingredients.filter((ingredient) => ingredient.id !== id)
      .map((i) => i.value)
      .join(","));
  };

  return (
    <div >
      <form id="ingredientsForm" onSubmit={onSubmit} className={styles.ingredientform}>
        <div className={styles.format}>
          {ingredients
            .filter((ingredient) => ingredient.value != null)
            .map((ingredient) => (
              <div key={ingredient.id} className={styles.container}>
                <input
                  type="text"
                  placeholder="Enter an Ingredient"
                  defaultValue={ingredient.value}
                  onChange={(e) => onChange(e, ingredient.id)}
                  className={styles.ingredientform}
                />

                <button type="button" className={styles.deletebtn} onClick={() => deleteRow(ingredient.id)}>
                  Remove</button>
              </div>
            ))}
        </div>
        <div>
          <button type="button" onClick={addRow} className={styles.addbtn}>
            Add Ingredient
          </button>
          <br />
          <input type="submit" value="Generate Recipes" className={styles.generatebtn} />
        </div>
      </form>
      <div> { isLoading ? <img src="https://media.tenor.com/JwPW0tw69vAAAAAi/cargando-loading.gif" className={styles.loading} /> :
        <div>
          <div id="title" className={styles.title}>{titleWords}</div>
          <br />
          <br />
          
          <div id="ingredients" className={styles.ingredients}>{ingredientWords}</div>
          <br />
          <br />
          
          <div id="instructions" className={styles.instructions}>{instructionWords}</div>
      
            {showImage ? <img src={imageUrl} alt="Recipe Image" className={styles.image} /> : null}
        
        </div>
      }
      </div>
    </div>
  );
}
