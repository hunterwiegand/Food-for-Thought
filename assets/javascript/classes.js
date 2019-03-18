class recipe {
    constructor(recipeJSON) {
        this.name = recipeJSON.label;
        this.url = recipeJSON.url;
        this.source = recipeJSON.source;
        this.imageURL = recipeJSON.image;
        this.servings = recipe.yield;
        this.ingredients = []; //An array of foodItem objects
        this.nutrition = new nutritionInfo({
            ENERC_KCAL: recipeJSON.totalNutrients.ENERC_KCAL.quantity,
            PROCNT: recipeJSON.totalNutrients.PROCNT.quantity,
            CHOCDF: recipeJSON.totalNutrients.CHOCDF.quantity
        })
        this.mealPlanSlot;
    }

    HTML() {
        let containerDiv = $("<div>");
        containerDiv.append($("<img>").attr("src", this.imageURL));
        containerDiv.append($("<span>").text(this.name));
        containerDiv.append($("<span>").text("Servings: " + this.servings));

        return recipeDiv;
    }
}

class foodItem {
    constructor(foodItemJSON) {
        this.name = foodItemJSON.label;
        this.nutrition = new nutritionInfo(foodItemJSON.nutrients);
    }

    HTML() {
        let containerDiv = $("<div>");
        containerDiv.append($("<span>").text(this.name));
        containerDiv.append($("<span>").html(this.nutrition.HTML()))
        return containerDiv;
    }
}

class nutritionInfo {
    constructor(nutritionJSON) {
        this.calories = nutritionJSON.ENERC_KCAL;
        this.protien = nutritionJSON.PROCNT;
        this.cholestorol = nutritionJSON.CHOCDF
    }

    HTML() {
        let containerDiv = $("<div>");
        containerDiv.attr("class", "nutrition-info")
        containerDiv.append($("<span>").text("Nutritional Info:"));
        containerDiv.append($("<span>").text("Calories: " + this.calories + "g"));
        containerDiv.append($("<span>").text("Protien: " + this.protien + "g"));
        containerDiv.append($("<span>").text("Cholestorol: " + this.cholestorol + "g"));

        return containerDiv
    }
}