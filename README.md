# icemaru2
Super Genius Discord Bot あいすまる

[discord-bot-typescript-template](https://github.com/avaice/discord-bot-typescript-template)をベースに作っています

## 機能
サンプルと完全一致しなくても、同じようなニュアンスで話せば大体通じます
- よくわかんないことをしゃべってくれる
- なんか雑にほめてくれる
- 歌を歌ってくれる
  - `!play https://www.youtube.com/watch?v=pb0DyZwc_sE`, `!skip`, `!stop`
- VALORANTのキャラをピックしてくれる
  - （VCにメンバーが揃った状態で）`キャラピックして`
- マインクラフト関連
  - サーバー接続人数取得
    - `マイクラ今何人やってる？`
  - マイクラサーバーのニュース生成
    - `マイクラのニュース教えて！`
- サーバーステータス確認
  - `あいす丸元気？`

その他　どうでもいい機能

## 必要な環境変数

```
BOT_TOKEN = BOTのトークン

# マイクラ関連の機能を使用したい場合
MINECRAFT_SERVER=マイクラサーバーのアドレス（サーバー接続人数確認機能）
MINECRAFT_SERVER_LOG=マイクラのサーバーログにアクセスするためのURL（マイクラニュース機能）
OPENAI_API_KEY=ChatGPTを使用するためのOpenAI API KEY（マイクラニュース機能）

# メモリ不足でクラッシュしがちな場合は設定
MEMORY_LIMITER="128"　（使用可能メモリが１２８MB未満の場合、YouTube再生機能を制限する）
```
