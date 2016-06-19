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

# 連絡先 #

* スモールオメガω : http://smallomega.com
* シロガネ