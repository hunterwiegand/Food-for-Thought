let pantry = [];
let shoppingList = [];
let recipes = [];
let shownRecipes = [];
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

function unitConversion(originalAmount, originalType, changeType) {
    let teaSpoonConversion = {
        tablespoon: 1 / 3,
        cup: teaSpoonConversion.tablespoon / 16,
        pint: teaSpoonConversion.cup / 2,
        quart: teaSpoonConversion.pint / 2,
        gallon: teaSpoonConversion.quart / 4,
    }

    let tableSpoonConversion = {
        teaspoon: 3,
        cup: teaSpoonConversion.cup * 3,
        pint: teaSpoonConversion.pint * 3,
        quart: teaSpoonConversion.quart * 3,
        gallon: teaSpoonConversion.gallon * 3
    }

    let pintConversion = {
        teaspoon: tableSpoonConversion.teaspoon * 2,
        tablespoon: 2,
        cup: tableSpoonConversion.cup * 2,
        quart: tableSpoonConversion.quart * 2,
        gallon: tableSpoonConversion.gallon * 2
    }

    let quartConversion = {
        teaspoon: pintConversion.teaspoon * 2,
        tablespoon: pintConversion.tablespoon * 2,
        cup: pintConversion.cup * 2,
        pint: 2,
        gallon: pintConversion.gallon * 2
    }

    let gallonConversion = {
        teaspoon: quartConversion.teaspoon * 4,
        tablespoon: quartConversion.tablespoon * 4,
        cup: quartConversion.cup * 4,
        pint: quartConversion.pint * 4,
        quart: 4,
    }

    switch (originalType) {
        case "teaspoon":
            return teaSpoonConversion[changeType] * originalAmount;
        case "tablespoon":
            return tableSpoonConversion[changeType] * originalAmount;
        case "pint":
            return pintConversion[changeType] * originalAmount;
        case "quart":
            return quartConversion[changeType] * originalAmount;
        case "gallon":
            return gallonConversion[changeType] * originalAmount;
        default:
            console.log("conversion not supported");
            return undefined;

    }
}

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

