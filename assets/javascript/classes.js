class recipe {

    constructor(recipeJSON) {
        this.name = recipeJSON.label;
        this.url = this.convertUrl(recipeJSON.url)
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

    convertUrl(url) {
        if (url.slice(0, 5) === "http:") {
            return "https" + url.slice(4)
        }
    }

}

class foodItem {
    constructor(foodItemJSON, measurement, quantity) {
        this.name = foodItemJSON.label.split(",").splice(0, 2).join(",");
        this.quantity = quantity;
        this.measurement = measurement;
        // this.category = category;
    }
}

class nutritionInfo {
    constructor(nutritionJSON) {
        this.calories = Math.floor(nutritionJSON.ENERC_KCAL);
        this.protien = Math.floor(nutritionJSON.PROCNT);
        this.cholestorol = Math.floor(nutritionJSON.CHOCDF);
    }
}