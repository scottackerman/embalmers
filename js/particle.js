var numberOfFlakes = 250,
    snowHorizonWidth = 800,
    flakeScaleMin = .8,
    flakeScaleMax = 2,
    maxXFloat = 200,
    minFlakeTweenTime = 3,
    maxFlakeTweenTime = 10,
    maxFlakeHangTime = .5,
    liquidSurfaceY = 400,

    steamDensity = 50,
    steamHorizonStart = 30,
    steamScaleMin = 2,
    steamScaleMax = 10,
    minSteamTweenTime = .5,
    maxSteamTweenTime = 2,
    steamHorizonX = 20,
    steamHorizonY = 0,  
    steamId = 0,
    steamPulls = 0,
    steamTargetArray = new Array('#midTrain', '#frontTrain');

// FIND THE FLAKING MEMORY LEAK!!!!!

$(document).ready(function() {
  Modernizr.load('js/traqball.js');
	setTimeout('init()', 5500);
	startFlakes();
});

function init() {
  $('#viewport').addClass('active');
  getRandomSteamTime();
}

function styleParticle(particle, alpha, scale, x) {
	$(particle).css({'border-radius': scale, 'height': scale, 'left': x, 'top': 0, 'opacity': alpha, 'width': scale});
}

function startFlakes() {
	for(var i=0; i < numberOfFlakes; i++) {
		var flake = spawnFlake();
		setFlakeParams(flake);
	}
}

function spawnFlake() {
	var flake = document.createElement('div');
	flake.className = 'snow';
	$('#snowfield').append(flake);
	return flake;
}

function setFlakeParams(flake) {
	var flakeAlpha = Math.random() * 1;
	var flakeStartX = Math.random() * snowHorizonWidth;
	var flakeFinishX =  flakeStartX + setFlakeXFloat();
	var flakeScale = Math.round((Math.random() * (flakeScaleMax - flakeScaleMin)) + flakeScaleMin);
	var flakeTweenTime = (Math.random() * (maxFlakeTweenTime - minFlakeTweenTime)) + minFlakeTweenTime;
	styleParticle(flake, flakeAlpha, flakeScale, flakeStartX);
	tweenFlake(flake, flakeFinishX, flakeTweenTime);
}

function setFlakeHangTime(flakeTweenTime) {
	return flakeTweenTime + Math.random()*maxFlakeHangTime;
}

function setFlakeXFloat() {
	var posNeg = Math.round(Math.random()*1);
	if(posNeg==0){
		posNeg = -1
	}
	var xFloat = (Math.round((Math.random() * maxXFloat)) * posNeg);
	return xFloat;
}

// ADD EASING TO SNOW
function tweenFlake(flake, flakeFinishX, flakeTweenTime) {
  var leftStr = flakeFinishX + 'px';
  var topStr = liquidSurfaceY + 'px';
  $(flake).animate({top: topStr, left: flakeFinishX}, flakeTweenTime*1000, function() {
      setFlakeParams(flake);
  });
}

/* STEAM */

function getRandomSteamTime() {
	var timeDelay = (Math.random()*3)+1;
	setTimeout('generateSteam()', timeDelay*1000);
}

function generateSteam(){
	steamPulls = Math.ceil(Math.random()*6);
	var targ = Math.round(Math.random());
	startSteam(steamTargetArray[targ]);
}

function startSteam(target) {
	steamPulls--;
	for(var i=0; i < steamDensity; i++) {
		steamId ++;
		var steam = spawnSteam(steamId, target);
		setSteamParams(steam, target);
	}
	if(steamPulls > 0){
		setTimeout(function() {
		    startSteam(target);
		}, 100);
	}
	else{
		getRandomSteamTime();
	}
}

function spawnSteam(i, target) {
	var steam = document.createElement('div');
	steam.className = 'particle steam';
	steam.id = 'steam'+i;
	$(target).append(steam);
	return steam;
}

function setSteamParams(steam, target) {
	var steamAlpha = Math.random() * 1;
	var steamScale = Math.round((Math.random() * (steamScaleMax - steamScaleMin)) + steamScaleMin);
	var steamTweenTime = (Math.random() * (maxSteamTweenTime - minSteamTweenTime)) + minSteamTweenTime;
	styleParticle(steam, steamAlpha, steamScale, steamHorizonStart);
	tweenSteam(steam, steamTweenTime, target);
}

// MUST KILL THE DIVS ONCE FADED OUT.
function tweenSteam(steam, steamTweenTime, target) {
	var targ = target.substring(1, target.length);
	var yTween = new Tween(steam.style, 'top', Tween.regularEaseOut, 0, -60, steamTweenTime, 'px');
	var xTween = new Tween(steam.style, 'left', Tween.regularEaseIn, 30, 200, steamTweenTime, 'px');
	var st = new Object();
	st.steam = steam;
	st.targ = targ;
	st.onMotionFinished = function(){
		var child = document.getElementById(this.steam.id);
		var parent = document.getElementById(targ);
		parent.removeChild(child);
	};
	xTween.addListener(st);
	xTween.start();
	yTween.start();
	
}