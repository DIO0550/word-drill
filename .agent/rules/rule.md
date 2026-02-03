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
- **コンパニオンオブジェクトパターン**を使用すること
  - 型と同名のオブジェクトを定義し、関連する関数をまとめる
  - 例:
    ```typescript
    type User = {
      id: string
      name: string
    }

    const User = {
      create: (id: string, name: string): User => ({ id, name }),
      validate: (user: User): boolean => user.id.length > 0,
    } as const
    ```

### コンパニオンオブジェクトの設計指針

#### ドメインロジックの集約
- 状態の判定ロジックや遷移ロジックは、使う側（reducer、hooks等）ではなくコンパニオンオブジェクトに実装する
- 使う側は「何をするか」だけに集中し、「どうやるか」はコンパニオンオブジェクトに委譲する

#### 命名規則
| 種類 | 命名パターン | 例 |
|------|-------------|-----|
| ファクトリ関数 | `create` | `User.create(...)` |
| 状態チェック | `can〇〇` / `is〇〇` | `QuizState.canGoToNext(state)` |
| 状態遷移 | 動詞形 | `QuizState.goToNext(state, length)` |

#### 悪い例と良い例
```typescript
// ❌ Bad: 使う側でロジックを書いている
const isCompleted = state.currentIndex + 1 >= questionsLength
return {
  ...state,
  phase: isCompleted ? 'completed' : 'playing',
  currentIndex: isCompleted ? state.currentIndex : state.currentIndex + 1,
}

// ✅ Good: ロジックをコンパニオンオブジェクトに委譲
return QuizState.goToNext(state, questionsLength)
```

```typescript
// ❌ Bad: 内部状態を直接参照
if (state.phase === 'feedback') { ... }

// ✅ Good: ドメインの意図を表す関数を使う
if (QuizState.canGoToNext(state)) { ... }
```

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

## テスト記述ルール
- **テストはネストさせないこと** (`describe` ブロックの使用を避け、フラットに `test` を記述する)
  - `it` ではなく `test` を使用すること
  - ネストが必要なさそうな場合は、テストファイルを分割することで対応すること
  - 参考: [Avoid Nesting when you're Testing](https://kentcdodds.com/blog/avoid-nesting-when-youre-testing)

## UI確認
- **Chrome Browserは使わないこと**
- UIの確認を行う際は、必ず`agent-browser`スキルを使用すること
- UIの実装やデザインに関しては、以下のスキルを参照すること
  - `frontend-design`
  - `theme-factory`
  - `ui-design-guidelines`