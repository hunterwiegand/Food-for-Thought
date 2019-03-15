let pantry = [];
let userData;

$(document).ready(function() {
    if (!userData) { //not logged in yet
        //Redirect to login screen
    } else { //already logged in
        generatePantry();
        generateShoppingList();
    }
});


//Generate the pantry html object and display it
function generatePantry() {
    console.log(pantry);
}


//Generate the shopping list html object and display it
function generateShoppingList() {

}


function loginButtonClicked() {

    //TODO: Go through the firebase login flow
    //TODO:  Pull down the userData
}