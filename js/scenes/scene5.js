var totalHits = 0,
		totalScore = 0,
		globalTimer = null,
		globalTime = 120,
		electronFallingTimer = null;

AFRAME.registerComponent("falling-electrons",{
	schema: {
    samplecount: {
      type: 'int',
      default: 20
    },
    blueColor : {
    	type : "string",
    	default : "#0000FF"
    },
    blueScore : {
    	type : "int",
    	default : 5
    },
    greenColor : {
    	type : "string",
    	default : "#00FF00"
    },
    greenScore : {
    	type : "int",
    	default : 3
    },
    orangeColor : {
    	type : "string",
    	default : "#ff4e48"
    },
    orangeScore : {
    	type : "int",
    	default : 2
    },
    redColor : {
    	type : "string",
    	default : "#FF0000"
    },
    redScore : {
    	type : "int",
    	default : 1
    }
  },
	init : function(){
		var electronWrapper = document.createElement("a-entity"),
				reactor = document.getElementById("reacter"),
				plate = document.getElementById("plate");
		var controllers = {
			"rightHand" : document.getElementById("right-btn"),
      "leftHand" : document.getElementById("left-btn")
		}
		var dr3video = document.getElementById("dr3-video");
		electronWrapper.id = "electron-wrapper";
		for(i = 0; i < this.data.samplecount; i++){
			var color,
					colorName;
			if((i % 4) == 0){
				color = this.data.blueColor;
				colorName = "blue";
				score = this.data.blueScore;
			}else if((i % 3) == 0){
				color = this.data.greenColor;
				colorName = "green";
				score = this.data.greenScore;
			}else if((i % 2) == 0){
				color = this.data.orangeColor;
				colorName = "orange";
				score = this.data.orangeScore;
			}else if((i % 1) == 0){
				color = this.data.redColor;
				colorName = "red";
				score = this.data.redScore;
			}
			var elec = this.getElectron(color, colorName, score, i);
			electronWrapper.appendChild(elec);
		}
		this.el.appendChild(electronWrapper);
		
		var position = {
			x : 0,
			y : -0.8,
			z : -5
		}

		var timeInterval = null;
		controllers.rightHand.addEventListener("mouseenter",function(){
			timeInterval = setInterval(function(){
				if(position.x < 3.6){
					position.x = position.x + 0.2;
				}
				plate.setAttribute("position",position);
			},500);
		})
		controllers.rightHand.addEventListener("mouseleave",function(){
			clearInterval(timeInterval);
			timeInterval = null;
		})
		controllers.leftHand.addEventListener("mouseenter",function(){
			timeInterval = setInterval(function(){
				if(position.x > -3.1){
					position.x = position.x - 0.2;
				}
				plate.setAttribute("position",position);
			},500);
		})
		controllers.leftHand.addEventListener("mouseleave",function(){
			clearInterval(timeInterval);
			timeInterval = null;
		})

		// dr3video.onended = function(){
		// 	window.location = "scene6.html"
		// }

		// controllers.rightHand.addEventListener("menudown",function(){
			// document.getElementById("scene5-intro").setAttribute("visible","false");
			electronFallingTimer = setInterval(makeElectronsFall, 3000);
			globalTimer = setInterval(startGlobalTimer, 1000);
		// })
	},

	getElectron : function(color, colorName, score, idx){
		var electron = document.createElement("a-sphere");
		electron.setAttribute("class",colorName + " electron");
		electron.setAttribute("data-index", idx);
		electron.setAttribute("radius", 0.1);
		electron.setAttribute("material","color:" + color);
		electron.setAttribute("visible","false");
		electron.setAttribute("static-body","");
		var position = {
			x : getRandomArbitrary(2,-2),
			y : 10,
			z : getRandomArbitrary(1.5, -1.5)
		}
		electron.setAttribute("position",position);
		position.y = -20;
		switch(colorName){
			case "blue":
				dur = 3000;
				break;
			case "green":
				dur = 5000;
				break;
			case "orange":
				dur = 7000;
				break;
			case "red":
				dur = 10000;
				break;
		}
		var jumpingElectrons = document.querySelectorAll(".jumping-electrons");
		var percent = document.getElementById("percent");
		electron.addEventListener("hitstart",function(evt){
			totalHits++;
			var reacter = document.getElementById("reacter");
			reacter.emit("electronHit");
			this.setAttribute("visible","false");
			var sc = totalScore + score;
			if(sc > 100){
				sc = 100;
			}
			totalScore = sc;
			window.localStorage.setItem("percent", totalScore);
			percent.setAttribute("value", sc + "%");
			var bar = document.getElementById("progress-bar");
			bar.emit("updateBar",{
				percentage : sc
			})
			if(sc == 100){
				endGame();
			}else{
				if(totalHits == 2){
					var ec5 = document.getElementById("electron5");
					var ec6 = document.getElementById("electron6");
					var ec1 = document.getElementById("electron1");
					var ec2 = document.getElementById("electron2");
					ec5.setAttribute("position","-0.938 0.487 -1.71");
					ec6.setAttribute("position","0.574 0.487 -1.718");
					ec5.setAttribute("visible","true");
					ec6.setAttribute("visible","true");
					ec1.setAttribute("visible","false");
					ec2.setAttribute("visible","false");
				}else if(totalHits == 3){
					var ec7 = document.getElementById("electron7");
					var ec8 = document.getElementById("electron8");
					var ec3 = document.getElementById("electron3");
					var ec4 = document.getElementById("electron4");
					ec7.setAttribute("position","0.574 0.487 -0.202");
					ec8.setAttribute("position","-0.934 0.487 -0.234");
					ec7.setAttribute("visible","true");
					ec8.setAttribute("visible","true");
					ec3.setAttribute("visible","false");
					ec4.setAttribute("visible","false");
				}else if(totalHits == 4){
					var ec1 = document.getElementById("electron1");
					var ec2 = document.getElementById("electron2");
					ec1.setAttribute("visible","true");
					ec2.setAttribute("visible","true");
				}else if(totalHits == 5){
					var ec3 = document.getElementById("electron3");
					var ec4 = document.getElementById("electron4");
					ec3.setAttribute("visible","true");
					ec4.setAttribute("visible","true");
				}
				jumpingElectrons.forEach(function(elec){
					elec.emit("electronJump");
				})
			}
		})
		electron.setAttribute("animation__drop" + idx, {"property" : "position", "startEvents" : "dropElectron", "to" : position, "dur" : dur });
		return electron;
	}
})

var getRandomArbitrary = function(max, min) {
  return Math.random() * (max - min) + min;
}

var getRandomInteger = function(min, max){
	min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

var endGame = function(){
	// var video = document.getElementById("dr3-video");
	// var player = document.getElementById("player");
	// player.setAttribute("visible",true);
	// video.play();
	clearInterval(this.electronFallingTimer);
	clearInterval(globalTimer);
}

var startGlobalTimer = function(){
	var time = document.getElementById("time");
	globalTime--;
	time.setAttribute("value",globalTime + " Secs");
	if(globalTime == 0){
		endGame();
	}
}

var	makeElectronsFall = function(){
	var number = getRandomInteger(1,3);
	for(i = 0; i <= number; i++){
		var electronNumber = getRandomInteger(1,21);
		var electron = document.querySelector('a-sphere[data-index="' + electronNumber + '"]');
		electron.setAttribute("visible","true");
		electron.emit("dropElectron");
	}
}










