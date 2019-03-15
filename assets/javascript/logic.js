let pantry = [];
let userData;

$(document).ready(function() {
    if (!userData) { //not logged in yet
        //Redirect to login screen
    } else { //already logged in
        generatePantry();
        generateShoppingList();
        generateCalendar();
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


//Generate the calendar with all meals planned or load the google calendar if that's what we're doing.
function generateCalendar() {

}