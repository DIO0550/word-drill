---
trigger: always_on
---

## 言語設定
- 必ず**日本語**で応答すること
- Implementation PlanとTaskは**日本語**で記載すること


## 禁止コマンド
- npmは使わず、pnpmを使うこと
- npxの使用を禁止する

## TypeScriptルール
- 基本的に`interface`ではなく`type`を利用すること

## 品質チェック
- 必ずファイルを変更したら、`pnpm run lint`と`pnpm run test`を実行すること

## コミットルール
- 必ず意味のある単位でコミットを分割すること。
- 以下のような全てのステージングに移動するコマンドは禁止とする
```
git add -A
```