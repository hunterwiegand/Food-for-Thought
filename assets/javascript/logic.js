let pantry = [];
let shoppingList = [];
let isLoggedIn = false;
let userData;

$(document).ready(function() {
    if (!isLoggedIn) { //not logged in yet
        //Redirect to login screen
        console.log("usernot found");
    } else { //already logged in
        // generatePantry();
        generateShoppingList();
        generateCalendar();
    }
});

// Firebase Config
var config = {
    apiKey: "AIzaSyBmxS4V7it_sK4jjGlZNxrPftrb6BCn0G8",
    authDomain: "food-for-thought-bb3d4.firebaseapp.com",
    databaseURL: "https://food-for-thought-bb3d4.firebaseio.com",
    projectId: "food-for-thought-bb3d4",
    storageBucket: "food-for-thought-bb3d4.appspot.com",
    messagingSenderId: "504782992813"
};

firebase.initializeApp(config);
database = firebase.database();

//--------------------------------------------------
//              Page Setup Functions
//--------------------------------------------------


//Generate the pantry html object and display it
function generatePantry() {

    $("#pantry-list-div").empty();

    $.each(pantry, function(index, value) {
        $("#pantry-list-div").append(createFoodItemHTML(value));
    })
}


//Generate the shopping list html object and display it
function generateShoppingList() {
    $.each(shoppingList, function(index, value) {
        console.log("WARNING: need real location of shopping list html element.")

        $("#shopping-list-div").append(createPantryItemHTML(value));
    })

    console.log("WARNING: shopping list page not implemented")
    console.log("shopping list contents", shoppingList);

}

//Generate the calendar with all meals planned or load the google calendar if that's what we're doing.
function generateCalendar() {
    console.log("WARNING: generateCalendar Not currently implemented");
}



//--------------------------------------------------
//             JSON to object
//--------------------------------------------------


function createRecipeObject(recipeJSON) {
    return new recipe(recipeJSON);
}

function createFoodItemObject(foodItemJSON, measurement, quantity, category) {
    return new foodItem(foodItemJSON, measurement, quantity, category);
}




//--------------------------------------------------
//             Object to HTML
//--------------------------------------------------

function addItemToPantry(foodObject) {
    console.log(foodObject.name, "Added to pantry.");
    console.log(pantry);
    pantry.push(foodObject);
    console.log(pantry);
    updateFirebase("pantry", foodObject);
    generatePantry();
}

function addItemToShoppingList(foodObject) {
    console.log(foodObject.name, "Added to shopping list.");

    shoppingList.push(foodObject);
    generateShoppingList();
}

function createRecipeHTML(recipeObject) {
    let containerDiv = $("<div>");
    containerDiv.attr("class", "recipe-container row")
    let imageCol = $("<div>");
    imageCol.attr("class", "col-3");
    imageCol.append($("<img class='recipe-image'>").attr("src", recipeObject.imageURL));
    containerDiv.append(imageCol);
    let nameCol = $("<div>");
    nameCol.attr("class", "col-4");
    nameCol.append($("<div class='recipe-title row>").text(recipeObject.name))
    nameCol.append($("<div class='recipe-item row>").text("Servings: " + recipeObject.servings));
    nameCol.append($("<div class='row'>").append(createNutritionHTML(recipeObject.nutrition)));
    containerDiv.append(nameCol);
    let ingredientCol = $("<div>");
    ingredientCol.attr("class", "col-5");
    incredientCol.append(createIngredientsHTML(recipeObject.ingredients));
    containerDiv.append(ingredientCol);

    return containerDiv;
}

function createFoodItemHTML(foodItemObject) {
    let tableRow = $("<tr>");
    tableRow.attr("food-name", foodItemObject.name);
    tableRow.append($("<td class='food-item-title'>").text(foodItemObject.name));
    tableRow.append($("<td class='food-item-item'>").text(foodItemObject.quantity));
    tableRow.append($("<td class='food-item-item'>").text(foodItemObject.measurement));
    tableRow.append($("<td class='food-item-item'>").text(foodItemObject.category));

    return tableRow;
}

function createNutritionHTML(nutritionObject) {
    let containerDiv = $("<div>");
    containerDiv.attr("class", "nutrition-container")
    containerDiv.append($("<span class='nutrition-header'>").text("Nutritional Info:"));
    containerDiv.append($("<span class='nutrition-statistic'>").text("Calories: " + nutritionObject.calories + "g"));
    containerDiv.append($("<span class='nutrition-statistic'>").text("Protien: " + nutritionObject.protien + "g"));
    containerDiv.append($("<span class='nutrition-statistic'>").text("Cholestorol: " + nutritionObject.cholestorol + "g"));

    return containerDiv
}

