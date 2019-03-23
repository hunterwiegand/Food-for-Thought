let pantry = [];
let shoppingList = [];
let recipes = [];
let shownRecipes = [];
let isLoggedIn = false;
let userData;

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

// Generates a table of foodItems with a button to remove them from the database, local data, and html
function generateChangeableFoodObjectTable(target) {
    //Set the function up to target the correct table and data array.
    let targetArray = [];
    let targetTable;
    if (target === "pantry") {
        targetArray = pantry;
        targetTable = "#pantry-list-div"
    } else if (target === "shoppingList") {
        targetArray = shoppingList;
        targetTable = "#shopping-list-div"
    } else {
        console.log("Incorrectly called function. No table created")
    }

    $(targetTable).empty(); //Empty table so that we start with a known state

    //Each foodItem object becomes a line in the table
    $.each(targetArray, function(index, value) {
        let foodItemHTML = createFoodItemHTML(value);

        //Each line in the table gets a button which removes it from the pantry when clicked.
        let xButton = $("<span class='px-1'>").text("X");
        xButton.click(function() {
            removeFromFirebase(target, value.identifier); //remove from firebase
            foodItemHTML.remove(); //remove from html dom
            targetArray.splice(index, 1); //remove from the object array
        })
        foodItemHTML.prepend(xButton);

        $(targetTable).append(foodItemHTML);
    })
}

//Generate the pantry table html object on the recipe page and display it
function generateRecipePantry() {

    $("#recipe-pantry-list-div").empty();

    $.each(pantry, function(index, value) {
        let foodHTML = createFoodItemHTML(value);
        foodHTML.attr("data-food-name", value.name);
        foodHTML.addClass("food");
        $("#recipe-pantry-list-div").append(foodHTML);
    })
}



//Generate the calendar with all meals planned
function generateCalendar() {
    $("#calendar").fullCalendar({}); //Puts the calendar into the div for hoding the calendar.

    let recipeArr = userData.val().recipes;

    for (var recipe in recipeArr) {

        //convert recipes to calendar event objects
        let currentObj = new Object();
        currentObj.title = recipeArr[recipe].name;
        currentObj.start = recipeArr[recipe].mealPlanSlot.date + "T";

        switch (recipeArr[recipe].mealPlanSlot.meal) {
            case "breakfast":
                currentObj.start += "08:00:00Z";
                break;
            case "lunch":
                currentObj.start += "13:00:00Z";
                break;
            case "dinner":
                currentObj.start += "19:00:00Z";
                break;
            default:
                currentObj.start += "00:00:00Z";
        }
        currentObj.allDay = false;

        //Populate calendar
        $('#calendar').fullCalendar('renderEvent', currentObj);
    }
}


//--------------------------------------------------
//                 Object to HTML
//--------------------------------------------------
//These functions take custom class objects and turns them into HTML objects which are used to display to the page.

//Takes in a foodItem object, adds it the pantry array and firebase.
function addNewPantryItem(foodObject) {
    let foodIdentifier = updateFirebase("pantry", foodObject); //Adds new item to firebase. FoodIdentifier is the firebase id given to this foodItem.
    foodObject.identifier = foodIdentifier;
    pantry.push(foodObject); //Adds new item to local pantry array
    generateChangeableFoodObjectTable("pantry"); //Now that the foodItem has been added, we regenerate the pantry list. We need to do this rather than just pushing to ensure the xButton is properly generated and attached.
}

//Takes in a foodItem object, adds it to the shoppingList array and firebase.
function addNewShoppingListItem(foodObject) {
    let foodIdentifier = updateFirebase("shoppingList", foodObject);
    foodObject.identifier = foodIdentifier;
    shoppingList.push(foodObject);
    generateChangeableFoodObjectTable("shoppingList");
}

