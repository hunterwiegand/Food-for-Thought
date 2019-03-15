
//      EDAMAM RECIPE DATABASE
// Edamam application Id -- e09fb63c
// Edamam key -- e3f22d5545ff1c55fcf99f5fb6d19266	
//      EDAMAM FOOD DATABASE
// Edamam Food databass Id -- cd666e09
// Edamam Food database key -- 13cb0a3f237838bbc1414d50596d2015


//Variables for EDAMAM RECIPE DATABASE
var edaRecId = "e09fb63c";
var edaRecKey = "e3f22d5545ff1c55fcf99f5fb6d19266";
var userFoodItem = "Chicken";

// Variables for EDAMAM FOOD DATABASE
var edaFoodId = "cd666e09";
var edaFoodKey = "13cb0a3f237838bbc1414d50596d2015";
var barcodeNum = "023700043825"

var recipeLabel = "";
var foodLabel = "";


//Function to call EDAMAM RECIPE DATABASE
function callEdaRec() {
    var queryURL = "https://api.edamam.com/search?q=" + userFoodItem + "&app_id=" + edaRecId + "&app_key=" + edaRecKey;
    console.log(queryURL);

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        console.log(response);

        var hits = response.hits;

        for (var i = 0; i < hits.length; i++) {
        
            recipeLabel = hits[i].recipe.label;
            console.log(recipeLabel);
        }
    })

}
//Function to call EDAMAM FOOD DATABASE
function callEdaFood() {
    var queryURL = "https://api.edamam.com/api/food-database/parser?upc=" + barcodeNum + "&app_id=" + edaFoodId + "&app_key=" + edaFoodKey;
    console.log(queryURL);

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        var hints = response.hints;

        foodLabel = hints[0].food.label;
        console.log(foodLabel);
    })

    

}

// callEdaRec();
// callEdaFood();