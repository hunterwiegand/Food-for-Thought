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

    html() {
        let containerDiv = $("<div>");
        containerDiv.attr("class", "recipe-container")
        containerDiv.append($("<img class='recipe-image'>").attr("src", this.imageURL));
        containerDiv.append($("<span class='recipe-title>").text(this.name));
        containerDiv.append($("<span class='recipe-item>").text("Servings: " + this.servings));
        containerDiv.append("<span>").html(this.nutrition.html());
        return recipeDiv;
    }
}

class foodItem {
    constructor(foodItemJSON, quantity = 1, measurement = "unit") {
        this.name = foodItemJSON.label;
        this.nutrition = new nutritionInfo(foodItemJSON.nutrients);
        this.quantity = quantity;
        this.measurement = measurement;
    }

    html() {
        let containerDiv = $("<div>");
        containerDiv.append($("<span class='food-item-title'>").text(this.name));
        containerDiv.append($("<span class='food-item-item>").text("Quantity: " + this.quantity + this.measurement));
        containerDiv.append($("<span>").html(this.nutrition.html()))
        return containerDiv;
    }
}

class nutritionInfo {
    constructor(nutritionJSON) {
        this.calories = Math.floor(nutritionJSON.ENERC_KCAL);
        this.protien = Math.floor(nutritionJSON.PROCNT);
        this.cholestorol = Math.floor(nutritionJSON.CHOCDF);
    }

    html() {
        let containerDiv = $("<div>");
        containerDiv.attr("class", "nutrition-container")
        containerDiv.append($("<span class='nutrition-header'>").text("Nutritional Info:"));
        containerDiv.append($("<span class='nutrition-statistic'>").text("Calories: " + this.calories + "g"));
        containerDiv.append($("<span class='nutrition-statistic'>").text("Protien: " + this.protien + "g"));
        containerDiv.append($("<span class='nutrition-statistic'>").text("Cholestorol: " + this.cholestorol + "g"));

        return containerDiv
    }
}