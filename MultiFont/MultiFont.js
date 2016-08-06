//=============================================================================
// Multi Font
// by Shirogane / smallomega.com
//=============================================================================


/*
 * @plugindesc You can use more than one font
 * @author Shirogane / smallomega.com
 *
 * @param initFontFamily
 * @desc default setting font
 * @default GameFont
 *
 * @help
 * You can use more than one font
 * To change all of the fonts in your game, such as message windows and menu windows
 * Put the font files in the fonts/ folder, and describe as below to the gamefont.css 
 *
 * @font-face {
 *  font-family: GameFont;
 *  src: url("mplus-1m-regular.ttf");
 * }
 * @font-face{
 *  font-family: GameFont2;
 *  src: url("xxx.ttf");
 * }
 *
 * Enter arbitrary string to font-family: 
 * To note that is an error to remove GameFont definision
 * If you want to change from boot, you write font-family in the plugin parameter
 * If you want to change in game, you write font-family in the plugin command
 *
 * Plugin Command
 *   MultiFont change font-family # To change the font. enter the font-family: defined gamefont.css for font-family
 *   MultiFont reset              # To Change the font to the "initFontFamily"
 */

/*:ja
 * @plugindesc 複数フォントを使用できるようにします
 * @author Shirogane / smallomega.com
 *
 * @param initFontFamily
 * @desc 最初に設定するフォントです
 * @default GameFont
 *
 * @help
 * フォントを複数使用できるようになります
 * メッセージウインドウやメニューなどゲーム中すべてのフォントを変更します
 * フォントファイルをfonts/フォルダに入れてganefont.cssを下記のように記述します
 *
 * @font-face {
 *  font-family: GameFont;
 *  src: url("mplus-1m-regular.ttf");
 * }
 * @font-face{
 *  font-family: GameFont2;
 *  src: url("xxx.ttf");
 * }
 *
 * font-family:には任意の文字列を入れてください
 * GameFontの定義を消すとエラーになるので注意してください
 * 起動時から変更したい場合はプラグインパラメータにfont-familyを記述します
 * ゲーム中に変更したい場合はプラグインコマンドにfont-familyを記述します
 *
 * プラグインコマンド
 *   MultiFont change font-family # フォントを変更します。font-familyにはgamefont.cssに定義したfont-family:を指定してください
 *   MultiFont reset              # フォントをinitFontFamilyに戻します。
 */

(function() {

    var parameters = PluginManager.parameters('MultiFont');
    var initFontFamily = String(parameters['initFontFamily'] || "GameFont") ;
    // 現在のFontFamily設定
    var currentMultiFontFamily = initFontFamily;

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);

        if (command === "MultiFont")
        {
            switch(args[0])
            {
                case "change":
                {
                    currentMultiFontFamily = args[1];
                    break;
                }
                case "reset":
                {
                    currentMultiFontFamily = initFontFamily;
                    break;
                }
                default:
                {
                    break;
                }
            }
        }
    };

    // Bitmapの初期化時にフォントの指定を変更
    var _Bitmap_initialize = Bitmap.prototype.initialize;
    Bitmap.prototype.initialize = function (width,height) {
        _Bitmap_initialize.call(this,width,height);

        // Bitmapのinitializeで設定したfontFaceを上書きします
        // gamefont.cssに定義したfont-faceのfont-familyに指定した文字列が渡るようにします
        this.fontFace = currentMultiFontFamily;
    };

    // Windowのフォント変更を行います
    var _Window_Base_standardFontFace = Window_Base.prototype.standardFontFace;
    Window_Base.prototype.standardFontFace = function() {
        var result = _Window_Base_standardFontFace.call(this);

        // GameFontが返された場合のみ上書き
        // Chinese,Koreanの場合は変更しない
        if(!$gameSystem.isChinese() && !$gameSystem.isKorean()){
            result = currentMultiFontFamily;
        }
        return result;
    };

    // 初期設定したフォントは起動時の読み込みが終わるまで待つようにする
    var _Scene_Boot_isGameFontLoaded = Scene_Boot.prototype.isGameFontLoaded;
    Scene_Boot.prototype.isGameFontLoaded = function () {
        var result = _Scene_Boot_isGameFontLoaded.call(this);

        // 初期設定したフォントがロード完了しているかを返す
        return result && Graphics.isFontLoaded(initFontFamily);
    }

})();
