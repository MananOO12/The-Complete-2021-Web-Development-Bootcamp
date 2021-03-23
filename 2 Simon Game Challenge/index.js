
var buttonColor = ["green", "red", "yellow", "blue"];

var gamePattern = []
var userPattern = []

var started = false;
var level = 0;

$(document).keydown(function(event){
  if(!started){
    $("h1").text("Level " + level);
    nextSequence();
    started = true;
  }
});

$(".box").on("click", function(){
  //user pattern
  var userClicked = $(this).attr("id");
  userPattern.push(userClicked);

  //audio play
  playSound(userClicked);

  animatePress(userClicked);

  checkAnswer(userPattern.length-1);
});


function checkAnswer(currentLevel){
  console.log(userPattern);
  if(gamePattern[currentLevel] == userPattern[currentLevel]){

    console.log("true");

    if(userPattern.length == gamePattern.length){
      console.log("true1");
      setTimeout(nextSequence, 1000);
    }
  }
  else{
    console.log("fail");
    $("h1").text("Game Over, Press Any Key to Restart");
    $("body").addClass("game-over");

    var audio = new Audio("sounds/wrong.mp3");
    audio.play();

    setTimeout(function(){
      $("body").removeClass("game-over");
    }, 200);

    startOver();
  }
}


function nextSequence(){
  level++;
  $("h1").text("Level " + level);
  userPattern = [];
  randomNumber = generateRandom();
  randomColor = buttonColor[randomNumber];

  //random pattern
  gamePattern.push(randomColor);

  //animation
  $("#" + randomColor).fadeOut(100).fadeIn(100);

  //play sound
  playSound(randomColor);
}


function startOver(){
  level = 0;
  gamePattern = [];
  started = false;
}


function generateRandom(){
  n = Math.floor(Math.random() * 4);
  return n;
}


function playSound(name){
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}


function animatePress(name){
  $("#" + name).addClass("pressed");
  setTimeout(function(){
    $("#" + name).removeClass("pressed");
  }, 100);
}


// $("document").on("keydown", function(){
  // if(!started){
  //   $("h1").text("Level " + level);
  //   nextSequence();
  //   started = true;
//   }
// });


// function clicked(){
//
//   //user pattern
//   userClicked = $(this).attr("id");
//   userPattern.push(userClicked);
//
//   //audio play
//   playSound(userClicked);
//
//   animatePress(userClicked);
// }
