//-----------------------------------------------------------------------------
//  Galv's Quick Arrange Party
//-----------------------------------------------------------------------------
//  For: RPGMAKER MV
//  GALV_QuickArrangeParty.js
//-----------------------------------------------------------------------------
//  2017-04-02 - Version 1.3 - compatibility with Yanfly party system
//  2016-07-26 - Version 1.2 - fix bug with parallel processes
//  2016-07-22 - Version 1.1 - window refreshes if actor changes while open
//  2016-04-20 - Version 1.0 - release
//  Requested by James Westbrook
//-----------------------------------------------------------------------------
// Terms can be found at:
// galvs-scripts.com
//-----------------------------------------------------------------------------

var Imported = Imported || {};
Imported.Galv_QuickArrangeParty = true;

var Galv = Galv || {};          // Galv's main object
Galv.QAP = Galv.QAP || {};        // Galv's stuff

//-----------------------------------------------------------------------------
/*:
 * @plugindesc (v.1.3) Press buttons on map to quickly arrange your party members.
 * 
 * @author Galv - galvs-scripts.com
 *
 * @param Timeout
 * @desc Amount of frames before party arrange window auto-closes
 * @default 180
 *
 * @param Button
 * @desc Key pressed to open up party arrange window
 * @default control
 *
 * @param Window Height
 * @desc Height of the party arrange window
 * @default 100
 *
 * @param Window Position
 * @desc top, middle or bottom
 * @default top
 *
 * @param Actor Width
 * @desc The width of the box containing the actor in the party arrange window
 * @default 70
 *
 * @param Dead Icon
 * @desc Icon displayed on dead party member
 * @default 1
 *
 * @param Change Dead Battler
 * @desc If a member is defeated in battle they are automatically moved to the last member, true or false
 * @default false
 *
 * @help
 *   Galv's Quick Arrange Party
 * ----------------------------------------------------------------------------
 * This plugin was requested by James Westbrook to quickly rearrange party
 * members without having to go into the menu each time.
 *
 * Press the selected button to open/close the party window and then press the
 * number corresponding to the actor to highlight, then press the number of the
 * actor you wish to swap with. If an actor is pressed twice, they are swapped
 * with the party leader.
 *
 * The plugin will also automatically move dead party members to the back of
 * member list. This can also happen in battle but this is optional.
 *
 * Available default buttons:
 * 'tab',      // tab
 * 'ok',       // enter
 * 'shift',    // shift
 * 'control',  // control
 * 'control',  // alt
 * 'escape',   // escape
 * 'ok',       // space
 * 'pageup',   // pageup
 * 'pagedown', // pagedown
 * 'left',     // left arrow
 * 'up',       // up arrow
 * 'right',    // right arrow
 * 'down',     // down arrow
 * 'escape',   // insert
 * 'pageup',   // Q
 * 'pagedown', // W
 * 'escape',   // X
 * 'ok',       // Z
 * 'escape',   // numpad 0
 * 'down',     // numpad 2
 * 'left',    // numpad 4
 * 'right',   // numpad 6
 * 'up',      // numpad 8
 * 'debug'    // F9
 */



//-----------------------------------------------------------------------------
//  CODE STUFFS
//-----------------------------------------------------------------------------

