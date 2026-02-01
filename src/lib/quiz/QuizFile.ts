import { ParseResult } from './ParseResult'
import type { QuizFileMetadata } from './QuizFileMetadata'
import type { QuizQuestion } from './QuizQuestion'
import { ValidationError } from './ValidationError'

const SEMVER_REGEX = /^\d+\.\d+\.\d+$/

/**
 * クイズファイル
 */
export type QuizFile = {
  version: string
  metadata: QuizFileMetadata
  questions: QuizQuestion[]
}

export const QuizFile = {
  /**
   * JSON文字列からクイズファイルをパースする
   */
  parse: (json: string): ParseResult<QuizFile> => {
    try {
      const data: unknown = JSON.parse(json)
      return QuizFile.parseFromObject(data)
    } catch {
      return ParseResult.err([
        ValidationError.create('', 'Invalid JSON format'),
      ])
    }
  },

  /**
   * オブジェクトからクイズファイルをパースする
   */
  parseFromObject: (data: unknown): ParseResult<QuizFile> => {
    const errors = QuizFile.validate(data)
    if (errors.length > 0) {
      return ParseResult.err(errors)
    }
    return ParseResult.ok(data as QuizFile)
  },

  /**
   * クイズファイルデータをバリデートする
   */
  validate: (data: unknown): ValidationError[] => {
    const errors: ValidationError[] = []

    if (typeof data !== 'object' || data === null) {
      return [ValidationError.create('', 'Data must be an object')]
    }

    const obj = data as Record<string, unknown>

    // version
    if (typeof obj.version !== 'string') {
      errors.push(ValidationError.create('version', 'version is required and must be a string'))
    } else if (!SEMVER_REGEX.test(obj.version)) {
      errors.push(ValidationError.create('version', 'version must be a valid semver format (e.g., 1.0.0)'))
    }

    // metadata
    errors.push(...validateMetadata(obj.metadata))

    // questions
    errors.push(...validateQuestions(obj.questions))

    return errors
  },
} as const

/**
 * メタデータをバリデートする
 */
const validateMetadata = (metadata: unknown): ValidationError[] => {
  const errors: ValidationError[] = []

  if (typeof metadata !== 'object' || metadata === null) {
    return [ValidationError.create('metadata', 'metadata is required and must be an object')]
  }

  const obj = metadata as Record<string, unknown>
  const requiredFields = ['category', 'name', 'description', 'createdAt', 'updatedAt'] as const

  for (const field of requiredFields) {
    if (typeof obj[field] !== 'string') {
      errors.push(ValidationError.create(`metadata.${field}`, `${field} is required and must be a string`))
    }
  }

  return errors
}

/**
 * 問題リストをバリデートする
 */
const validateQuestions = (questions: unknown): ValidationError[] => {
  const errors: ValidationError[] = []

  if (!Array.isArray(questions)) {
    return [ValidationError.create('questions', 'questions is required and must be an array')]
  }

  if (questions.length === 0) {
    return [ValidationError.create('questions', 'questions must contain at least one question')]
  }

  const seenIds = new Set<string>()

  questions.forEach((question, index) => {
    errors.push(...validateQuestion(question, index, seenIds))
  })

  return errors
}

/**
 * 個々の問題をバリデートする
 */
const validateQuestion = (
  question: unknown,
  index: number,
  seenIds: Set<string>
): ValidationError[] => {
  const errors: ValidationError[] = []
  const path = `questions[${index}]`

  if (typeof question !== 'object' || question === null) {
    return [ValidationError.create(path, 'question must be an object')]
  }

  const obj = question as Record<string, unknown>

  // id
  if (typeof obj.id !== 'string') {
    errors.push(ValidationError.create(`${path}.id`, 'id is required and must be a string'))
  } else {
    if (seenIds.has(obj.id)) {
      errors.push(ValidationError.create(`${path}.id`, `duplicate id: ${obj.id}`))
    }
    seenIds.add(obj.id)
  }

  // term
  if (typeof obj.term !== 'string') {
    errors.push(ValidationError.create(`${path}.term`, 'term is required and must be a string'))
  }

  // meaning
  if (typeof obj.meaning !== 'string') {
    errors.push(ValidationError.create(`${path}.meaning`, 'meaning is required and must be a string'))
  }

  // choices
  if (!Array.isArray(obj.choices)) {
    errors.push(ValidationError.create(`${path}.choices`, 'choices is required and must be an array'))
  } else if (obj.choices.length !== 4) {
    errors.push(ValidationError.create(`${path}.choices`, 'choices must contain exactly 4 items'))
  } else {
    obj.choices.forEach((choice, choiceIndex) => {
      if (typeof choice !== 'string') {
        errors.push(ValidationError.create(`${path}.choices[${choiceIndex}]`, 'choice must be a string'))
      }
    })
  }

  // answer
  if (typeof obj.answer !== 'number') {
    errors.push(ValidationError.create(`${path}.answer`, 'answer is required and must be a number'))
  } else if (obj.answer < 0 || obj.answer > 3 || !Number.isInteger(obj.answer)) {
    errors.push(ValidationError.create(`${path}.answer`, 'answer must be 0, 1, 2, or 3'))
  }

  // example (optional)
  if (obj.example !== undefined && typeof obj.example !== 'string') {
    errors.push(ValidationError.create(`${path}.example`, 'example must be a string if provided'))
  }

  return errors
}
