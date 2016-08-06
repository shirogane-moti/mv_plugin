# RPGツクールMVプラグイン集 #

RPGツクールMVのプラグインを置いています

ここに置かれたプラグインは作品の形態,商用非商用問わずご使用いただいて結構です

使用報告も不要ですがご連絡いただけた方がサポートなどしやすいと思います

## BootOpeningDemo ##

### サンプル ###

* [Web上でサンプルを見る](http://smallomega.com/download/mvgame/RapidQuest/index.html)
* [サンプルプロジェクトのダウンロード](http://smallomega.com/download/mvplugins/project_BootOpeningDemo.zip)

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

そのうち作る予定なの

### 仕様 ###

* メッセージウインドウやメニューなどゲーム中すべてのフォントを変更します
* gamefont.cssに追加で定義した@font-faceを利用できるようになります
        * プラグインパラメータから、起動時のフォントを変更することができます
        * プラグインコマンドから、ゲーム中にフォントを変更することができます

### 使い方 ###

* 下準備
        * fonts/フォルダに利用したいフォントファイルを配置します
        * gamefont.cssに追加で利用したいフォントを@font-faceで定義してください

        @font-face {
          font-family: GameFont;
          src: url("mplus-1m-regular.ttf");
        }
        @font-face {
          font-family: GameFont2;
          src: url("xxx.ttf");
        }

* ツクールからの設定
        * js/pluginsフォルダ直下にMultiFont.jsを入れてください
        * RPGツクールMVエディタからプラグインを有効にしてください
        * プラグインパラメータから起動時のフォントを設定します
                * initFontFamily : 起動時に使用するfont-family:を入力します
        * プラグインコマンドからゲーム中にフォントを変更します
                * MultiFont change font-family  (font-familyにはgamefont.cssに定義したfont-family:を指定してください)


# 連絡先 #

* スモールオメガω : http://smallomega.com
* シロガネ