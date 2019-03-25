 # Food-for-Thought

 Food for Thought is a web based application that allows users to easily generate meals based off of the food they have on hand, and helps create a meal plan with their choosen dishes. With future development Food for Thought will have a shopping feature that allows the user to purchase the missing ingredients needed for thier meals.

 # Description

Food for Thought is build upon Javascript, Html, Css, and utilizes Bootstrap, Ajax, Jquery, Firebase, Edamam's Recipe and Food apis, and FullCalendar. It has 5 main pages: "Home", "Pantry", "Recipes", "Shopping List", and "Meal Plan".

# Home

The home page is set to our index.html and will be the first page the user stumbles across. This is used as a log-in/sign-up page and uses Firebase's auth. Once the user logs in with an authorized account they gain access to the other features of the site.

# Pantry

The Pantry page is used to gather information from the user. Specifically, the type of food they have access to. Once an item is entered we call on the Edamam api and store the food's nutrional value, as well as it's specified label into the users firebase database. This information is then displayed to the user via a pantry table. There is an option next to each itme to delete it from the users pantry.

# Recipes

Once the user has added items to their pantry they can access them from the Recipes page. When the food item is clicked on the Recipe page, it will be added the the Recipe list. When the user clicks the Create Recipe button, the Edamam Recipe Api is called (using Ajax) with the food items as it's parameters. Three of the most popular recipes are then presented to the user with two options of seeing the recipe and adding the recipe to their meal plan.

# Meal Plan

Upon page load a calender is generated with the user's selected recipes with times defaulted to breakfast lunch or dinner. A future function for this page would be to drag and drop each meal so that the user can change the meal for any given day.

# Acknowledgments

This application was built with inspiration from the Universtiy of Washingtons's coding bootcamp, by Hunter, Carl, Jean, and James