(function() {

Galv.QAP.timeout = Number(PluginManager.parameters('Galv_QuickArrangeParty')["Timeout"]);
Galv.QAP.btn = PluginManager.parameters('Galv_QuickArrangeParty')["Button"];
Galv.QAP.wHeight = Number(PluginManager.parameters('Galv_QuickArrangeParty')["Window Height"]);
Galv.QAP.aWidth = Number(PluginManager.parameters('Galv_QuickArrangeParty')["Actor Width"]);
Galv.QAP.dIcon = Number(PluginManager.parameters('Galv_QuickArrangeParty')["Dead Icon"]);
Galv.QAP.pos = PluginManager.parameters('Galv_QuickArrangeParty')["Window Position"];

Galv.QAP.autoDead = PluginManager.parameters('Galv_QuickArrangeParty')["Change Dead Battler"].toLowerCase() == 'true' ? true : false;

// Add numbers
for (i = 0; i < 10; i++) {
	Input.keyMapper[i + 48] = String(i);
};


Galv.QAP.swapActors = function(mem1,mem2) {
	if (mem1 == mem2) {
		mem2 = 0;
	}
	$gameParty.swapOrder(mem1,mem2);
};



Galv.QAP.arrangeDead = function() {
	// remove all dead
	var deadlist = [];
	var length = $gameParty._actors.length;
	for (i = 0; i < length; i++) {
		if ($gameParty._actors[i] && $gameActors.actor($gameParty._actors[i]).isDead()) {
			deadlist.push($gameParty._actors[i]);
			$gameParty._actors.splice(i,1);
			i--;
		};
	};
	// add dead to end
	for (i = 0; i < deadlist.length; i++) {
		$gameParty._actors.push(deadlist[i]);
	};
};


Galv.QAP.open = function() {
	if (!$gameMap.isEventRunning() && SceneManager._scene._QAPWindow) SceneManager._scene._QAPWindow.open();
};

Galv.QAP.close = function() {
	if (SceneManager._scene._QAPWindow && SceneManager._scene._QAPWindow) SceneManager._scene._QAPWindow.close();
};

Galv.QAP.refresh = function() {
	if (SceneManager._scene._QAPWindow && SceneManager._scene._QAPWindow) SceneManager._scene._QAPWindow.refresh(true);
};

Galv.QAP.Game_Map_refresh = Game_Map.prototype.refresh;
Game_Map.prototype.refresh = function() {
	Galv.QAP.Game_Map_refresh.call(this);
	Galv.QAP.refresh();
};



// Refresh Here
//-----------------------------------------------------------------------------

Galv.QAP.BattleManager_endTurn = BattleManager.endTurn;
BattleManager.endTurn = function() {
	Galv.QAP.BattleManager_endTurn.call(this);
	if (Galv.QAP.autoDead) Galv.QAP.arrangeDead();
};


Galv.QAP.Game_Actor_refresh = Game_Actor.prototype.refresh;
Game_Actor.prototype.refresh = function() {
	Galv.QAP.Game_Actor_refresh.call(this);
	if (SceneManager._scene.constructor.name == "Scene_Map") $gamePlayer.refresh();
};

Galv.QAP.Scene_Battle_terminate = Scene_Battle.prototype.terminate;
Scene_Battle.prototype.terminate = function() {
	Galv.QAP.Scene_Battle_terminate.call(this);
	$gamePlayer.refresh();
};


// Game Player
//-----------------------------------------------------------------------------

Galv.QAP.Game_Player_refresh = Game_Player.prototype.refresh;
Game_Player.prototype.refresh = function() {
	Galv.QAP.arrangeDead();
	Galv.QAP.Game_Player_refresh.call(this);
};


Galv.QAP.Game_Player_moveByInput = Game_Player.prototype.moveByInput;
Game_Player.prototype.moveByInput = function() {
	Galv.QAP.Game_Player_moveByInput.call(this);
	if (Input.isTriggered(Galv.QAP.btn)) {
		Galv.QAP.open();
	};
};



// Scene Map
//-----------------------------------------------------------------------------

Galv.QAP.Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
Scene_Map.prototype.createAllWindows = function() {
	Galv.QAP.Scene_Map_createAllWindows.call(this);
	this.createQAPWindow();
};

Scene_Map.prototype.createQAPWindow = function() {
	this._QAPWindow = new Window_QAP();
    this.addChild(this._QAPWindow);
};

Galv.QAP.Scene_Map_callMenu = Scene_Map.prototype.callMenu;
Scene_Map.prototype.callMenu = function() {
	this._QAPWindow.hide();
	Galv.QAP.Scene_Map_callMenu.call(this);
};


// QAP Window
//-----------------------------------------------------------------------------

function Window_QAP() {
    this.initialize.apply(this, arguments);
};

Window_QAP.prototype = Object.create(Window_Base.prototype);
Window_QAP.prototype.constructor = Window_QAP;

Window_QAP.prototype.initialize = function(numLines) {
    var width = Graphics.boxWidth;
    var height = Galv.QAP.wHeight;
	switch (Galv.QAP.pos.toLowerCase()) {
		case 'top':
			var y = 0;
			break;
		case 'middle':
		case 'center':
			var y = Graphics.boxHeight / 2 - height / 2;
			break;
		case 'bottom':
		case 'bot':
			var y = Graphics.boxHeight - height;
			break;
	};
    Window_Base.prototype.initialize.call(this, 0, y, width, height);
	this._changeTarget = -1;
	this.openness = 0;
	this._timer = 0;
	this._currentParty = "";
	this.refresh(true,true);
};


Window_QAP.prototype.getPartyString = function() {
	var string = "";
	var mem = $gameParty.members();
	for (var i = 0; i < mem.length; i++) {
		string += mem[i]._actorId;
	};
	return string;
};

Window_QAP.prototype.refresh = function(clearTarget,force) {
	var compare = this.getPartyString();

	if (compare != this._currentParty || force) {
		if (clearTarget) this._changeTarget = -1;
		this.contents.clear();
		this.drawParty();
		this._currentParty = compare;
	};
};

Window_QAP.prototype.standardPadding = function() {
	return 0;
};

Window_QAP.prototype.update = function() {
	Window_Base.prototype.update.call(this);	
	if (this.isOpen()) {
		this._timer -= 1;
		if (this._timer <= 0) this.close();
		this.updateButtons();
	};
};

Window_QAP.prototype.updateButtons = function() {
	if (Input.isTriggered(Galv.QAP.btn) || $gameMap.isEventRunning()) {
		this.close();
		return;
	};
	for (i = 0; i < 10; i++) {
		if (Input.isTriggered(String(i))) {
			this._timer = Galv.QAP.timeout;
			var ti = i == 0 && $gameParty.members().length == 10 ? $gameParty.members().length - 1 : i - 1;
			if (this._changeTarget < 0) {
				if (i <= $gameParty.members().length) {
					if ($gameParty.members()[i - 1].isAlive()) {
						this._changeTarget = ti;
						this.refresh(false,true);
					} else {
						SoundManager.playBuzzer();
					};
				};
			} else {
				if (ti < $gameParty.members().length) {
					if ($gameParty.members()[i - 1].isAlive()) {
						Galv.QAP.swapActors(this._changeTarget,ti);
						this._changeTarget = -1;
						this.refresh(false,true);	
					} else {
						SoundManager.playBuzzer();
					};
				};
			};
		};
	};
};

Window_QAP.prototype.open = function() {
	this._timer = Galv.QAP.timeout;
	this._changeTarget = -1;
	this.refresh(true,true);
	Window_Base.prototype.open.call(this);
};

Window_QAP.prototype.drawParty = function() {
	var mem = $gameParty.members();
	var length = Math.min(mem.length,10);
	var space = Galv.QAP.aWidth;
	var x = (this.contentsWidth() / 2) - (length * space) / 2 + space / 2;
	var y = Galv.QAP.wHeight - 40;
	
	for (i = 0; i < length; i++) {
		var px = i * space + x;
		var nx = px - space / 2;

		if (i === this._changeTarget) {
			this.changePaintOpacity(false);
			this.contents.fillRect(nx, 10, space, this.contentsHeight() - 20, this.pendingColor());
			this.changePaintOpacity(true);
		};		
		this.drawCharacter(mem[i]._characterName, mem[i]._characterIndex, px, y);
		this.drawText(i + 1,nx,y,space,'center');
		if (mem[i].isDead()) this.drawIcon(Galv.QAP.dIcon,px - Window_Base._iconWidth / 2, y - Window_Base._iconHeight);
	};
};

})();