//Creates a recipe card for use in recipe search.
function createRecipeHTML(recipeObject, index) {

    let containerDiv = $("<div>");
    containerDiv.attr("class", "recipe-container row m-1 border")
    let leftCol = $("<div>");
    let titleRow = $("<div>");
    titleRow.attr("class", "row");
    let contentLeftRow = $("<div>");
    contentLeftRow.attr("class", "row");
    leftCol.append(titleRow, contentLeftRow);
    leftCol.attr("class", "col-7");
    containerDiv.append(leftCol);
    let imageCol = $("<div>");
    imageCol.attr("class", "col-8");
    imageCol.append($("<img class='recipe-image'>").attr("src", recipeObject.imageURL));
    let infoCol = $("<div>");
    infoCol.attr("class", "col-4");
    titleRow.append($("<div class='recipe-title col'>").html($("<h3>" + recipeObject.name + "</h3>")));
    infoCol.append($("<div class='recipe-item row'>").text("Servings: " + recipeObject.servings));
    infoCol.append($("<div class='row p-1'>").append(createRecipeDirectionLink(recipeObject.url)));
    infoCol.append($("<div class='row p-1'>").append(createRecipeSelectionModal(recipeObject, index)));
    contentLeftRow.append(imageCol, infoCol);
    let ingredientCol = $("<div>");
    ingredientCol.attr("class", "col-5");
    ingredientCol.append(createIngredientsHTML(recipeObject.ingredients));
    containerDiv.append(ingredientCol);
    return containerDiv;
}

//Takes in a foodItem and returns a Food Item HTML table row for Pantry Page
function createFoodItemHTML(foodItemObject) {
    let tableRow = $("<tr>");
    tableRow.attr("food-name", foodItemObject.name);
    tableRow.append($("<td class='food-item-title'>").text(foodItemObject.name));
    tableRow.append($("<td class='food-item-item'>").text(foodItemObject.quantity));
    tableRow.append($("<td class='food-item-item'>").text(foodItemObject.measurement));

    return tableRow;
}

//Takes in an array of ingredients and retuns an unordered list of all of the ingredients
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

//Takes in a url for an external website that has the directions for the recipe returns a button that has an onclick event which opens up a modal with the url loaded in a modal.
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

//Takes in a recipe object and outputs a recipe card HTML object. The index parameter is used for making the cards unique.
function createRecipeSelectionModal(recipe, index) {
    let targetId = "modal-center-" + index;
    let containerDiv = $("<div>");
    let modalButton = $("<button>");
    modalButton.addClass("btn btn-primary");
    modalButton.attr("type", "button");
    modalButton.attr("data-toggle", "modal");
    modalButton.attr("data-target", "#" + targetId);
    modalButton.attr("btn-index", index);
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
    let modalSeven = $("<div class='modal-body' id='recipe-modal-body-" + index + "'>");
    let modalEight = $("<div class='modal-footer'>")
    let modalNine = $("<button type='button' class='btn btn-secondary' data-dismiss='modal'>");
    modalNine.text("Cancel");
    let modalTen = $("<button type='button' class='btn btn-primary' id='add-to-calendar-button' data-dismiss='modal'>");
    modalTen.text("Add to Calendar");
    //Binds a click event to the button created above. The event will modify all pantry items that were selected to be used and add any not selected to the shopping list. Then it will take the recipe, add it to the recipes array and firebase so that it is ready for the calendar.
    modalTen.click(function() {

        for (let i = 0; i < recipe.ingredients.length; i++) {
            let ingValue = $("#ingredient-select-" + i + "-" + index).val();
            if (ingValue === "-1") {
                callEdaFoodByName(recipe.ingredients[i], "shoppingList", $("#measurement-" + i + "-" + index).val(), $("#quantity-" + i + "-" + index).val(), "none");
            } else {
                if ($("#quantity-" + i + "-" + index).val() === "0") {
                    removeFromFirebase("pantry", pantry[ingValue].identifier);
                    pantry.splice(ingValue, 1);
                } else {
                    setFirebase("pantry/" + pantry[ingValue].identifier + "/quantity", $("#quantity-" + i + "-" + index).val());
                    setFirebase("pantry/" + pantry[ingValue].identifier + "/measurement", $("#measurement-" + i + "-" + index).val());
                    pantry[ingValue].quantity = $("#quantity-" + i + "-" + index).val();
                    pantry[ingValue].measurement = $("#measurement-" + i + "-" + index).val();
                }
            }
        }
        generateRecipePantry();
        shownRecipes[index].mealPlanSlot = { date: $("#time-slot-date" + index).val(), meal: $('input[name=meal]:checked').attr("value") };
        recipes.push(shownRecipes[index]);
        updateFirebase("recipes", shownRecipes[index]);

    })

    //Adds a click event to the "Add to Meal" button. This clears and then populates the modal with the correct recipe information. 
    modalButton.click(function() {
        modalSeven.empty();
        modalSeven.append(createRecipeIngredientAllocationTable(recipe.ingredients, index));
        modalSeven.append(createTimeSlotPicker(index));
    })

    modalCenter.append(modalOne);
    modalOne.append(modalTwo);
    modalTwo.append(modalThree, modalSeven, modalEight);
    modalThree.append(modalFour, modalFive);
    modalFive.append(modalSix);
    modalEight.append(modalNine, modalTen);
    containerDiv.append(modalButton, modalCenter);

    return containerDiv;
}

