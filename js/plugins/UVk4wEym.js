//===================================================================================
// Astfgl Item menu
// Date 20/10/2017
// Free to use both commercialyy and non commercially, repost and
// edit, as long as the final product is kept under the same terms of use.
// Credits required, any of Astfgl, Astgfl (Pierre MATEO), Pierre MATEO
//====================================================================================

/*:
 * @plugindesc Item Menu
 * @author Astfgl
 * @help All parameters are evaled, meaning you can use a formula, or in game variables.
 * For example you can put $gameVariables.value(1) in the columns parameter field.
 * Then, each time you open the menu, the number of columns will be what's 
 * inside variable 1.
 * 
 * @param x
 * @desc The x coordinate of the item window
 * @default Graphics.boxWidth / 2 - SceneManager._scene._itemWindow.width / 2
 *
 * @param y
 * @desc The y coordinate of the item window
 * @default Graphics.boxHeight / 2 - SceneManager._scene._itemWindow.height / 2
 *
 * @param width
 * @desc The width coordinate of the item window
 * @default 300
 *
 * @param height
 * @desc The height coordinate of the item window
 * @default 500
 *
 * @param columns
 * @desc The number of columns
 * @default 1
 *
 *
 * @param category
 * @desc The starting category of the item list window. 'item','weapon','armor','keyItem'.
 * @default 'keyItem'
*/

(function(){
	var params = PluginManager.parameters("AstfglIM");
	
	var _Astfgl_newSIC = Scene_Item.prototype.create
	Scene_Item.prototype.create = function() {
		_Astfgl_newSIC.call(this);
		this._helpWindow.hide();
		this._categoryWindow.hide();
		this._categoryWindow.deactivate();
		this._categoryWindow.selectSymbol(eval(params.category));
		this.onCategoryOk();
		this._itemWindow.setHandler('cancel', this.popScene.bind(this));
		this._itemWindow.width = eval(params.width) || 0;
		this._itemWindow.height = eval(params.height) || 0;
		this._itemWindow.x = eval(params.x) || 0;
		this._itemWindow.y = eval(params.y) || 0;
	}
	
	Window_ItemList.prototype.maxCols = function() {
		return eval(params.columns);
	};
	
})()