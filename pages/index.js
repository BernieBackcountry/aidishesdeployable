import { useState } from "react";
import styles from "./index.module.css";




export default function Home() {
  const [foodInput, setfoodInput] = useState("");
  const [result, setResult] = useState();
  const [counter, setCounter] = useState(1);
  const [ingredients, setIngredients] = useState([{ id: 1, value: "" }]);
  //const [image, setImage] = useState();



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
      setResult(data.result);
      setfoodInput("");

    } catch (error) {
      console.error(error);
      alert(error.message);
    }

    /*try {
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
      setResult(data.result);
      setfoodInput("");

    } catch (error) {
      console.error(error);
      alert(error.message);
    }

*/
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
      <div id="final" className={styles.result}></div>
      {
        <div id="final" dangerouslySetInnerHTML={{ __html: result }} className={styles.result} />
      }
    </div>
  );
}