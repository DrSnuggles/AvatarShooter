// LD37 - ED:Avatar Shooter
/*
Story:
I'm an Elite Dangerous gamer and i love this game like it's predecessors.
Inspired by the view in front of my space ship, which i'm consuming too much, and ongoing war in galaxy
i had the idea of killing our enemies in our station.
I do a bit of coding around ED but this time i wanted to join LD and build this little, simple game

Problem:
Time. I just have less than 24hours instead of 72 for this Jam entry.

Solved:
I made it as simple as possible and we enjoy playing it. It just took about 6-8 hours. Most of the time was needed for searching avatars in youtube/forums/databases and resizing them.
The code is commented but not very nice. Most of it is copy&paste from MDN (https://github.com/mozdevs/gamedev-js-tiles/blob/gh-pages/square/logic-grid.js)

Used Tools:
Programmers Notepad v2.3.4 (no, i will not update today :)
Paint.NET v3.36 (old version but i prefer the interface)
Audacity v2.1.0
*/

// Init
document.title='LD37 - ED:Avatar Shooter';
document.oncontextmenu=function (){return false;};		// disable RMB
document.ondragstart=function (){return false;};		// disable unwanted
document.ondragsend=function (){return false;};			// drag'n'drop
var canvas = document.getElementById("canvas");			// get HTML canvas element
var context = canvas.getContext('2d');					// get 2D context of canvas for drawing
window.onresize = function (){resizer();};				// i like it scaled, so call function when window is resized

// all audio assets by Frontier Developments
var snd_mus = document.createElement("audio"); snd_mus.src = "mus/Battleship5.ogg"; snd_mus.loop = false;		// by Frontier Developments
var snd_hit = document.createElement("audio"); snd_hit.src = "snd/Hit.ogg";	snd_hit.volume = 0.5;				// from an UA in Elite Dangerous by Frontier Developments
var snd_hit2 = document.createElement("audio"); snd_hit2.src = "snd/HitFriend.ogg";	snd_hit2.volume = 0.5;		// cannot comply
var snd_shot = document.createElement("audio"); snd_shot.src = "snd/Shot.ogg"; snd_shot.volume = 1.0;			// Fragcannon

// scale the gfx if screen is resized
var xscale, yscale;	// global var storing the scalefactor x & y
function resizer(){ // i like it scaled
 canvas.width=window.innerWidth-1;	//needed, else you get scrollbars
 canvas.height=window.innerHeight-4;//needed, else you get scrollbars
 xscale=canvas.width/1920.0;		//1920x1080 are the original sizes of the bg picture
 yscale=canvas.height/1080.0;
}

var Loader = {	//from MDN
	images: {}
};
Loader.loadImage = function (key, src) {//from MDN
	var img = new Image();
	var d = new Promise(function (resolve, reject) {
		img.onload = function () {
			this.images[key] = img;
			resolve(img);
		}.bind(this);
		img.onerror = function () {
			reject('Could not load image: ' + src);
		};
	}.bind(this));
	img.src = src;
	return d;
};
Loader.getImage = function (key) {	//from MDN
	return (key in this.images) ? this.images[key] : null;
};

