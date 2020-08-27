"use strict";

//global variables

const apiKey = "1";
const baseFoodURL = `https://www.themealdb.com/api/json/v1/${apiKey}/`;
const baseDrinkURL = `https://www.thecocktaildb.com/api/json/v1/${apiKey}/`;

//displays food from Meal API response

function displayFood(responseJson) {
  console.log(responseJson);
  $("#food-results").empty();
  let htmlString = "";
  for (let i = 0; i < responseJson.meals.length; i++) {
    htmlString += `
    <h2>Cuisine</h2>
    <img class="img-main" src="${responseJson.meals[i].strMealThumb}" alt="${responseJson.meals[i].strMeal}">
    <h3>${responseJson.meals[i].strMeal}</h3>
    <h4>Ingredients:</h4>
    <ul>`;
    for (let j = 1; j < 21; j++) {
      if (
        responseJson.meals[i]["strMeasure" + j] ||
        responseJson.meals[i]["strIngredient" + j]
      )
        htmlString += `<li>${responseJson.meals[i]["strMeasure" + j]} ${
          responseJson.meals[i]["strIngredient" + j]
        }</li>`;
    }
    htmlString = htmlString.replace(/null /g, "").replace(/  /g, "");
    htmlString += `
      </ul>
      <h4>Directions:</h4>`;
    let description = responseJson.meals[i].strInstructions.split(".");
    for (let k = 0; k < description.length; k++) {
      htmlString += `<p>${description[k]}.</p>`;
    }
    $("#food-results").append(htmlString);
  }
  $("#food-results").removeClass("hidden");
}

//displays drink from Cocktail API response

function displayDrink(responseJson) {
  console.log(responseJson);
  $("#drink-results").empty();
  let htmlString = "";
  for (let i = 0; i < responseJson.drinks.length; i++) {
    htmlString += `
    <h2>Beverage</h2>
    <img class="img-main" src="${responseJson.drinks[i].strDrinkThumb}" alt="${responseJson.drinks[i].strDrink}">
    <h3>${responseJson.drinks[i].strDrink}</h3>
    <h4>Ingredients:</h4>
    <ul>`;
    for (let j = 1; j < 21; j++) {
      if (
        responseJson.drinks[i]["strMeasure" + j] ||
        responseJson.drinks[i]["strIngredient" + j]
      )
        htmlString += `<li>${responseJson.drinks[i]["strMeasure" + j]} ${
          responseJson.drinks[i]["strIngredient" + j]
        } </li>`;
    }
    htmlString = htmlString.replace(/null/g, "");
    htmlString += `
      </ul>
      <h4>Directions:</h4>
      <p>${responseJson.drinks[i].strInstructions}</p>`;
    $("#drink-results").append(htmlString);
  }
  $("#drink-results").removeClass("hidden");
}

//handle food image click

function foodClick() {
  $("img").on("click", function (event) {
    event.preventDefault();
    const foodChoice = this.alt;
    getFoodChoice(foodChoice);
  });
}

//handles drink image click

function drinkClick() {
  $("img").on("click", function (event) {
    event.preventDefault();
    const drinkChoice = this.alt;
    getDrinkChoice(drinkChoice);
  });
}

//displays users food options from MEAL API and lets user click image to get food choice

function displayFoodOptions(responseJson) {
  console.log(responseJson);
  $("#food-results").empty();
  let htmlString = `
  <h2>Cuisine Options:</h2>
  <p>(Click on Image to get recipe)</p>
  <div class="options">`;
  for (let i = 0; i < responseJson.meals.length; i++) {
    htmlString += `
        <h3>${responseJson.meals[i].strMeal}</h3>
        <img src="${responseJson.meals[i].strMealThumb}" alt="${responseJson.meals[i].strMeal}">`;
  }
  htmlString += `
  </div>`;
  $("#food-results").append(htmlString);
  $("#food-results").removeClass("hidden");
  foodClick();
}

//displays users drink options from COCTAIL API and lets user click image to get drink choice

function displayDrinkOptions(responseJson) {
  console.log(responseJson);
  $("#drink-results").empty();
  let htmlString = `
  <h2>Beverage Options:</h2>
  <p>(Click on Image to get recipe)</p>
  <div class="options">`;
  for (let i = 0; i < responseJson.drinks.length; i++) {
    htmlString += `
      <h3>${responseJson.drinks[i].strDrink}</h3>
      <img src="${responseJson.drinks[i].strDrinkThumb}" alt="${responseJson.drinks[i].strDrink}">`;
  }
  htmlString += `
  </div>`;
  $("#drink-results").append(htmlString);
  $("#drink-results").removeClass("hidden");
  drinkClick();
}

//gets users food choice from MEAL API

function getFoodChoice(foodChoice) {
  console.log(foodChoice);
  const search = "search.php?s=";
  const urlFoodChoice = baseFoodURL + search + foodChoice;
  fetch(urlFoodChoice)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => displayFood(responseJson))
    .catch((err) => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}

//gets users drink choice from COCTAIL API

function getDrinkChoice(drinkChoice) {
  console.log(drinkChoice);
  const search = "search.php?s=";
  const urlDrinkChoice = baseDrinkURL + search + drinkChoice;
  fetch(urlDrinkChoice)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => displayDrink(responseJson))
    .catch((err) => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}

//gets a random food from Meal API

function getRandomFood() {
  const random = "random.php";
  const urlFood = baseFoodURL + random;
  console.log(urlFood);
  fetch(urlFood)
    .then((response) => response.json())
    .then((responseJson) => displayFood(responseJson));
}

//gets food options from MEAL API using users submission

function getFoodOptions(userFood) {
  const options = "filter.php?i=";
  const urlFoodOptions = baseFoodURL + options + userFood;
  fetch(urlFoodOptions)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => displayFoodOptions(responseJson))
    .catch((err) => {
      $("#js-error-message").text(
        "Something went wrong: Food Ingredient Not Found"
      );
    });
}

//gets drink options from COCKTAIL API using user submission

function getDrinkOptions(userDrink) {
  const options = "filter.php?i=";
  const urlDrinkOptions = baseDrinkURL + options + userDrink;
  fetch(urlDrinkOptions)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => displayDrinkOptions(responseJson))
    .catch((err) => {
      $("#js-error-message").text(
        "Something went wrong: Drink Ingredient Not Found"
      );
    });
}

//gets a random drink from Cocktail API

function getRandomDrink() {
  const random = "random.php";
  const urlDrink = baseDrinkURL + random;
  console.log(urlDrink);
  fetch(urlDrink)
    .then((response) => response.json())
    .then((responseJson) => displayDrink(responseJson));
}

//handles food ingredient click for get food options

function foodSubmit() {
  $("form").on("click", ".food-btn", function (event) {
    event.preventDefault();
    $("#js-error-message").empty();
    const userFood = $("#food-search").val();
    getFoodOptions(userFood);
  });
}

//handles drink ingredient click for drink options

function drinkSubmit() {
  $("form").on("click", ".drink-btn", function (event) {
    event.preventDefault();
    $("#js-error-message").empty();
    const userDrink = $("#drink-search").val();
    getDrinkOptions(userDrink);
  });
}

//if random button is pressed

function randomClick() {
  $("form").on("click", ".btn-random", function (event) {
    event.preventDefault();
    $("#js-error-message").empty();
    getRandomFood();
    getRandomDrink();
  });
}

//watches form for submits and clicks

function watchForm() {
  foodSubmit();
  drinkSubmit();
  randomClick();
}

$(watchForm);
