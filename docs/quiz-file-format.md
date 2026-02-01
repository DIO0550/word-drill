# クイズファイル形式仕様書

## 概要

クイズ問題データのファイル形式を定義する。
将来のマイグレーションに対応するため、バージョン番号を含む。

## ファイル形式

**JSON** を採用する。

### 採用理由

- 広く普及しており、多くのツール・言語でサポートされている
- 構造が明確で、スキーマ定義が容易
- 外部URL（Gist等）からの配信に適している

---

## バージョン管理

### バージョニング方式

**semver形式** (`MAJOR.MINOR.PATCH`) を使用する。

| バージョン | 意味 |
|------------|------|
| MAJOR | 後方互換性のない変更（フィールド削除・型変更） |
| MINOR | 後方互換性のある機能追加（オプショナルフィールド追加） |
| PATCH | データ修正 |

### 現在のバージョン

`1.0.0`

---

## ファイル構造

```json
{
  "version": "1.0.0",
  "metadata": {
    "category": "prog-rust",
    "name": "Rust",
    "description": "ownership, borrowing, lifetime など",
    "createdAt": "2026-02-01",
    "updatedAt": "2026-02-01"
  },
  "questions": [
    {
      "id": "prog-rust-001",
      "term": "ownership",
      "meaning": "Rustにおけるメモリ管理の基本概念。各値は所有者を持ち、所有者がスコープを抜けると値は解放される。",
      "choices": [
        "所有権",
        "借用",
        "ライフタイム",
        "参照"
      ],
      "answer": 0,
      "example": "let s1 = String::from(\"hello\"); let s2 = s1; // s1 の ownership が s2 に移動"
    }
  ]
}
```

---

## フィールド定義

### ルートオブジェクト

| フィールド | 型 | 必須 | 説明 |
|------------|-----|------|------|
| version | string | ✓ | ファイル形式のバージョン (semver) |
| metadata | object | ✓ | ファイルのメタ情報 |
| questions | array | ✓ | 問題リスト |

### metadata

| フィールド | 型 | 必須 | 説明 |
|------------|-----|------|------|
| category | string | ✓ | カテゴリID |
| name | string | ✓ | カテゴリ表示名 |
| description | string | ✓ | カテゴリの説明 |
| createdAt | string | ✓ | 作成日 (YYYY-MM-DD) |
| updatedAt | string | ✓ | 更新日 (YYYY-MM-DD) |

### questions[]

| フィールド | 型 | 必須 | 説明 |
|------------|-----|------|------|
| id | string | ✓ | 一意のID (例: `prog-rust-001`) |
| term | string | ✓ | 用語・単語 |
| meaning | string | ✓ | 意味・説明 |
| choices | string[] | ✓ | 4択の選択肢（4つ固定） |
| answer | number | ✓ | 正解のインデックス (0-3) |
| example | string | | 例文（任意） |

---

## バリデーションルール

1. `version` は有効なsemver形式であること
2. `questions` は1つ以上の問題を含むこと
3. `questions[].id` はファイル内で一意であること
4. `questions[].choices` は正確に4つの選択肢を含むこと
5. `questions[].answer` は 0〜3 の範囲であること

---

## 外部配信

このフォーマットは外部URLからの配信を想定している。

### 想定する配信元

- GitHub Gist (Raw URL)
- 任意のホスティングサービス

### 外部配信時の要件

- Content-Type: `application/json`
- 文字エンコーディング: UTF-8

---

## 変更履歴

| バージョン | 日付 | 変更内容 |
|------------|------|----------|
| 1.0.0 | 2026-02-01 | 初版 |