function generateRecipePantry() {

    $("#recipe-pantry-list-div").empty();

    $.each(pantry, function(index, value) {
        let foodHTML = createFoodItemHTML(value);
        foodHTML.attr("data-food-name", value.name);
        foodHTML.addClass("food");
        $("#recipe-pantry-list-div").append(foodHTML);


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
    pantry.push(foodObject);
    updateFirebase("pantry", foodObject);
    generatePantry();
}

function addItemToShoppingList(foodObject) {
    console.log(foodObject.name, "Added to shopping list.");

    shoppingList.push(foodObject);
    generateShoppingList();
}

function addRecipeToCalender(recipeObject) {
    console.log(recipeObject.name, "Added to Calender");
    recipe.push(recipeObject);
}

function createRecipeHTML(recipeObject, index) {

    let containerDiv = $("<div>");
    containerDiv.attr("class", "recipe-container row")
    let imageCol = $("<div>");
    imageCol.attr("class", "col-3");
    imageCol.append($("<img class='recipe-image'>").attr("src", recipeObject.imageURL));
    containerDiv.append(imageCol);
    let nameCol = $("<div>");
    nameCol.attr("class", "col-4");
    nameCol.append($("<div class='recipe-title row'>").text(recipeObject.name))
    nameCol.append($("<div class='recipe-item row'>").text("Servings: " + recipeObject.servings));
    nameCol.append($("<div class='row'>").append(createNutritionHTML(recipeObject.nutrition)));
    nameCol.append($("<div class='row'>").append(createRecipeDirectionLink(recipeObject.url)));
    nameCol.append($("<div class='row'>").append(createRecipeSelectionModal(recipeObject, index)));
    containerDiv.append(nameCol);
    let ingredientCol = $("<div>");
    ingredientCol.attr("class", "col-5");
    ingredientCol.append(createIngredientsHTML(recipeObject.ingredients));
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
    let containerDiv = $("<div>");
    let titleDiv = $("<div class='ingredients-title col'>");
    titleDiv.html($("<span class='ingredients-title'> Ingredients: </span>"));
    let ingredientsUL = $("<ul>");
    $.each(ingredients, function(key, value) {
        ingredientsUL.append($("<li class='ingredient'>").text(value));
    })
    containerDiv.append(titleDiv);
    containerDiv.append(ingredientsUL)
    return containerDiv;
}

function createRecipeDirectionLink(directionLink) {
    let containerDiv = $("<div>");
    let directionButton = $("<button class='btn btn-primary btn-lg' data-toggle='modal' data-target='#myModal'>");
    directionButton.text("Get Recipe");
    directionButton.click(function() {
        $("#direction-modal-info").attr("src", directionLink);

    })
    containerDiv.append(directionButton);

    return containerDiv;
}

function createRecipeSelectionModal(recipe, index) {
    let targetId = "modal-center-" + index;
    let containerDiv = $("<div>");
    let modalButton = $("<button>");
    modalButton.addClass("btn btn-prmary");
    modalButton.attr("type", "button");
    modalButton.attr("data-toggle", "modal");
    modalButton.attr("data-target", "#" + targetId)
    modalButton.text("Add to Meal Plan");
    let modalCenter = $("<div>");
    modalCenter.addClass("modal fade");
    modalCenter.attr("id", targetId);
    modalCenter.attr("tabindex", "-1");
    modalCenter.attr("role", "dialog");
    modalCenter.attr("aria-labelledby", targetId + "-title");
    modalCenter.attr("aria-hidden", "true");
    let modalOne = $("<div class='modal-dialog modal-lg' role='document'>");
    let modalTwo = $("<div class='modal-content'>");
    let modalThree = $("<div class='modal-header'>");
    let modalFour = $("<h5 class='modal-title' id='" + targetId + "-title'>");
    modalFour.text("Plan Your Meal");
    let modalFive = $("<button type='button' class='close' data-dismiss='modal' aria-label='Close'>");
    let modalSix = $("<span aria-hidden='true'>");
    modalSix.text("X")
    let modalSeven = $("<div class='modal-body' id='recipe-modal-body'>");
    let modalEight = $("<div class='modal-footer'>")
    let modalNine = $("<button type='button' class='btn btn-secondary' data-dismiss='modal'>");
    modalNine.text("Cancel");
    let modalTen = $("<button type='button' class='btn btn-primary' id='add-to-calendar-button' data-dismiss='modal'>");
    modalTen.text("Add to Calendar");

    modalTen.click(function() {
        //TODO: Need to update ingredients and shopping list and then update
        //TODO: Need to check to make sure date and meal are selected and message player if they're not
        shownRecipes[index].mealPlanSlot = { date: $("#time-slot-date" + index).val(), meal: $('input[name=meal]:checked').attr("value") };
        recipes.push(shownRecipes[index]);
        updateFirebase("recipes", shownRecipes[index]);

    })

    modalCenter.append(modalOne);
    modalOne.append(modalTwo);
    modalTwo.append(modalThree, modalSeven, modalEight);
    modalSeven.append(createRecipeIngredientAllocationTable(recipe.ingredients));
    modalSeven.append(createTimeSlotPicker(index));
    modalThree.append(modalFour, modalFive);
    modalFive.append(modalSix);
    modalEight.append(modalNine, modalTen);
    containerDiv.append(modalButton, modalCenter);

    return containerDiv;
}

function createRecipeIngredientAllocationTable(ingredients) {
    let containerDiv = $("<div>");
    let ingredientsTable = $("<table>");
    let headerRow = $("<tr>");
    headerRow.append($("<th>").text("Ingredients"));
    headerRow.append($("<th>").text("What to use"));
    headerRow.append($("<th>").text("Qty Left"));
    headerRow.append($("<th>").text("Measurement"));
    ingredientsTable.append(headerRow);
    $.each(ingredients, function(key, value) {
        let currentRow = $("<tr>");
        currentRow.append($("<td>").text(value));
        currentRow.append($("<td>").append(createRecipeDropDown(key)));
        currentRow.append($("<td>").append($("<input type='text' id='quantity-" + key + "'>")));
        currentRow.append($("<td>").append($("<input type='text' id='measurement-" + key + "'>")));
        ingredientsTable.append(currentRow);
    })
    containerDiv.append(ingredientsTable);
    return containerDiv;
}

function createRecipeDropDown(index) {
    let ingredientSelect = $("<select class='custom-select' id='ingredientSelect-" + index + "'>");
    ingredientSelect.append(($("<option value='-1'>").text("Add to the Shopping List")));
    $.each(pantry, function(key, value) {
        ingredientSelect.append($("<option value='" + key + "'>").text(value.name));
    })

    return ingredientSelect;
}

function createTimeSlotPicker(index) {
    let containerDiv = $("<div>");
    let controlOne = $("<div class='custom-control custom-control-inline'>")
    controlOne.append($("<input type='date' class='form-control ml-2' id='time-slot-date" + index + "' placeholder='Date'>"));
    let controlTwo = $("<div class='custom-control custom-radio custom-control-inline'>");
    controlTwo.append($("<input type='radio' id='breakfast-radio" + index + "' value='breakfast' name='meal' class='custom-control-input'>"));
    controlTwo.append($("<label class='custom-control-label' for='breakfast-radio" + index + "'>Breakfast</label>"))
    let controlThree = $("<div class='custom-control custom-radio custom-control-inline'>");
    controlThree.append($("<input type='radio' id='lunch-radio" + index + "' value='lunch' name='meal' class='custom-control-input'>"));
    controlThree.append($("<label class='custom-control-label' for='lunch-radio" + index + "'>Lunch</label>"))
    let controlFour = $("<div class='custom-control custom-radio custom-control-inline'>");
    controlFour.append($("<input type='radio' id='dinner-radio" + index + "' value='dinner' name='meal' class='custom-control-input'>"));
    controlFour.append($("<label class='custom-control-label' for='dinner-radio" + index + "'>Dinner</label>"))
    containerDiv.append(controlOne, controlTwo, controlThree, controlFour);

    return containerDiv;
}



// Get modal element
var modal = document.getElementById("simpleModal");
// var modal2 = document.getElementById("simpleModal2");
// Get open modal button
var modalBtn = document.getElementById("modalBtn");
// Get close button
var closeBtn = document.getElementsByClassName("closeBtn")[0];

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

            if (password !== promise) {
                (modal.style.display = "block");
            }

        })
        // Listen for close click
    closeBtn.addEventListener("click", closeModal);
    //Listen for outside click
    window.addEventListener("click", outsideClick);
    // Function to close modal
    function closeModal() {
        modal.style.display = "none";
    }

    // Funtion to close modal if click outside of modal
    function outsideClick(e) {
        if (e.target === modal) {
            modal.style.display = "none";
        }

        $("#user-email").val("");
        $("#user-password").val("");
    }
})


