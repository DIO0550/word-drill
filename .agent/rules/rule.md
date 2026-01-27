---
trigger: always_on
---

## PLANNINGモード
- PLANNINGモードでは、必ず`implementation_plan.md`の作成から始めること

## 言語設定
- 必ず**日本語**で応答すること
- Implementation PlanとTaskは**日本語**で記載すること


## 禁止コマンド
- npmは使わず、pnpmを使うこと
- npxの使用を禁止する

## TypeScriptルール
- 基本的に`interface`ではなく`type`を利用すること

## 品質チェックとビルド
ファイルを変更した際は、必ず以下のコマンドを実行して品質を保証すること
- **静的解析**: `pnpm run lint`
- **単体テスト**: `pnpm run test`
- **ビルド確認**: `pnpm run build`

※ 基本的なESLintの無効化を禁止する

## コミットルール
- 必ず意味のある単位でコミットを分割すること。
- 以下のような全てのステージングに移動するコマンドは禁止とする
```
git add -A
```

## UI確認
- **Chrome Browserは使わないこと**
- UIの確認を行う際は、必ず`agent-browser`スキルを使用すること
- UIの実装やデザインに関しては、以下のスキルを参照すること
  - `frontend-design`
  - `theme-factory`
  - `ui-design-guidelines`