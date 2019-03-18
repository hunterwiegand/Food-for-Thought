class recipe {
    constructor(recipeJSON) {
        this.name = recipeJSON.label;
        this.url = recipeJSON.url;
        this.source = recipeJSON.source;
        this.imageURL = recipeJSON.image;
        this.servings = recipe.yield;
        this.ingredients = []; //An array of foodItem objects
        this.dietaryInfo = []; //An object of dietary info (use the total nutirents object from edamam call)
        this.mealPlanSlot;
    }

    HTML() {
        let recipeDiv = $("<div>");
        recipeDiv.append($("<img>").attr("src", this.imageURL));
        recipeDiv.append($("<span>").text(this.name));
        recipeDiv.append($("<span>").text("Servings: " + this.servings));

        return recipeDiv;
    }
}

class foodItem {
    constructor(name, upc) {
        this.name = name;
        this.barcode = upc;
    }

    pantryHTML() {
        let pantryItemDiv = $("<div>");
        pantryItemDiv.append($("<span>").text(this.name));
        return pantryItemDiv;
    }

    shoppingListHTML() {
        let shoppingListItemDiv = $("<div>");
        shoppingListItemDiv.append($("<span>").text(this.name));
        return shoppingListItemDiv;
    }
}