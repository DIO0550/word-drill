# word-drill 仕様書

## 概要

英単語・プログラミング英語・IT用語を4択クイズ形式で学習できるWebアプリケーション。
GitHub Pagesでホスティングし、学習履歴はIndexedDBでローカル保存する。

## 技術スタック

- Vite + React + TypeScript
- React Router (HashRouter)
- IndexedDB (vanilla)
- GitHub Pages + GitHub Actions

## ドキュメント構成

| ファイル | 内容 |
|---------|------|
| [categories.md](./categories.md) | カテゴリ体系 |
| [pages.md](./pages.md) | ページ構成・各ページ詳細 |
| [data-structures.md](./data-structures.md) | IndexedDBスキーマ |
| [quiz-file-format.md](./quiz-file-format.md) | クイズファイルフォーマット |

## 将来の拡張候補

- [ ] 問題の追加・編集UI
- [ ] JSONインポート/エクスポート
- [ ] PWA対応（オフライン学習）
- [ ] ダークモード切り替え
- [ ] 復習モード（苦手な問題を優先出題）
- [ ] スペースドリピティション（間隔反復）
