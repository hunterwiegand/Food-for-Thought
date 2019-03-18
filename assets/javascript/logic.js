$(function() {
	// Create the QuaggaJS config object for the live stream
	var liveStreamConfig = {
			inputStream: {
				type : "LiveStream",
				constraints: {
					width: {min: 640},
					height: {min: 480},
					aspectRatio: {min: 1, max: 100},
					facingMode: "environment" // or "user" for the front camera
				}
			},
			locator: {
				patchSize: "medium",
				halfSample: true
			},
			numOfWorkers: (navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 4),
			decoder: {
				"readers":[
					{"format":"ean_reader","config":{}}
				]
			},
			locate: true
		};
	// The fallback to the file API requires a different inputStream option. 
	// The rest is the same 
	var fileConfig = $.extend(
			{}, 
			liveStreamConfig,
			{
				inputStream: {
					size: 800
				}
			}
		);
	// Start the live stream scanner when the modal opens
	$('#livestream_scanner').on('shown.bs.modal', function (e) {
		Quagga.init(
			liveStreamConfig, 
			function(err) {
				if (err) {
					$('#livestream_scanner .modal-body .error').html('<div class="alert alert-danger"><strong><i class="fa fa-exclamation-triangle"></i> '+err.name+'</strong>: '+err.message+'</div>');
					Quagga.stop();
					return;
				}
				Quagga.start();
			}
		);
    });
	
	// Make sure, QuaggaJS draws frames an lines around possible 
	// barcodes on the live stream
	Quagga.onProcessed(function(result) {
		var drawingCtx = Quagga.canvas.ctx.overlay,
			drawingCanvas = Quagga.canvas.dom.overlay;
 
		if (result) {
			if (result.boxes) {
				drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
				result.boxes.filter(function (box) {
					return box !== result.box;
				}).forEach(function (box) {
					Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
				});
			}
 
			if (result.box) {
				Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
			}
 
			if (result.codeResult && result.codeResult.code) {
				Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
			}
		}
	});
	
	// Once a barcode had been read successfully, stop quagga and 
	// close the modal after a second to let the user notice where 
	// the barcode had actually been found.
	Quagga.onDetected(function(result) {    		
		if (result.codeResult.code){
			$('#scanner_input').val(result.codeResult.code);
			Quagga.stop();	
			setTimeout(function(){ $('#livestream_scanner').modal('hide'); }, 1000);			
		}
	});
    
	// Stop quagga in any case, when the modal is closed
    $('#livestream_scanner').on('hide.bs.modal', function(){
    	if (Quagga){
    		Quagga.stop();	
    	}
    });
	
	// Call Quagga.decodeSingle() for every file selected in the 
	// file input
	$("#livestream_scanner input:file").on("change", function(e) {
		if (e.target.files && e.target.files.length) {
			Quagga.decodeSingle($.extend({}, fileConfig, {src: URL.createObjectURL(e.target.files[0])}), function(result) {
                console.log(result.codeResulte.code);
            });
		}
    });
});
let pantry = [];
let shoppingList = [];
let userData;

$(document).ready(function () {
    if (!userData) { //not logged in yet
        //Redirect to login screen
    } else { //already logged in
        generatePantry();
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

//--------------------------------------------------
//              Page Setup Functions
//--------------------------------------------------


//Generate the pantry html object and display it
function generatePantry() {
    $.each(pantry, function (index, value) {
        console.log("WARNING: need real location of pantry html element.")

        $("#pantry-list-div").append(createPantryItemHTML(value));
    })
    console.log("WARNING: pantry page not implemented")
    console.log("pantry contents", pantry);
}


//Generate the shopping list html object and display it
function generateShoppingList() {
    $.each(shoppingList, function (index, value) {
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
    return new recipe(recipeJSON.label, recipeJSON.shareAs, recipeJSON.image, recipeJSON.yield, recipeJSON.totalNutrients, recipeJSON.ingredients);
}

function createFoodItemObject(foodItemJSON) {
    return new foodItem(foodItemJSON.name, foodItemJSON.upc);
}




//--------------------------------------------------
//             Object to HTML
//--------------------------------------------------

function addItemToPantry(foodObject) {
    console.log(foodObject.name, "Added to pantry.");

    pantry.push(foodObject);
    generatePantry();
}

function addItemToShoppingList(foodObject) {
    console.log(foodObject.name, "Added to shopping list.");

    shoppingList.push(foodObject);
    generateShoppingList();
}



//--------------------------------------------------
//            UI interactions
//--------------------------------------------------



function getAccountInfo() {

    //Listener for login button
    $("#login-button").on("click", function () {
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
    $("#signup-button").on("click", function () {

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

    firebase.auth().onAuthStateChanged(firebaseUser => {
        if(firebaseUser) {
            console.log("Logged in");
        } else {
            console.log("Not logged in");
        }
    })

    $("#logout-button").on("click", function () {
        const auth = firebase.auth();
        console.log("Logged out");
        auth.signOut();
    })

    //TODO: Go through the firebase login flow
    //TODO:  Pull down the userData

}

//TODO: Tie this to the actual search button for recipes
$("#recipe-search-button").click(function () {
    let searchTerm = $("#recipe-search-text").val();
    callEdaRec(searchTerm);
})

$("#searchButton").click(function () {
	let searchTerm = $("#searchButton").val();
	callEdaFood(searchTerm);
	
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
    }).then(function (response) {

        console.log(response);

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
    console.log(queryURL);

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        let newFoodItem = createFoodItemObject(response.hints[0].food);

        addItemToPantry(newFoodItem);
    })
}

getAccountInfo();
