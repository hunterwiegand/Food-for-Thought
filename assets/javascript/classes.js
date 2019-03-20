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
    constructor(foodItemJSON, quantity = 1, measurement = "unit", category = "none") {
        this.name = foodItemJSON.label;
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