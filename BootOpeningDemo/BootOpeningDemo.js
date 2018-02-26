//=============================================================================
// BootOpeningDemo.js
//=============================================================================

/*:
 * @plugindesc You can start the opening demo before your title scene
 * @author Shirogane / smallomega.com
 *
 * @param firstMapId
 * @desc Opening demo map ID
 * @default 1
 * @param startX
 * @desc First X coordinate on demo map
 * @default 0
 * @param startY
 * @desc First Y coordinate on demo map
 * @default 0
 *
 * @help 
 *
 * プラグインコマンド:
 *   BootOpeningDemo end # End the opening demo and change the title scene
 *   BootOpeningDemo skipOK # You can skip to the title scene by the decide key or touch
 *   BootOpeningDemo skipNG # You can not skip to the title scene by the decide key or touch
 */

/*:ja
 * @plugindesc タイトル画面を出す前にオープニングデモから開始します
 * @author Shirogane / smallomega.com
 *
 * @param firstMapId
 * @desc オープニングデモに使用するマップID
 * @default 1
 * @param startX
 * @desc マップ上の開始座標X
 * @default 0
 * @param startY
 * @desc マップ上の開始座標Y
 * @default 0
 *
 *
 * @help 
 *
 * プラグインコマンド:
 *   BootOpeningDemo end # デモを終了してタイトル画面へ遷移します
 *   BootOpeningDemo skipOK # 決定キー、タッチ操作でタイトル画面に遷移できるようになります    
 *   BootOpeningDemo skipNG # 決定キー、タッチ操作でタイトル画面に遷移できなくなります  
 */

(function() {

    var parameters  = PluginManager.parameters('BootOpeningDemo');
    var firstMapId  = Number(parameters['firstMapId'] || 0);
    var firstStartX = Number(parameters['firstStartX'] || 0);
    var firstStartY = Number(parameters['firstStartY'] || 0);
    var openingDemoEnd = false;
    var openingDemoSkipOk = false;

    // プラグインコマンド
    var _Game_Interpreter_pluginCommand =
        Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args)
    {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (!openingDemoEnd)
        {
            if (command === 'BootOpeningDemo')
            {
                switch (args[0])
                {
                    case 'end':
                        changeTitle();
                        break;
                    case 'skipOK':
                        openingDemoSkipOk = true;
                        break;
                    case 'skipNG':
                        openingDemoSkipOk = false;
                        break;
                    default:
                        throw Error("(BootOpeningDemo) invalid argument : " + args[0]);
                        break;
                }
            }
        }
    };

    // 最初のシーンに遷移している部分を書き換え
    var _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function()
    {
        if (DataManager.isBattleTest() || DataManager.isEventTest())
        {
            // デバッグ機能だけは通常の動作
            _Scene_Boot_start.call(this);
        }
        else
        {
            // 開始フラグリセット
            openingDemoEnd = false;
            // 開始初期化処理
            Scene_Base.prototype.start.call(this);
            this.updateDocumentTitle();
            SoundManager.preloadImportantSounds();
            DataManager.createGameObjects();
            DataManager.selectSavefileForNewGame();
            Graphics.frameCount = 0;
            // エラーチェック
            if (firstMapId == 0) {
                throw new Error("(BootOpeningDemo) parameter firstMapId is invalid");
            }
            this.checkPlayerLocation();
            // マップ呼び出し
            $gamePlayer.reserveTransfer(firstMapId,
                firstStartX, firstStartY);
            SceneManager.goto(Scene_Map);
        }
    };

    // デモ中は方向キー移動操作不可
    var _Game_Player_moveByInput = Game_Player.prototype.moveByInput;
    Game_Player.prototype.moveByInput = function ()
    {
        if (openingDemoEnd)
        {
            return _Game_Player_moveByInput.call(this);
        }
    }

    // デモ中はマップのタッチ操作不可
    var _Scene_Map_isMapTouchOk = Scene_Map.prototype.isMapTouchOk;
    Scene_Map.prototype.isMapTouchOk = function ()
    {
        // オープニングデモが終了していなければ実行しない
        if (openingDemoEnd)
        {
            return _Scene_Map_isMapTouchOk.call(this);
        }
    }

    // デモ中はメニュー操作不可
    var _Scene_Map_isMenuCalled = Scene_Map.prototype.isMenuCalled;
    Scene_Map.prototype.isMenuCalled = function ()
    {
        // オープニングデモが終了していなければ常にfalse
        if (openingDemoEnd)
        {
            return _Scene_Map_isMenuCalled.call(this);
        }
        else
        {
            return false;
        }
    }

    // 決定キーで遷移、タッチ操作で遷移
    var _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function ()
    {
        _Scene_Map_update.call(this);
        // デモ中だけの処理でスキップ許可が出ていてシーン遷移中でない
        if (!openingDemoEnd &&
            openingDemoSkipOk &&
            !SceneManager.isSceneChanging())
        {
            // 決定キーで遷移、タッチ操作で遷移
            if (TouchInput.isTriggered() || Input.isTriggered('ok'))
            {
                // タイトルへ遷移
                changeTitle();
            }
        }
    }

    // オープニングデモ中は禁止のイベントコマンドが使われていたらErrorにする
    var _Game_Interpreter_executeCommand = Game_Interpreter.prototype.executeCommand;
    Game_Interpreter.prototype.executeCommand = function ()
    {
        if (!openingDemoEnd)
        {
            var command = this.currentCommand();
            if (command)
            {
                // 禁止コマンドチェック
                switch (command.code)
                {
                    // 下記のコマンドをOPデモ中に実行したらErrorになります
                    // 入力が必要なもの、シーンが遷移するもの、などが禁止になっています
                    // なお、変数の操作やシステムの設定変更は可能ですが、タイトルに遷移した時点でリセットされます
                    case 103: // 数値入力の処理
                    case 104: // アイテム選択の処理
                    case 301: // 戦闘の処理
                    case 302: // ショップの処理
                    case 303: // 名前入力の処理
                    case 351: // メニュー画面を開く
                    case 352: // セーブ画面を開く
                    case 353: // ゲームオーバー
                    case 354: // タイトル画面に戻す
                        throw Error('(BootOpeningDemo) invalid command : code ' + command.code);
                        break;
                    default:
                        break;
                }
            }
        }
        return _Game_Interpreter_executeCommand.call(this);
    }

    var changeTitle = function()
    {
        openingDemoEnd = true;
        // タイトル画面へ遷移、通常のScene_Bootを開始する
        SceneManager.goto(Scene_Title);
        Window_TitleCommand.initCommandPosition();
    }

})();
