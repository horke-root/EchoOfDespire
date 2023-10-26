//=============================================================================
// OpheliaEnigma_MouseHover.js
//=============================================================================

/*:
 * @plugindesc Allows the player to highlight menu options by hovering with the
 * mouse.
 *
 * @author OpheliaEnigma
 * 
 * @help
 *
 * Allows the player to highlight menu options by hovering with the
 * mouse. This works for the show choices command, menu options, etc.
 * 
 *                      COPYRIGHT NOTICE:
 *                      -----------------
 *
 * This plugin is free to be used for non-commercial projects, however, for
 * usage on commercial projects, please visit https://opheliaenigma.itch.io/
 * and donate the amount specified for this plugin. Any doubt don't hesitate
 * to contact me, OpheliaEnigma, either through the specified link or my
 * email address: OpheliaEnigmaUltimateCoder [at] gmail.com
 */


//=============================================================================
// OpheliaEnigma_MouseHover Code
//=============================================================================
(function() {
	
	//=============================================================================
	// Window_Selectable
	//=============================================================================
	var _WS_update = Window_Selectable.prototype.update;
	Window_Selectable.prototype.update = function()
	{
		const measureEntry = function(curr, localCoord, entryParameter){
			return localCoord > curr.padding && localCoord <= entryParameter - curr.padding;
		}
		const checkX = function(curr){
			return measureEntry(curr, curr.canvasToLocalX(TouchInput.x), curr.width);
		}
		const checkY = function(curr){
			return measureEntry(curr, curr.canvasToLocalY(TouchInput.y), curr.height);
		}
		if (
			TouchInput.isMoved()   &&
			this.isOpen()          &&
			this.active            &&
			checkX(this)           &&
			checkY(this)
		) this.onTouch( false );
		
		// Make sure to do the stuff that was in the function before
		_WS_update.call(this);
	}
})();