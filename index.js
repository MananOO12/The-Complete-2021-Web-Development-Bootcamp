//setTimeout(startGame, 5000);


function startGame(){

var number1 = Math.floor(Math.random()*6)+1;
var number2 = Math.floor(Math.random()*6)+1;

var img1 = "images/dice"+number1+".png";
var img2 = "images/dice"+number2+".png";

document.querySelector(".dice1-img").setAttribute("src",img1);
document.querySelector(".dice2-img").setAttribute("src",img2);
var result = document.querySelectorAll(".dice p");
if(number1>number2)
  {
    document.querySelector("h1").innerHTML = "🎉Player 1 Wins!!!";
    result[0].innerHTML = "🎉 Player 1";
  }
else if(number2>number1)
  {
    document.querySelector("h1").innerHTML = "🎉Player 2 Wins!!!";
    result[1].innerHTML = "Player 2 🎉";
  }
else
  document.querySelector("h1").innerHTML = "!!Draw!!";
}

document.addEventListener('click', startGame);