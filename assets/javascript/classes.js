class recipe {
    constructor(recipeJSON) {
        this.name = recipeJSON.label;
        this.url = recipeJSON.shareAs;
        this.imageURL = recipeJSON.image;
        this.servings = recipe.yield;
        this.ingredients = []; //An array of foodItem objects
        this.dietaryInfo = diataryInfo; //An object of dietary info (use the total nutirents object from edamam call)
        this.mealPlanSlot;
    }

}

class foodItem {
    constructor(name, upc) {
        this.name = name;
        this.barcode = upc;
    }
}