function createIngredientsHTML(ingredients) {
    let ingredientsDiv = $("<div class='row'>");
    ingredientsDiv.append($("<div class='ingredients-title col").text("Ingredients:"));
    $.each(ingredients, function(key, value) {
        ingredientsDiv.append($("<div class='row'>").append($("<span class='ingredient'>").text(key)));
    })

    return ingredientsDiv;
}

//--------------------------------------------------
//               Login Page UI Interactions
//--------------------------------------------------

$("#login-button").on("click", function() {
    //Get user login info
    const email = $("#user-email").val();
    const password = $("#user-password").val();
    const auth = firebase.auth();

    console.log("email: ", email);
    console.log("password: ", password);

    const promise = auth.signInWithEmailAndPassword(email, password);
    promise.catch(function(event) {
        console.log(event.message);
    })

    $("#user-email").val("");
    $("#user-password").val("");
})

//Listener for sign-up button
$("#signup-button").on("click", function() {

    //Get user sign-up info
    const email = $("#signup-email").val();
    const password = $("#signup-password").val();
    const auth = firebase.auth();

    const promise = auth.createUserWithEmailAndPassword(email, password);

    promise.catch(function(event) {
        console.log("created account");
    })

    $("#signup-email").val("");
    $("#signup-password").val("");
})

$("#logout-button").on("click", function() {
    const auth = firebase.auth();
    console.log("Logged out");
    auth.signOut();
})

//---------------------------------------------
//         Recipe Page UI Interactions
//---------------------------------------------


//TODO: Tie this to the actual search button for recipes
$("#recipe-search-button").click(function() {
    let searchTerm = $("#recipe-search-text").val();
    callEdaRec(searchTerm);
})

//---------------------------------------------
//        Pantry Page UI Interactions
//---------------------------------------------

$("#add-item-btn").click(function(event) {
    event.preventDefault();
    let searchTerm = $("#item-input").val();
    //Checks to see if the entry is only numbers (making it a barcode).
    if (/^\d+$/.test(searchTerm)) {
        callEdaFood(searchTerm); // is a barcode
    } else {
        callEdaFoodByName(searchTerm); // Is not a barcode
    }

})


//--------------------------------------------------
//                    API Calls
//--------------------------------------------------

//Variables for EDAMAM RECIPE DATABASE
var edaRecId = "e09fb63c";
var edaRecKey = "e3f22d5545ff1c55fcf99f5fb6d19266";

// Variables for EDAMAM FOOD DATABASE
var edaFoodId = "cd666e09";
var edaFoodKey = "13cb0a3f237838bbc1414d50596d2015";
// var barcodeNum = "023700043825"



//Function to call EDAMAM RECIPE DATABASE
function callEdaRec(userFoodItem) {
    var queryURL = "https://api.edamam.com/search?q=" + userFoodItem + "&app_id=" + edaRecId + "&app_key=" + edaRecKey;
    console.log(queryURL);

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {


        var hits = response.hits;

        for (var i = 0; i < hits.length; i++) {

            let newRecipe = createRecipeObject(hits[i].recipe);
            let newHTML = createRecipeHTML(newRecipe);
            //TODO: Display this recipeHTML object in results
        }
    })

}
//Function to search EDAMAM FOOD DATABASE using a passed barcode
function callEdaFood(barcodeNum) {
    var queryURL = "https://api.edamam.com/api/food-database/parser?upc=" + barcodeNum + "&app_id=" + edaFoodId + "&app_key=" + edaFoodKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        let newFoodItem = createFoodItemObject(response.hints[0].food, $("#measurment-input").val(), $("#quantity-input").val(), $("#category-select")[0].value);


        addItemToPantry(newFoodItem);

        $("#pantryList").append(createFoodItemHTML(newFoodItem));
    })

}

//Function to search EDAMAM FOOD DATABASE using a passed string
function callEdaFoodByName(foodName) {
    var queryURL = "https://api.edamam.com/api/food-database/parser?ingr=" + foodName + "&app_id=" + edaFoodId + "&app_key=" + edaFoodKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        let newFoodItem = createFoodItemObject(response.hints[0].food, $("#measurement-input").val(), $("#quantity-input").val(), $("#category-select")[0].value);
        addItemToPantry(newFoodItem);
    })
}


//--------------------------------------------------
//                Firebase functions
//--------------------------------------------------


firebase.auth().onAuthStateChanged(user => {
    //Checks to see if this user has information in the database. If so, grab it 
    if (user) {
        uuid = user.uid;
        console.log("Logged in");
        //Grab user data
        database.ref("/users/" + uuid).once("value", function(snapshot) {
            if (snapshot.val()) {
                userData = snapshot;
                pantry = [];
                $.each(userData.val().pantry, function(index, key) {
                    pantry.push(key);
                })

                generatePantry();
            }
        })
        isLoggedIn = true;
    } else {
        console.log("Not logged in");
        isLoggedIn = false;
    }
})

function updateFirebase(location, value) {
    firebase.database().ref("/users/" + uuid + "/" + location).push(value)
}