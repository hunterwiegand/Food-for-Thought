class recipe {
    constructor(recipeJSON) {
        this.name = recipeJSON.label;
        this.url = recipeJSON.url;
        this.source = recipeJSON.source;
        this.imageURL = recipeJSON.image;
        this.servings = recipeJSON.yield;
        this.ingredients = recipeJSON.ingredientLines;
        this.nutrition = new nutritionInfo({
            ENERC_KCAL: recipeJSON.totalNutrients.ENERC_KCAL.quantity,
            PROCNT: recipeJSON.totalNutrients.PROCNT.quantity,
            CHOCDF: recipeJSON.totalNutrients.CHOCDF.quantity
        })
        this.mealPlanSlot;
    }
}

class foodItem {
    constructor(foodItemJSON, measurement, quantity, category) {

        let counter = "0";
        let nameArr = [];
        let nameStr = foodItemJSON.label;
        let name = "";


        console.log(typeof nameStr);
        console.log(nameStr);
        console.log(nameStr.length);

        for (var i = 0; i < nameStr.length + 1; i++) {
            if (nameStr.charAt(i) != ",") {
                nameArr.push(nameStr.charAt(i));
            } else if (nameStr.charAt(i) === "," && counter === "0") {
                nameArr.push(nameStr.charAt(i));
                counter++;
            } else {
                break;
            }
        }

        console.log("nameArr: ", nameArr);

        name = nameArr.join("");

        console.log(name);
        

        this.name = name;
        this.quantity = quantity;
        this.measurement = measurement;
        this.category = category;
    }
}

class nutritionInfo {
    constructor(nutritionJSON) {
        this.calories = Math.floor(nutritionJSON.ENERC_KCAL);
        this.protien = Math.floor(nutritionJSON.PROCNT);
        this.cholestorol = Math.floor(nutritionJSON.CHOCDF);
    }
}