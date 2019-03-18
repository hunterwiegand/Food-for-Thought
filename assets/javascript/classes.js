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
    constructor(foodItemJSON, quantity = 0, measurement = "tonnes") {
        this.name = foodItemJSON.label;
        this.nutrition = new nutritionInfo(foodItemJSON.nutrients);
        this.quantity = quantity;
        this.measurement = measurement;
    }

    HTML() {
        let containerDiv = $("<div>");
        containerDiv.append($("<span>").text(this.name));
        containerDiv.append($("<span>").text("Quantity: " + this.quantity + this.measurement));
        containerDiv.append($("<span>").html(this.nutrition.HTML()))
        return containerDiv;
    }
}

class nutritionInfo {
    constructor(nutritionJSON) {
        this.calories = Math.floor(nutritionJSON.ENERC_KCAL);
        this.protien = Math.floor(nutritionJSON.PROCNT);
        this.cholestorol = Math.floor(nutritionJSON.CHOCDF);
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