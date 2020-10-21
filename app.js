var numSquares = 6;
var colors = [];
var pickedColor;
var squares = document.querySelectorAll(".square");
var colorDisplay = document.getElementById("colorDisplay");
var messageDisplay = document.querySelector("#message");
var h1 = document.querySelector("h1");
var resetButton = document.querySelector("#reset");
var modeButtons = document.querySelectorAll(".mode");
var score = 0; 
var scoreDisplay = document.querySelector("#scoreDisplay"); 
var resetPressed = true; 


init();

function init(){ //initializes the session, gets the current score or resets the score 
	setupModeButtons();
	setupSquares();
	var lsScore = sessionStorage.getItem('score');
	if( lsScore !== null ){
		score = lsScore; 
		scoreDisplay.textContent = score;
	}
	else {
		sessionStorage.setItem('score', score); 
	}
	reset();
}

function setupModeButtons(){  //sets the number of squares based on whether hard (numSquares= 6) or easy (numSquares=3) is selected 
	for(var i = 0; i < modeButtons.length; i++){
		modeButtons[i].addEventListener("click", function(){
			modeButtons[0].classList.remove("selected");
			modeButtons[1].classList.remove("selected");
			this.classList.add("selected");
			this.textContent === "Easy" ? numSquares = 3: numSquares = 6;
			reset();
		});
	}
}

function setupSquares(){ //if the color of clickedColor is equal to the pickedColor, than the text "Correct!" will be displayed w/ the play again option and show score. 
//if the color of clickedColor is not equal to the pickedColor, the message "Try Again" will display w/ the current score 
	for(var i = 0; i < squares.length; i++){
	//add click listeners to squares
		squares[i].addEventListener("click", function(){
			//grab color of clicked square
			var clickedColor = this.style.background;
			//compare color to pickedColor
			if(clickedColor === pickedColor){ 
				updateColorName();
				//console.log(colorName);
				messageDisplay.textContent = "Correct!";
				resetButton.textContent = "Play Again?"
				changeColors(clickedColor);
				h1.style.background = clickedColor;
				if(resetPressed){
					score+=5; 
					resetPressed = false;
				}
				scoreDisplay.textContent = score;
				sessionStorage.setItem('score', score);
			} else {
				this.style.background = "#232323";
				messageDisplay.textContent = "Try Again"
				score--;
				scoreDisplay.textContent = score; 
				sessionStorage.setItem('score', score);
			}
		});
	}
}


async function updateColorName(){ //This funcition asynchronously goes to https://www.thecolorapi.com/id?rgb= and looks up
	//the correct color in the array for the clicked square to update the ColorName. Then it reads the result and parses it as JSON. 
	//It then updates all of the color blocks to that color and displays the color name OR if it's  not an exact match, the color name 
	//will print out with the color name plus "ish." 
	const regex = /\([^\)]+\)/g; 
	var rgbColors = pickedColor.match(regex); 
	const url = "https://www.thecolorapi.com/id?rgb="+rgbColors[0];
	var requestOptions = {
	  method: 'GET',
	  redirect: 'follow'
	};

	let result = await fetch(url, requestOptions); 
	let colorData = await result.json(); 

	if(colorData.name.exact_match_name) {
		colorDisplay.textContent = colorData.name.value; 
	}
	else {
		colorDisplay.textContent = colorData.name.value + "-ish"; 
	}
}

function reset(){ //This function resets the board w/ new colors for a new game 
	resetPressed = true;
	colors = generateRandomColors(numSquares);
	//pick a new random color from array
	pickedColor = pickColor();
	//change colorDisplay to match picked Color
	colorDisplay.textContent = pickedColor;
	resetButton.textContent = "New Colors"
	messageDisplay.textContent = "";
	//change colors of squares
	for(var i = 0; i < squares.length; i++){
		if(colors[i]){
			squares[i].style.display = "block"
			squares[i].style.background = colors[i];
		} else {
			squares[i].style.display = "none";
		}
	}
	h1.style.background = "steelblue";
}

resetButton.addEventListener("click", function(){
	reset();
})

function changeColors(color){  //This function loops through all squares and changes the color to match the given color.
	//loop through all squares
	for(var i = 0; i < squares.length; i++){
		//change each color to match given color
		squares[i].style.background = color;
	}
}

function pickColor(){ //This function chooses a random color 
	var random = Math.floor(Math.random() * colors.length);
	return colors[random];
}

function generateRandomColors(num){  //This function creates the random array of colors and returns that array 
	//make an array
	var arr = []
	//repeat num times
	for(var i = 0; i < num; i++){
		//get random color and push into arr
		arr.push(randomColor())
	}
	//return that array
	return arr;
}

function randomColor(){  //This function picks the random color to be used (at the top of the screen). 
	//pick a "red" from 0 - 255
	var r = Math.floor(Math.random() * 256);
	//pick a "green" from  0 -255
	var g = Math.floor(Math.random() * 256);
	//pick a "blue" from  0 -255
	var b = Math.floor(Math.random() * 256);
	return "rgb(" + r + ", " + g + ", " + b + ")";
}