//Takes in a list of ingredients and outputs a table of ingredients with form controls to edit the ingredients. Returns the HTML object.
function createRecipeIngredientAllocationTable(ingredients, index) {
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
        currentRow.append($("<td>").append(createRecipeDropDown(key, index))); //This is a dropdown containing all pantry items.
        currentRow.append($("<td>").append($("<input type='text' id='quantity-" + key + "-" + index + "'>")));
        currentRow.append($("<td>").append($("<input type='text' id='measurement-" + key + "-" + index + "'>")));
        ingredientsTable.append(currentRow);
    })
    containerDiv.append(ingredientsTable);
    return containerDiv;
}

//Takes in the table line and recipe index used in creating a unique id. Returns a dropdown HTML item of all items in the pantry and an option to "Add to the Shopping List".
function createRecipeDropDown(line, index) {
    let ingredientSelect = $("<select class='custom-select' id='ingredient-select-" + line + "-" + index + "'>");
    ingredientSelect.append(($("<option value='-1'>").text("Add to the Shopping List")));
    $.each(pantry, function(key, value) {
        ingredientSelect.append($("<option value='" + key + "'>").text(value.name));
    })

    return ingredientSelect;
}

//Takes in the recipe index for creating a unique id. Returns controls for setting the day and meal for the recipe (one date input and 3 radios for meals).
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


//---------------------------------------------
//        Login (index) Page UI Interactions
//---------------------------------------------

$("#login-button").on("click", function() {
    //Get user login info
    const email = $("#user-email").val();
    const password = $("#user-password").val();
    const auth = firebase.auth();

    var loginModal = $("#signinModal");

    const promise = auth.signInWithEmailAndPassword(email, password);
    promise.catch(function(event) {
        console.log(event.message);

        if (password !== promise) {
            (loginModal.modal('show'));
            loginModal.css({ display: 'block' })
        }

    })

    // Listen for close click
    $('.loginCloseBtn').on("click", closeModal);
    //Listen for outside click
    window.addEventListener("click", outsideClick);
    // Function to close modal
    function closeModal() {
        loginModal.style.display = "none";
    }

    // Funtion to close modal if click outside of modal
    function outsideClick(e) {
        if (e.target === loginModal) {
            loginModal.style.display = "none";
        }

        $("#user-email").val("");
        $("#user-password").val("");
    }
})


//Listener for sign-up button
$("#signup-button").on("click", function() {
    var loginModal = $("#signinModal");
    var closeBtn = $(".loginCloseBtn");
    //Get user sign-up info
    const email = $("#signup-email").val().trim();
    const password = $("#signup-password").val().trim();
    const passwordConfirm = $("#signup-confirm-password").val().trim();

    // Confirm 1st entered password = 2nd entered password or open modal 
    if (password !== passwordConfirm) {
        (loginModal.modal('show'));
        loginModal.css({ display: 'block' })
    } else {
        const auth = firebase.auth();
        const promise = auth.createUserWithEmailAndPassword(email, password);

        promise.catch(function(event) {
            console.log("created account");

        })
    }

    // Listen for close click
    closeBtn.on("click", closeModal);
    //Listen for outside click
    window.addEventListener("click", outsideClick);
    // Function to close modal
    function closeModal() {
        loginModal.css({ display: 'hide' })
    }

    // Funtion to close modal if click outside of modal
    function outsideClick(e) {
        if (e.target === loginModal) {
            loginModal.style.display = "none";
        }

    }


    $("#signup-email").val("");
    $("#signup-password").val("");
    $("#signup-confirm-password").val("");
})

$("#logout-button").on("click", function() {
    const auth = firebase.auth();
    console.log("Logged out");
    auth.signOut();
    $("#logged-out-state").addClass("visible")
    $("#logged-out-state").removeClass("invisible")
    $("#logged-in-state").removeClass("visible")
    $("#logged-in-state").addClass("invisible")
})


