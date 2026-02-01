import { expect, test } from 'vitest'
import { QuizFile } from './QuizFile'

const validQuizData = {
  version: '1.0.0',
  metadata: {
    category: 'prog-rust',
    name: 'Rust',
    description: 'ownership, borrowing, lifetime など',
    createdAt: '2026-02-01',
    updatedAt: '2026-02-01',
  },
  questions: [
    {
      id: 'prog-rust-001',
      term: 'ownership',
      meaning: 'Rustにおけるメモリ管理の基本概念。',
      choices: ['所有権', '借用', 'ライフタイム', '参照'],
      answer: 0,
      example: 'let s1 = String::from("hello");',
    },
  ],
}

// === parse ===

test('QuizFile.parseは正常なJSONをパースできる', () => {
  const result = QuizFile.parse(JSON.stringify(validQuizData))
  expect(result.success).toBe(true)
  if (result.success) {
    expect(result.data.version).toBe('1.0.0')
    expect(result.data.questions).toHaveLength(1)
  }
})

test('QuizFile.parseは不正なJSONでエラーを返す', () => {
  const result = QuizFile.parse('{ invalid json }')
  expect(result.success).toBe(false)
  if (!result.success) {
    expect(result.errors[0].message).toBe('Invalid JSON format')
  }
})

// === parseFromObject ===

test('QuizFile.parseFromObjectは正常なオブジェクトをパースできる', () => {
  const result = QuizFile.parseFromObject(validQuizData)
  expect(result.success).toBe(true)
  if (result.success) {
    expect(result.data.metadata.category).toBe('prog-rust')
  }
})

test('QuizFile.parseFromObjectはオブジェクト以外でエラーを返す', () => {
  const result = QuizFile.parseFromObject(null)
  expect(result.success).toBe(false)
  if (!result.success) {
    expect(result.errors[0].message).toBe('Data must be an object')
  }
})

// === validate: version ===

test('QuizFile.validateはversionがない場合エラーを返す', () => {
  const data = { ...validQuizData, version: undefined }
  const errors = QuizFile.validate(data)
  expect(errors.some((e) => e.path === 'version')).toBe(true)
})

test('QuizFile.validateは不正なsemver形式でエラーを返す', () => {
  const data = { ...validQuizData, version: 'v1.0' }
  const errors = QuizFile.validate(data)
  expect(errors.some((e) => e.path === 'version' && e.message.includes('semver'))).toBe(true)
})

// === validate: metadata ===

test('QuizFile.validateはmetadataがない場合エラーを返す', () => {
  const data = { ...validQuizData, metadata: undefined }
  const errors = QuizFile.validate(data)
  expect(errors.some((e) => e.path === 'metadata')).toBe(true)
})

test('QuizFile.validateはmetadataの必須フィールドが欠けている場合エラーを返す', () => {
  const data = {
    ...validQuizData,
    metadata: { category: 'test' },
  }
  const errors = QuizFile.validate(data)
  expect(errors.some((e) => e.path === 'metadata.name')).toBe(true)
  expect(errors.some((e) => e.path === 'metadata.description')).toBe(true)
})

// === validate: questions ===

test('QuizFile.validateはquestionsがない場合エラーを返す', () => {
  const data = { ...validQuizData, questions: undefined }
  const errors = QuizFile.validate(data)
  expect(errors.some((e) => e.path === 'questions')).toBe(true)
})

test('QuizFile.validateは空のquestionsでエラーを返す', () => {
  const data = { ...validQuizData, questions: [] }
  const errors = QuizFile.validate(data)
  expect(errors.some((e) => e.path === 'questions' && e.message.includes('at least one'))).toBe(true)
})

test('QuizFile.validateは選択肢が4つでない場合エラーを返す', () => {
  const data = {
    ...validQuizData,
    questions: [{ ...validQuizData.questions[0], choices: ['a', 'b', 'c'] }],
  }
  const errors = QuizFile.validate(data)
  expect(errors.some((e) => e.path === 'questions[0].choices' && e.message.includes('4'))).toBe(true)
})

test('QuizFile.validateはanswer範囲外でエラーを返す', () => {
  const data = {
    ...validQuizData,
    questions: [{ ...validQuizData.questions[0], answer: 5 }],
  }
  const errors = QuizFile.validate(data)
  expect(errors.some((e) => e.path === 'questions[0].answer')).toBe(true)
})

test('QuizFile.validateは重複IDでエラーを返す', () => {
  const data = {
    ...validQuizData,
    questions: [
      validQuizData.questions[0],
      { ...validQuizData.questions[0] },
    ],
  }
  const errors = QuizFile.validate(data)
  expect(errors.some((e) => e.message.includes('duplicate'))).toBe(true)
})

test('QuizFile.validateは正常なデータでエラーを返さない', () => {
  const errors = QuizFile.validate(validQuizData)
  expect(errors).toHaveLength(0)
})
