class recipe {
    constructor(name, url, imageURL, servings, cals) {
        this.name = name;
        this.url = url;
        this.imageURL = imageURL;
        this.ingredients = []; //An array of foodItem objects
        this.servings = servings;
        this.dietaryInfo = {} //An object of dietary info (use the total nutirents object from edamam call)
        this.mealPlanSlot;
    }

}

class foodItem {
    constructor(name, upc) {
        this.name = name;
        this.barcode = upc;
    }
}