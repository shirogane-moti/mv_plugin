//=============================================================================
// URL Query Manager
// by Shirogane / smallomega.com
//=============================================================================

/*:
 * @plugindesc The plugin you can get the URL query entered in the web browser
 * @author Shirogane / smallomega.com
 *
 * @help
 * You can get the URL query ( for example rhe string ?str=aabbcc&value=12200)
 * entered in the web browser with plugin command.
 * The URL query value is stored in the switch, the variable, the actor's name
 * with the below plugin command.
 *
 * Plugin command:
 * URLQueryManager defined [key] [switch_id]
 *  If the URL query key() is existed,
 *  The switch specified in the switch_id turn ON.
 *
 * URLQueryManager getName [key] [actor_id]
 *  To store the value entered in the URL query key
 *  to the actor's name specified in the actor_id
 *
 * URLQueryManager getValue [key] [variable_id]
 *  To store the value entered in the URL query key
 *  to the variable specified in the variable_id
 */

/*:ja
 * @plugindesc Webブラウザに入力されたURLクエリを取得できるプラグインです。
 * @author Shirogane / smallomega.com
 *
 * @help
 * Webブラウザに入力されたURLクエリ(?str=aabbcc&value=12200のような文字列)を
 * プラグインコマンドによって取得することができます。
 * 取得した値は次のプラグインコマンドによって
 * スイッチ、変数、アクターの名前に格納されます
 *
 * プラグインコマンド：
 * URLQueryManager defined [key] [switch_id]
 *  URLクエリのkey(str=aabbccのstrの部分)が存在していたらswitch_idで指定したスイッチをONにします
 *
 * URLQueryManager getName [key] [actor_id]
 *  URLクエリのkeyに設定された値をactor_idで指定したアクターの名前に格納します
 *
 * URLQueryManager getValue [key] [variable_id]
 *  URLクエリのkeyに設定された値をvariable_idで指定した変数に格納します
 */

// //////////////////////////////////////////////////////////
// URLQueryManager
// URLクエリとして受け取ったkey-valueをハッシュで保存しておく
// key,valueともにStringで保存します
// //////////////////////////////////////////////////////////

function URLQueryManager() {
  throw new Error('This is a static class');
}

URLQueryManager.setQueryString = function(queryStr) {
  // ?p=str&q=str2 のような文字列が来るのを想定してパースする

  // 初めて実行する場合は新しく作る
  this._query = {};

  // 最初が'?'でなければ何もせずreturn
  if( queryStr.substring(0,1) != '?') {
    return;
  }

  // ["p=str","q=str2"] の形に分割
  var pair = queryStr.substring(1).split('&');
  for( var i=0; i<pair.length; i++ ){
    // ["p","str"] の形に分割
    var kv = pair[i].split('=');
    // _queryに結果を代入
    if(kv[1] != undefined) {
      this._query[kv[0]] = kv[1];
    }
    else {
      // '='が書かれていなかった場合は空文字として扱う
      this._query[kv[0]] = "";
    }
  }

};

// keyが存在しているかどうかを得る
URLQueryManager.isKeyDefined = function (key) {
  if( this._query == undefined) {
    // _queryが定義されていない場合(setQueryString未実行の場合)falseで返答
    return false;
  }
  // undefinedでないかどうかを見る
  return this._query[key] != undefined;
};

// 引数のkeyに対応するvalueを返す
URLQueryManager.getValue = function (key) {
  // _queryが定義されていない場合(setQueryString未実行の場合)空文字で返答
  if( this._query == undefined ) {
    return "";
  }

  // keyのあるなしで分岐させる
  if(this.isKeyDefined(key)) {
    // 存在していればそれを返す
    return this._query[key]
  } else {
    // 存在していない場合は空文字で返答
    return "";
  }
};

// //////////////////////////////////////////////////////////
// Game_Interpreter
// //////////////////////////////////////////////////////////

(function() {

  var parameters = PluginManager.parameters('URLQueryManager');

  // 起動時の処理を実装
  var _Scene_Boot_prototype_start = Scene_Boot.prototype.start;
  Scene_Boot.prototype.start = function () {
    _Scene_Boot_prototype_start.call(this);

    // 起動シーンの開始と共にURLクエリの解釈を行う
    URLQueryManager.setQueryString(window.location.search);
  };

  // プラグインコマンドの実装
  var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args)
  {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'URLQueryManager')
    {
      switch (args[0])
      {
        // keyが定義されていたらスイッチをonにする
        case 'defined':
        {
          var queryKey = args[1];
          var switchId = args[2];
          var isDefined = URLQueryManager.isKeyDefined(queryKey);
          $gameSwitches.setValue(switchId,isDefined);
          break;
        }
        // 主人公の名前をkeyに設定された値に変更します
        case 'getName':
        {
          var queryKey = args[1];
          var actorId = args[2];
          var actor = $gameActors.actor(actorId);
          if(actor!=null)
          {
            var name = URLQueryManager.getValue(queryKey);
            actor.setName(name);
          }
          break;
        }
        // 変数をkeyに設定された値に変更します
        case 'getValue':
        {
          var queryKey = args[1];
          var switchId = args[2];
          var value = Number(URLQueryManager.getValue(queryKey));
          $gameVariables.setValue(switchId,value);
          break;
        }
        default:
        {
          break;
        }
      }
    }
  };
})();