//Listener for sign-up button
$("#signup-button").on("click", function() {

    //Get user sign-up info
    const email = $("#signup-email").val().trim();
    const password = $("#signup-password").val().trim();
    const passwordConfirm = $("#signup-confirm-password").val().trim();

    // Confirm 1st entered password = 2nd entered password or open modal 
    if (password !== passwordConfirm) {
        (modal.style.display = "block");
    } else {
        const auth = firebase.auth();
        const promise = auth.createUserWithEmailAndPassword(email, password);

        promise.catch(function(event) {
            console.log("created account");

        })
    }

    // Listen for close click
    closeBtn.addEventListener("click", closeModal);
    //Listen for outside click
    window.addEventListener("click", outsideClick);
    // Function to close modal
    function closeModal() {
        modal.style.display = "none";
    }

    // Funtion to close modal if click outside of modal
    function outsideClick(e) {
        if (e.target === modal) {
            modal.style.display = "none";
        }

    }


    $("#signup-email").val("");
    $("#signup-password").val("");
})

$("#logout-button").on("click", function() {
    const auth = firebase.auth();
    console.log("Logged out");
    auth.signOut();
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

//---------------------------------------------
//        Recipe Page UI Interactions
//---------------------------------------------

$("#recipe-search-button").click(function() {

    let searchTerm = ($(".recipe-food-item").text());

    console.log(searchTerm);
    searchTerm = searchTerm.split(" ").join("+");
    console.log(searchTerm);


    //Need to format searchTem by adding + and only taking in the first 2 itmes with commas
    //example, Rice, white, medium-grain, raw, unenriched => Rice,+white

    callEdaRec(searchTerm);
})

$(document).on("click", ".food", function() {
    console.log("food item was clicked");
    console.log(this.dataset.foodName);
    var foodName = this.dataset.foodName;

    let newDiv = $("<div>");
    newDiv.addClass("recipe-food-item");
    newDiv.prepend(foodName + " ");


    $("#recipe-search-text").prepend(newDiv);

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
    var queryURL = "https://api.edamam.com/search?q=" + userFoodItem + "&app_id=" + edaRecId + "&app_key=" + edaRecKey + "&from=0&to=3";
    console.log(queryURL);

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {


        var hits = response.hits;

        shownRecipes = [];
        $("#recipe-search-text").empty();
        for (var i = 0; i < hits.length; i++) {

            let newRecipe = createRecipeObject(hits[i].recipe);
            shownRecipes.push(newRecipe);

            let newHTML = createRecipeHTML(newRecipe, i);

            $("#recipe-search-text").append(newHTML);
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

        // $("#pantryList").append(createFoodItemHTML(newFoodItem));
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

        console.log(newFoodItem);
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
                generateRecipePantry();
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