# RPGツクールMVプラグイン集 #

RPGツクールMVのプラグインを置いています

ここに置かれたプラグインは作品の形態,商用非商用問わずご使用いただいて結構です

使用報告も不要ですがご連絡いただけた方がサポートなどしやすいと思います

## サンプルダウンロード ##

BootOpeningDemo,URLQueryManagerのサンプルで同じプロジェクトファイルに入っています

* [サンプルプロジェクトのダウンロード](http://smallomega.com/download/mvplugins/project_BootOpeningDemo.zip)

## BootOpeningDemo ##

### サンプル ###

* [Web上でサンプルを見る](http://game.nicovideo.jp/atsumaru/games/gm220)
* [紹介動画](http://www.nicovideo.jp/watch/sm27854032)

### 仕様 ###

* オープニングデモとしてマップのイベントを実行します
* プラグインコマンド「BootOpeningDemo skipOK」により、決定キー、画面クリックでタイトル画面へ行けるようになります
* プラグインコマンド「BootOpeningDemo end」でタイトル画面へ
* 移動操作やメニュー開閉は不可
* オープニングデモ中、下記のイベントコマンドは使用不可で使うとErrorになります
	* 数値入力の処理
	* アイテム選択の処理
	* 戦闘の処理
	* ショップの処理
	* 名前入力の処理
	* メニュー画面を開く
	* セーブ画面を開く
	* ゲームオーバー
	* タイトル画面に戻す

### 使い方 ###

* js/pluginsフォルダ直下にBootOpeningDemo.jsを入れてください
* RPGツクールMVエディタからプラグインを有効にしてください
* プラグインの設定画面から下記を入力してください
	* firstMapId : オープニングデモに使うマップID
	* startX : マップ上の開始座標X
	* startY : マップ上の開始座標Y

## MultiFont ##

### サンプル ###

* ありません

### 仕様 ###

* メッセージウインドウやメニューなどゲーム中すべてのフォントを変更します
* gamefont.cssに追加で定義した複数の@font-faceを利用できるようになります
	* プラグインパラメータにより、起動時からフォントを変更することができます
	* プラグインコマンドにより、ゲーム中にフォントを変更することができます

### 使い方 ###

* 下準備
	* fonts/フォルダに利用したいフォントファイルを配置します
	* gamefont.cssに追加で利用したいフォントを`@font-face`で定義してください
* ツクールからの設定
	* js/pluginsフォルダ直下にMultiFont.jsを入れてください
	* RPGツクールMVエディタからプラグインを有効にしてください
	* プラグインパラメータから起動時のフォントを設定します
		* initFontFamily : 起動時に使用する`font-family:`を入力します
	* プラグインコマンドからゲーム中にフォントを変更します
		* MultiFont change font-family  (font-familyにはgamefont.cssに定義した`font-family:`を指定してください)
* gamefont.cssの例

        @font-face {
          font-family: GameFont;
          src: url("mplus-1m-regular.ttf");
        }
        @font-face {
          font-family: GameFont2;
          src: url("xxx.ttf");
        }
        ...

※ `GameFont`の定義を消すとエラーになります

## URLQueryManager ##

### サンプル ###

* [紹介動画](http://www.nicovideo.jp/watch/sm29750297)

### 仕様 ###

* Webブラウザに入力されたURLクエリ(?str=aabbcc&value=12200のような文字列)をプラグインコマンドによって取得することができます。
* 取得された値はプラグインコマンドによってスイッチ、変数、アクターの名前に格納されます

### 使い方 ###

* js/pluginsフォルダ直下にMultiFont.jsを入れてください
* RPGツクールMVエディタからプラグインを有効にしてください
* 次のプラグインコマンドによってスイッチ、変数、アクターの名前に値を取得してください
	* `URLQueryManager defined [key] [switch_id]`
		* URLクエリのkey(str=aabbccのstrの部分)が存在していたらswitch_idで指定したスイッチをONにします
	* `URLQueryManager getName [key] [actor_id]`
		* URLクエリのkeyに設定された値をactor_idで指定したアクターの名前に格納します
	* `URLQueryManager getValue [key] [variable_id]`
		* URLクエリのkeyに設定された値をvariable_idで指定した変数に格納します

# 連絡先 #

* スモールオメガω : http://smallomega.com
* Twitter : @shirogane_moti
* シロガネ