var mousePos;
function getMousePos(canvas, evt) {	// http://www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}
canvas.addEventListener('mousemove', function(evt) {
	mousePos = getMousePos(canvas, evt);
}, false);
canvas.addEventListener('mousedown', function(evt) { // own mousedown event
	if (!Game.paused){
		snd_shot.play();
		snd_shot.currentTime=0;
		if (Game.Foe){
			for (var i=Game.Foe.length-1;i>=0;i--){
				if (((mousePos.x<553*xscale || mousePos.x>(553+385)*xscale) || (mousePos.y<559*yscale || mousePos.y>(559+111)*yscale)) && ((mousePos.x<980*xscale || mousePos.x>(980+387)*xscale) || (mousePos.y<558*yscale || mousePos.y>(558+111)*yscale))){ // not behind shelter
					if (Math.abs((Game.Foe[i].x+Game.Foe[i].Sheet.width/2)*xscale-mousePos.x)<20*xscale && Math.abs((Game.Foe[i].y+Game.Foe[i].Sheet.height/2)*yscale-mousePos.y)<20*yscale){	//Foe hit
						Game.Foe.splice(i,1);
						points+=200;
						snd_hit.play();
						snd_hit.currentTime=0;
					}
				}
			}
		}
		if (Game.Friend){
			for (var i=Game.Friend.length-1;i>=0;i--){
				if (((mousePos.x<553*xscale || mousePos.x>(553+385)*xscale) || (mousePos.y<559*yscale || mousePos.y>(559+111)*yscale)) && ((mousePos.x<980*xscale || mousePos.x>(980+387)*xscale) || (mousePos.y<558*yscale || mousePos.y>(558+111)*yscale))){ // not behind shelter
					if (Math.abs((Game.Friend[i].x+Game.Friend[i].Sheet.width/2)*xscale-mousePos.x)<20*xscale && Math.abs((Game.Friend[i].y+Game.Friend[i].Sheet.height/2)*yscale-mousePos.y)<20*yscale){	//Friend hit
						Game.Friend.splice(i,1);
						points-=500;
						snd_hit2.play();
						snd_hit2.currentTime=0;
					}
				}
			}
		}
	}
}, false);
var Game = {};
Game.paused=false;	// game will be paused when timeleft=0 (as long as music plays)
Game.run = function (context) {	//from MDN
	this.ctx = context;
	this._previousElapsed = 0;

	var p = this.load();
	Promise.all(p).then(function (loaded) {
		this.init();
		window.requestAnimationFrame(this.tick);
	}.bind(this));
};
Game.tick = function (elapsed) {	//from MDN
	if(!this.paused){
		window.requestAnimationFrame(this.tick);
		this.ctx.clearRect(0, 0, canvas.width, canvas.height);
		var delta = (elapsed - this._previousElapsed) / 1000.0;
		delta = Math.min(delta, 0.25); // maximum delta of 250 ms
		this._previousElapsed = elapsed;
		this.update(delta);
		this.render();
	}
}.bind(Game);
Game.init = function () {};	//from MDN
Game.update = function (delta) {};	//from MDN
Game.render = function () {};	//from MDN
window.onload = function () {	//from MDN
	resizer();
	Game.run(context);
};
function Foe() {
	// which Foe
	var tmp=Math.random()*53;				//0-52.9999
	tmp=Math.floor(tmp+1);					//1-53
	this.Sheet = Loader.getImage('R'+tmp);	//R1-R53
	// pos
	tmp=Math.random()*600;					//0-599.9999
	this.x=600+tmp;							//600-1199.9999
	this.y = 559;
	// dir (left,right,up)
	tmp=Math.random();
	this.dirX=0;
	this.dirY=0;
	if (tmp<0.2){
		this.dirX=-1;						//20% chance for left
	}else if(tmp>=0.2 && tmp<0.4){
		this.dirX=1;						//20% chance for right
	}else{
		this.dirY=-1;						//rest chance for up
	}
	// speed
	var tmp=Math.random()*128;
	this.speed = 64+tmp;					// 64-192
	tmp = Math.random()*3000+2000;
	window.setTimeout(function (){Game.Foe.push(new Foe())},tmp);	// new Foe after 2-5 sec
}
Foe.prototype.move = function (delta) {
	this.x += this.dirX * this.speed * delta;
	this.y += this.dirY * this.speed * delta;
};
function Friend() {
	// which Friend
	var tmp=Math.random()*18; 				//0-17.9999
	tmp=Math.floor(tmp+1);					//1-18
	this.Sheet = Loader.getImage('F'+tmp);	//F1-F18
	// pos
	tmp=Math.random()*600;
	this.x=600+tmp;
	this.y = 559;
	// dir (left,right,up)
	tmp=Math.random();
	this.dirX=0;
	this.dirY=0;
	if (tmp<0.2){
		this.dirX=-1;
	}else if(tmp>=0.2 && tmp<0.4){
		this.dirX=1;
	}else{
		this.dirY=-1;
	}
	// speed
	var tmp=Math.random()*128;
	this.speed = 64+tmp;
	tmp = Math.random()*20000+5000;
	window.setTimeout(function (){Game.Friend.push(new Friend())},tmp); // new friend after 5-25 sec
}
Friend.prototype.move = function (delta) {
	this.x += this.dirX * this.speed * delta;
	this.y += this.dirY * this.speed * delta;
};
Game.load = function () { // here are all the picture assets
    return [
        Loader.loadImage('bg', 'gfx/Dock.jpg'),
        Loader.loadImage('left', 'gfx/Dock_left.png'),
        Loader.loadImage('right', 'gfx/Dock_right.png'),
		Loader.loadImage('R1', 'gfx/RoA/1stBones.jpg'),
		Loader.loadImage('R2', 'gfx/RoA/Calavero.jpg'),
		Loader.loadImage('R3', 'gfx/RoA/Drunk3nJ3sus.jpg'),
        Loader.loadImage('R4', 'gfx/RoA/Engineer.jpg'),
		Loader.loadImage('R5', 'gfx/RoA/FinnTarses.jpg'),
		Loader.loadImage('R6', 'gfx/RoA/FriedrichNix.jpg'),
		Loader.loadImage('R7', 'gfx/RoA/Haazopp.png'),
		Loader.loadImage('R8', 'gfx/RoA/HaGGiz.jpg'),
		Loader.loadImage('R9', 'gfx/RoA/Husky.jpg'),
		Loader.loadImage('R10', 'gfx/RoA/JerryCotton.jpg'),
		Loader.loadImage('R11', 'gfx/RoA/KnaeckeBroetchen.jpg'),
		Loader.loadImage('R12', 'gfx/RoA/LouBaron.jpg'),
		Loader.loadImage('R13', 'gfx/RoA/LukeMurphy.jpg'),
		Loader.loadImage('R14', 'gfx/RoA/McCloud.jpg'),
		Loader.loadImage('R15', 'gfx/RoA/OogieBoogie.jpg'),
		Loader.loadImage('R16', 'gfx/RoA/RagnarLodbrock.jpg'),
		Loader.loadImage('R17', 'gfx/RoA/Revaan.jpg'),
		Loader.loadImage('R18', 'gfx/RoA/YuriTakanawa.jpg'),
		Loader.loadImage('R19', 'gfx/RoA/ZandZack.jpg'),
		Loader.loadImage('R20', 'gfx/51TH/BoltThroweR.jpg'),
		Loader.loadImage('R21', 'gfx/51TH/Chdracu.jpg'),
		Loader.loadImage('R22', 'gfx/51TH/Dankad.jpg'),
		Loader.loadImage('R23', 'gfx/51TH/Eoxe.jpg'),
		Loader.loadImage('R24', 'gfx/51TH/FireFox.jpg'),
		Loader.loadImage('R25', 'gfx/51TH/MikeDerix.jpg'),
		Loader.loadImage('R26', 'gfx/51TH/MKaard.jpg'),
		Loader.loadImage('R27', 'gfx/51TH/Monstro99.jpg'),
		Loader.loadImage('R28', 'gfx/51TH/Noctis.jpg'),
		Loader.loadImage('R29', 'gfx/51TH/Psycho.jpg'),
		Loader.loadImage('R30', 'gfx/51TH/Snax.jpg'),
		Loader.loadImage('R31', 'gfx/RSM/AHoncho.jpg'),
		Loader.loadImage('R32', 'gfx/RSM/AntSolo.jpg'),
		Loader.loadImage('R33', 'gfx/RSM/Jimeoren.jpg'),
		Loader.loadImage('R34', 'gfx/RSM/MikeMEtalic.jpg'),
		Loader.loadImage('R35', 'gfx/RSM/RedHot.jpg'),
		Loader.loadImage('R36', 'gfx/RSM/RMpage.jpg'),
		Loader.loadImage('R37', 'gfx/SDC/Di4blo.jpg'),
		Loader.loadImage('R38', 'gfx/SDC/MassLockedMafia.jpg'),
		Loader.loadImage('R39', 'gfx/SDC/NobleAvatar.jpg'),
		Loader.loadImage('R40', 'gfx/SDC/Rinzler.jpg'),
		Loader.loadImage('R41', 'gfx/SDC/SmokeWeez.jpg'),
		Loader.loadImage('R42', 'gfx/SDC/Sole.jpg'),
		Loader.loadImage('R43', 'gfx/SDC/ToasterTest.jpg'),
		Loader.loadImage('R44', 'gfx/others/AED.jpg'),
		Loader.loadImage('R45', 'gfx/others/ChadMcClish.jpg'),
		Loader.loadImage('R46', 'gfx/others/DangerousCom.jpg'),
		Loader.loadImage('R47', 'gfx/others/DokiDoki.jpg'),
		Loader.loadImage('R48', 'gfx/others/HOBOwFragcannon.jpg'),
		Loader.loadImage('R49', 'gfx/others/InAbsentia.jpg'),
		Loader.loadImage('R50', 'gfx/others/Nyxi.jpg'),
		Loader.loadImage('R51', 'gfx/others/Palazo.jpg'),
		Loader.loadImage('R52', 'gfx/others/PiPko.jpg'),
		Loader.loadImage('R53', 'gfx/others/xpressive.jpg'),
		Loader.loadImage('F1', 'gfx/BBfA/Apollo.jpg'),
		Loader.loadImage('F2', 'gfx/BBfA/Benethor.jpg'),
		Loader.loadImage('F3', 'gfx/BBfA/Brahtacc.jpg'),
		Loader.loadImage('F4', 'gfx/BBfA/Chabis.jpg'),
		Loader.loadImage('F5', 'gfx/BBfA/CptGrato.jpg'),
		Loader.loadImage('F6', 'gfx/BBfA/Crocket.jpg'),
		Loader.loadImage('F7', 'gfx/BBfA/DanyTheReaper.jpg'),
		Loader.loadImage('F8', 'gfx/BBfA/EllenLRipley.jpg'),
		Loader.loadImage('F9', 'gfx/BBfA/Hermodt.jpg'),
		Loader.loadImage('F10', 'gfx/BBfA/HunterAlf.jpg'),
		Loader.loadImage('F11', 'gfx/BBfA/Irreversible.jpg'),
		Loader.loadImage('F12', 'gfx/BBfA/Krisnawalla.jpg'),
		Loader.loadImage('F13', 'gfx/BBfA/Pitek.jpg'),
		Loader.loadImage('F14', 'gfx/BBfA/Schoki.jpg'),
		Loader.loadImage('F15', 'gfx/BBfA/SilentMagic85.jpg'),
		Loader.loadImage('F16', 'gfx/BBfA/Tinvanno.jpg'),
		Loader.loadImage('F17', 'gfx/BBfA/Tomski.jpg'),
		Loader.loadImage('F18', 'gfx/BBfA/ZBrannigan.jpg')
    ];
};

var points = 0;
var timeleft = 65535;
Game.init = function () {
	timeleft = snd_mus.duration;	// time for this room in seconds (equal to music length)
	this.Friend = [];				// array for all Friends
	var tmp = Math.random()*5000;	// max up to 5 sec before friend shows up
	window.setTimeout(function(){Game.Friend.push(new Friend())},tmp);
	this.Foe = [];					// array for all foes
	var tmp = Math.random()*3000;
	window.setTimeout(function(){Game.Foe.push(new Foe())},tmp);
	var tmp = Math.random()*3000;
	window.setTimeout(function(){Game.Foe.push(new Foe())},tmp);
	this.bg = Loader.getImage('bg');	// bg picture
	this.ld = Loader.getImage('left');	// left barrier
	this.rd = Loader.getImage('right');	// right barrier
	resizer();							// needed to get xscale,yscale
	snd_mus.play();						// play bg music
	window.requestAnimationFrame(this.tick);	// lets rock
};
Game.update = function (delta) {
	timeleft-=delta;									// decrease by passed time
	if (Math.round(timeleft,1)==0.0){Game.paused=true;}	// if there is no time left pause the game
	if (this.Foe){										// if foe exists
		for (var i=this.Foe.length-1;i>=0;i--){			// all foes
			// if outside the screen remove
			if (this.Foe[i].x<0-this.Foe[i].Sheet.width || this.Foe[i].x>1920+this.Foe[i].Sheet.width || this.Foe[i].y<0-this.Foe[i].Sheet.height || this.Foe[i].y>1080+this.Foe[i].Sheet.height){
				this.Foe.splice(i,1);		// destroy enemy
			}else{
				this.Foe[i].move(delta);	// move enemy
			}
		}
	}
	if (this.Friend){
		for (var i=this.Friend.length-1;i>=0;i--){
			// if outside the screen remove
			if (this.Friend[i].x<0-this.Friend[i].Sheet.width || this.Friend[i].x>1920+this.Friend[i].Sheet.width || this.Friend[i].y<0-this.Friend[i].Sheet.height || this.Friend[i].y>1080+this.Friend[i].Sheet.height){
				this.Friend.splice(i,1);		// destroy friend
			}else{
				this.Friend[i].move(delta);	// move friend
			}
		}
	}
};
Game.render = function () { // finally it's time to draw into the canvas
    this.ctx.drawImage(this.bg,0,0,canvas.width,canvas.height);		// draw background
	
	if (this.Foe){													// draw enemies
		for (var i=this.Foe.length-1;i>=0;i--){						// all enemies
			this.ctx.drawImage(
				this.Foe[i].Sheet,
				this.Foe[i].x*xscale,
				this.Foe[i].y*yscale,
				this.Foe[i].Sheet.width*xscale,
				this.Foe[i].Sheet.height*yscale
			);
			// draw red rect around enemies
			this.ctx.beginPath();
			this.ctx.lineWidth="2";
			this.ctx.strokeStyle="red";
			this.ctx.rect(this.Foe[i].x*xscale-1,this.Foe[i].y*yscale-1,this.Foe[i].Sheet.width*xscale+2,this.Foe[i].Sheet.height*yscale+2);
			this.ctx.stroke();
		}
	}
	if (this.Friend){												// friends?
		for (var i=this.Friend.length-1;i>=0;i--){					// draw all friend
			this.ctx.drawImage(
				this.Friend[i].Sheet,
				this.Friend[i].x*xscale,
				this.Friend[i].y*yscale,
				this.Friend[i].Sheet.width*xscale,
				this.Friend[i].Sheet.height*yscale
			);
			// draw blue rect around friends
			this.ctx.beginPath();
			this.ctx.lineWidth="2";
			this.ctx.strokeStyle="blue";
			this.ctx.rect(this.Friend[i].x*xscale-1,this.Friend[i].y*yscale-1,this.Friend[i].Sheet.width*xscale+2,this.Friend[i].Sheet.height*yscale+2);
			this.ctx.stroke();
		}
	}
    this.ctx.drawImage(this.ld,553*xscale,559*yscale,385*xscale,111*yscale);	// draw barrier in front
    this.ctx.drawImage(this.rd,980*xscale,558*yscale,387*xscale,111*yscale);	// could be more than one, or just one large with transparency

	// OnScreenDisplay
	this.ctx.font = 'bold 20pt Calibri';
	this.ctx.fillStyle = '#FFFFFF';
	this.ctx.fillText('Ludum Dare 37 - One room', 2, 20);
	this.ctx.fillStyle = '#F16C00';
	this.ctx.fillText('Score:'+points, 2, 45);
	this.ctx.fillStyle = '#E50000';
	this.ctx.fillText('Time:'+Math.round(timeleft), 2, 70);

	//Bottomline
	this.ctx.fillStyle = '#FFFFFF';
	this.ctx.fillText('all assets from Elite:Dangerous © by Frontier Developments', 2, canvas.height-5);
};