class recipe {
    constructor(name, url) {
        this.name = name;
        this.url = url;
        this.ingredients = []; //An array of foodItem objects
        this.servings;
        this.dietaryInfo = {} //An object of dietary info
        this.mealPlanSlot;
    }

}

class foodItem {
    constructor(name) {
        this.name = name;
        this.barcode;
    }
}