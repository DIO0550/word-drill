# IndexedDB スキーマ

**データベース名**: `word-drill`  
**バージョン**: 1

## Object Stores

### history (回答履歴)

| フィールド | 型 | 説明 |
|------------|-----|------|
| id | number | 自動採番の主キー |
| questionId | string | 問題ID |
| category | string | サブカテゴリID |
| correct | boolean | 正解したか |
| timestamp | number | 回答日時 (Unix ms) |

**インデックス**
- `questionId` - 問題別の集計用
- `category` - カテゴリ別の集計用
- `timestamp` - 日付フィルタ用

### stats (問題別統計)

| フィールド | 型 | 説明 |
|------------|-----|------|
| questionId | string | 問題ID（主キー） |
| correctCount | number | 正解数 |
| wrongCount | number | 不正解数 |
| lastAnswered | number | 最終回答日時 |