//---------------------------------------------
//        Pantry and Shopping List Page UI Interactions
//---------------------------------------------

$("#add-item-btn").click(function(event) {
    event.preventDefault();
    let searchTerm = $("#item-input").val();
    //Checks to see if the entry is only numbers (making it a barcode).
    if (/^\d+$/.test(searchTerm)) {
        callEdaFood(searchTerm); // is a barcode
    } else {
        callEdaFoodByName(searchTerm, $(this).attr("data-target"), $("#measurement-input").val(), $("#quantity-input").val()); // Is not a barcode
    }
})

//---------------------------------------------
//        Recipe Page UI Interactions
//---------------------------------------------

$("#recipe-search-button").click(function() {
    let searchTerm = ($(".recipe-food-item").text());
    //Need to format searchTem by adding + and only taking in the first 2 itmes with commas
    //example, Rice, white, medium-grain, raw, unenriched => Rice,+white
    searchTerm = searchTerm.split(" ").join("+");
    callEdaRec(searchTerm);

})

//Adds an event listener to pantry items appearing on the recipe page. If the item is not in the list of recipe ingredients, add it otherwise remove it.
$(document).on("click", ".food", function() {
    let foodName = this.dataset.foodName;
    let temp = foodName.replace(/\s/g, '');
    temp = temp.replace(/\s*,\s*|\s+,/g, '-');
    if ($(this).attr("data-state") === "remove") {
        $("#" + temp).remove();
        $(this).attr("data-state", "add");
    } else {
        let newDiv = $("<div>");
        newDiv.addClass("recipe-food-item");
        newDiv.attr("id", temp)
        newDiv.prepend(foodName + " ");
        $("#recipe-search-text").prepend(newDiv);
        $(this).attr("data-state", "remove");
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
    var queryURL = "https://api.edamam.com/search?q=" + userFoodItem + "&app_id=" + edaRecId + "&app_key=" + edaRecKey + "&from=0&to=3";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {


        var hits = response.hits;

        shownRecipes = [];
        $("#recipe-search-text").empty();
        for (var i = 0; i < hits.length; i++) {

            let newRecipe = new recipe(hits[i].recipe);
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
        let newFoodItem = new foodItem(response.hints[0].food, $("#measurment-input").val(), $("#quantity-input").val(), $("#category-select")[0].value);
        addNewPantryItem(newFoodItem);

    })

}

//Function to search EDAMAM FOOD DATABASE using a passed string
function callEdaFoodByName(foodName, location, measurment, quantity, category) {
    var queryURL = "https://api.edamam.com/api/food-database/parser?ingr=" + foodName + "&app_id=" + edaFoodId + "&app_key=" + edaFoodKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        let newFoodItem = new foodItem(response.hints[0].food, measurment, quantity);
        switch (location) {
            case "pantry":
                addNewPantryItem(newFoodItem);
                break
            case "shoppingList":
                addNewShoppingListItem(newFoodItem);
                break
            default:
                console.log("Error, didn't put", newFoodItem, "Anywhere");
        }
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

                if (userData.val().pantry) {
                    $.each(userData.val().pantry, function(index, key) {
                        key.identifier = index;
                        pantry.push(key);
                    })
                }

                if (userData.val().shoppingList) {
                    shoppingList = [];
                    $.each(userData.val().shoppingList, function(index, key) {
                        key.identifier = index;
                        shoppingList.push(key);
                    })
                }

                generateChangeableFoodObjectTable("pantry"); //Generate pantry table
                generateChangeableFoodObjectTable("shoppingList"); //Generate shopping list table
                generateRecipePantry();
                generateCalendar();
            }
        })
        isLoggedIn = true;
        $("#logged-in-state").addClass("visible")
        $("#logged-in-state").removeClass("invisible")
        $("#logged-out-state").removeClass("visible")
        $("#logged-out-state").addClass("invisible")
    } else {
        console.log("Not logged in");
        isLoggedIn = false;
    }
})


function updateFirebase(location, value) {
    result = firebase.database().ref("/users/" + uuid + "/" + location).push(value);
    return result.path.pieces_[result.path.pieces_.length - 1];
}

function removeFromFirebase(location, value) {
    firebase.database().ref("/users/" + uuid + "/" + location + "/" + value).remove();
}

function setFirebase(location, value) {
    result = firebase.database().ref("/users/" + uuid + "/" + location).set(value);
}