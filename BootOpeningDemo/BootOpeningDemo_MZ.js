//=============================================================================
// BootOpeningDemo_MZ.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc タイトル画面を出す前にオープニングデモから開始します(MZ対応版)
 * @author Shirogane / smallomega.com
 * @url https://smallomega.com
 *
 * @param firstMapId
 * @text 初期マップID
 * @desc オープニングデモに使用するマップID
 * @default 1
 * @param firstStartX
 * @text 初期座標X
 * @desc マップ上の開始座標X
 * @default 0
 * @param firstStartY
 * @text 初期座標Y
 * @desc マップ上の開始座標Y
 * @default 0
 * 
 * @command end
 * @text オープニングデモの終了
 * @desc デモを終了してタイトル画面へ遷移します
 * @command skipOK
 * @text スキップ操作の許可
 * @desc 決定キー、タッチ操作でタイトル画面に遷移できるようになります
 * @command skipNG
 * @text スキップ操作の禁止
 * @desc 決定キー、タッチ操作でタイトル画面に遷移できなくなります  
 *
 * @help 
 * ■プラグインコマンド
 * 
 * ▼オープニングデモの終了
 * 　デモを終了してタイトル画面へ遷移します
 * ▼スキップ操作の許可
 * 　決定キー、タッチ操作でタイトル画面に遷移できるようになります
 * ▼スキップ操作の禁止
 * 　決定キー、タッチ操作でタイトル画面に遷移できなくなります
 * 
 */

(function() {

    const pluginName = "BootOpeningDemo_MZ";
    
    var parameters  = PluginManager.parameters(pluginName);
    var firstMapId  = Number(parameters['firstMapId'] || 0);
    var firstStartX = Number(parameters['firstStartX'] || 0);
    var firstStartY = Number(parameters['firstStartY'] || 0);
    var openingDemoEnd = false;
    var openingDemoSkipOk = false;

    PluginManager.registerCommand(pluginName, "end", args => {
        changeTitle();
    });
    PluginManager.registerCommand(pluginName, "skipOK", args => {
        openingDemoSkipOk = true;
    });
    PluginManager.registerCommand(pluginName, "skipNG", args => {
        openingDemoSkipOk = false;
    });

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
            // エラーチェック
            if (firstMapId == 0) {
                throw new Error("(BootOpeningDemo) parameter firstMapId is invalid");
            }
            // 開始フラグリセット
            openingDemoEnd = false;
            // 開始初期化処理
            Scene_Base.prototype.start.call(this);
            SoundManager.preloadImportantSounds();
            this.resizeScreen();
            this.updateDocumentTitle();
            DataManager.setupNewGame();
            // マップ呼び出し
            $gamePlayer.reserveTransfer(firstMapId, firstStartX, firstStartY);
            this.checkPlayerLocation();
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
        // MVは_videoがあったがMZにはない？確認中
        // // Videoが動いていたら停止
        // if(Graphics._video.duration > 0)
        // {
        //     Graphics._video.currentTime = Graphics._video.duration;
        //     // Graphice._onTouchEndedで再度playさせないように
        //     Graphics._videoUnlocked = true
        // }
        // タイトル画面へ遷移、通常のScene_Bootを開始する
        SceneManager.goto(Scene_Title);
        Window_TitleCommand.initCommandPosition();
    }

})();
